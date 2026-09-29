/**
 * 📰 SECTION HEADER — Encabezado superior izquierdo (replicado de v17)
 * ====================================================================
 * Flecha atrás (glyph oficial `back`) + decorador de fondo elegido por
 * la longitud del título (<35 corto · <40 medio · ≥40 largo) + título.
 * En las intros de capítulo se antepone el numeral romano (`numeral`):
 * "II. Tejidos, nodos y alternativas…". El título se acota al 60vw con
 * salto de línea balanceado para los títulos largos.
 */

import { Link } from 'react-router-dom'
import { Glyph } from '../modal/primitives/Glyph'
import { SHELL_ASSETS } from './assets'
import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title?: string
  backTo?: string
  /** Numeral romano del capítulo (solo intros): se muestra como "II. Título". */
  numeral?: string
}

function backgroundFor(title: string): string | null {
  if (!title) return null
  if (title.length < 35) return SHELL_ASSETS.header.bgShort
  if (title.length < 40) return SHELL_ASSETS.header.bgMedium
  return SHELL_ASSETS.header.bgLong
}

export function SectionHeader({ title = '', backTo, numeral }: SectionHeaderProps) {
  const display = numeral !== undefined && title !== '' ? `${numeral}. ${title}` : title
  const bg = backgroundFor(display)
  return (
    <header className={styles.header}>
      <div className={styles.group}>
        {bg !== null && <img src={bg} className={styles.bgImage} alt="" />}
        {backTo !== undefined && (
          <Link to={backTo} className={styles.back} aria-label="Regresar">
            <Glyph name="back" size={24} />
          </Link>
        )}
        {display !== '' && (
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>{display}</h3>
          </div>
        )}
      </div>
    </header>
  )
}
