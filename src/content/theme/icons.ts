/**
 * 🎨 ICONS — Catálogo canónico de iconos del Atlas
 * =================================================
 * Fuente de verdad: archivos SVG oficiales en `public/assets/ui/icons/`.
 * Los componentes NUNCA contienen SVG inline: piden un nombre (`IconName`)
 * y `Glyph` lo resuelve a la referencia del archivo.
 *
 * Los SVG se importan con `?raw` para que queden inline en el DOM y hereden
 * `currentColor` (tintado con la paleta). Excepción: `datos` es un raster
 * (blanco sobre fondo oscuro, como en v17) y no se tinta.
 *
 * Nota de build: importar desde `public/` duplica esos bytes en el bundle
 * (~40 KB), pero mantiene UNA sola fuente de verdad. No mover.
 */

import presentation from '../../../public/assets/ui/icons/line/presentation.svg?raw'
import levels from '../../../public/assets/ui/icons/line/levels.svg?raw'
import metadata from '../../../public/assets/ui/icons/line/metadata.svg?raw'
import download from '../../../public/assets/ui/icons/line/download.svg?raw'
import gallery from '../../../public/assets/ui/icons/line/gallery.svg?raw'
import datos from '../../../public/assets/ui/icons/line/datos.svg?raw'
import mapaArbol from '../../../public/assets/ui/icons/line/mapa-arbol.svg?raw'
import sintesis from '../../../public/assets/ui/icons/line/sintesis.svg?raw'
import credits from '../../../public/assets/ui/icons/line/credits.svg?raw'
import markerPin from '../../../public/assets/ui/markers/marker-pin.svg?raw'
import generalInfo from '../../../public/assets/ui/icons/line/general-info.svg?raw'
import back from '../../../public/assets/ui/icons/line/back.svg?raw'
import arrowUp from '../../../public/assets/ui/icons/line/arrow-up.svg?raw'

/** Nombre → SVG de referencia. `perfil` = levels v17, `fichatecnica` = metadata v17. */
export const ICON_SRC = {
  presentation,
  perfil: levels,
  fichatecnica: metadata,
  download,
  gallery,
  datos,
  'mapa-arbol': mapaArbol,
  sintesis,
  credits,
  marker: markerPin,
  info: generalInfo,
  back,
  'arrow-up': arrowUp,
} as const

export type IconName = keyof typeof ICON_SRC

/** Fallback explícito cuando un nombre no existe (nunca vacío silencioso). */
export const ICON_FALLBACK: IconName = 'info'

/** Iconos raster que no heredan `currentColor` (arte blanco fijo de v17). */
export const NON_TINTABLE_ICONS: ReadonlySet<string> = new Set(['datos'])
