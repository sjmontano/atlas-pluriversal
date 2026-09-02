/**
 * 🏔️ INICIO LAYOUT — Contenido para modales con fullImage
 * =========================================================
 * Se usa cuando fullImage=true. La imagen de fondo y el scrim
 * los renderiza ModalShell; este layout solo apila los blocks
 * con estilo especial para legibilidad sobre la foto.
 */

import type { Modal } from '../../../types/modal.ts'
import { BlockRenderer } from './BlockRenderer'
import styles from './layouts.module.css'

export function InicioLayout({ modal }: { modal: Modal }) {
  return (
    <div className={styles.inicio}>
      {modal.body && modal.body.length > 0 && (
        <BlockRenderer blocks={modal.body} />
      )}
    </div>
  )
}
