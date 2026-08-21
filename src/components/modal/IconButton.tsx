/**
 * 🔘 ICON BUTTON — Trigger responsive de modales (frame + glyph + label)
 * ======================================================================
 * Anatomía del atlas v17 estandarizada: frame de fondo + glyph centrado
 * + etiqueta. Desktop: etiqueta oculta que aparece en hover/focus.
 * Mobile (<640px): etiqueta siempre visible debajo, fila con scroll.
 */

import { Frame } from './Frame'
import { Glyph } from './Glyph'
import styles from './IconButton.module.css'

export interface IconButtonProps {
  icon: string
  label: string
  frame?: string
  onClick: () => void
  active?: boolean
}

export function IconButton({
  icon,
  label,
  frame = '1',
  onClick,
  active = false,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.btn}${active ? ` ${styles.active}` : ''}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <span className={styles.frame}>
        <Frame variant={frame} />
      </span>
      <span className={styles.glyph}>
        <Glyph name={icon} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}