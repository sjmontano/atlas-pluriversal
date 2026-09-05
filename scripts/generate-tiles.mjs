// ─────────────────────────────────────────────────────────────────────────────
// GENERADOR DE TILES XYZ (WebP) PARA MAPAS DEL ATLAS
// ==================================================
//
// Genera tiles XYZ de alta resolución para un mapa usando los binarios CLI de
// GDAL (gdal_translate + gdalwarp). El footprint geográfico se deriva del PGW
// de cada content module (src/content/*), de modo que los tiles quedan
// alineados exactamente con la capa base ImageSource.
//
// Requisitos:
//   - GDAL con driver WEBP (Windows: C:\Program Files\GDAL, o GDAL_BIN=<dir>)
//   - ffmpeg para convertir AVIF → WebP (GDAL 3.12 no lee AVIF):
//     C:\Herramientas\ffmpeg\bin, o FFMPEG_BIN=<dir>
//   - Ejecutar con tsx (resuelve imports .ts y aliases @):
//     tsx --tsconfig tsconfig.app.json scripts/generate-tiles.mjs
//
// Uso:
//   npm run tiles                                  # todos los mapas con tiles
//   npm run tiles -- chapter1-ecosistemas          # un mapa
//   npm run tiles -- chapter1-ecosistemas --force  # regenerar tiles existentes
//
// Salida:
//   public/assets/maps/tiles/mapas-standard/{mapId}/{z}/{x}/{y}.webp
//   public/assets/maps/tiles/mapas-hd/{mapId}/{z}/{x}/{y}.webp
//   public/assets/maps/previews/{mapId}.webp
//   public/assets/maps/tiles/capas/{layerId}/{z}/{x}/{y}.webp (capas futuras)
//   (NO versionar en git — regenerar con `npm run tiles`)
// ─────────────────────────────────────────────────────────────────────────────

import { mkdirSync, existsSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { MAP_TILE_MODES } from '../src/data/tiles.ts'
import { processBounds } from '../src/services/BoundsCalculator.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_ROOTS = {
  standard: join(ROOT, 'public', 'assets', 'maps', 'tiles', 'mapas-standard'),
  hd: join(ROOT, 'public', 'assets', 'maps', 'tiles', 'mapas-hd'),
}
const PREVIEW_ROOT = join(ROOT, 'public', 'assets', 'maps', 'previews')
const TMP_ROOT = join(ROOT, '.tmp-tiles')

// ── Entorno GDAL ────────────────────────────────────────────────────────────
const GDAL_BIN = process.env.GDAL_BIN || 'C:\\Program Files\\GDAL'
const FFMPEG_BIN = process.env.FFMPEG_BIN || 'C:\\Herramientas\\ffmpeg\\bin'
const PATH_SEP = process.platform === 'win32' ? ';' : ':'
const gdalEnv = {
  ...process.env,
  PATH: GDAL_BIN + PATH_SEP + FFMPEG_BIN + PATH_SEP + (process.env.PATH ?? ''),
  GDAL_DATA: process.env.GDAL_DATA || join(GDAL_BIN, 'gdal-data'),
  PROJ_LIB: process.env.PROJ_LIB || join(GDAL_BIN, 'projlib'),
  // No escribir sidecars .aux.xml
  GDAL_PAM_ENABLED: 'NO',
}

function gdal(bin, args, label) {
  const res = spawnSync(bin, args, { env: gdalEnv, encoding: 'utf8', windowsHide: true })
  if (res.status !== 0) {
    throw new Error(
      `${label} falló (${bin})\n  stderr: ${(res.stderr || '').trim().split('\n').slice(-4).join('\n  ')}`,
    )
  }
}

