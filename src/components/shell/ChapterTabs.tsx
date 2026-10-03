/**
 * 🗂️ CHAPTER TABS — Pestañas de capítulos (ex SidebarBottom de v17)
 * ==================================================================
 * Barra inferior centrada con los Cap. I–IV: numeral + flecha ↑ en el
 * overlay; hover (no seleccionado) crece, muestra imagen de fondo y
 * descriptor; el seleccionado cambia de color y no navega.
 *
 * Modo autoHide (solo mapas de contenido): arranca en peek (una franja
 * visible), a los ~3s se baja a hidden (88% oculto) y sube completo al
 * acercar el cursor al borde inferior (zona invisible de 48px) con un
 * rebote elástico sutil. En intros se monta sin autoHide (siempre visible).
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CHAPTERS } from '@data/chapters/chapters.ts'
import { useChapterStore } from '@stores/chapterStore'
import { SHELL_ASSETS } from './assets'
import type { Chapter } from '../../types/chapter.ts'
import { Glyph } from '../modal/primitives/Glyph'
import styles from './ChapterTabs.module.css'

/** Ms en peek antes de bajarse solo. */
const PEEK_MS = 2800

export interface ChapterTabsProps {
  /** Ocultado automático con peek (mapas de contenido). Default: false. */
  autoHide?: boolean
  /** Clave para reiniciar el ciclo peek→hidden (p. ej. mapId). */
  autoHideKey?: string
}

/** Quita el prefijo "I. " del título del registro para el descriptor. */
function shortTitle(chapter: Chapter): string {
  return chapter.title.replace(/^[IVXL]+\.\s*/, '')
}

/** Silueta blanca por capítulo (public/assets/ui/layer-chapter). */
const SILHOUETTES: Record<number, string> = {
  1: '/assets/ui/layer-chapter/chapter1-map.svg',
  2: '/assets/ui/layer-chapter/chapter2-maps.svg',
  3: '/assets/ui/layer-chapter/chapter3-river.svg',
  4: '/assets/ui/layer-chapter/chapter4-cacao.svg',
}

export function ChapterTabs({ autoHide = false, autoHideKey }: ChapterTabsProps) {
  const activeChapter = useChapterStore((s) => s.activeChapter)
  const [state, setState] = useState<'peek' | 'hidden' | 'open'>('peek')
  const hideTimer = useRef<number | null>(null)
  const cursor = useRef({ x: -1, y: -1 })
  const zoneRef = useRef<HTMLDivElement>(null)

  /* Posición del cursor: si al ocultar está sobre la zona, no ocultar. */
  useEffect(() => {
    if (!autoHide) return
    const onMove = (e: PointerEvent): void => {
      cursor.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [autoHide])

  /* Ciclo peek (visible al montar / navegar) → hidden tras PEEK_MS. */
  useEffect(() => {
    if (!autoHide) return
    setState('peek')
    hideTimer.current = window.setTimeout(() => setState('hidden'), PEEK_MS)
    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current)
    }
  }, [autoHide, autoHideKey])

  const inZone = (): boolean => {
    const z = zoneRef.current
    if (!z) return false
    const r = z.getBoundingClientRect()
    const p = cursor.current
    return p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom
  }

  const open = (): void => {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current)
    setState('open')
  }
  const maybeHide = (): void => {
    if (!inZone()) {
      /* Retardo breve: el mouse puede haber salido de la zona por un
         frame mientras el menú subía (el borde del aside se mueve). */
      hideTimer.current = window.setTimeout(() => {
        if (!inZone()) setState('hidden')
      }, 120)
    }
  }

  return (
    <>
      {autoHide && (
        <div
          ref={zoneRef}
          className={styles.hoverZone}
          data-active={state !== 'open'}
          aria-hidden="true"
          onMouseEnter={open}
        />
      )}
      <aside
        className={styles.tabs}
        aria-label="Capítulos"
        data-autohide={autoHide}
        data-state={state}
        onMouseEnter={autoHide ? open : undefined}
        onMouseLeave={autoHide ? maybeHide : undefined}
        onFocus={autoHide ? open : undefined}
        onBlur={
          autoHide
            ? (e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setState('hidden')
              }
            : undefined
        }
      >
        {CHAPTERS.map((chapter) => {
        const selected = chapter.id === activeChapter
        const className = `${styles.tab}${selected ? ` ${styles.selected}` : ''}`
        const body = (
          <>
            <img
              className={styles.fondo}
              src={chapter.hoverImage ?? SHELL_ASSETS.sidebar.tabDefaultBg}
              alt=""
            />
            <div className={styles.overlay}>
              <span className={styles.number}>Cap. {chapter.roman}</span>
              <span className={styles.arrow}>
                <Glyph name="arrow-up" size={21} />
              </span>
            </div>
            <p className={styles.text}>
              <span className={styles.number}>Cap. {chapter.roman}</span>
              <span className={styles.title}>{shortTitle(chapter)}</span>
            </p>
            {SILHOUETTES[chapter.id] !== undefined && (
              <div className={styles.siluetaWrap} aria-hidden="true">
                <img
                  className={styles.silueta}
                  src={SILHOUETTES[chapter.id] ?? ''}
                  alt=""
                  draggable={false}
                />
              </div>
            )}
          </>
        )

        return selected ? (
          <div key={chapter.id} className={className} aria-current="page" data-chapter={chapter.id}>
            {body}
          </div>
        ) : (
          <Link key={chapter.id} to={`/capitulo/${chapter.id}`} className={className} data-chapter={chapter.id}>
            {body}
          </Link>
        )
      })}
      </aside>
    </>
  )
}
