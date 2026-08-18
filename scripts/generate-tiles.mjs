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
//   pnpm tiles                                  # todos los mapas con tiles
//   pnpm tiles chapter1-ecosistemas             # un mapa
//   pnpm tiles chapter1-ecosistemas --force     # regenerar tiles existentes
//
// Salida:
//   public/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp   (mapas base)
//   public/assets/maps/tiles/capas/{layerId}/{z}/{x}/{y}.webp (capas futuras)
//   (NO versionar en git — regenerar con `pnpm tiles`)
// ─────────────────────────────────────────────────────────────────────────────

import { mkdirSync, existsSync, writeFileSync, copyFileSync, readdirSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { MAP_TILE_MODES } from '../src/data/tiles.ts'
import { processBounds } from '../src/services/BoundsCalculator.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_ROOT = join(ROOT, 'public', 'assets', 'maps', 'tiles', 'mapas')
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
 * Resuelve la imagen full a un archivo legible por GDAL (webp/png).
 * - URLs Cloudinary: descarga directa.
 * - Rutas locales (/assets/...): copia desde public/.
 * - AVIF (GDAL 3.12 no lo lee): convierte con ffmpeg a WebP.
 */
async function resolveSource(images, tmpDir) {
  const full = images.full
  if (!full) return null
  const isLocal = full.startsWith('/assets/')
  let raw
  if (isLocal) {
    raw = join(ROOT, 'public', full.replace(/^\//, ''))
    if (!existsSync(raw)) throw new Error(`imagen local no existe: ${raw}`)
  } else {
    const ext = extname(new URL(full).pathname) || '.webp'
    const srcFile = join(tmpDir, `source${ext}`)
    await download(full, srcFile)
    raw = srcFile
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

async function generateMap(mapId, mod, { force = false } = {}) {
  const { geo, images, config, tiles } = mod.default

  if (!tiles) {
    console.log(`⏭️  ${mapId}: sin tiles (makeTilesConfig devolvió null)`)
    return
  }
  if (!images.full) {
    console.log(`⏭️  ${mapId}: sin imagen full`)
    return
  }

  const { bounds } = processBounds(geo.pgw, geo.width, geo.height)
  const [west, south, east, north] = bounds

  const zFrom = tiles.minZoom
  const zTo = tiles.maxZoom

  const tmpDir = join(TMP_ROOT, mapId)
  mkdirSync(tmpDir, { recursive: true })
  const srcFile = await resolveSource(images, tmpDir)
  if (!srcFile) return
  const tif4326 = join(tmpDir, '4326.tif')
  const tif3857 = join(tmpDir, '3857.tif')
  const outDir = join(OUT_ROOT, mapId)

  cleanupOrphanZooms(outDir, zFrom, zTo)

  console.log(`\n🗺️  ${mapId}`)
  console.log(`   bounds: [${[west, south, east, north].map((v) => v.toFixed(5)).join(', ')}]`)
  console.log(`   zoom: ${zFrom}..${zTo}`)

  // 1. Georreferenciar a EPSG:4326 (mismo footprint que la capa base)
  gdal(
    'gdal_translate',
    ['-q', '-of', 'GTiff', '-a_srs', 'EPSG:4326', '-a_ullr', String(west), String(north), String(east), String(south), srcFile, tif4326],
    'gdal_translate 4326',
  )

  // 2. Warp a Web Mercator (proyección de los tiles XYZ)
  gdal(
    'gdalwarp',
    ['-q', '-overwrite', '-t_srs', 'EPSG:3857', '-r', 'lanczos', '-dstalpha', '-of', 'GTiff', tif4326, tif3857],
    'gdalwarp 3857',
  )

  // 3. Extraer tiles XYZ (esquema xyz estándar)
  const xMin = lonToX(west)
  const xMax = lonToX(east)
  const yMin = latToY(south)
  const yMax = latToY(north)

  let total = 0
  for (let z = zFrom; z <= zTo; z++) {
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
            '-outsize', '256', '256',
            tif3857, out,
          ],
          `tile z${z}/${xt}/${yt}`,
        )
        total++
      }
    }
    console.log(`   ✔ z${z}: cuadrícula ${xt0}-${xt1}/${yt0}-${yt1} (${(xt1 - xt0 + 1) * (yt1 - yt0 + 1)})`)
  }

  console.log(`   ✅ ${mapId}: ${total} tiles → ${outDir}`)
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