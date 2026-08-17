import type { PGWData } from './BoundsCalculator'

export interface CalibrationState {
  readonly a: number
  readonly d: number
  readonly b: number
  readonly e: number
  readonly c: number
  readonly f: number
  readonly width: number
  readonly height: number
}

export function pgwToState(pgw: PGWData, width: number, height: number): CalibrationState {
  const [a, d, b, e, c, f] = pgw
  return { a, d, b, e, c, f, width, height }
}

export function stateToPGW(state: CalibrationState): PGWData {
  return [state.a, state.d, state.b, state.e, state.c, state.f]
}

export function shiftOrigin(pgw: PGWData, dLng: number, dLat: number): PGWData {
  const [a, d, b, e, c, f] = pgw
  return [a, d, b, e, c + dLng, f + dLat]
}

export function scaleParam(pgw: PGWData, key: 'd' | 'b', factor: number): PGWData {
  const [a, d, b, e, c, f] = pgw
  if (key === 'd') return [a, d * factor, b, e, c, f]
  return [a, d, b * factor, e, c, f]
}

export function resizeDims(width: number, height: number, dW: number, dH: number): { width: number; height: number } {
  return { width: width + dW, height: height + dH }
}

/**
 * Re-escala la huella de la capa por eje (escalado simétrico: los dos
 * lados opuestos de un eje se mueven por igual) manteniendo el centro
 * geográfico fijo. Solo toca los coeficientes translacionales correctos:
 * para PGW axis-aligned (B=D=0), escalar width ajusta `c` y escalar
 * height ajusta `f`. Devuelve el PGW original si los factores son 1.
 */
export function scaleLayerSymmetric(
  pgw: PGWData,
  width: number,
  height: number,
  factorH: number,
  factorV: number,
): { pgw: PGWData; width: number; height: number } {
  const [a, d, b, e, c, f] = pgw
  const nextWidth = Math.max(1, Math.round(width * factorH))
  const nextHeight = Math.max(1, Math.round(height * factorV))

  if (nextWidth === width && nextHeight === height) return { pgw, width, height }

  const nextC = (() => {
    const dW = width - nextWidth
    return Math.abs(a) > 0 ? c + (a * dW) / 2 : c
  })()

  const nextF = (() => {
    const dH = height - nextHeight
    return Math.abs(e) > 0 ? f + (e * dH) / 2 : f
  })()

  return { pgw: [a, d, b, e, nextC, nextF], width: nextWidth, height: nextHeight }
}

function clampFinito(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

/**
 * Clampa la magnitud de un coeficiente de escala preservando su signo.
 * Un 0 exacto se conserva (PGW retrato legítimo con A=0/E=0); un signo
 * negativo (rotación real) no se vuelve positivo.
 */
function clampScale(value: number, min = 1e-12, max = 1): number {
  if (!Number.isFinite(value)) return min
  if (value === 0) return 0
  const mag = Math.min(Math.max(Math.abs(value), min), max)
  return value < 0 ? -mag : mag
}

export function clampCalibration(state: CalibrationState): CalibrationState {
  return {
    a: clampScale(state.a),
    d: clampScale(state.d),
    b: clampScale(state.b),
    e: clampScale(state.e),
    c: clampFinito(state.c, -180, 180),
    f: clampFinito(state.f, -90, 90),
    width: Math.max(1, Math.round(clampFinito(state.width, 1, 100000))),
    height: Math.max(1, Math.round(clampFinito(state.height, 1, 100000))),
  }
}
