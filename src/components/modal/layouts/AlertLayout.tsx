/**
 * ⚠️ ALERT LAYOUT — small · aviso / en construcción
 */

import type { Modal } from '../../../types/modal.ts'
import { Glyph } from '../Glyph'
import { BlockRenderer } from '../blocks/BlockRenderer'
import styles from './layouts.module.css'

export function AlertLayout({ modal }: { modal: Modal }) {
  return (
    <div className={styles.alert}>
      <span className={styles.alertIcon}>
        <Glyph name={modal.icon} size={48} />
      </span>
      <BlockRenderer blocks={modal.body} />
    </div>
  )
}
