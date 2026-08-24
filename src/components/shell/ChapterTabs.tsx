/**
 * 🗂️ CHAPTER TABS — Pestañas de capítulos (ex SidebarBottom de v17)
 * ==================================================================
 * Barra inferior centrada con los Cap. I–IV: numeral + flecha ↑ en el
 * overlay; hover (no seleccionado) crece, muestra imagen de fondo y
 * descriptor; el seleccionado cambia de color y no navega.
 */

import { Link } from 'react-router-dom'
import { CHAPTERS } from '@data/chapters/chapters.ts'
import { useChapterStore } from '@stores/chapterStore'
import { SHELL_ASSETS } from './assets'
import type { Chapter } from '../../types/chapter.ts'
import { Glyph } from '../modal/Glyph'
import styles from './ChapterTabs.module.css'

/** Quita el prefijo "I. " del título del registro para el descriptor. */
function shortTitle(chapter: Chapter): string {
  return chapter.title.replace(/^[IVXL]+\.\s*/, '')
}

export function ChapterTabs() {
  const activeChapter = useChapterStore((s) => s.activeChapter)

  return (
    <aside className={styles.tabs} aria-label="Capítulos">
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
          </>
        )

        return selected ? (
          <div key={chapter.id} className={className} aria-current="page">
            {body}
          </div>
        ) : (
          <Link key={chapter.id} to={`/capitulo/${chapter.id}`} className={className}>
            {body}
          </Link>
        )
      })}
    </aside>
  )
}
