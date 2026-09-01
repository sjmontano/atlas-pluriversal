/**
 * 📜 CUSTOM SCROLLBAR — Track visual alineado con el header
 * ==========================================================
 * Reemplaza el scrollbar nativo del navegador con un track visual
 * posicionado vía CSS (absoluto dentro del contenedor scrollable).
 * El thumb se sincroniza con el scroll via onScroll.
 *
 * Uso:
 *   <div className={styles.bodyOuter}>
 *     <CustomScrollbar />
 *     <div className={styles.bodyInner} ref={scrollRef} onScroll={sync}>
 *       ...contenido...
 *     </div>
 *   </div>
 */

import { useRef, useCallback, useEffect, useState } from 'react'
import styles from './CustomScrollbar.module.css'

export interface CustomScrollbarProps {
  /** Ref al contenedor con overflow-y: auto */
  scrollRef: React.RefObject<HTMLDivElement | null>
  /** Clase CSS adicional para el track */
  className?: string
}

export function CustomScrollbar({
  scrollRef,
  className,
}: CustomScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumbHeight, setThumbHeight] = useState(30)
  const [thumbTop, setThumbTop] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ y: 0, scrollTop: 0 })

  const updateThumb = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const { scrollHeight, clientHeight, scrollTop } = el
    if (scrollHeight <= clientHeight) {
      setThumbHeight(0)
      return
    }

    const ratio = clientHeight / scrollHeight
    const trackH = trackRef.current?.clientHeight ?? clientHeight
    const thumb = Math.max(24, ratio * trackH)
    const maxScroll = scrollHeight - clientHeight
    const maxTop = trackH - thumb
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0

    setThumbHeight(thumb)
    setThumbTop(top)
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateThumb()
  }, [scrollRef, updateThumb])

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const track = trackRef.current
      const el = scrollRef.current
      if (!track || !el) return

      const rect = track.getBoundingClientRect()
      const clickY = e.clientY - rect.top
      const trackH = rect.height
      const { scrollHeight, clientHeight } = el
      const maxScroll = scrollHeight - clientHeight

      const ratio = clickY / trackH
      el.scrollTop = ratio * maxScroll
    },
    [scrollRef],
  )

  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      dragStart.current = {
        y: e.clientY,
        scrollTop: scrollRef.current?.scrollTop ?? 0,
      }
    },
    [scrollRef],
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const el = scrollRef.current
      const track = trackRef.current
      if (!el || !track) return

      const dy = e.clientY - dragStart.current.y
      const trackH = track.clientHeight
      const { scrollHeight, clientHeight } = el
      const maxScroll = scrollHeight - clientHeight
      const maxTop = trackH - thumbHeight
      const deltaRatio = maxScroll > 0 ? dy / maxTop : 0

      el.scrollTop = dragStart.current.scrollTop + deltaRatio * maxScroll
    }

    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, scrollRef, thumbHeight])

  return (
    <div
      ref={trackRef}
      className={`${styles.track} ${className ?? ''}`}
      onClick={handleTrackClick}
      role="scrollbar"
      aria-orientation="vertical"
      aria-controls="scroll-content"
      aria-valuenow={Math.round(thumbTop)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {thumbHeight > 0 && (
        <div
          className={`${styles.thumb} ${isDragging ? styles.dragging : ''}`}
          style={{
            height: thumbHeight,
            transform: `translateY(${thumbTop}px)`,
          }}
          onMouseDown={handleThumbMouseDown}
        />
      )}
    </div>
  )
}
