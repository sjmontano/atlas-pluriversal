/**
 * 🏠 HOME NAV — Botones inferiores izquierdos (replicado de v17)
 * ===============================================================
 * Casa → `/` (InicioPage placeholder) y logo "Un río Cauca, muchos
 * mundos" → https://www.unriocauca.com/ (pestaña nueva). Ambos con
 * tooltip decorado al hover.
 */

import { Link } from 'react-router-dom'
import { SHELL_ASSETS } from './assets'
import styles from './HomeNav.module.css'

function Tooltip({ label }: { label: string }) {
  return (
    <span className={styles.tooltip}>
      <img className={styles.tooltipBg} src={SHELL_ASSETS.tooltips.fondo} alt="" />
      <span>{label}</span>
    </span>
  )
}

export interface HomeNavProps {
  /** Oculta el link externo cuando ya se está en contexto un-rio-cauca. */
  showSiteLink?: boolean
}

export function HomeNav({ showSiteLink = true }: HomeNavProps) {
  return (
    <div className={styles.wrap}>
      <Link to="/" className={styles.homeBtn} aria-label="Inicio">
        <img src={SHELL_ASSETS.buttons.home} alt="" />
        <Tooltip label="Inicio" />
      </Link>

      {showSiteLink && (
        <a
          href="https://www.unriocauca.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoBtn}
          aria-label="Un río Cauca, muchos mundos"
        >
          <img className={styles.logoBg} src={SHELL_ASSETS.sidebar.fondoIcon} alt="" />
          <img className={styles.logoImg} src={SHELL_ASSETS.buttons.unRioCauca} alt="" />
          <Tooltip label="Un río Cauca" />
        </a>
      )}
    </div>
  )
}
