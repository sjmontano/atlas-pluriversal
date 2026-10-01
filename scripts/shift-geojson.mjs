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
  node scripts/shift-geojson.mjs --lng <d> --lat <d> <archivo.json> [...]
Pantalla (bearing -90) → geo: izquierda = --lat negativo, derecha = --lat
positivo, arriba = --lng negativo, abajo = --lng positivo.`

const args = process.argv.slice(2)
let dlng = 0
let dlat = 0
const files = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lng') dlng = Number(args[++i])
  else if (args[i] === '--lat') dlat = Number(args[++i])
  else if (args[i] === '--help' || args[i] === '-h') {
    console.log(USAGE)
    process.exit(0)
  } else files.push(args[i])
}
if (files.length === 0 || !Number.isFinite(dlng) || !Number.isFinite(dlat)) {
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

for (const file of files) {
  const raw = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
  const data = JSON.parse(raw)
  const feats = data.type === 'FeatureCollection' ? data.features : [data]
  const before = feats.map((f) => bboxOf(f.geometry))
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
console.log(`OK: dlng=${dlng} dlat=${dlat} en ${files.length} archivo(s).`)
