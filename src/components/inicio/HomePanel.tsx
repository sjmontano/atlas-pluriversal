/**
 * 🏠 HOME PANEL — Identidad y acciones de la home (replicado de v17 ContentInfo)
 * ==============================================================================
 * Logo (link unriocauca) · títulos centrales · 3 acciones inferiores:
 * Créditos (modal) · Ficha técnica (modal xs) · Inicio → mapa intro.
 */

import { Link } from 'react-router-dom'
import { getModalById } from '@content/modals'
import { useUIStore } from '@stores/uiStore'
import { SHELL_ASSETS } from '@components/shell/assets'
import styles from './HomePanel.module.css'

const INICIO_ICONS = {
  play: '/assets/ui/icons/inicio/play.svg',
  metadata: '/assets/ui/icons/inicio/metadata.svg',
  credits: '/assets/ui/icons/inicio/credits.svg',
} as const

function Tooltip({ label }: { label: string }) {
  return (
    <span className={styles.tooltip}>
      <img className={styles.tooltipBg} src={SHELL_ASSETS.tooltips.fondo} alt="" />
      <span>{label}</span>
    </span>
  )
}

export function HomePanel() {
  const openModal = useUIStore((s) => s.openModal)

  const openById = (id: string) => {
    const modal = getModalById(id)
    if (modal) openModal(modal)
  }

  return (
    <div className={styles.panel}>
      <a
        className={styles.logoLink}
        href="https://www.unriocauca.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Un río Cauca, muchos mundos"
      >
        <img className={styles.logo} src={SHELL_ASSETS.buttons.unRioCauca} alt="" />
      </a>

      <section className={styles.titles}>
        <h1 className={styles.title}>Atlas</h1>
        <h2 className={styles.subtitle}>Sur del valle alto del río Cauca</h2>
        <p className={styles.description}>Geopoéticas para las transiciones</p>
      </section>

      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.button}
          aria-label="Créditos"
          onClick={() => openById('creditos')}
        >
          <img className={styles.fondo} src={SHELL_ASSETS.sidebar.fondoIcon} alt="" />
          <img className={styles.icon} src={INICIO_ICONS.credits} alt="" />
          <Tooltip label="Créditos" />
        </button>

        <button
          type="button"
          className={styles.button}
          aria-label="Ficha técnica"
          onClick={() => openById('ficha-tecnica')}
        >
          <img className={styles.fondo} src={SHELL_ASSETS.sidebar.fondoIcon} alt="" />
          <img className={styles.icon} src={INICIO_ICONS.metadata} alt="" />
          <Tooltip label="Ficha técnica" />
        </button>

        <Link to="/intro" className={`${styles.button} ${styles.buttonPlay}`} aria-label="Inicio">
          <img className={styles.fondo} src={SHELL_ASSETS.sidebar.fondoIcon} alt="" />
          <img className={styles.icon} src={INICIO_ICONS.play} alt="" />
          <Tooltip label="Inicio" />
        </Link>
      </div>
    </div>
  )
}
