/**
 * 📋 DATASHEET LAYOUT — small · ficha técnica (tabla meta)
 */

import type { Modal } from '../../../types/modal.ts'
import { BlockRenderer } from '../blocks/BlockRenderer'
import styles from './layouts.module.css'

export function DataSheetLayout({ modal }: { modal: Modal }) {
  const metaEntries = Object.entries(modal.meta ?? {})

  return (
    <div>
      <BlockRenderer blocks={modal.body} />
      {metaEntries.length > 0 && (
        <table className={styles.datasheet}>
          <tbody>
            {metaEntries.map(([key, value]) => (
              <tr key={key}>
                <th scope="row">{key}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}