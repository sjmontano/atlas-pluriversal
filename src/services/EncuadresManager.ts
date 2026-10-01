/**
 * 🖼️ ENCUADRES MANAGER — Rectángulos navegables entre mapas
 * ===========================================================
 * Port data-driven del flujo de encuadres de v17 (agregarEncuadres.jsx):
 * en vez de cadenas if/else por texto, cada `Encuadre` declara su
 * `targetMapId` y este servicio puro renderiza polígono (opcional) +
 * etiqueta clickeable y delega la navegación (URL-first) al callback.
 *
 * Las etiquetas son IMÁGENES en capas symbol (no Markers DOM): el Marker
 * HTML se posiciona por JS en cada frame y podía desfasarse del canvas
 * WebGL al zoom (deriva etiqueta vs polígono). El `icon-image` vive en el
 * mismo pase de render que fill/line: imposible que diverja, en todo zoom
 * y pantalla. Sin `text-field` (BLANK_STYLE no tiene `glyphs`): el texto va
 * horneado en la imagen (ver `encuadreLabelIcons.ts`).
 *
 * Interacción con hit-test manual (`map.project` + radio), igual que
 * `PoiManager.bindPoiEvents`: MapLibre v6 lanza en `queryRenderedFeatures`
 * sobre capas con `icon-image`, así que nada de `map.on(capa)` para labels.
 *
 * Patrón: igual que BasemapManager/PoiManager — add/remove con IDs
 * prefijados y try/catch defensivo en destroy.
 */

import type * as maplibregl from 'maplibre-gl'
import type { Encuadre } from '../types/content.ts'
import {
  composeEncuadreLabel,
  loadWithTimeout,
  LABEL_ICON_SIZE,
  LABEL_METRICS,
  LABEL_METRICS_COMPACT,
} from './encuadreLabelIcons.ts'

interface FeatureCollectionData {
  type: 'FeatureCollection'
  features: unknown[]
}

const PREFIX = 'atlas-encuadre'
const DEFAULT_COLOR = '#193965'
/* v17 (agregarEncueadres.jsx): fondo oscuro por defecto (FondoTooltip4),
 * hover → fondo claro (FondoTooltip3) + texto azul #193965. */
const LABEL_BG = '/assets/ui/tooltips/fondo-tooltip-4.webp'
const LABEL_BG_HOVER = '/assets/ui/tooltips/fondo-tooltip-3.webp'
const LABEL_TEXT = '#ffffff'
const LABEL_TEXT_HOVER = '#193965'
/* Respaldo si el webp no carga (offline total): azul noche / celeste claro. */
const LABEL_BG_FALLBACK = '#0a2240'
const LABEL_BG_HOVER_FALLBACK = '#dce9f2'
/* Medio punto de la etiqueta + holgura para el hit-test (como los 24px POI). */
const HIT_SLOP_PX = 8
/* Objetivo táctil mínimo WCAG (44px): aunque lo visual sea más bajo, la
 * zona tocable nunca baja de esto. Se aplica expandiendo la caja. */
const MIN_TOUCH_HALF_PX = 22

interface LabelBox {
  id: string
  targetMapId: string
  coords: [number, number]
  halfW: number
  halfH: number
  hasPolygon: boolean
}

interface Tracked {
  sources: string[]
  layers: string[]
  images: string[]
  layerHandlers: Array<{ layer: string; type: 'click' | 'mouseenter' | 'mouseleave'; fn: (ev: unknown) => void }>
  mapHandlers: Array<{ type: 'click' | 'mousemove'; fn: (ev: maplibregl.MapMouseEvent) => void }>
  labels: LabelBox[]
  canvasLeave: (() => void) | null
}

const trackedByMap = new WeakMap<maplibregl.Map, Tracked>()

function track(map: maplibregl.Map): Tracked {
  let t = trackedByMap.get(map)
  if (t === undefined) {
    t = { sources: [], layers: [], images: [], layerHandlers: [], mapHandlers: [], labels: [], canvasLeave: null }
    trackedByMap.set(map, t)
  }
  return t
}

