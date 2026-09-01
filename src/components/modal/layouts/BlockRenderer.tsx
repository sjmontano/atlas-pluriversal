/**
 * 🧱 BLOCK RENDERER — Renderiza los bloques tipados del body
 * ==========================================================
 * Registry de bloques: paragraph, heading, list, datatable, quote.
 * Agregar un bloque nuevo = extender `ModalBlock` en types/modal.ts,
 * añadir caso aquí y estilo en blocks.module.css.
 */

import type { ModalBlock } from '../../../types/modal.ts'
import styles from './blocks.module.css'

function renderBlock(block: ModalBlock) {
  switch (block.type) {
    case 'heading':
      return (
        <h3
          key={block.id}
          className={
            block.level === 3 ? styles.heading3 : styles.heading
          }
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
    case 'datatable':
      return (
        <div key={block.id} className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.columns.map((col, i) => (
                  <th key={i} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    case 'paragraph':
    default:
      return (
        <p key={block.id} className={`${styles.block} ${styles.paragraph}`}>
          {block.text}
        </p>
      )
  }
}

export interface BlockRendererProps {
  blocks: ModalBlock[]
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return <>{blocks.map(renderBlock)}</>
}