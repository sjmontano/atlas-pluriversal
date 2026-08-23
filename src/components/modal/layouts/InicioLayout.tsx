/**
 * 🏔️ INICIO LAYOUT
 */

import type { Modal } from '../../../types/modal.ts'
import { BlockRenderer } from '../blocks/BlockRenderer'
import styles from './layouts.module.css'

export function InicioLayout({ modal }: { modal: Modal }) {
  return (
    <div className={styles.inicio}>
      {modal.image && (
        <img
          className={styles.inicioBg}
          src={modal.image}
          alt=""
          aria-hidden="true"
        />
      )}

      {modal.texto && <p className={styles.inicioTexto}>{modal.texto}</p>}

      {modal.body && modal.body.length > 0 && (
        <BlockRenderer blocks={modal.body} />
      )}
    </div>
  )
}