/** Lee "Size is W, H" del gdalinfo de un archivo raster. */
function rasterSize(bin, file) {
  const res = spawnSync('gdalinfo', [file], { env: gdalEnv, encoding: 'utf8', windowsHide: true })
  if (res.status !== 0) throw new Error(`gdalinfo falló: ${(res.stderr || '').trim().slice(-200)}`)
  const m = /Size is\s+(\d+),\s*(\d+)/.exec(res.stdout || '')
  if (!m) throw new Error(`No se pudo leer el tamaño de ${file}`)
  return { w: Number(m[1]), h: Number(m[2]) }
}

// ── Web Mercator (EPSG:3857) ────────────────────────────────────────────────
const R = 6378137
const WORLD = 20037508.342789244
const lonToX = (lon) => (R * lon * Math.PI) / 180
const latToY = (lat) => R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))

// ── Walk de content (replica src/content/index.ts: glob de 1-2 niveles) ─────
function walkContent() {
  const contentRoot = join(ROOT, 'src', 'content')
  const files = []
  for (const dir of readdirSync(contentRoot, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    // ./<dir>/index.ts (intro suelto) y ./<dir>/<sub>/index.ts (capítulos)
    const direct = join(contentRoot, dir.name, 'index.ts')
    if (existsSync(direct)) files.push(direct)
    const sub = join(contentRoot, dir.name)
    for (const subDir of readdirSync(sub, { withFileTypes: true })) {
      if (!subDir.isDirectory()) continue
      const candidate = join(sub, subDir.name, 'index.ts')
      if (existsSync(candidate)) files.push(candidate)
    }
  }
  return files
}

// ── Descarga / copia de la imagen full ──────────────────────────────────────
async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} descargando ${url}`)
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

/**
 * Resuelve la fuente local explícita a un archivo legible por GDAL (webp/png).
 * No hace fallback a images.full/Cloudinary: un tileset debe tener una fuente
 * local declarada en tiles.source.
 * - AVIF (GDAL 3.12 no lo lee): convierte con ffmpeg a WebP.
 */
async function resolveSource(tiles, geo, tmpDir) {
  const full = tiles.source
  if (!full) throw new Error('Tiles sin source local explícito')
  const isLocal = full.startsWith('/assets-raw/') || full.startsWith('/assets/')
  let raw
  if (isLocal) {
    // Fuentes del generador viven en assets-raw/ (fuera de public/, no se
    // despliegan); compat con rutas legacy dentro de public/.
    const rel = full.replace(/^\//, '')
    raw = full.startsWith('/assets-raw/') ? join(ROOT, rel) : join(ROOT, 'public', rel)
    if (!existsSync(raw)) throw new Error(`imagen local no existe: ${raw}`)
  } else {
    const ext = extname(new URL(full).pathname) || '.webp'
    const srcFile = join(tmpDir, `source${ext}`)
    await download(full, srcFile)
    raw = srcFile
  }
  let sourceRotate = tiles.sourceRotate
  if (sourceRotate === 'auto') {
    const { w, h } = rasterSize('gdalinfo', raw)
    const sourceRatio = w / h
    const geoRatio = geo.width / geo.height
    const directDelta = Math.abs(Math.log(sourceRatio / geoRatio))
    const swappedDelta = Math.abs(Math.log(sourceRatio / (geo.height / geo.width)))
    sourceRotate = swappedDelta < directDelta ? 'ccw' : undefined
  }
  if (sourceRotate) {
    const rotated = join(tmpDir, 'source-rotated.png')
    const transpose = sourceRotate === 'ccw' ? 'transpose=2' : 'transpose=1'
    console.log(`   ⚙ ffmpeg: rotación ${sourceRotate.toUpperCase()}…`)
    const res = spawnSync(
      join(FFMPEG_BIN, 'ffmpeg'),
      ['-y', '-i', raw, '-vf', transpose, '-frames:v', '1', rotated],
      { encoding: 'utf8', windowsHide: true },
    )
    if (res.status !== 0) {
      throw new Error(`ffmpeg falló rotando la fuente\n  ${(res.stderr || '').trim().split('\n').slice(-3).join('\n  ')}`)
    }
    raw = rotated
  }
  if (raw.toLowerCase().endsWith('.avif')) {
    const webpFile = join(tmpDir, 'source.webp')
    console.log('   ⚙ ffmpeg: AVIF → WebP…')
    const res = spawnSync(
      join(FFMPEG_BIN, 'ffmpeg'),
      ['-y', '-i', raw, webpFile],
      { encoding: 'utf8', windowsHide: true },
    )
    if (res.status !== 0) {
      throw new Error(`ffmpeg falló convirtiendo AVIF\n  ${(res.stderr || '').trim().split('\n').slice(-3).join('\n  ')}`)
    }
    return webpFile
  }
  return raw
}

function cleanupOrphanZooms(outDir, zFrom, zTo) {
  if (!existsSync(outDir)) return
  for (const entry of readdirSync(outDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const z = Number(entry.name)
    if (Number.isNaN(z)) continue
    if (z < zFrom || z > zTo) {
      rmSync(join(outDir, entry.name), { recursive: true, force: true })
      console.log(`   🧹 eliminando zoom huérfano: z${entry.name}`)
    }
  }
}

function generatePreview(srcFile, mapId) {
  mkdirSync(PREVIEW_ROOT, { recursive: true })
  const out = join(PREVIEW_ROOT, `${mapId}.webp`)
  gdal(
    'gdal_translate',
    ['-q', '-of', 'WEBP', '-co', 'QUALITY=55', '-outsize', '1024', '0', '-r', 'near', srcFile, out],
    `preview ${mapId}`,
  )
  console.log(`   ✔ preview: ${out}`)
}

async function generateMap(mapId, mod, { force = false } = {}) {
  const { geo, tiles } = mod.default

  if (!tiles) {
    console.log(`⏭️  ${mapId}: sin tiles (makeTilesConfig devolvió null)`)
    return
  }
  if (!tiles.source) {
    console.log(`⏭️  ${mapId}: sin source local explícito`)
    return
  }

  const { bounds, coordinates } = processBounds(geo.pgw, geo.width, geo.height)
  const [west, south, east, north] = bounds

  const zFrom = tiles.minZoom
  const zTo = tiles.maxZoom

  const tmpDir = join(TMP_ROOT, mapId)
  mkdirSync(tmpDir, { recursive: true })
  const srcFile = await resolveSource(tiles, geo, tmpDir)
  if (!srcFile) return
  const tif4326 = join(tmpDir, '4326.tif')
  const tif3857 = join(tmpDir, '3857.tif')
  console.log(`\n🗺️  ${mapId}`)
  console.log(`   bounds: [${[west, south, east, north].map((v) => v.toFixed(5)).join(', ')}]`)
  console.log(`   zoom: ${zFrom}..${zTo}`)

  // 1. Georreferenciar a EPSG:4326 con GCPs de las 4 esquinas REALES
  //    (el mismo cuadrilátero que MapLibre usa en el ImageSource).
  //    NO usar -a_ullr del bbox axis-aligned: para PGW rotado/mixto el bbox
  //    no coincide con el cuadrilátero y los tiles quedan desalineados.
  //    Los GCPs usan las dimensiones REALES del archivo fuente (que pueden
  //    diferir de geo.width/geo.height si Cloudinary sirve una versión menor).
  const { w: srcW, h: srcH } = rasterSize('gdalinfo', srcFile)
  const [tl, tr, br, bl] = coordinates
  gdal(
    'gdal_translate',
    [
      '-q', '-of', 'GTiff', '-a_srs', 'EPSG:4326',
      '-gcp', '0', '0', String(tl[0]), String(tl[1]),
      '-gcp', String(srcW), '0', String(tr[0]), String(tr[1]),
      '-gcp', String(srcW), String(srcH), String(br[0]), String(br[1]),
      '-gcp', '0', String(srcH), String(bl[0]), String(bl[1]),
      srcFile, tif4326,
    ],
    'gdal_translate 4326 (GCPs)',
  )

  // 2. Warp a Web Mercator (proyección de los tiles XYZ). -tps (thin plate
  //    spline) modela la no-linealidad de Mercator entre los GCPs (un affine
  //    -order 1 no basta: las esquinas del cuadrilátero no forman un
  //    paralelogramo exacto en 3857 y el muestreo degrada el detalle).
  gdal(
    'gdalwarp',
    ['-q', '-overwrite', '-t_srs', 'EPSG:3857', '-tps', '-r', 'near', '-dstalpha', '-of', 'GTiff', tif4326, tif3857],
    'gdalwarp 3857',
  )

  generatePreview(srcFile, mapId)

  // 3. Extraer tiles XYZ (esquema xyz estándar)
  const xMin = lonToX(west)
  const xMax = lonToX(east)
  const yMin = latToY(south)
  const yMax = latToY(north)

  let total = 0
  for (const profile of ['standard', 'hd']) {
    const outDir = join(OUT_ROOTS[profile], mapId)
    cleanupOrphanZooms(outDir, zFrom, zTo)
    console.log(`   perfil ${profile}:`)
    for (let z = zFrom; z <= zTo; z++) {
      const tilePixelSize =
        tiles.tilePixelSizeByProfile?.[profile]?.[z] ??
        tiles.tilePixelSizeByZoom?.[z] ??
        tiles.tileSize
      const T = (2 * WORLD) / 2 ** z
      const xt0 = Math.floor((xMin + WORLD) / T)
      const xt1 = Math.floor((xMax + WORLD) / T)
      const yt0 = Math.floor((WORLD - yMax) / T)
      const yt1 = Math.floor((WORLD - yMin) / T)

      for (let xt = xt0; xt <= xt1; xt++) {
        const dir = join(outDir, String(z), String(xt))
        mkdirSync(dir, { recursive: true })
        const west2 = xt * T - WORLD
        const east2 = (xt + 1) * T - WORLD
        for (let yt = yt0; yt <= yt1; yt++) {
          const out = join(dir, `${yt}.webp`)
          if (!force && existsSync(out)) continue
          const north2 = WORLD - yt * T
          const south2 = WORLD - (yt + 1) * T
          gdal(
            'gdal_translate',
            [
              '-q', '-of', 'WEBP', '-co', 'QUALITY=95',
              '-projwin', String(west2), String(north2), String(east2), String(south2),
              '-outsize', String(tilePixelSize), String(tilePixelSize),
              '-r', 'near',
              tif3857, out,
            ],
            `${profile} tile z${z}/${xt}/${yt}`,
          )
          total++
        }
      }
      console.log(`   ✔ ${profile} z${z}: cuadrícula ${xt0}-${xt1}/${yt0}-${yt1} (${(xt1 - xt0 + 1) * (yt1 - yt0 + 1)}) @${tilePixelSize}px`)
    }
  }

  console.log(`   ✅ ${mapId}: ${total} tiles → standard + hd`)
  return total
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const targets = args.filter((a) => !a.startsWith('-'))

  const modules = []
  for (const file of walkContent()) {
    const mod = await import(pathToFileURL(file).href)
    const mapId = mod.default?.mapId
    if (mapId && MAP_TILE_MODES[mapId]) {
      modules.push({ mapId, mod })
    }
  }

  const wanted = targets.length > 0 ? new Set(targets) : null
  const todo = wanted ? modules.filter((m) => wanted.has(m.mapId)) : modules

  console.log(`📦 ${modules.length} mapas registrados con tiles (de ${walkContent().length} módulos en content)`)

  let grandTotal = 0
  for (const { mapId, mod } of todo) {
    try {
      grandTotal += (await generateMap(mapId, mod, { force })) ?? 0
    } catch (err) {
      console.error(`❌ ${mapId}: ${err.message}`)
    }
  }
  console.log(`\n✅ Total: ${grandTotal} tiles en ${todo.length} mapas`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
