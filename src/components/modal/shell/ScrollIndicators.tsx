/**
 * 📜 SCROLL INDICATORS — Flecha bounce + fade inferior
 * ====================================================
 * - Flecha bounce animada (apuntando abajo)
 * - Fade inferior (gradiente) que desaparece al llegar al final del scroll
 * - Controlado por ref del contenedor scrollable
 * - Accesible (pointer-events: none, aria-hidden)
 */

import { useEffect, useState } from 'react'
import styles from './ScrollIndicators.module.css'

export interface ScrollIndicatorsProps {
  /** Referencia al contenedor scrollable */
  scrollRef: React.RefObject<HTMLElement | null>
  /** Mostrar flecha bounce */
  showArrow?: boolean
  /** Mostrar fade inferior */
  showFade?: boolean
}

export function ScrollIndicators({
  scrollRef,
  showArrow = true,
  showFade = true,
}: ScrollIndicatorsProps) {
  const [arrowOpacity, setArrowOpacity] = useState(1)
  const [showBottomFade, setShowBottomFade] = useState(true)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container

      // Flecha: se desvanece progresivamente (hasta 200px)
      const newOpacity = Math.max(0, 1 - scrollTop / 200)
      setArrowOpacity(newOpacity)

      // Fade inferior: desaparece al llegar al final
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 5
      setShowBottomFade(!isBottom)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    // Verificar estado inicial
    const { scrollHeight, clientHeight } = container
    setShowBottomFade(scrollHeight > clientHeight)

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {showArrow && arrowOpacity > 0 && (
        <div
          className={styles.arrow}
          style={{ opacity: arrowOpacity }}
          aria-hidden="true"
        >
          <img src="/assets/ui/icons/line/arrow-down.svg" alt="" />
        </div>
      )}

      {showFade && showBottomFade && (
        <div className={styles.fade} aria-hidden="true" />
      )}
    </>
  )
}
