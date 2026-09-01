/**
 * ⚠️ ALERT LAYOUT — small · aviso / en construcción
 */

import type { Modal } from '../../../types/modal.ts'
import { Glyph } from '../primitives/Glyph'
import { BlockRenderer } from './BlockRenderer'
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
