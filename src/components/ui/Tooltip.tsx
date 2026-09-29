/**
 * 💬 TOOLTIP — Sistema general de indicadores de botón del Atlas
 * ===============================================================
 * Un solo componente para todos los botones (shell, home, markers).
 * Valida en runtime y evita los problemas de los parches por botón:
 *
 * - Clamp horizontal: si el tooltip desbordaría el viewport (botones al
 *   filo izquierdo/derecho), se desplaza lo justo (`--tip-dx`) y la flecha
 *   se reposiciona (`--arrow-x`) para seguir apuntando al botón.
 * - Flip vertical: si no cabe arriba (markers pegados al borde superior),
 *   se abre debajo del botón con la flecha hacia arriba.
 *
 * Uso: renderizar como hijo directo del botón/link (el host debe tener
 * `position: relative`). La visibilidad la gestiona el componente
 * escuchando hover/focus del host. En táctil se oculta por CSS.
 */

import { useEffect, useRef } from 'react'
import { SHELL_ASSETS } from '@components/shell/assets'
import styles from './Tooltip.module.css'

/** Margen de seguridad al viewport en px. */
const MARGIN = 8

export interface TooltipProps {
  label: string
  /** Permite 2 líneas (títulos de markers con \n). Default: una línea. */
  wrap?: boolean
}

export function Tooltip({ label, wrap = false }: TooltipProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const tip = ref.current
    const host = tip?.parentElement
    if (!tip || !host) return
    let raf = 0

    /** Mide ya visible y corrige desbordes. */
    const place = () => {
      const r = tip.getBoundingClientRect()
      let dx = 0
      if (r.left < MARGIN) dx = MARGIN - r.left
      else if (r.right > window.innerWidth - MARGIN) dx = window.innerWidth - MARGIN - r.right
      tip.style.setProperty('--tip-dx', `${dx}px`)
      tip.style.setProperty('--arrow-x', `calc(50% - ${dx}px)`)
      if (r.top < MARGIN) tip.dataset.flip = 'true'
      else delete tip.dataset.flip
    }

    const show = () => {
      tip.dataset.open = 'true'
      cancelAnimationFrame(raf)
      /* La animación de entrada lleva 120ms de retardo: medimos en el
         siguiente frame, invisible aún, sin parpadeo. */
      raf = requestAnimationFrame(place)
    }
    const hide = () => {
      delete tip.dataset.open
      cancelAnimationFrame(raf)
    }

    host.addEventListener('mouseenter', show)
    host.addEventListener('mouseleave', hide)
    host.addEventListener('focusin', show)
    host.addEventListener('focusout', hide)
    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('mouseenter', show)
      host.removeEventListener('mouseleave', hide)
      host.removeEventListener('focusin', show)
      host.removeEventListener('focusout', hide)
    }
  }, [])

  return (
    <span
      ref={ref}
      className={styles.tip}
      role="tooltip"
      aria-hidden="true"
      data-wrap={wrap ? 'true' : undefined}
    >
      <img className={styles.bg} src={SHELL_ASSETS.tooltips.fondo} alt="" />
      <span className={styles.text}>{label}</span>
    </span>
  )
}
