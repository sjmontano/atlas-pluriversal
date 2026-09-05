/**
 * 🎨 GLYPH — Catálogo de iconos monocromo del sistema de modales
 * ==============================================================
 * Los componentes piden un NOMBRE (`IconName`) y aquí se resuelve a la
 * referencia del archivo oficial (`content/theme/icons.ts`). Este módulo
 * no contiene SVG inline: el arte vive en `public/assets/ui/icons/`.
 *
 * El SVG queda inline en el DOM (import `?raw`) para heredar
 * `fill/stroke = currentColor` y tintar con la paleta.
 * Nombre desconocido → fallback `info` (nunca vacío silencioso).
 */

import { ICON_SRC, ICON_FALLBACK } from '@content/theme/icons.ts'
import styles from './Glyph.module.css'

export interface GlyphProps {
  name: string
  size?: number
}

/** Renderiza el SVG del glyph por nombre (aria-hidden). */
export function Glyph({ name, size = 28 }: GlyphProps) {
  const svg: string =
    (ICON_SRC as Record<string, string>)[name] ?? ICON_SRC[ICON_FALLBACK]
  return (
    <span
      className={styles.box}
      style={{ width: size, height: size }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
