import { processBounds } from '@services/BoundsCalculator'
import type { MapGeoEntry } from '../types/content'

export type TileZoomMode = 'detail' | 'initial-only' | 'none'

export interface TileZoomRange {
  minZoom: number
  maxZoom: number
}

const REF_W = 1920
const REF_H = 1080

/**
 * Zoom donde el mapa llena el ancho de pantalla (techo de detalle).
 * Más allá no hay detalle perceptible. Fórmula verificada: round/log2/256.
 */
export function screenCeilingZoom(geo: MapGeoEntry, canvasW: number): number {
  const { bounds } = processBounds(geo.pgw, geo.width, geo.height)
  const lonSpan = bounds[2] - bounds[0]
  if (lonSpan <= 0) return 0
  return Math.round(Math.log2((canvasW * 360) / (256 * lonSpan)))
}

/**
 * Mismo cálculo que TransformConstrain (Paso A): el zoom mínimo donde el
 * viewport cabe en el bound, bearing-aware (quarter-turn intercambia ejes).
 * Solo para validación/consistencia; el runtime clampea por frame.
 */
export function constrainMinZoom(
  geo: MapGeoEntry,
  canvasW: number,
  canvasH: number,
  bearing: number,
): number {
  const { bounds } = processBounds(geo.pgw, geo.width, geo.height)
  const [west, south, east, north] = bounds
  const latSpan = north - south
  const lonSpan = east - west
  const normalized = ((bearing % 360) + 360) % 360
  const isQuarterTurn = normalized === 90 || normalized === 270
  if (isQuarterTurn) {
    const mw = latSpan > 0 ? Math.log2((canvasW * 360) / (512 * latSpan)) : 0
    const mh = lonSpan > 0 ? Math.log2((canvasH * 360) / (512 * lonSpan)) : 0
    return Math.max(mw, mh)
  }
  const mw = lonSpan > 0 ? Math.log2((canvasW * 360) / (512 * lonSpan)) : 0
  const mh = latSpan > 0 ? Math.log2((canvasH * 360) / (512 * latSpan)) : 0
  return Math.max(mw, mh)
}

/**
 * Rango de zooms para generar/servir tiles.
 * - detail: minZoom = floor(constrainMinZoom), maxZoom = screenCeilingZoom.
 * - initial-only: minZoom = maxZoom = floor(initialZoom).
 * - none: null (sin tiles; reservado para mapas futuros).
 */
export function computeTileRange(
  geo: MapGeoEntry,
  initialZoom: number,
  mode: TileZoomMode,
  canvasW: number = REF_W,
  canvasH: number = REF_H,
  bearing: number = 0,
): TileZoomRange | null {
  if (mode === 'none') return null
  if (mode === 'initial-only') {
    const z = Math.floor(initialZoom)
    return { minZoom: z, maxZoom: z }
  }
  const minZoom = Math.floor(constrainMinZoom(geo, canvasW, canvasH, bearing))
  const maxZoom = Math.max(minZoom, screenCeilingZoom(geo, canvasW))
  return { minZoom, maxZoom }
}