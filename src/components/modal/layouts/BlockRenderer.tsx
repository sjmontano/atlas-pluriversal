/**
 * 🧱 BLOCK RENDERER — Renderiza los bloques tipados del body
 * ==========================================================
 * Registry de bloques: paragraph, heading, list, quote, image,
 * carousel, columns, meta, link.
 * Agregar un bloque nuevo = extender `ModalBlock` en types/modal.ts,
 * añadir caso aquí y estilo en blocks.module.css.
 */

import { useState } from 'react'
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

/* ─── Carousel inline (sin dependencias externas) ──────────────────────── */

function CarouselBlock({ block }: { block: Extract<ModalBlock, { type: 'carousel' }> }) {
  const images = block.images
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null

  const current = images[index] ?? images[0]
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  return (
    <div className={`${styles.block} ${styles.carousel}`}>
      <div className={styles.carouselMain}>
        <img className={styles.carouselImg} src={current?.src} alt={current?.alt} />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.carouselNav} ${styles.carouselPrev}`}
              onClick={prev}
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.carouselNav} ${styles.carouselNext}`}
              onClick={next}
              aria-label="Siguiente"
            >
              ›
            </button>
            <span className={styles.carouselCount}>
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {current?.description && (
        <p className={styles.carouselDescription}>{current.description}</p>
      )}
      {images.length > 1 && (
        <div className={styles.carouselThumbs}>
          {images.map((img, i) => (
            <img
              key={i}
              className={`${styles.carouselThumb}${i === index ? ` ${styles.carouselThumbActive}` : ''}`}
              src={img.src}
              alt={img.alt}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
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
