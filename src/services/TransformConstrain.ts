/**
 * 🧭 TRANSFORM CONSTRAIN BEARING-AWARE
 * =====================================
 *
 * Crea una TransformConstrainFunction que restringe el viewport de MapLibre
 * considerando el bearing del mapa. Reemplaza a setMaxBounds, que es
 * bearing-blind (siempre clampea LON con viewport WIDTH y LAT con HEIGHT,
 * sin importar la rotación).
 *
 * Con bearing = ±90° los ejes de pantalla están intercambiados:
 *   - Ancho de pantalla W  ↔ eje LATITUD  (sur → norte)
 *   - Alto de pantalla H   ↔ eje LONGITUD (oeste → este)
 *
 * La función se ejecuta PRE-render en cada frame: recibe el centro y zoom
 * propuestos y devuelve los permitidos. No hay loop de feedback.
 *
 * Port de `createBearingAwareConstrain()` (atlas_3.0 `useAtlasMap.ts:100-183`),
 * validado en producción con bearing=-90 en los 7 mapas del Capítulo 1.
 */

import { LngLat } from 'maplibre-gl'
import type { TransformConstrainFunction } from 'maplibre-gl'
import type { GeographicBounds, ImageCoordinates } from './BoundsCalculator'

export interface CanvasSizeProvider {
  (): { clientWidth: number; clientHeight: number }
}

/* ── Rotación oblicua ─────────────────────────────────────────────────────
 * Con un bearing que no es múltiplo de 90° (imagen girada respecto al norte),
 * el rectángulo lon/lat de la imagen es más grande que la imagen: limitar por
 * él deja ver sus bordes. Ahí se limita en el marco de la pantalla, proyectando
 * las 4 esquinas reales. Se trabaja en grados Mercator, donde la escala de
 * pantalla es igual en ambos ejes. */

const DEG = Math.PI / 180
const mercatorY = (lat: number): number => Math.log(Math.tan(Math.PI / 4 + (lat * DEG) / 2)) / DEG
const latFromMercatorY = (y: number): number => (2 * Math.atan(Math.exp(y * DEG)) - Math.PI / 2) / DEG

/** Extensión de la imagen sobre los ejes de la pantalla para un bearing oblicuo. */
export interface ObliqueFrame {
  right: readonly [number, number]
  up: readonly [number, number]
  uMin: number
  uMax: number
  vMin: number
  vMax: number
}

/** Marco de la imagen en ejes de pantalla; null si el bearing es múltiplo de 90°. */
export function obliqueFrame(
  coordinates: ImageCoordinates,
  bearing: number,
  marginH = 0,
  marginV = 0,
): ObliqueFrame | null {
  if (bearing % 90 === 0) return null
  const t = bearing * DEG
  const right = [Math.cos(t), -Math.sin(t)] as const
  const up = [Math.sin(t), Math.cos(t)] as const
  const us: number[] = []
  const vs: number[] = []
  for (const [lng, lat] of coordinates) {
    const y = mercatorY(lat)
    us.push(lng * right[0] + y * right[1])
    vs.push(lng * up[0] + y * up[1])
  }
  // Rectángulo interior a las 4 esquinas: la imagen nunca está girada exactamente
  // igual que el bearing, y el exterior dejaría una línea de fondo en los bordes.
  const [uLo, uHi] = us.sort((a, b) => a - b).slice(1, 3) as [number, number]
  const [vLo, vHi] = vs.sort((a, b) => a - b).slice(1, 3) as [number, number]
  const du = (uHi - uLo) * marginH
  const dv = (vHi - vLo) * marginV
  return { right, up, uMin: uLo - du, uMax: uHi + du, vMin: vLo - dv, vMax: vHi + dv }
}

/** Zoom mínimo con el que el viewport cabe dentro del marco. */
export function obliqueMinZoom(frame: ObliqueFrame, W: number, H: number): number {
  return Math.max(
    Math.log2((W * 360) / (512 * (frame.uMax - frame.uMin))),
    Math.log2((H * 360) / (512 * (frame.vMax - frame.vMin))),
  )
}

const clampSpan = (value: number, min: number, max: number, half: number): number =>
  min + half <= max - half ? Math.max(min + half, Math.min(max - half, value)) : (min + max) / 2

/**
 * @param getCanvas - Devuelve el elemento contenedor del mapa (para leer W/H)
 * @param vmb - viewportMaxBounds [west, south, east, north]
 * @param bearing - Bearing del mapa en grados (ej. -90)
 * @param maxZoom - Zoom máximo permitido (techo de detalle). MapLibre con
 *   transformConstrain custom NO clampea el maxZoom nativo, así que este
 *   clamps lo reemplaza. Opcional: si se omite no hay techo.
 * @param frame - Marco de `obliqueFrame()`: si existe, reemplaza a `vmb`.
 */
