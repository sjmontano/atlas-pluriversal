/**
 * 🧰 HELPERS DE MODALES — maquetadores compartidos por capítulo
 * =============================================================
 * `paragraphs()` y `presentacion()` vivían copiados en cada
 * `chapter-{1,2,3,4}.ts`. Centralizados aquí con cero cambio de API.
 *
 * Regla: el helper NO sabe de dónde viene el contenido. Cada capítulo
 * resuelve su fuente (generados, literales) y llama con una entrada
 * ya resuelta (`PresentacionEntry`).
 */

import type { Modal, ModalBlock } from '../../types/modal.ts'

/** Divide un texto literal (separado por \n\n) en bloques párrafo. */
export function paragraphs(texto: string | null, base: string): ModalBlock[] {
  if (texto === null) return []
  return texto
    .split('\n\n')
    .map((t) => t.trim())
    .filter((t) => t !== '')
    .map((text, i) => ({ type: 'paragraph' as const, id: `${base}-p${i + 1}`, text }))
}

export interface PresentacionEntry {
  title: string
  highlight: string
  texto: string | null
  /** Si existe y no es vacío, agrega bloque link "Ver documento completo". */
  link?: string
  /** Etiqueta del trigger. Default: 'Presentación'. */
  triggerLabel?: string
}

/**
 * Modal de presentación por mapa.
 * id: `cap{cap}-presentacion-{mapKey}` · trigger al mapa `chapter{cap}-{mapKey}`
 * (o al `mapId` explícito si se pasa).
 */
export function presentacion(
  cap: number,
  mapKey: string,
  entry: PresentacionEntry,
  mapId?: string,
): Modal {
  const id = `cap${cap}-presentacion-${mapKey}`
  const blocks = paragraphs(entry.texto, id)
  if (entry.link !== undefined && entry.link !== '') {
    blocks.push({ type: 'link', id: `${id}-link`, href: entry.link, label: 'Ver documento completo' })
  }
  return {
    id,
    section: `capitulo-${cap}`,
    variant: 'large',
    title: entry.title,
    highlight: entry.highlight,
    icon: 'presentation',
    body: blocks,
    trigger: {
      type: 'button',
      icon: 'presentation',
      frame: '1',
      label: entry.triggerLabel ?? 'Presentación',
      mapId: mapId ?? `chapter${cap}-${mapKey}`,
    },
  }
}
