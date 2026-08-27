/**
 * 🌐 FETCH GEOJSON — Extrae las capas del backend a archivos estáticos
 * =====================================================================
 * El backend (render.com) sirve GeoJSON en `{ geoCollection: FeatureCollection }`.
 * Esta rutina se corre UNA vez (o cuando el equipo de contenido actualice el
 * backend) y deja los datos estáticos en `public/assets/geojson/<id>.json`.
 * Filosofía del proyecto: sin backend en runtime (TAREA 0).
 *
 * Uso:
 *   node scripts/fetch-geojson.mjs            # baja los que falten
 *   node scripts/fetch-geojson.mjs --force    # re-baja todo
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BACKEND = 'https://atlas-backend-a4m1.onrender.com/api/v1/location'
const OUT_DIR = resolve(process.cwd(), 'public/assets/geojson')

/** id de archivo (kebab-case) → nombre de la ubicación en el backend. */
const MANIFEST = [
  { id: 'cuenca-rio-cauca', name: 'Cuenca del río Cauca' },
  { id: 'valle-alto-rio-cauca', name: 'Valle alto del río Cauca' },
  { id: 'rio-magdalena', name: 'Río Magdalena' },
  { id: 'cuenca-alta', name: 'capa Cuenca alta' },
  { id: 'nodo-oriente-cali', name: 'nodoOrienteCali' },
  { id: 'nodo-villa-rica', name: 'nodovilla' },
  { id: 'nodo-suarez', name: 'nodoSuarez' },
  { id: 'cuenca-baja', name: 'Cuenca Baja' },
  { id: 'cuenca-media', name: 'Cuenca media' },
  { id: 'rio-san-jorge', name: 'Río San Jorge' },
  { id: 'rio-cesar', name: 'Río Cesar' },
  { id: 'rio-nechi', name: 'Río Nechí' },
  { id: 'rio-anchicaya', name: 'Rio Anchicaya' },
  { id: 'rio-san-juan', name: 'Río San Juan' },
  { id: 'rio-atrato', name: 'Río Atrato' },
  { id: 'rio-cauca', name: 'Río Cauca' },
  { id: 'encuadre-cuenca-alta', name: 'Encuadre cuenca alta' },
  { id: 'encuadre-sur-valle', name: 'Encuadre del sur del valle' },
  { id: 'encuadre-cuenca-completa', name: 'EncuadreCuencaCompleta' },
  { id: 'encuadre-limites-cuenca', name: 'Encuadre limites de la cuenca' },
]

const force = process.argv.includes('--force')

function isFeatureCollection(data) {
  return (
    data !== null &&
    typeof data === 'object' &&
    data.type === 'FeatureCollection' &&
    Array.isArray(data.features)
  )
}

async function fetchOne(entry) {
  const url = `${BACKEND}/${encodeURIComponent(entry.name)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const body = await res.json()
  const geo = body.geoCollection ?? body
  if (!isFeatureCollection(geo)) throw new Error('respuesta no es FeatureCollection')
  const out = resolve(OUT_DIR, `${entry.id}.json`)
  writeFileSync(out, JSON.stringify(geo), 'utf8')
  const kb = Math.round(Buffer.byteLength(JSON.stringify(geo)) / 1024)
  return { id: entry.id, features: geo.features.length, kb }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  let ok = 0
  const failures = []

  for (const entry of MANIFEST) {
    const out = resolve(OUT_DIR, `${entry.id}.json`)
    if (!force && existsSync(out)) {
      console.log(`↷ ${entry.id} (ya existe)`)
      ok++
      continue
    }
    try {
      const r = await fetchOne(entry)
      console.log(`✓ ${r.id}: ${r.features} features, ${r.kb} KB`)
      ok++
    } catch (err) {
      console.error(`✗ ${entry.id}: ${err.message}`)
      failures.push(entry.id)
    }
  }

  console.log(`\n${ok}/${MANIFEST.length} capas estáticas listas en public/assets/geojson/`)
  if (failures.length > 0) {
    console.error(`Fallaron: ${failures.join(', ')}`)
    process.exitCode = 1
  }
}

void main()
