/**
 * 🚀 MODAL RENDERER — Motor del sistema de modales
 * ================================================
 * Conecta `uiStore.activeModal` con la shell y los layouts.
 * Registry de layouts: image-text, gallery, datasheet, text, alert.
 * Los datos vienen de src/content/modals/ (vía openModal(getModalById(...))).
 */

import type { Modal } from '../../types/modal.ts'
import { useUIStore } from '@stores/index.ts'
import { ModalShell } from './ModalShell'
import { AlertLayout } from './layouts/AlertLayout'
import { DataSheetLayout } from './layouts/DataSheetLayout'
import { GalleryLayout } from './layouts/GalleryLayout'
import { ImageTextLayout } from './layouts/ImageTextLayout'
import { InicioLayout } from './layouts/InicioLayout'
import { TextLayout } from './layouts/TextLayout'
import styles from './ModalShell.module.css'

function layoutFor(modal: Modal, onClose: () => void) {
  switch (modal.layout) {
    case 'image-text':
      return <ImageTextLayout modal={modal} />
    case 'gallery':
      return <GalleryLayout modal={modal} />
    case 'datasheet':
      return <DataSheetLayout modal={modal} />
    case 'alert':
      return <AlertLayout modal={modal} />
    case 'inicio':
      return <InicioLayout modal={modal} onClose={onClose} />
    case 'text':
    default:
      return <TextLayout modal={modal} />
  }
}

export function ModalRenderer() {
  const modal = useUIStore((s) => s.activeModal)
  const closeModal = useUIStore((s) => s.closeModal)

  if (!modal) return null

  const hero = modal.layout === 'inicio'
  const actions = modal.actions ?? [{ label: 'Cerrar', variant: 'ghost' }]
  const dialogStyle = modal.theme?.size
    ? {
        width: modal.theme.size.width,
        height: modal.theme.size.height,
        maxWidth: modal.theme.size.width,
        maxHeight: modal.theme.size.height,
      }
    : undefined

  return (
    <ModalShell
      open
      title={modal.title}
      highlight={modal.highlight}
      variant={modal.variant}
      onClose={closeModal}
      hero={hero}
      dialogStyle={dialogStyle}
      footer={
        hero ? null : (
          <div className={styles.footer}>
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={
                  action.variant === 'primary'
                    ? `${styles.btn} ${styles.btnPrimary}`
                    : `${styles.btn} ${styles.btnGhost}`
                }
                onClick={() => {
                  if (action.onClick === 'close' || !action.href) {
                    closeModal()
                  } else if (action.href) {
                    window.open(action.href, '_blank', 'noopener')
                    closeModal()
                  }
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )
      }
    >
      {layoutFor(modal, closeModal)}
    </ModalShell>
  )
}