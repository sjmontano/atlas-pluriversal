/**
 * 🖼️ CAROUSEL FONDO — Carrusel inmersivo full-bleed
 * ==================================================
 * Variante de presentación del bloque 'carousel' para modales
 * fullBleed (sin header): slides con contain (sin recorte),
 * flechas centradas verticalmente SOBRE la imagen y dots
 * abajo-centro SOBRE la imagen. Reutiliza los assets actuales
 * del sistema. Lógica espejo de CarouselBlock (autoplay 6s,
 * teclado, swipe); no se extrae hook compartido para no
 * modificar BlockRenderer.
 */

import { useState, useEffect, useCallback } from 'react'
import styles from './CarouselFondo.module.css'

export interface CarouselFondoImage {
  src: string
  alt: string
}

export function CarouselFondo({ images }: { images: CarouselFondoImage[] }) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  useEffect(() => {
    if (isPaused || images.length <= 1) return
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [isPaused, images.length, next])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  }, [next, prev])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    setTouchStart(touch.clientX)
    setTouchDelta(0)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return
    const touch = e.touches[0]
    if (!touch) return
    setTouchDelta(touch.clientX - touchStart)
  }, [touchStart])

  const onTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta) > 50) {
      if (touchDelta > 0) prev()
      else next()
    }
    setTouchStart(null)
    setTouchDelta(0)
  }, [touchDelta, next, prev])

  if (images.length === 0) return null

  return (
    <div
      className={styles.fondo}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de imágenes"
    >
      {images.length > 1 && (
        <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={prev} aria-label="Imagen anterior">
          <img src="/assets/ui/icons/line/arrow-left.svg" alt="" aria-hidden="true" />
        </button>
      )}
      <div
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <img
            key={i}
            className={`${styles.slide}${i === index ? ` ${styles.active}` : ''}`}
            src={img.src}
            alt={img.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            aria-hidden={i === index ? undefined : true}
          />
        ))}
        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot}${i === index ? ` ${styles.dotActive}` : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <button type="button" className={`${styles.nav} ${styles.next}`} onClick={next} aria-label="Siguiente imagen">
          <img src="/assets/ui/icons/line/arrow-right.svg" alt="" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
