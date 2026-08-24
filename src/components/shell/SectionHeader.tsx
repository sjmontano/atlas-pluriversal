/**
 * 📰 SECTION HEADER — Encabezado superior izquierdo (replicado de v17)
 * ====================================================================
 * Flecha atrás (glyph oficial `back`) + decorador de fondo elegido por
 * la longitud del título (<20 corto · <40 medio · ≥40 largo) + título.
 */

import { Link } from 'react-router-dom'
import { Glyph } from '../modal/Glyph'
import { SHELL_ASSETS } from './assets'
import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title?: string
  backTo?: string
}

function backgroundFor(title: string): string | null {
  if (!title) return null
  if (title.length < 20) return SHELL_ASSETS.header.bgShort
  if (title.length < 40) return SHELL_ASSETS.header.bgMedium
  return SHELL_ASSETS.header.bgLong
}

export function SectionHeader({ title = '', backTo }: SectionHeaderProps) {
  const bg = backgroundFor(title)
  return (
    <header className={styles.header}>
      <div className={styles.group}>
        {bg !== null && <img src={bg} className={styles.bgImage} alt="" />}
        {backTo !== undefined && (
          <Link to={backTo} className={styles.back} aria-label="Regresar">
            <Glyph name="back" size={24} />
          </Link>
        )}
        {title !== '' && (
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        )}
      </div>
    </header>
  )
}
