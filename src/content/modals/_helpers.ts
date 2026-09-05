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
 * Ficha de perfil (texto): imagen de cabecera + localización/incidencia/
 * influencia/descripción + listas de problemáticas y acciones.
 * Forma compartida de las fichas de Alternativas Transformadoras (C2).
 * Los perfiles del C4 son diagramas (modales de imagen), otra forma.
 */
export function fichaPerfil(
  id: string,
  title: string,
  highlight: string,
  image: string,
  localizacion: string,
  incidencia: string,
  influencia: string,
  descripcion: string,
  problematicas: string[],
  acciones: string[],
  mapId: string,
): Modal {
  const blocks: ModalBlock[] = [
    { type: 'paragraph', id: `${id}-loc`, text: `Localizacion: ${localizacion}` },
    { type: 'paragraph', id: `${id}-inc`, text: `Incidencia: ${incidencia}` },
    { type: 'paragraph', id: `${id}-inf`, text: `Influencia: ${influencia}` },
    { type: 'paragraph', id: `${id}-desc`, text: descripcion },
  ]
  if (problematicas.length > 0) {
    blocks.push({ type: 'heading', id: `${id}-ph`, level: 2, text: 'Problematicas que afrontamos' })
    blocks.push({ type: 'list', id: `${id}-pl`, items: problematicas })
  }
  if (acciones.length > 0) {
    blocks.push({ type: 'heading', id: `${id}-ah`, level: 2, text: 'Nuestras acciones' })
    blocks.push({ type: 'list', id: `${id}-al`, items: acciones })
  }
  return {
    id,
    section: 'capitulo-2',
    variant: 'large',
    title,
    highlight,
    icon: 'marker',
    image,
    body: blocks,
    trigger: {
      type: 'marker',
      icon: 'marker',
      frame: '1',
      label: title,
      mapId,
    },
  }
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
