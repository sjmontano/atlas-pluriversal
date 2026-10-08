/**
 * Niveles de la imagen base Cloudinary según zoom (fallback sin tiles).
 *
 * Un solo ImageSource piramidal: base (vista lejana, previsualización de baja
 * resolución para internet lento) → medium (intermedia) → high (acercamiento). Los umbrales derivan del minZoom del tileset para
 * que base y tiles hablen el mismo idioma. Ver
 * docs/superpowers/specs/2026-10-07-fallback-cloudinary-zoom-design.md
 */

export type BaseLevel = 'base' | 'medium' | 'high'
export type BaseZoomMode = 'detail' | 'initial-only' | 'initial-cover' | 'none'

export const BASE_TRANSFORMS: Record<BaseLevel, string> = {
  base: 'w_1600,q_auto,f_webp',
  medium: 'w_2560,q_auto,f_webp',
  high: 'q_auto,f_webp',
}

/**
 * Fuente de la que se derivan los niveles: el original (`full`) cuando existe
 * y difiere del thumbnail (`base`); si no, el `base`. Muchos `base` en
 * Cloudinary son thumbnails de ~564px (de ahí no sale detalle ni con
 * transforms), mientras el `full` es el original a resolución del geo.
 */
export function pickBaseSource(images: { base: string; full?: string }): string {
  if (images.full && images.full !== images.base) return images.full
  return images.base
}

/**
 * Resuelve el nivel de base para un zoom dado.
 * - detail: base hasta min+0.5, medium hasta min+1.0, high en adelante
 *   (histeresis 0.5 incluida para no flapping en el borde).
 * - initial-only / initial-cover: un solo nivel → siempre medium.
 */
export function resolveBaseLevel(
  zoom: number,
  minZoom: number,
  _maxZoom: number,
  mode: BaseZoomMode,
): BaseLevel {
  if (mode === 'initial-only' || mode === 'initial-cover') return 'medium'
  if (zoom <= minZoom + 0.5) return 'base'
  if (zoom <= minZoom + 1.0) return 'medium'
  return 'high'
}

/** Rango de referencia: prefiere el del tileset, cae al fallback calculado. */
export function baseRangeForEntry(
  entryTiles: { minZoom: number; maxZoom: number } | null | undefined,
  fallbackMin: number,
  fallbackMax: number,
): { minZoom: number; maxZoom: number } {
  if (entryTiles) return { minZoom: entryTiles.minZoom, maxZoom: entryTiles.maxZoom }
  return { minZoom: fallbackMin, maxZoom: fallbackMax }
}

/**
 * ¿La imagen respeta el aspecto del geo? Detecta fuentes locales rotadas 90°
 * (ej. PNG 6035×3389 con geo 3382×6023): el generador las rota con
 * `sourceRotate: 'auto'`, pero el runtime estiraría la ImageSource y se vería
 * deformada. En ese caso el fallback NO debe subir a esa URL.
 * Tolerancia 0.15 en log-ratio: los transforms Cloudinary preservan el
 * aspecto exacto, solo el swap 90° (≈1.1 en log) la dispara.
 */
export function matchesGeoAspect(
  imgW: number,
  imgH: number,
  geoW: number,
  geoH: number,
): boolean {
  if (imgW <= 0 || imgH <= 0 || geoW <= 0 || geoH <= 0) return false
  return Math.abs(Math.log(imgW / imgH / (geoW / geoH))) <= 0.15
}
