/**
 * 📰 SECTION HEADER — Encabezado superior izquierdo (replicado de v17)
 * ====================================================================
 * Flecha atrás (glyph oficial `back`) + decorador de fondo elegido por
 * la longitud del título (<35 corto · <40 medio · ≥40 largo) + título.
 * En las intros de capítulo se antepone el numeral romano (`numeral`):
 * "II. Tejidos, nodos y alternativas…". El título se acota al 60vw con
 * salto de línea balanceado para los títulos largos.
 */

import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Glyph } from '../modal/primitives/Glyph'
import { SHELL_ASSETS } from './assets'
import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title?: string
  backTo?: string
  /** Numeral romano del capítulo (solo intros): se muestra como "II. Título". */
  numeral?: string
}

function backgroundFor(title: string): string | null {
  if (!title) return null
  if (title.length < 35) return SHELL_ASSETS.header.bgShort
  if (title.length < 40) return SHELL_ASSETS.header.bgMedium
  return SHELL_ASSETS.header.bgLong
}

export function SectionHeader({ title = '', backTo, numeral }: SectionHeaderProps) {
  const display = numeral !== undefined && title !== '' ? `${numeral}. ${title}` : title
  const bg = backgroundFor(display)
  const titleRef = useRef<HTMLHeadingElement>(null)

  /* Ciñe el título a su línea más larga solo cuando se envuelve: el flex
     mide el max-content (título en una línea) y deja un espacio fantasma a
     la derecha que el decorado cubre. Una línea → intacto (ancho natural).
     Ojo: getClientRects en un bloque devuelve un solo rect; las líneas se
     miden con Range, que sí devuelve un rect por línea. */
  useLayoutEffect(() => {
    const el = titleRef.current
    const wrap = el?.parentElement
    if (!el || !wrap) return
    let lastKey = ''
    let ro: ResizeObserver | null = null
    const fit = () => {
      /* Medir desde el ancho natural para que al crecer el viewport el
         título pueda des-envolverse solo. Si el resultado coincide con el
         ajuste previo se restaura sin mutar (evita loops del observer). */
      const prev = el.style.width
      el.style.width = ''
      const range = document.createRange()
      range.selectNodeContents(el)
      const lineRects = Array.from(range.getClientRects())
      if (lineRects.length <= 1) {
        if (lastKey === 'single') { el.style.width = prev; return }
        lastKey = 'single'
        return
      }
      let max = 0
      for (const r of lineRects) max = Math.max(max, r.width)
      const next = `${Math.ceil(max)}px`
      const key = `wrap:${next}`
      if (key === lastKey) { el.style.width = prev; return }
      lastKey = key
      el.style.width = next
    }
    fit()
    /* Observar el wrapper (no el h3): su box sí cambia con el viewport,
       el clamp 60vw y la carga de fuentes; el h3 fijado no cambiaría. */
    ro = new ResizeObserver(fit)
    ro.observe(wrap)
    return () => ro?.disconnect()
  }, [display])

  return (
    <header className={styles.header}>
      <div className={styles.group}>
        {bg !== null && <img src={bg} className={styles.bgImage} alt="" />}
        {backTo !== undefined && (
          <Link to={backTo} className={styles.back} aria-label="Regresar">
            <Glyph name="back" size={24} />
          </Link>
        )}
        {display !== '' && (
          <div className={styles.titleWrapper}>
            <h3 ref={titleRef} className={styles.title}>{display}</h3>
          </div>
        )}
      </div>
    </header>
  )
}
