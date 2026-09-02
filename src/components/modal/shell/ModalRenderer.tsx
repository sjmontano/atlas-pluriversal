/**
 * 🚀 MODAL RENDERER — Motor del sistema de modales
 * ================================================
 * Conecta `modalStore.activeModal` con la shell y los layouts.
 * Body siempre es BlockRenderer. Layout 'inicio' usa InicioLayout para bgImage + scrim.
 */

import { useModalStore } from '@stores/modalStore'
import { ModalShell } from './ModalShell'
import { ModalActions } from './ModalActions'
import { InicioLayout } from '../layouts/InicioLayout'
import { BlockRenderer } from '../layouts/BlockRenderer'

export function ModalRenderer() {
  const modal = useModalStore((s) => s.activeModal)
  const closeModal = useModalStore((s) => s.closeModal)

  if (!modal) return null

  const dialogStyle = modal.theme?.size
    ? {
        width: modal.theme.size.width,
        height: modal.theme.size.height,
        maxWidth: modal.theme.size.width,
        maxHeight: modal.theme.size.height,
      }
    : undefined

  const renderBody = () => {
    if (modal.fullImage) {
      return <InicioLayout modal={modal} />
    }
    return <BlockRenderer blocks={modal.body} />
  }

  return (
    <ModalShell
      open
      title={modal.title}
      highlight={modal.highlight}
      variant={modal.variant}
      onClose={closeModal}
      bgImage={modal.fullImage ? modal.image : undefined}
      fullImage={modal.fullImage}
      theme={modal.theme}
      dialogStyle={dialogStyle}
      icon={modal.icon}
      iconImage={modal.iconImage}
      showScrollIndicators={modal.showScrollIndicators}
      footer={
        modal.actions !== undefined && modal.actions.length > 0
          ? <ModalActions actions={modal.actions} onClose={closeModal} />
          : null
      }
    >
      {renderBody()}
    </ModalShell>
  )
}
