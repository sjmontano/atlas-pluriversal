/**
 * 🏁 INICIO PAGE — La home del Atlas (replicada de v17 Home/Content)
 * ===================================================================
 * Lienzo de relación de aspecto FIJA (la imagen 1920×1080) con los 16
 * POIs pegados a la imagen (como los POIs de mapa: fijos a coordenadas).
 *
 * Paneo tipo mapa: si el viewport no muestra todo el lienzo (tablet/
 * celular, o aspecto distinto al 16:9), se puede arrastrar (mouse/touch)
 * para reacharlo todo. El paneo está acotado al overflow real y el click
 * en un marker se suprime si hubo arrastre (>6px).
 */

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { ShellLayout } from '@components/shell/ShellLayout'
import { HomeMarkers } from '@components/inicio/HomeMarkers'
import { HomePanel } from '@components/inicio/HomePanel'
import styles from './InicioPage.module.css'

const HOME_BACKGROUND = '/assets/ui/inicio/background.webp'
/** Relación de aspecto nativa del fondo (1920×1080). */
const IMAGE_ASPECT = 1920 / 1080
/** Umbral en px para distinguir arrastre (pan) de click. */
const DRAG_THRESHOLD = 6

interface Offset {
  x: number
  y: number
}

const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v))

export function InicioPage() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<Offset>({ x: 0, y: 0 })
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ id: number; px: number; py: number; ox: number; oy: number } | null>(null)
  const movedRef = useRef(false)

  /* Medir el viewport (responsive) */
  useEffect(() => {
    const el = viewportRef.current
    if (el === null) return
    const update = () => setViewport({ x: el.clientWidth, y: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Lienzo en modo cover: siempre llena el viewport manteniendo el aspecto */
  const canvasW = Math.max(viewport.x, viewport.y * IMAGE_ASPECT)
  const canvasH = canvasW / IMAGE_ASPECT
  const maxX = Math.max(0, (canvasW - viewport.x) / 2)
  const maxY = Math.max(0, (canvasH - viewport.y) / 2)
  const pannable = maxX > 1 || maxY > 1

  /* Re-acotar el offset cuando cambia el tamaño */
  useEffect(() => {
    setOffset((o) => ({ x: clamp(o.x, -maxX, maxX), y: clamp(o.y, -maxY, maxY) }))
  }, [maxX, maxY])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    movedRef.current = false
    /* Los elementos interactivos (markers, botones, links) no inician pan:
       así el click llega limpio a su handler. */
    const target = e.target as HTMLElement
    if (!pannable || !e.isPrimary || target.closest('button, a') !== null) return
    drag.current = { id: e.pointerId, px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y }
    setDragging(true)
    void e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (d === null || e.pointerId !== d.id) return
    const dx = e.clientX - d.px
    const dy = e.clientY - d.py
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) movedRef.current = true
    setOffset({ x: clamp(d.ox + dx, -maxX, maxX), y: clamp(d.oy + dy, -maxY, maxY) })
  }

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current === null || e.pointerId !== drag.current.id) return
    drag.current = null
    setDragging(false)
  }

  /* Suprime el click en markers/links si la interacción fue un arrastre */
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (movedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      movedRef.current = false
    }
  }

  return (
    <ShellLayout minimap="sur" showChapters={false} showNorth={false} showHome={false}>
      <div
        ref={viewportRef}
        className={`${styles.viewport}${pannable ? ` ${styles.pannable}` : ''}`}
        style={{ cursor: pannable ? (dragging ? 'grabbing' : 'grab') : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {viewport.x > 0 && (
          <div
            className={styles.canvas}
            style={{
              width: canvasW,
              height: canvasH,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
            }}
          >
            <img className={styles.background} src={HOME_BACKGROUND} alt="" draggable={false} />
            <HomeMarkers />
          </div>
        )}
        <HomePanel />
      </div>
    </ShellLayout>
  )
}
