/**
 * 🖼️ MODAL SHELL — Estructura base del modal (Atomic Design)
 * ===========================================================
 * Componente contenedor reocupable para modales.
 * Maneja overlay, accesibilidad (Focus trap, ESC, ARIA) y tres variantes responsive.
 */

import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ModalVariant } from '../../types/modal.ts'
import { Glyph } from './Glyph'
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
  /** Ícono dinámico del header (p.ej. 'marker', 'presentation', 'gallery'...). */
  icon?: string
  /** Sin cromo básico, el layout interno toma el control total de la superficie. */
  hero?: boolean
  /** Estilos opcionales en línea para dimensionar el diálogo. */
  dialogStyle?: CSSProperties
}

const DECORATOR_URL = '/assets/modal/inicio/linea.svg'
const ICON_BG_URL = '/assets/modal/inicio/fondoIcon1.svg'
const SALIR_URL = '/assets/modal/inicio/salir.svg'

export function ModalShell({
  open,
  title,
  variant,
  highlight,
  onClose,
  children,
  footer,
  icon,
  hero = false,
  dialogStyle,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      ; (first ?? dialogRef.current)?.focus()

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
            {/* Encabezado del modal */}
            <div className={styles.head}>
              <div className={styles.headerGroup}>
                {icon && (
                  <span className={styles.iconBadge}>
                    <img
                      className={styles.iconBg}
                      src={ICON_BG_URL}
                      alt=""
                      aria-hidden="true"
                    />
                    <span className={styles.iconGlyph}>
                      <Glyph name={icon} size={20} />
                    </span>
                  </span>
                )}

                <div className={styles.titleColumn}>
                  {highlight ? (
                    <p className={styles.highlight}>{highlight}</p>
                  ) : null}
                  <h2 className={styles.title}>{title}</h2>
                  <span
                    className={styles.decor}
                    style={{ backgroundImage: `url(${DECORATOR_URL})` }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                <img src={SALIR_URL} alt="" aria-hidden="true" />
              </button>
            </div>

            {/* Contenido principal alineado */}
            <div className={styles.body}>{children}</div>

            {/* Acciones o pie opcional */}
            {footer ? <div className={styles.foot}>{footer}</div> : null}
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
