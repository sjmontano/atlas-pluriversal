/**
 * 🏔️ INICIO LAYOUT
 * La imagen de fondo full-bleed la renderiza ModalShell (prop bgImage);
 * este layout aporta solo el contenido superpuesto (texto con scrim).
 */

import type { Modal } from '../../../types/modal.ts'
import { BlockRenderer } from '../blocks/BlockRenderer'
import styles from './layouts.module.css'

export function InicioLayout({ modal }: { modal: Modal }) {
  return (
    <div className={styles.inicio}>
      {modal.texto && <p className={styles.inicioTexto}>{modal.texto}</p>}

      {modal.body && modal.body.length > 0 && (
        <BlockRenderer blocks={modal.body} />
      )}
    </div>
  )
}
