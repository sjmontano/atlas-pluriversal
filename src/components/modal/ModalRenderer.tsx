/**
 * 🚀 MODAL RENDERER — Motor del sistema de modales
 * ================================================
 * Conecta `uiStore.activeModal` con la shell y los layouts.
 * Registry de layouts: image-text, gallery, datasheet, text, alert.
 * Los datos vienen de src/content/modals/ (vía openModal(getModalById(...))).
 */

import { useUIStore } from '@stores/index.ts'
import type { Modal } from '../../types/modal.ts'
import { ModalShell } from './ModalShell'
import { ModalActions } from './ModalActions'
import { AlertLayout } from './layouts/AlertLayout'
import { DataSheetLayout } from './layouts/DataSheetLayout'
import { GalleryLayout } from './layouts/GalleryLayout'
import { ImageTextLayout } from './layouts/ImageTextLayout'
import { InicioLayout } from './layouts/InicioLayout'
import { TextLayout } from './layouts/TextLayout'

function layoutFor(modal: Modal) {
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
      return <InicioLayout modal={modal} />
    case 'text':
    default:
      return <TextLayout modal={modal} />
  }
}

export function ModalRenderer() {
  const modal = useUIStore((s) => s.activeModal)
  const closeModal = useUIStore((s) => s.closeModal)

  if (!modal) return null

  const hero = false
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
      bgImage={modal.layout === 'inicio' ? modal.image : undefined}
      dialogStyle={dialogStyle}
      icon={modal.icon}
      iconImage={modal.iconImage}
      footer={modal.actions !== undefined && modal.actions.length > 0
        ? <ModalActions actions={modal.actions} onClose={closeModal} />
        : null}
    >
      {layoutFor(modal)}
    </ModalShell>
  )
}
