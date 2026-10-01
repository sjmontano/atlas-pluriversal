// ─────────────────────────────────────────────────────────────────────────────
// SHIFT-GEOJSON — desplaza polígonos/líneas de encuadres por un delta [dlng, dlat]
// =============================================================================
// Los GeoJSON de encuadres son coordenadas verdaderas (CRS84): si se ven
// corridos respecto al relieve ya calibrado, se mueven aquí (NO el PGW,
// que movería también la imagen y rompería la calibración).
//
// Mapa de pantalla → geo con bearing -90 (verificado con markers medidos:
// pantalla X ∝ +lat, pantalla Y ∝ +lng), o sea:
//    ← izquierda .... --lat NEGATIVO      → derecha ...... --lat positivo
//    ↑ arriba ........ --lng NEGATIVO      ↓ abajo ........ --lng positivo
// Magnitud aprox a zoom inicial: ~104 px por grado (≈0.01° ≈ 1 px).
// Tras fijar el delta, aplicar el MISMO a los labelCoords en
// src/content/chapter-1/encuadres/map.ts (si no, las etiquetas se despegan).
//
// Uso:
//   node scripts/shift-geojson.mjs --lat -0.05 public/assets/geojson/encuadre-sur-valle.json
//   node scripts/shift-geojson.mjs --lng 0.02 --lat -0.05 public/assets/geojson/encuadre-*.json
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from 'node:fs'

const USAGE = `Uso:
  node scripts/shift-geojson.mjs --lng <d> --lat <d> [--scale-x <f> --scale-y <f>] <archivo.json> [...]
Pantalla (bearing -90) → geo: izquierda = --lat negativo, derecha = --lat
positivo, arriba = --lng negativo, abajo = --lng positivo.
Escala (tamaño, 1 = original) alrededor del centroide del archivo.`

const args = process.argv.slice(2)
let dlng = 0
let dlat = 0
let scaleX = 1
let scaleY = 1
const files = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lng') dlng = Number(args[++i])
  else if (args[i] === '--lat') dlat = Number(args[++i])
  else if (args[i] === '--scale-x') scaleX = Number(args[++i])
  else if (args[i] === '--scale-y') scaleY = Number(args[++i])
  else if (args[i] === '--help' || args[i] === '-h') {
    console.log(USAGE)
    process.exit(0)
  } else files.push(args[i])
}
if (files.length === 0 || !Number.isFinite(dlng) || !Number.isFinite(dlat) || !Number.isFinite(scaleX) || !Number.isFinite(scaleY)) {
  console.log(USAGE)
  process.exit(1)
}

const round6 = (n) => Math.round(n * 1e6) / 1e6

/** Desplaza recursivamente; solo toca posiciones [lng, lat, ...]. */
function shift(coords) {
  if (Array.isArray(coords) && typeof coords[0] === 'number') {
    coords[0] = round6(coords[0] + dlng)
    if (typeof coords[1] === 'number') coords[1] = round6(coords[1] + dlat)
    return
  }
  for (const c of coords) shift(c)
}

function bboxOf(geom) {
  const xs = []
  const ys = []
  const walk = (c) => {
    if (Array.isArray(c) && typeof c[0] === 'number') {
      xs.push(c[0])
      ys.push(c[1])
    } else for (const x of c) walk(x)
  }
  walk(geom.coordinates)
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
}

/** Escala recursivamente alrededor del centroide (1 = sin cambio). */
function scale(coords, cx, cy) {
  if (Array.isArray(coords) && typeof coords[0] === 'number') {
    coords[0] = round6(cx + (coords[0] - cx) * scaleX)
    if (typeof coords[1] === 'number') coords[1] = round6(cy + (coords[1] - cy) * scaleY)
    return
  }
  for (const c of coords) scale(c, cx, cy)
}

function centroidOf(data) {
  const feats = data.type === 'FeatureCollection' ? data.features : [data]
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (const f of feats) {
    const b = bboxOf(f.geometry)
    if (b.x0 < x0) x0 = b.x0
    if (b.x1 > x1) x1 = b.x1
    if (b.y0 < y0) y0 = b.y0
    if (b.y1 > y1) y1 = b.y1
  }
  return [(x0 + x1) / 2, (y0 + y1) / 2]
}

for (const file of files) {
  const raw = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
  const data = JSON.parse(raw)
  const feats = data.type === 'FeatureCollection' ? data.features : [data]
  const before = feats.map((f) => bboxOf(f.geometry))
  if (scaleX !== 1 || scaleY !== 1) {
    const [cx, cy] = centroidOf(data)
    for (const f of feats) scale(f.geometry.coordinates, cx, cy)
  }
  for (const f of feats) shift(f.geometry.coordinates)
  /* Minificado en una línea como los originales (diff solo en números). */
  writeFileSync(file, JSON.stringify(data))
  feats.forEach((f, i) => {
    const b = before[i]
    const a = bboxOf(f.geometry)
    console.log(
      `${file} [${i}]: x ${b.x0}→${a.x0} .. ${b.x1}→${a.x1} | y ${b.y0}→${a.y0} .. ${b.y1}→${a.y1}`,
    )
  })
}
console.log(`OK: dlng=${dlng} dlat=${dlat} scale=${scaleX}x${scaleY} en ${files.length} archivo(s).`)
