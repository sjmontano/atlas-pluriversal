/**
 * 📍 HOME MARKERS — Los 16 lugares de la home
 * ============================================
 * Estilo replicado de los POIs de mapa (variante `icon` de chapter2-valle,
 * ver services/PoiManager.ts): círculo cian + anillo de pulso expansivo +
 * gota blanca encima. Consume POI_THEME como única fuente de colores,
 * tamaños y asset de gota. Click → modal layout `inicio`.
 */

import type { CSSProperties } from 'react'
import { POI_THEME } from '@content/theme'
import { getModalById } from '@content/modals'
import { HOME_MARKERS } from '@content/inicio/markers.ts'
import { POIS } from '@content/inicio/pois.ts'
import { useUIStore } from '@stores/uiStore'
import { SHELL_ASSETS } from '@components/shell/assets'
import styles from './HomeMarkers.module.css'

export function HomeMarkers() {
  const openModal = useUIStore((s) => s.openModal)

  const themeVars = {
    '--poi-bg': POI_THEME.iconBg,
    '--poi-size': 'clamp(26px, 2.2vw, 34px)',
    '--poi-pulse-ms': `${POI_THEME.pulse.durationMs}ms`,
  } as CSSProperties

  return (
    <div className={styles.markers} style={themeVars}>
      {HOME_MARKERS.map((position) => {
        const poi = POIS.find((p) => p.id === position.id)
        if (poi === undefined) return null
        const modal = getModalById(poi.id)

        return (
          <div
            key={poi.id}
            className={styles.marker}
            style={{ top: `${position.top}%`, left: `${position.left}%` }}
          >
            <button
              type="button"
              className={styles.button}
              aria-label={poi.title.replace(/\n/g, ' ')}
              onClick={() => {
                if (modal) openModal(modal)
              }}
            >
              <span className={styles.wrapper}>
                <span
                  className={styles.pulse}
                  style={{ animationDelay: position.delay }}
                />
                <span className={styles.circle} />
                <img
                  className={styles.gota}
                  src={POI_THEME.gota.url}
                  alt=""
                  draggable={false}
                />
              </span>
              <span className={styles.tooltip}>
                <img className={styles.tooltipBg} src={SHELL_ASSETS.tooltips.fondo} alt="" />
                <span>{poi.title}</span>
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
