/**
 * 📖 TEXT LAYOUT — medio · bloques editoriales con scroll
 */

import type { Modal } from '../../../types/modal.ts'
import { BlockRenderer } from '../blocks/BlockRenderer'

export function TextLayout({ modal }: { modal: Modal }) {
  return <BlockRenderer blocks={modal.body} />
}