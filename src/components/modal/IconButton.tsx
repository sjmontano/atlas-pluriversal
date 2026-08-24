/**
 * 🔘 ICON BUTTON — Trigger responsive de modales (frame + glyph + label)
 * ======================================================================
 * Anatomía del atlas v17 estandarizada: contenedor de fondo (frame) con
 * el glyph centrado DENTRO del contenedor, más etiqueta que aparece en
 * hover/focus (desktop) o siempre visible en móvil (<640px).
 *
 * `bg` permite sustituir el frame por otro contenedor oficial (ej. el
 * fondo-icon del shell para el ToolRail), manteniendo el centrado.
 */

import { Frame } from './Frame'
import { Glyph } from './Glyph'
import styles from './IconButton.module.css'

export interface IconButtonProps {
  icon: string
  label: string
  frame?: string
  /** URL de un contenedor de fondo alternativo. Si se omite usa Frame. */
  bg?: string
  onClick: () => void
  active?: boolean
}

export function IconButton({
  icon,
  label,
  frame = '1',
  bg,
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
      <span className={styles.iconBox}>
        <span className={styles.frame}>
          {bg !== undefined ? (
            <img src={bg} alt="" draggable={false} />
          ) : (
            <Frame variant={frame} />
          )}
        </span>
        <span className={styles.glyph}>
          <Glyph name={icon} />
        </span>
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
