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
/* v17 (agregarEncueadres.jsx): fondo oscuro por defecto (FondoTooltip4),
 * hover → fondo claro (FondoTooltip3) + texto azul #193965. */
const LABEL_BG = '/assets/ui/tooltips/fondo-tooltip-4.webp'
const LABEL_BG_HOVER = '/assets/ui/tooltips/fondo-tooltip-3.webp'
const LABEL_TEXT = '#ffffff'
const LABEL_TEXT_HOVER = '#193965'

interface Tracked {
  sources: string[]
  layers: string[]
  markers: Marker[]
  layerHandlers: Array<{ layer: string; type: 'click' | 'mouseenter' | 'mouseleave'; fn: (ev: unknown) => void }>
}

const trackedByMap = new WeakMap<maplibregl.Map, Tracked>()

function track(map: maplibregl.Map): Tracked {
  let t = trackedByMap.get(map)
  if (t === undefined) {
    t = { sources: [], layers: [], markers: [], layerHandlers: [] }
    trackedByMap.set(map, t)
  }
  return t
}

interface EncuadreHighlight {
  on: () => void
  off: () => void
}

const NO_HIGHLIGHT: EncuadreHighlight = { on: () => undefined, off: () => undefined }

function labelElement(
  encuadre: Encuadre,
  onNavigate: (target: string) => void,
  highlight: EncuadreHighlight,
): HTMLButtonElement {
  const el = document.createElement('button')
  el.type = 'button'
  el.setAttribute('aria-label', `Ir a: ${encuadre.name}`)
  /* Clase para el ajuste responsive (AtlasMap.module.css): en móvil las
     etiquetas se compactan. OJO: MapLibre posiciona el marker escribiendo
     `transform` en este elemento. NO tocar el.style.transform aquí (rompe
     la posición); lo visual va en el wrapper interno. */
  el.className = 'atlas-encuadre-label'
  Object.assign(el.style, {
    all: 'unset',
    cursor: 'pointer',
    position: 'relative',
    display: 'block',
    maxWidth: '220px',
  } satisfies Partial<CSSStyleDeclaration>)

  const inner = document.createElement('span')
  inner.className = 'atlas-encuadre-label-inner'
  /* Rotación opt-in por encuadre (v17: 19° en intro cap 3). Va en el
   * wrapper interno porque MapLibre escribe `transform` en el botón. */
  const rotate = encuadre.labelRotate ?? 0
  const baseTransform = rotate !== 0 ? `rotate(${rotate}deg)` : ''
  /* Estilo verbatim v17: Noto Sans itálica 500, 1.8vh/2vh, blanco sobre
   * FondoTooltip4. Sin borde propio (v17 solo redondea el fondo a 6px).
   * Se conserva whiteSpace normal (nuestros names no traen <br> como v17)
   * y el responsive de AtlasMap.module.css sigue mandando en móvil. */
  Object.assign(inner.style, {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 8px',
    fontFamily: '"Noto Sans", sans-serif',
    fontStyle: 'italic',
    fontSize: '1.8vh',
    fontWeight: '500',
    lineHeight: '2vh',
    textAlign: 'center',
    color: LABEL_TEXT,
    whiteSpace: 'normal',
    textShadow: '0 1px 3px rgba(3, 9, 30, 0.85)',
    transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), filter 0.25s ease',
    transform: baseTransform,
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
    borderRadius: '6px',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>)
  inner.appendChild(bg)

  const text = document.createElement('span')
  text.textContent = encuadre.name
  inner.appendChild(text)
  el.appendChild(inner)

  el.addEventListener('mouseenter', () => {
    inner.style.transform = `${baseTransform} scale(1.06)`.trim()
    inner.style.filter = 'brightness(1.15)'
    bg.src = LABEL_BG_HOVER
    text.style.color = LABEL_TEXT_HOVER
    highlight.on()
  })
  el.addEventListener('mouseleave', () => {
    inner.style.transform = baseTransform
    inner.style.filter = ''
    bg.src = LABEL_BG
    text.style.color = ''
    highlight.off()
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
          /* Sin relleno base (solo borde): el relleno aparece al hover
           * de la etiqueta o del polígono. El fill sigue clickeable. */
          map.addLayer({
            id: fillId,
            type: 'fill',
            source: sid,
            paint: { 'fill-color': color, 'fill-opacity': 0 },
          })
          map.addLayer({
            id: lineId,
            type: 'line',
            source: sid,
            paint: { 'line-color': color, 'line-width': 1.5, 'line-dasharray': [2, 2] },
          })

          const go = () => onNavigate(encuadre.targetMapId)
          const pointerOn = () => { map.getCanvas().style.cursor = 'pointer' }
          const pointerOff = () => { map.getCanvas().style.cursor = '' }
          map.on('click', fillId, go)
          map.on('click', lineId, go)
          map.on('mouseenter', fillId, pointerOn)
          map.on('mouseenter', lineId, pointerOn)
          map.on('mouseleave', fillId, pointerOff)
          map.on('mouseleave', lineId, pointerOff)

          t.sources.push(sid)
          t.layers.push(fillId, lineId)
          t.layerHandlers.push(
            { layer: fillId, type: 'click', fn: go },
            { layer: lineId, type: 'click', fn: go },
            { layer: fillId, type: 'mouseenter', fn: pointerOn },
            { layer: lineId, type: 'mouseenter', fn: pointerOn },
            { layer: fillId, type: 'mouseleave', fn: pointerOff },
            { layer: lineId, type: 'mouseleave', fn: pointerOff },
          )
        } catch {
          /* polígono ausente: la etiqueta sigue navegable */
        }
      }

      /* Resaltado sutil del cuadrante al hover de la etiqueta */
      const highlight: EncuadreHighlight = encuadre.url === undefined
        ? NO_HIGHLIGHT
        : {
            on: () => {
              try {
                map.setPaintProperty(`${PREFIX}-fill-${encuadre.id}`, 'fill-opacity', 0.25)
                map.setPaintProperty(`${PREFIX}-line-${encuadre.id}`, 'line-width', 3)
              } catch { /* capa aún no lista */ }
            },
            off: () => {
              try {
                map.setPaintProperty(`${PREFIX}-fill-${encuadre.id}`, 'fill-opacity', 0)
                map.setPaintProperty(`${PREFIX}-line-${encuadre.id}`, 'line-width', 1.5)
              } catch { /* noop */ }
            },
          }

      /* Etiqueta clickeable */
      const marker = new Marker({ element: labelElement(encuadre, onNavigate, highlight) })
        .setLngLat(encuadre.labelCoords)
        .addTo(map)
      t.markers.push(marker)
    }),
  )
}

export function removeEncuadres(map: maplibregl.Map): void {
  const t = trackedByMap.get(map)
  if (t === undefined) return
  for (const h of t.layerHandlers) {
    try { map.off(h.type, h.layer, h.fn) } catch { /* noop */ }
  }
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
