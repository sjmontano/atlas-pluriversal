/**
 * 🌳 LAYER TREE — Árbol genérico del menú de capas (port v17 layerMenu.jsx)
 * ==========================================================================
 * Convierte `groups` (con `parent` opcional) + `layers` (con `group` opcional)
 * + `legends` en un árbol con numeración automática:
 *
 * - Grupos sin `parent` + capas sin `group` = secciones top-level, numeradas
 *   en secuencia (1., 2., 3. — el ítem 3 de v17 es una capa suelta). Grupos
 *   con `numbered: false` (años como '1970') o `header: false` no consumen
 *   número.
 * - Subgrupos = `1.1.`, `2.3.` etc. recursivos (cualquier profundidad).
 * - Capas anidadas no se numeran; solo las top-level llevan número.
 * - Leyendas cuyo `group` coincide con un ID de grupo se anidan como filas
 *   informativas de ese grupo (v17 un-rio-cauca, años 1970/2022); el resto
 *   forma secciones libres con su texto como encabezado.
 *
 * Genérico: menús planos (sin `parent`, sin título) siguen funcionando igual.
 */

import type { Layer, LayerGroup, LegendItem } from '../../types/layer'

export type TriState = boolean | 'mixed'

export interface GroupNode {
  kind: 'group'
  group: LayerGroup
  depth: number
  number: string
  children: TreeNode[]
  /** Leyendas informativas anidadas (sin ojo) */
  legends: LegendItem[]
  /** Ids de TODAS las capas descendientes (para toggle en cascada). */
  layerIds: string[]
}

export interface LayerNode {
  kind: 'layer'
  layer: Layer
  /** Número solo para capas sueltas top-level (ej. "3"). */
  number: string | null
}

export type TreeNode = GroupNode | LayerNode

const byOrder = (a: { order: number }, b: { order: number }): number => a.order - b.order

function collectLayerIds(node: TreeNode): string[] {
  if (node.kind === 'layer') return [node.layer.id]
  return node.children.flatMap(collectLayerIds)
}

function buildGroupNode(
  group: LayerGroup,
  depth: number,
  number: string,
  childrenOf: Map<string, LayerGroup[]>,
  layersByGroup: Map<string, Layer[]>,
  legendsByGroup: Map<string, LegendItem[]>,
): GroupNode {
  const children: TreeNode[] = []
  const subs = (childrenOf.get(group.id) ?? []).slice().sort(byOrder)
  subs.forEach((sub) => {
    children.push(buildGroupNode(sub, depth + 1, '', childrenOf, layersByGroup, legendsByGroup))
  })
  const direct = (layersByGroup.get(group.id) ?? []).slice().sort(byOrder)
  for (const layer of direct) children.push({ kind: 'layer', layer, number: null })

  const node: GroupNode = {
    kind: 'group',
    group,
    depth,
    number,
    children,
    legends: (legendsByGroup.get(group.id) ?? []).slice().sort(byOrder),
    layerIds: [],
  }
  node.layerIds = children.flatMap(collectLayerIds)
  return node
}

/** Un grupo es colapsable si tiene subgrupos o más de una capa directa. */
export function isCollapsible(node: GroupNode): boolean {
  let subgroups = 0
  let layers = 0
  for (const child of node.children) {
    if (child.kind === 'group') subgroups += 1
    else layers += 1
  }
  return subgroups > 0 || layers > 1
}

export interface LayerTree {
  roots: TreeNode[]
  /** Leyendas libres (su `group` no es un id de grupo): secciones con texto. */
  freeLegends: Array<[string | null, LegendItem[]]>
}

export function buildLayerTree(
  groups: LayerGroup[],
  layers: Layer[],
  legends: LegendItem[],
): LayerTree {
  const byId = new Map(groups.map((g) => [g.id, g]))
  const childrenOf = new Map<string, LayerGroup[]>()
  const roots: LayerGroup[] = []
  for (const group of groups) {
    const parent = group.parent !== undefined ? byId.get(group.parent) : undefined
    if (parent !== undefined) {
      const list = childrenOf.get(parent.id) ?? []
      list.push(group)
      childrenOf.set(parent.id, list)
    } else {
      roots.push(group)
    }
  }
  roots.sort(byOrder)

  const layersByGroup = new Map<string, Layer[]>()
  const loose: Layer[] = []
  for (const layer of layers) {
    if (layer.group !== undefined && byId.has(layer.group)) {
      const list = layersByGroup.get(layer.group) ?? []
      list.push(layer)
      layersByGroup.set(layer.group, list)
    } else {
      loose.push(layer)
    }
  }
  loose.sort(byOrder)

  // Leyendas anidadas (group = id de grupo) vs libres (texto de sección).
  const legendsByGroup = new Map<string, LegendItem[]>()
  const free: LegendItem[] = []
  for (const item of legends) {
    if (item.group !== undefined && byId.has(item.group)) {
      const list = legendsByGroup.get(item.group) ?? []
      list.push(item)
      legendsByGroup.set(item.group, list)
    } else {
      free.push(item)
    }
  }

  // Secciones top-level: grupos y capas sueltas entremezclados por `order`.
  // Solo los grupos con encabezado numerado consumen número (1., 2., 3.).
  const sections = roots.map((group) => ({
    order: group.order,
    node: buildGroupNode(group, 0, '', childrenOf, layersByGroup, legendsByGroup),
  }))
  const merged: Array<{ order: number; node: TreeNode }> = [
    ...sections,
    ...loose.map((layer) => ({
      order: layer.order,
      node: { kind: 'layer', layer, number: null } as TreeNode,
    })),
  ].sort((a, b) => a.order - b.order)

  let n = 0
  for (const entry of merged) {
    const numbered =
      entry.node.kind === 'layer' ||
      (entry.node.group.header !== false && entry.node.group.numbered !== false)
    if (numbered) {
      n += 1
      entry.node.number = String(n)
    }
    if (entry.node.kind === 'group') renumber(entry.node)
  }
  return { roots: merged.map((entry) => entry.node), freeLegends: groupLegends(free) }
}

/** Agrupa leyendas libres por su texto de sección, respetando el orden
 *  global de aparición (una sección sin grupo puede ir primera). */
function groupLegends(legends: LegendItem[]): Array<[string | null, LegendItem[]]> {
  const sections: Array<[string | null, LegendItem[]]> = []
  const indexByGroup = new Map<string, number>()
  for (const item of legends) {
    const key = item.group ?? null
    if (key === null) {
      const last = sections[sections.length - 1]
      if (last !== undefined && last[0] === null) {
        last[1].push(item)
      } else {
        sections.push([null, [item]])
      }
      continue
    }
    const at = indexByGroup.get(key)
    if (at !== undefined) {
      sections[at]?.[1].push(item)
    } else {
      indexByGroup.set(key, sections.length)
      sections.push([key, [item]])
    }
  }
  return sections
}

/** Re-numera subgrupos (`1.1.`, `2.3.`). Solo los subgrupos consumen
 *  número; las capas directas no alteran la secuencia. Sin número padre,
 *  secuencia plana. */
function renumber(node: GroupNode): void {
  let n = 0
  for (const child of node.children) {
    if (child.kind === 'group') {
      n += 1
      child.number = node.number !== '' ? `${node.number}.${n}` : String(n)
      renumber(child)
    }
  }
}

/** Tri-estado de un conjunto de capas: todas / ninguna / mezcla. */
export function triState(visible: Set<string>, ids: string[]): TriState {
  if (ids.length === 0) return false
  const count = ids.filter((id) => visible.has(id)).length
  if (count === 0) return false
  if (count === ids.length) return true
  return 'mixed'
}
