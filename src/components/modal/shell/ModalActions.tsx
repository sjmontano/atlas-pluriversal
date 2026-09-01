/**
 * 🔘 MODAL ACTIONS — Footer de acciones del modal (links/cerrar)
 * ==============================================================
 * Renderiza `Modal.actions`: con `href` abre externo en pestaña nueva;
 * sin `href` (u `onClick:'close'`) cierra el modal.
 */

import type { ModalAction } from '../../../types/modal.ts'
import styles from './ModalActions.module.css'

export interface ModalActionsProps {
  actions: ModalAction[]
  onClose: () => void
}

export function ModalActions({ actions, onClose }: ModalActionsProps) {
  if (actions.length === 0) return null
  return (
    <div className={styles.row}>
      {actions.map((action) =>
        action.href !== undefined && action.onClick !== 'close' ? (
          <a
            key={action.label}
            className={styles[action.variant ?? 'ghost']}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {action.label}
          </a>
        ) : (
          <button
            key={action.label}
            type="button"
            className={styles[action.variant ?? 'ghost']}
            onClick={onClose}
          >
            {action.label}
          </button>
        ),
      )}
    </div>
  )
}
