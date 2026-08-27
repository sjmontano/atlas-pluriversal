/**
 * 🖼️ ENCUADRES MANAGER — Rectángulos navegables entre mapas
 * ===========================================================
 * Port data-driven del flujo de encuadres de v17 (agregarEncuadres.jsx):
 * en vez de cadenas if/else por texto, cada `Encuadre` declara su
 * `targetMapId` y este servicio puro renderiza polígono (opcional) +
 * etiqueta clickeable y delega la navegación (URL-first) al callback.
 *
 * Patrón: igual que BasemapManager/PoiManager — add/remove con IDs
 * prefijados y try/catch defensivo en destroy.
 */

import { Marker } from 'maplibre-gl'
import type * as maplibregl from 'maplibre-gl'
import type { Encuadre } from '../types/content.ts'

interface FeatureCollectionData {
  type: 'FeatureCollection'
  features: unknown[]
}

const PREFIX = 'atlas-encuadre'
const DEFAULT_COLOR = '#5577af'
const LABEL_BG = '/assets/ui/tooltips/fondo-tooltip-3.webp'

interface Tracked {
  sources: string[]
  layers: string[]
  markers: Marker[]
}

const trackedByMap = new WeakMap<maplibregl.Map, Tracked>()

function track(map: maplibregl.Map): Tracked {
  let t = trackedByMap.get(map)
  if (t === undefined) {
    t = { sources: [], layers: [], markers: [] }
    trackedByMap.set(map, t)
  }
  return t
}

function labelElement(encuadre: Encuadre, onNavigate: (target: string) => void): HTMLButtonElement {
  const el = document.createElement('button')
  el.type = 'button'
  el.setAttribute('aria-label', `Ir a: ${encuadre.name}`)
  Object.assign(el.style, {
    all: 'unset',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 14px',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '600',
    lineHeight: '1.25',
    textAlign: 'center',
    color: '#ffffff',
    whiteSpace: 'normal',
    maxWidth: '220px',
    textShadow: '0 1px 3px rgba(3, 9, 30, 0.85)',
    transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), filter 0.25s ease',
  } satisfies Partial<CSSStyleDeclaration>)

  const bg = document.createElement('img')
  bg.src = LABEL_BG
  bg.alt = ''
  Object.assign(bg.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '-1',
    border: '2px solid rgba(0, 110, 150, 1)',
    borderRadius: '6px',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>)
  el.appendChild(bg)

  const text = document.createElement('span')
  text.textContent = encuadre.name
  el.appendChild(text)

  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.06)'
    el.style.filter = 'brightness(1.15)'
  })
  el.addEventListener('mouseleave', () => {
    el.style.transform = ''
    el.style.filter = ''
  })
  el.addEventListener('click', (e) => {
    e.stopPropagation()
    onNavigate(encuadre.targetMapId)
  })
  return el
}

export async function addEncuadres(
  map: maplibregl.Map,
  encuadres: Encuadre[],
  onNavigate: (targetMapId: string) => void,
): Promise<void> {
  const t = track(map)

  await Promise.all(
    encuadres.map(async (encuadre) => {
      /* Polígono (opcional) */
      if (encuadre.url !== undefined) {
        try {
          const res = await fetch(encuadre.url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = (await res.json()) as FeatureCollectionData
          const sid = `${PREFIX}-src-${encuadre.id}`
          const fillId = `${PREFIX}-fill-${encuadre.id}`
          const lineId = `${PREFIX}-line-${encuadre.id}`
          const color = encuadre.color ?? DEFAULT_COLOR

          map.addSource(sid, { type: 'geojson', data })
          map.addLayer({
            id: fillId,
            type: 'fill',
            source: sid,
            paint: { 'fill-color': color, 'fill-opacity': 0.08 },
          })
          map.addLayer({
            id: lineId,
            type: 'line',
            source: sid,
            paint: { 'line-color': color, 'line-width': 1.5, 'line-dasharray': [2, 2] },
          })

          const go = () => onNavigate(encuadre.targetMapId)
          map.on('click', fillId, go)
          map.on('click', lineId, go)
          map.on('mouseenter', fillId, () => { map.getCanvas().style.cursor = 'pointer' })
          map.on('mouseleave', fillId, () => { map.getCanvas().style.cursor = '' })

          t.sources.push(sid)
          t.layers.push(fillId, lineId)
        } catch {
          /* polígono ausente: la etiqueta sigue navegable */
        }
      }

      /* Etiqueta clickeable */
      const marker = new Marker({ element: labelElement(encuadre, onNavigate) })
        .setLngLat(encuadre.labelCoords)
        .addTo(map)
      t.markers.push(marker)
    }),
  )
}

export function removeEncuadres(map: maplibregl.Map): void {
  const t = trackedByMap.get(map)
  if (t === undefined) return
  for (const id of t.layers) {
    try { if (map.getLayer(id)) map.removeLayer(id) } catch { /* noop */ }
  }
  for (const id of t.sources) {
    try { if (map.getSource(id)) map.removeSource(id) } catch { /* noop */ }
  }
  for (const m of t.markers) {
    try { m.remove() } catch { /* noop */ }
  }
  trackedByMap.delete(map)
}
