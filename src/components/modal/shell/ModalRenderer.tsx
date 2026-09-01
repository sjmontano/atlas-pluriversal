/**
 * 🚀 MODAL RENDERER — Motor del sistema de modales
 * ================================================
 * Conecta `modalStore.activeModal` con la shell y los layouts.
 * Registry de layouts: gallery, datasheet, text, alert.
 * Los datos vienen de src/content/modals/ (vía openModal(getModalById(...))).
 */

import { useModalStore } from '@stores/modalStore'
import type { Modal } from '../../../types/modal.ts'
import { ModalShell } from './ModalShell'
import { ModalActions } from './ModalActions'
import { AlertLayout } from '../layouts/AlertLayout'
import { DataSheetLayout } from '../layouts/DataSheetLayout'
import { FeatureLayout } from '../layouts/FeatureLayout'
import { GalleryLayout } from '../layouts/GalleryLayout'
import { InicioLayout } from '../layouts/InicioLayout'
import { TextLayout } from '../layouts/TextLayout'

function layoutFor(modal: Modal) {
  switch (modal.layout) {
    case 'gallery':
      return <GalleryLayout modal={modal} />
    case 'datasheet':
      return <DataSheetLayout modal={modal} />
    case 'alert':
      return <AlertLayout modal={modal} />
    case 'inicio':
      return <InicioLayout modal={modal} />
    case 'feature':
      return <FeatureLayout modal={modal} />
    case 'text':
    default:
      return <TextLayout modal={modal} />
  }
}

export function ModalRenderer() {
  const modal = useModalStore((s) => s.activeModal)
  const closeModal = useModalStore((s) => s.closeModal)

  if (!modal) return null

  const isHeroLayout = modal.layout === 'feature'
  const hasBgImage = modal.layout === 'feature' || modal.layout === 'inicio'
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
      hero={isHeroLayout}
      bgImage={hasBgImage ? modal.image : undefined}
      dialogStyle={dialogStyle}
      icon={!isHeroLayout ? modal.icon : undefined}
      iconImage={!isHeroLayout ? modal.iconImage : undefined}
      footer={!isHeroLayout && modal.actions !== undefined && modal.actions.length > 0
        ? <ModalActions actions={modal.actions} onClose={closeModal} />
        : null}
    >
      {layoutFor(modal)}
    </ModalShell>
  )
}
