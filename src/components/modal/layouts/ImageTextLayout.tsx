/**
 * 🖼️ IMAGE-TEXT LAYOUT — large · hero imagen + bloques de texto
 */

import type { Modal } from '../../../types/modal.ts'
import { BlockRenderer } from '../blocks/BlockRenderer'
import styles from './layouts.module.css'

export function ImageTextLayout({ modal }: { modal: Modal }) {
  return (
    <div className={styles.imageText}>
      {modal.image ? (
        <figure className={styles.media}>
          <img
            className={styles.img}
            src={modal.image}
            alt={modal.title}
          />
        </figure>
      ) : null}
      <div>
        <BlockRenderer blocks={modal.body} />
      </div>
    </div>
  )
}