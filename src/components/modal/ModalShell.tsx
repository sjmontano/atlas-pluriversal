/**
 * 🖼️ MODAL SHELL — Estructura base del modal
 * ===========================================
 * Dialog + overlay + portal. Tres variantes de tamaño responsive
 * (small/medium/large) definidas en tokens CSS.
 *
 * A11y (patrón WAI-ARIA APG):
 * - role=dialog + aria-modal
 * - Esc cierra · Tab cíclico (focus trap) · scroll bloqueado al abrir
 * - foco inicial al primer elemento enfocable
 *
 * Motor genérico: no conoce datos de contenido, solo presenta `title`,
 * `highlight`, `variant`, `children` y `footer`.
 *
 * `hero` (layout inicio): sin header/footer/chrome — el layout controla toda
 * la superficie (imagen de fondo 100%). Conserva portal, Esc, focus trap y
 * bloqueo de scroll. El cierre visual lo aporta el propio layout.
 */

import { useEffect, useRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import type { ModalVariant } from '../../types/modal.ts'
import styles from './ModalShell.module.css'

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export interface ModalShellProps {
  open: boolean
  title: string
  variant: ModalVariant
  highlight?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  /** Sin chrome (header/footer), el layout controla toda la superficie. */
  hero?: boolean
  /** Estilo inline para el dialog (p.ej. tamaño personalizado por modal). */
  dialogStyle?: CSSProperties
}

export function ModalShell({
  open,
  title,
  variant,
  highlight,
  onClose,
  children,
  footer,
  hero = false,
  dialogStyle,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? dialogRef.current)?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const els = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      )
      if (els.length === 0) return
      const firstEl = els[0]
      const lastEl = els[els.length - 1]
      if (!firstEl || !lastEl) return
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={styles.root}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`${styles.dialog} ${styles[variant]}${hero ? ` ${styles.hero}` : ''}`}
        style={dialogStyle}
      >
        {hero ? (
          <div className={styles.heroBody}>{children}</div>
        ) : (
          <>
            <header className={styles.header}>
              <div className={styles.titles}>
                {highlight ? (
                  <p className={styles.highlight}>{highlight}</p>
                ) : null}
                <h2 className={styles.title}>{title}</h2>
              </div>
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </header>

            <div className={styles.body}>{children}</div>

            {footer ? <footer className={styles.footer}>{footer}</footer> : null}
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}