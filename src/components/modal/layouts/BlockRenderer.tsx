/**
 * 🧱 BLOCK RENDERER — Renderiza los bloques tipados del body
 * ==========================================================
 * Registry de bloques: paragraph, heading, list, quote, image,
 * carousel, columns, meta, link.
 * Agregar un bloque nuevo = extender `ModalBlock` en types/modal.ts,
 * añadir caso aquí y estilo en blocks.module.css.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ModalBlock } from '../../../types/modal.ts'
import styles from './blocks.module.css'

function renderBlock(block: ModalBlock): React.ReactNode {
  switch (block.type) {
    case 'heading':
      return (
        <h3
          key={block.id}
          className={block.level === 3 ? styles.heading3 : styles.heading}
        >
          {block.text}
        </h3>
      )

    case 'list':
      return block.ordered ? (
        <ol key={block.id} className={`${styles.block} ${styles.list}`}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul key={block.id} className={`${styles.block} ${styles.list}`}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )

    case 'quote':
      return (
        <blockquote key={block.id} className={`${styles.block} ${styles.quote}`}>
          <p>{block.text}</p>
          {block.source ? (
            <footer className={styles.quoteSource}>{block.source}</footer>
          ) : null}
        </blockquote>
      )

    case 'image':
      return (
        <figure key={block.id} className={`${styles.block} ${styles.imageBlock}`}>
          <img
            className={styles.image}
            src={block.src}
            alt={block.alt}
            loading="lazy"
          />
          {block.caption ? (
            <figcaption className={styles.imageCaption}>{block.caption}</figcaption>
          ) : null}
        </figure>
      )

    case 'carousel':
      return <CarouselBlock key={block.id} block={block} />

    case 'columns':
      return (
        <div key={block.id} className={`${styles.block} ${styles.columns}`}>
          <div className={styles.columnsMain}>
            {block.main.map(renderBlock)}
          </div>
          {block.aside && block.aside.length > 0 && (
            <div className={styles.columnsAside}>
              {block.aside.map(renderBlock)}
            </div>
          )}
        </div>
      )

    case 'meta':
      return (
        <div key={block.id} className={`${styles.block} ${styles.metaWrap}`}>
          <table className={styles.metaTable}>
            <tbody>
              {Object.entries(block.data).map(([key, value]) => (
                <tr key={key}>
                  <th scope="row">{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'link':
      return (
        <div key={block.id} className={`${styles.block} ${styles.linkBlock}`}>
          <a
            className={styles.link}
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {block.label}
          </a>
        </div>
      )

    case 'paragraph':
    default:
      return (
        <p key={block.id} className={`${styles.block} ${styles.paragraph}`}>
          {block.text}
        </p>
      )
  }
}

/* ─── Carousel inline (slide transition estilo v17) ─────────────────────── */

function CarouselBlock({ block }: { block: Extract<ModalBlock, { type: 'carousel' }> }) {
  const images = block.images
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  // Auto-play con cleanup correcto
  useEffect(() => {
    if (isPaused || images.length <= 1) return
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [isPaused, images.length, next])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  }, [next, prev])

  // Touch/swipe
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

  const slideOffset = touchStart !== null ? touchDelta * 0.3 : 0

  return (
    <div
      ref={containerRef}
      className={`${styles.block} ${styles.carousel}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de imágenes"
    >
      <div className={styles.carouselInner}>
        {/* Botón anterior */}
        {images.length > 1 && (
          <button
            type="button"
            className={`${styles.carouselNav} ${styles.carouselPrev}`}
            onClick={prev}
            aria-label="Imagen anterior"
          >
            <img src="/assets/ui/icons/line/arrow-left.svg" alt="" aria-hidden="true" />
          </button>
        )}

        {/* Contenedor de imágenes + descriptor */}
        <div className={styles.carouselContent}>
          <div
            className={styles.carouselTrackContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(calc(-${index * 100}% + ${slideOffset}px))` }}
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  className={styles.carouselSlide}
                  src={img.src}
                  alt={img.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>

            {/* Dots */}
            {images.length > 1 && (
              <div className={styles.carouselDots}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.carouselDot}${i === index ? ` ${styles.carouselDotActive}` : ''}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Ir a imagen ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Descripción con transición (solo si la imagen la trae:
              sin texto no se renderiza ni la caja ni la línea lateral) */}
          {images[index]?.description ? (
            <div className={styles.carouselDescription} key={index}>
              <p>{images[index]?.description}</p>
            </div>
          ) : null}
        </div>

        {/* Botón siguiente */}
        {images.length > 1 && (
          <button
            type="button"
            className={`${styles.carouselNav} ${styles.carouselNext}`}
            onClick={next}
            aria-label="Siguiente imagen"
          >
            <img src="/assets/ui/icons/line/arrow-right.svg" alt="" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Export ───────────────────────────────────────────────────────────── */

export interface BlockRendererProps {
  blocks: ModalBlock[]
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return <>{blocks.map(renderBlock)}</>
}
