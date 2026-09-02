/**
 * 🖼️ MODAL SHELL — Estructura base del modal
 * ===========================================
 * Componente contenedor reocupable para modales.
 * Maneja overlay, accesibilidad (Focus trap, ESC, ARIA), tres variantes responsive,
 * imagen de fondo full-bleed (fullImage) y tema personalizable (CSS variables).
 *
 * Header SIEMPRE visible: icono → highlight → título → decorador → X
 * Body = children (scrollable, con scrollbar custom)
 */

import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { ModalVariant } from '../../../types/modal.ts'
import { Glyph } from '../primitives/Glyph'
import { CustomScrollbar } from './CustomScrollbar'
import { ScrollIndicators } from './ScrollIndicators'
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
  /** Imagen de icono propia (sustituye al glyph en el badge del header). */
  iconImage?: string
  /** Imagen de fondo full-bleed a nivel del diálogo. */
  bgImage?: string
  /** Activa imagen de fondo + scrim automático sobre el body. */
  fullImage?: boolean
  /** Tema (CSS variables) — colores personalizados por modal. */
  theme?: { titleColor?: string; textColor?: string; bgColor?: string }
  /** Mostrar indicadores de scroll (flecha bounce + fade bottom). */
  showScrollIndicators?: boolean
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
  iconImage,
  bgImage,
  fullImage = false,
  theme,
  showScrollIndicators = false,
  dialogStyle,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const bodyScrollRef = useRef<HTMLDivElement>(null)

  const syncScrollbar = useCallback(() => {
    const el = bodyScrollRef.current
    if (!el) return
    const track = el.parentElement?.querySelector<HTMLElement>('[role="scrollbar"]')
    if (!track) return
    const thumb = track.querySelector<HTMLElement>(':scope > div')
    if (!thumb) return

    const { scrollHeight, clientHeight, scrollTop } = el
    if (scrollHeight <= clientHeight) {
      thumb.style.height = '0px'
      return
    }

    const ratio = clientHeight / scrollHeight
    const trackH = track.clientHeight
    const thumbH = Math.max(24, ratio * trackH)
    const maxScroll = scrollHeight - clientHeight
    const maxTop = trackH - thumbH
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0

    thumb.style.height = `${thumbH}px`
    thumb.style.transform = `translateY(${top}px)`
    thumb.style.opacity = '1'
  }, [])

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

  const themeVars: CSSProperties = {
    ...(theme?.titleColor ? { '--modal-title-color': theme.titleColor } as CSSProperties : {}),
    ...(theme?.textColor ? { '--modal-text-color': theme.textColor } as CSSProperties : {}),
    ...(theme?.bgColor ? { '--modal-bg': theme.bgColor } as CSSProperties : {}),
  }

  return createPortal(
    <div className={styles.root}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`${styles.dialog} ${styles[variant]}`}
        style={{ ...themeVars, ...dialogStyle }}
      >
        {/* Imagen de fondo full-bleed (fullImage) */}
        {bgImage && (
          <img
            className={styles.dialogBg}
            src={bgImage}
            alt=""
            aria-hidden="true"
          />
        )}

        {/* Header SIEMPRE visible */}
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
                  {iconImage !== undefined ? (
                    <img
                      src={iconImage}
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden="true"
                    />
                  ) : (
                    <Glyph name={icon} size={20} />
                  )}
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

        {/* Body scrollable + scrim (si fullImage) */}
        <div className={styles.bodyOuter}>
          {fullImage && <div className={styles.scrim} aria-hidden="true" />}
          <div
            ref={bodyScrollRef}
            className={styles.bodyInner}
            onScroll={syncScrollbar}
          >
            <CustomScrollbar
              scrollRef={bodyScrollRef}
              className={styles.bodyScrollbar}
            />
            {children}
          </div>
          {showScrollIndicators && (
            <ScrollIndicators
              scrollRef={bodyScrollRef}
              showArrow={true}
              showFade={true}
            />
          )}
        </div>

        {/* Footer opcional (actions legacy) */}
        {footer ? <div className={styles.foot}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
