/**
 * 🏷️ ENCUADRE LABEL ICONS — etiquetas como imágenes para capas symbol
 * =====================================================================
 * Por qué canvas y no HTML (Marker) ni text-field:
 * - Los Marker son overlay DOM: se posicionan por JS en cada frame y pueden
 *   desfasarse del canvas WebGL al zoom (deriva etiqueta vs polígono).
 * - `text-field` necesitaría `glyphs` en el estilo y BLANK_STYLE no los tiene.
 * En cambio una imagen `icon-image` vive en el mismo pase de render que las
 * capas fill/line: imposible que diverja, en todo zoom y pantalla.
 *
 * Patrón calcado de `poiIcons.ts` (compose + CanvasFactory inyectable para
 * tests) y de `PoiManager.ts` (hit-test manual con `map.project`, nunca
 * `queryRenderedFeatures`: MapLibre v6 lanza en capas con `icon-image`).
 */

export interface EncuadreLabelIcon {
  width: number
  height: number
  data: Uint8ClampedArray
}

export type CanvasFactory = () => HTMLCanvasElement

export interface EncuadreLabelMetrics {
  /** Alto de fuente CSS-px (se compone a ART_SCALE para nitidez). */
  fontPx: number
  /** Interlineado CSS-px. */
  linePx: number
  /** Relleno horizontal/vertical CSS-px. */
  padX: number
  padY: number
  /** Ancho máximo de texto CSS-px (pasado esto se envuelve por palabras). */
  maxWidthPx: number
  /** Radio de esquina CSS-px. */
  radiusPx: number
}

/** Arte al doble para pantallas densas; la capa usa ICON_SIZE 0.5. */
export const LABEL_ART_SCALE = 2
export const LABEL_ICON_SIZE = 1 / LABEL_ART_SCALE

/** Métricas de escritorio: tipo contenida sin perder legibilidad. */
export const LABEL_METRICS: EncuadreLabelMetrics = {
  fontPx: 14,
  linePx: 16,
  padX: 7,
  padY: 7,
  maxWidthPx: 230,
  radiusPx: 6,
}

/** Compacto móvil (mismo breakpoint del CSS anterior: 768px). Nunca bajo
 *  de 12px de fuente para no sacrificar lectura; lo táctil lo garantiza
 *  el área mínima de hit-test en el manager, no el tamaño visual. */
export const LABEL_METRICS_COMPACT: EncuadreLabelMetrics = {
  fontPx: 12,
  linePx: 14,
  padX: 8,
  padY: 6,
  maxWidthPx: 175,
  radiusPx: 6,
}

const defaultCanvasFactory: CanvasFactory = () => document.createElement('canvas')

/** Parte por `\n` explícitos y envuelve por palabras al ancho máximo. */
export function wrapLabelLines(
  name: string,
  measure: (s: string) => number,
  maxWidth: number,
): string[] {
  const lines: string[] = []
  for (const chunk of name.split('\n')) {
    const words = chunk.split(/\s+/).filter((w) => w !== '')
    if (words.length === 0) {
      lines.push('')
      continue
    }
    let cur = ''
    for (const w of words) {
      const t = cur === '' ? w : `${cur} ${w}`
      if (measure(t) <= maxWidth || cur === '') {
        cur = t
      } else {
        lines.push(cur)
        cur = w
      }
    }
    lines.push(cur)
  }
  return lines
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.arcTo(x + w, y, x + w, y + rr, rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr)
  ctx.lineTo(x + rr, y + h)
  ctx.arcTo(x, y + h, x, y + h - rr, rr)
  ctx.lineTo(x, y + rr)
  ctx.arcTo(x, y, x + rr, y, rr)
  ctx.closePath()
}

export interface ComposeLabelOptions {
  metrics: EncuadreLabelMetrics
  /** Color del texto (normal `#ffffff`, hover `#193965`). */
  textColor: string
  /** Fondo (webp tooltip). null → relleno sólido de respaldo. */
  bg: CanvasImageSource | null
  /** Relleno sólido si no hay bg. */
  fallbackBg: string
  factory?: CanvasFactory
}

/** Compone la píldora (fondo + texto centrado) y devuelve RGBA para addImage. */
export function composeEncuadreLabel(
  name: string,
  opts: ComposeLabelOptions,
): EncuadreLabelIcon {
  const { metrics, textColor, bg, fallbackBg } = opts
  const factory = opts.factory ?? defaultCanvasFactory
  const canvas = factory()
  const probe = canvas.getContext('2d')
  if (!probe) throw new Error('No 2d context available')

  const S = LABEL_ART_SCALE
  const font = `italic 700 ${metrics.fontPx * S}px "Noto Sans", sans-serif`
  probe.font = font
  const lines = wrapLabelLines(name, (s) => probe.measureText(s).width, metrics.maxWidthPx * S)
  const contentW = lines.reduce((m, l) => Math.max(m, probe.measureText(l).width), 0)
  const W = Math.max(1, Math.ceil(contentW + 2 * metrics.padX * S))
  const H = Math.max(1, Math.ceil(lines.length * metrics.linePx * S + 2 * metrics.padY * S))

  /* Redimensionar resetea el contexto: reconfigurar todo después. */
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context available')

  /* Fondo con esquinas redondeadas (cover) o sólido de respaldo. */
  ctx.save()
  roundRectPath(ctx, 0, 0, W, H, metrics.radiusPx * S)
  ctx.clip()
  if (bg !== null) {
    const bw = (bg as { width: number }).width || W
    const bh = (bg as { height: number }).height || H
    const scale = Math.max(W / bw, H / bh)
    const dw = bw * scale
    const dh = bh * scale
    ctx.drawImage(bg, (W - dw) / 2, (H - dh) / 2, dw, dh)
  } else {
    ctx.fillStyle = fallbackBg
    ctx.fillRect(0, 0, W, H)
  }
  ctx.restore()

  /* Texto centrado con sombra de legibilidad (verbatim del Marker). */
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = textColor
  ctx.shadowColor = 'rgba(3, 9, 30, 0.85)'
  ctx.shadowBlur = 3 * S
  ctx.shadowOffsetY = S
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, metrics.padY * S + metrics.linePx * S * (i + 0.5), metrics.maxWidthPx * S)
  })

  const { data } = ctx.getImageData(0, 0, W, H)
  return { width: W, height: H, data }
}

/** Carga un <img> nativo (los webp de tooltips no pasan por map.loadImage). */
export function loadImageElement(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

/** Misma carga con tope: en jsdom el Image nunca resuelve; no colgar. */
export function loadWithTimeout(url: string, ms = 1500): Promise<HTMLImageElement | null> {
  return Promise.race([
    loadImageElement(url),
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms)
    }),
  ])
}
