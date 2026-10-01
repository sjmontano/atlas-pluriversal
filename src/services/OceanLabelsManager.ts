/**
 * 🌊 OCEAN LABELS MANAGER — Etiquetas geográficas estáticas (océanos)
 * =====================================================================
 * Port data-driven de v17 (`MapComponent.jsx`: popups "OCÉANO PACÍFICO" y
 * "MAR CARIBE" solo en el mapa `encuadres`). En v17 eran popups DOM con
 * `<b>`; aquí son texto horneado en canvas en capas symbol — mismo pase
 * de render que el mapa, sin deriva al zoom y sin depender del DOM.
 *
 * No interactivas: sin hit-test, sin cursor, sin modales. Solo visibles
 * en los mapas que declaran `oceanLabels` (la vista Colombia completa;
 * en los zooms del valle esos puntos quedan fuera de vista).
 *
 * Patrón: igual que EncuadresManager — add/remove con IDs prefijados y
 * try/catch defensivo en destroy.
 */

import type * as maplibregl from 'maplibre-gl'
import type { OceanLabel } from '../types/content.ts'

const PREFIX = 'atlas-ocean'
/* El canvas se hornea al doble para nitidez; icon-size lo devuelve a CSS. */
const ART_SCALE = 2
const ICON_SIZE = 1 / ART_SCALE
const FONT_PX = 30
const PAD_X = 10
/* El letterSpacing suma ~2px por carácter fuera del measureText y la sombra
 * (blur 4) sangra por los bordes: sin esta holgura la primera/última letra
 * ("O" de OCÉANO) queda recortada por el borde del canvas. */
const SPACING_PX = 2
const SHADOW_SLACK = 8
const TEXT_COLOR = '#ffffff'

interface Tracked {
  sources: string[]
  layers: string[]
  images: string[]
}

const trackedByMap = new WeakMap<maplibregl.Map, Tracked>()

function track(map: maplibregl.Map): Tracked {
  let t = trackedByMap.get(map)
  if (t === undefined) {
    t = { sources: [], layers: [], images: [] }
    trackedByMap.set(map, t)
  }
  return t
}

interface BakedLabel {
  width: number
  height: number
  data: Uint8ClampedArray
}

/** Hornea texto blanco con sombra de legibilidad sobre fondo transparente. */
function bakeOceanLabel(name: string): BakedLabel {
  const canvas = document.createElement('canvas')
  const probe = canvas.getContext('2d')
  if (!probe) throw new Error('No 2d context available')

  const font = `700 ${FONT_PX}px "Noto Sans", sans-serif`
  probe.font = font
  const contentW = probe.measureText(name).width
  const spacedW = contentW + SPACING_PX * name.length
  const W = Math.max(1, Math.ceil(spacedW + 2 * (PAD_X + SHADOW_SLACK)))
  const H = Math.max(1, Math.ceil(FONT_PX * 1.5 + 2 * SHADOW_SLACK))

  /* Redimensionar resetea el contexto: reconfigurar todo después. */
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context available')

  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = TEXT_COLOR
  try {
    /* Espaciado tipo cartográfico si el navegador lo soporta. */
    ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${SPACING_PX}px`
  } catch { /* navegadores sin letterSpacing: se sigue igual */ }
  ctx.shadowColor = 'rgba(3, 9, 30, 0.9)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetY = 1
  ctx.fillText(name, W / 2, H / 2)

  const { data } = ctx.getImageData(0, 0, W, H)
  return { width: W, height: H, data }
}

export async function addOceanLabels(
  map: maplibregl.Map,
  labels: OceanLabel[],
): Promise<void> {
  /* Idempotente: evita duplicar capas si el efecto se re-ejecuta. */
  removeOceanLabels(map)
  const t = track(map)

  /* Fuente del canvas: esperar Noto Sans para hornear el texto correcto. */
  try {
    await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
  } catch { /* jsdom o fuente bloqueada: se sigue con fallback */ }

  for (const label of labels) {
    try {
      const baked = bakeOceanLabel(label.name)
      const imgId = `${PREFIX}-img-${label.id}`
      const srcId = `${PREFIX}-src-${label.id}`
      const layerId = `${PREFIX}-label-${label.id}`
      map.addImage(imgId, baked)
      map.addSource(srcId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Point', coordinates: label.coords },
            },
          ],
        },
      })
      map.addLayer({
        id: layerId,
        type: 'symbol',
        source: srcId,
        layout: {
          'icon-image': imgId,
          'icon-size': ICON_SIZE,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      })
      t.images.push(imgId)
      t.sources.push(srcId)
      t.layers.push(layerId)
    } catch {
      /* sin etiqueta canvas (WebGL sin imágenes): el mapa sigue igual */
    }
  }
}

export function removeOceanLabels(map: maplibregl.Map): void {
  const t = trackedByMap.get(map)
  if (t === undefined) return
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
