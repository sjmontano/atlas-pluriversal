/**
 * 🏔️ INICIO LAYOUT — large · modal de los POIs de la home (v17)
 * ==============================================================
 * Composición heredada del `Modal.jsx` de v17:
 * - imagen de fondo al 100% del contenedor
 * - grupo header (gota + fondo + título) arriba a la izquierda
 * - decorador `linea.svg` REPETIDO (nunca estirado) bajo el grupo,
 *   con el ancho exacto que ocupa el grupo (overflow recortado)
 * - texto alineado a la columna del grupo, 60% del ancho del contenedor
 * - X de cierre (salir.svg) arriba a la derecha
 *
 * Tema vía CSS custom properties (modelo plantilla + configuración):
 * el modal puede sobrescribir `theme.titleColor` / `theme.textColor`.
 * Los recursos viven en public/assets/modal/inicio/ (URL, no módulos).
 */

import type { CSSProperties } from 'react'
import type { Modal } from '../../../types/modal.ts'
import styles from './InicioLayout.module.css'

const DECORATOR = '/assets/modal/inicio/linea.svg'
const GOTA_FONDO = '/assets/modal/inicio/fondoIcon1.svg'
const GOTA_MARKER = '/assets/modal/inicio/marker1.svg'
const SALIR = '/assets/modal/inicio/salir.svg'

export interface InicioLayoutProps {
  modal: Modal
  onClose: () => void
}

export function InicioLayout({ modal, onClose }: InicioLayoutProps) {
  const themeVars = {
    '--modal-inicio-title': modal.theme?.titleColor,
    '--modal-inicio-text': modal.theme?.textColor,
  } as CSSProperties

  return (
    <div className={styles.inicio} style={themeVars}>
      {modal.image ? (
        <img
          className={styles.bg}
          src={modal.image}
          alt=""
          aria-hidden="true"
        />
      ) : null}

      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.cluster}>
        <div className={styles.head}>
          <div className={styles.headRow}>
            <span className={styles.gota}>
              <img
                className={styles.gotaFondo}
                src={GOTA_FONDO}
                alt=""
                aria-hidden="true"
              />
              <img
                className={styles.gotaGlyph}
                src={GOTA_MARKER}
                alt=""
                aria-hidden="true"
              />
            </span>
            <h2 className={styles.title}>{modal.title}</h2>
          </div>
          <span
            className={styles.decor}
            style={{ backgroundImage: `url(${DECORATOR})` }}
            aria-hidden="true"
          />
        </div>

        {modal.texto ? <p className={styles.texto}>{modal.texto}</p> : null}
      </div>

      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Cerrar"
      >
        <img className={styles.closeIcon} src={SALIR} alt="" aria-hidden="true" />
      </button>
    </div>
  )
}