export function createBearingAwareConstrain(
  getCanvas: CanvasSizeProvider,
  vmb: GeographicBounds,
  bearing: number,
  maxZoom?: number,
  frame?: ObliqueFrame | null,
): TransformConstrainFunction {
  if (frame) {
    const { right, up, uMin, uMax, vMin, vMax } = frame
    return (lngLat: LngLat, zoom: number) => {
      const { clientWidth: W, clientHeight: H } = getCanvas()
      const clampedZoom = Math.max(obliqueMinZoom(frame, W, H), Math.min(maxZoom ?? Infinity, zoom))
      const dpp = 360 / (512 * Math.pow(2, clampedZoom))
      const y = mercatorY(lngLat.lat)
      const u = clampSpan(lngLat.lng * right[0] + y * right[1], uMin, uMax, (W / 2) * dpp)
      const v = clampSpan(lngLat.lng * up[0] + y * up[1], vMin, vMax, (H / 2) * dpp)
      return {
        center: new LngLat(u * right[0] + v * up[0], latFromMercatorY(u * right[1] + v * up[1])),
        zoom: clampedZoom,
      }
    }
  }

  const [west, south, east, north] = vmb
  const normalized = ((bearing % 360) + 360) % 360
  const isQuarterTurn = normalized === 90 || normalized === 270

  const latSpan = north - south
  const lonSpan = east - west

  return (lngLat: LngLat, zoom: number) => {
    const canvas = getCanvas()
    const W = canvas.clientWidth
    const H = canvas.clientHeight

    // ── Paso A: minZoom bearing-aware ────────────────────────────────────
    // dpp(z) = 360 / (512 · 2^z). Para que el viewport quepa en el bound:
    //   W · dpp(z) <= span  →  z >= log2(W · 360 / (512 · span))
    let minZoom: number
    if (isQuarterTurn) {
      const minZoomW = latSpan > 0 ? Math.log2((W * 360) / (512 * latSpan)) : 0
      const minZoomH = lonSpan > 0 ? Math.log2((H * 360) / (512 * lonSpan)) : 0
      minZoom = Math.max(minZoomW, minZoomH)
    } else {
      const minZoomW = lonSpan > 0 ? Math.log2((W * 360) / (512 * lonSpan)) : 0
      const minZoomH = latSpan > 0 ? Math.log2((H * 360) / (512 * latSpan)) : 0
      minZoom = Math.max(minZoomW, minZoomH)
    }

    // ── Paso B: clampear zoom ANTES de calcular dpp ──────────────────────
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom ?? Infinity, zoom))

    // ── Paso C: dpp con zoom ya corregido ────────────────────────────────
    const dpp = 360 / (512 * Math.pow(2, clampedZoom))

    // ── Paso D: clampear centro (restar half-extent del viewport) ────────
    let clampedLng = lngLat.lng
    let clampedLat = lngLat.lat

    if (isQuarterTurn) {
      // bearing ±90°: pantalla W ↔ eje lat, pantalla H ↔ eje lon
      const halfLat = (W / 2) * dpp
      const halfLon = (H / 2) * dpp
      const minLat = south + halfLat
      const maxLat = north - halfLat
      const minLon = west + halfLon
      const maxLon = east - halfLon
      clampedLat =
        minLat <= maxLat
          ? Math.max(minLat, Math.min(maxLat, clampedLat))
          : (south + north) / 2
      clampedLng =
        minLon <= maxLon
          ? Math.max(minLon, Math.min(maxLon, clampedLng))
          : (west + east) / 2
    } else {
      // bearing 0/180: pantalla W ↔ eje lon, pantalla H ↔ eje lat
      const halfLon = (W / 2) * dpp
      const halfLat = (H / 2) * dpp
      const minLon = west + halfLon
      const maxLon = east - halfLon
      const minLat = south + halfLat
      const maxLat = north - halfLat
      clampedLng =
        minLon <= maxLon
          ? Math.max(minLon, Math.min(maxLon, clampedLng))
          : (west + east) / 2
      clampedLat =
        minLat <= maxLat
          ? Math.max(minLat, Math.min(maxLat, clampedLat))
          : (south + north) / 2
    }

    // Guardrail: coordenadas siempre válidas
    clampedLat = Math.max(-89.9, Math.min(89.9, clampedLat))
    clampedLng = Math.max(-179.9, Math.min(179.9, clampedLng))

    return {
      center: new LngLat(clampedLng, clampedLat),
      zoom: clampedZoom,
    }
  }
}
