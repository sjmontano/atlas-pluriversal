/**
 * 🖼️ PAN VIEWPORT — Imagen de fondo explorable con pan en móvil
 * =============================================================
 * Sustituye al `<img dialogBg>` cuando el modal pide `panMobile`.
 * En desktop se comporta igual (100% + contain); en móvil la imagen
 * se amplía (230%) y el viewport hace scroll nativo en ambos ejes.
 * Muestra un hint animado (chevrones del sistema) que se oculta
 * al primer gesto de scroll/toque.
 */

import { useState } from 'react'
import { Glyph } from '../primitives/Glyph'
import styles from './PanViewport.module.css'

export interface PanViewportProps {
  src: string
  bg?: string
}

export function PanViewport({ src, bg }: PanViewportProps) {
  const [hint, setHint] = useState(true)
  const dismiss = () => setHint(false)

  return (
    <div
      className={styles.viewport}
      style={bg !== undefined ? { background: bg } : undefined}
      onScroll={dismiss}
      onTouchStart={dismiss}
      onWheel={dismiss}
    >
      <img
        className={styles.img}
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      {hint && (
        <div className={styles.hint} aria-hidden="true">
          <span className={styles.arrows}>
            <Glyph name="back" size={20} />
            <span className={styles.flip}>
              <Glyph name="back" size={20} />
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
