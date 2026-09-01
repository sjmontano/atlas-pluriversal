/**
 * 📖 TEXT LAYOUT — medio · bloques editoriales con scroll
 */

import type { Modal } from '../../../types/modal.ts'
import { BlockRenderer } from './BlockRenderer'
import styles from './layouts.module.css'

export function TextLayout({ modal }: { modal: Modal }) {
  return (
    <div className={styles.textLayout}>
      <BlockRenderer blocks={modal.body} />
    </div>
  )
}
