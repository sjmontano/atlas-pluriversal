/**
 * 🎞️ GALLERY LAYOUT — medio · carrusel de imágenes con miniaturas
 */

import { useState } from 'react'
import type { Modal } from '../../../types/modal.ts'
import styles from './layouts.module.css'

export function GalleryLayout({ modal }: { modal: Modal }) {
  const images = modal.gallery ?? []
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null

  const current = images[index] ?? images[0]

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  return (
    <div>
      <div className={styles.galleryMain}>
        <img className={styles.galleryImg} src={current} alt="" />
        <button
          type="button"
          className={`${styles.galleryNav} ${styles.galleryPrev}`}
          onClick={prev}
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.galleryNav} ${styles.galleryNext}`}
          onClick={next}
          aria-label="Siguiente"
        >
          ›
        </button>
        <span className={styles.galleryCount}>
          {index + 1} / {images.length}
        </span>
      </div>
      <div className={styles.galleryThumbs}>
        {images.map((src, i) => (
          <img
            key={i}
            className={`${styles.galleryThumb}${i === index ? ` ${styles.galleryThumbActive}` : ''}`}
            src={src}
            alt=""
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}