function isCompact(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 768px)').matches
  )
}

function setPolygonHighlight(map: maplibregl.Map, id: string, on: boolean): void {
  try {
    map.setPaintProperty(`${PREFIX}-fill-${id}`, 'fill-opacity', on ? 0.25 : 0)
  } catch { /* capa aún no lista o encuadre sin polígono */ }
}

export async function addEncuadres(
  map: maplibregl.Map,
  encuadres: Encuadre[],
  onNavigate: (targetMapId: string) => void,
): Promise<void> {
  /* Idempotente (PoiManager.addPois hace lo mismo): evita duplicar capas
   * si el efecto se re-ejecuta sobre el mismo mapa. */
  removeEncuadres(map)
  const t = track(map)
  const compact = isCompact()
  const metrics = compact ? LABEL_METRICS_COMPACT : LABEL_METRICS

  /* Fuente del canvas: esperar Noto Sans para hornear el texto correcto. */
  try {
    await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
  } catch { /* jsdom o fuente bloqueada: se sigue con fallback */ }
  const [bgNormal, bgHover] = await Promise.all([
    loadWithTimeout(LABEL_BG),
    loadWithTimeout(LABEL_BG_HOVER),
  ])

  await Promise.all(
    encuadres.map(async (encuadre) => {
      /* Polígono (opcional) — sin cambios: fill sin relleno base + línea
       * punteada, clickeables, con cursor pointer en hover. */
      let hasPolygon = false
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
            paint: { 'line-color': color, 'line-width': 2.5, 'line-dasharray': [2, 2] },
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
          hasPolygon = true
        } catch {
          /* polígono ausente: la etiqueta sigue navegable */
        }
      }

      /* Etiqueta como imagen canvas en capa symbol: mismo transform que el
       * polígono en todo zoom/pantalla. `icon-rotate` preserva los 19° del
       * intro cap 3 sin tocar transforms del DOM. `labelMaxWidth` permite
       * una sola línea en etiquetas largas sin mover el global. */
      try {
        const effectiveMetrics =
          encuadre.labelMaxWidth === undefined
            ? metrics
            : { ...metrics, maxWidthPx: encuadre.labelMaxWidth }
        const normal = composeEncuadreLabel(encuadre.name, {
          metrics: effectiveMetrics,
          textColor: LABEL_TEXT,
          bg: bgNormal,
          fallbackBg: LABEL_BG_FALLBACK,
        })
        const hover = composeEncuadreLabel(encuadre.name, {
          metrics: effectiveMetrics,
          textColor: LABEL_TEXT_HOVER,
          bg: bgHover,
          fallbackBg: LABEL_BG_HOVER_FALLBACK,
        })
        const imgId = `${PREFIX}-img-${encuadre.id}`
        const imgHoverId = `${PREFIX}-img-${encuadre.id}-hover`
        const labelSid = `${PREFIX}-labelsrc-${encuadre.id}`
        const labelId = `${PREFIX}-label-${encuadre.id}`
        map.addImage(imgId, normal)
        map.addImage(imgHoverId, hover)
        map.addSource(labelSid, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: { type: 'Point', coordinates: encuadre.labelCoords },
              },
            ],
          },
        })
        map.addLayer({
          id: labelId,
          type: 'symbol',
          source: labelSid,
          layout: {
            'icon-image': imgId,
            'icon-size': LABEL_ICON_SIZE,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-rotate': encuadre.labelRotate ?? 0,
            'icon-rotation-alignment': 'viewport',
          },
        })
        t.images.push(imgId, imgHoverId)
        t.sources.push(labelSid)
        t.layers.push(labelId)
        t.labels.push({
          id: encuadre.id,
          targetMapId: encuadre.targetMapId,
          coords: encuadre.labelCoords,
          halfW: (normal.width * LABEL_ICON_SIZE) / 2,
          halfH: (normal.height * LABEL_ICON_SIZE) / 2,
          hasPolygon,
        })
      } catch {
        /* sin etiqueta canvas (WebGL sin imágenes): el polígono navega igual */
      }
    }),
  )

  /* Hit-test manual de etiquetas (nunca queryRenderedFeatures: bug v6 con
   * icon-image). El hover conmuta la imagen normal/hover y el relleno del
   * polígono; el click navega. */
  let hoveredId: string | null = null
  const pick = (point: { x: number; y: number }): LabelBox | null => {
    let best: LabelBox | null = null
    let bestScore = Infinity
    for (const label of t.labels) {
      let p: { x: number; y: number }
      try {
        p = map.project(label.coords)
      } catch {
        continue
      }
      const dx = Math.abs(p.x - point.x)
      const dy = Math.abs(p.y - point.y)
      /* Caja efectiva: visual o mínimo táctil (lo que sea mayor) + holgura */
      const hw = Math.max(label.halfW, MIN_TOUCH_HALF_PX) + HIT_SLOP_PX
      const hh = Math.max(label.halfH, MIN_TOUCH_HALF_PX) + HIT_SLOP_PX
      if (dx > hw || dy > hh) continue
      const score = Math.max(dx / (hw + 1), dy / (hh + 1))
      if (score < bestScore) {
        best = label
        bestScore = score
      }
    }
    return best
  }
  const applyHover = (id: string | null) => {
    if (id === hoveredId) return
    const prev = t.labels.find((l) => l.id === hoveredId)
    const next = t.labels.find((l) => l.id === id)
    hoveredId = id
    try {
      if (prev !== undefined) {
        map.setLayoutProperty(`${PREFIX}-label-${prev.id}`, 'icon-image', `${PREFIX}-img-${prev.id}`)
        if (prev.hasPolygon) setPolygonHighlight(map, prev.id, false)
      }
      if (next !== undefined) {
        map.setLayoutProperty(`${PREFIX}-label-${next.id}`, 'icon-image', `${PREFIX}-img-${next.id}-hover`)
        if (next.hasPolygon) setPolygonHighlight(map, next.id, true)
      }
      map.getCanvas().style.cursor = next !== undefined ? 'pointer' : ''
    } catch { /* capa aún no lista */ }
  }
  const onMove = (e: maplibregl.MapMouseEvent) => {
    applyHover(pick(e.point)?.id ?? null)
  }
  const onClick = (e: maplibregl.MapMouseEvent) => {
    const hit = pick(e.point)
    if (hit !== null) onNavigate(hit.targetMapId)
  }
  const onLeave = () => applyHover(null)
  map.on('mousemove', onMove)
  map.on('click', onClick)
  t.mapHandlers.push({ type: 'mousemove', fn: onMove }, { type: 'click', fn: onClick })
  try {
    const canvas = map.getCanvas()
    if (canvas !== null && typeof canvas.addEventListener === 'function') {
      canvas.addEventListener('mouseleave', onLeave)
      t.canvasLeave = () => {
        try {
          canvas.removeEventListener('mouseleave', onLeave)
        } catch { /* noop */ }
      }
    }
  } catch { /* entorno sin canvas */ }
}

export function removeEncuadres(map: maplibregl.Map): void {
  const t = trackedByMap.get(map)
  if (t === undefined) return
  for (const h of t.layerHandlers) {
    try { map.off(h.type, h.layer, h.fn) } catch { /* noop */ }
  }
  for (const h of t.mapHandlers) {
    try { map.off(h.type, h.fn) } catch { /* noop */ }
  }
  try {
    t.canvasLeave?.()
  } catch { /* noop */ }
  for (const id of t.layers) {
    try { if (map.getLayer(id)) map.removeLayer(id) } catch { /* noop */ }
  }
  for (const id of t.sources) {
    try { if (map.getSource(id)) map.removeSource(id) } catch { /* noop */ }
  }
  for (const id of t.images) {
    try { if (map.hasImage(id)) map.removeImage(id) } catch { /* noop */ }
  }
  trackedByMap.delete(map)
}
