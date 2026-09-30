/**
 * 🌳 LAYER TREE — Árbol genérico del menú de capas (port v17 layerMenu.jsx)
 * ==========================================================================
 * Convierte `groups` (con `parent` opcional) + `layers` (con `group` opcional)
 * en un árbol con numeración automática:
 *
 * - Grupos sin `parent` + capas sin `group` = secciones top-level, numeradas
 *   en secuencia (1., 2., 3. — el ítem 3 de v17 es una capa suelta).
 * - Subgrupos = `1.1.`, `2.3.` etc. recursivos (cualquier profundidad).
 * - Capas anidadas no se numeran; solo las top-level llevan número.
 *
 * Genérico: menús planos (sin `parent`, sin título) siguen funcionando igual.
 */

import type { Layer, LayerGroup } from '../../types/layer'

export type TriState = boolean | 'mixed'

export interface GroupNode {
  kind: 'group'
  group: LayerGroup
  depth: number
  number: string
  children: TreeNode[]
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
): GroupNode {
  const children: TreeNode[] = []
  const subs = (childrenOf.get(group.id) ?? []).slice().sort(byOrder)
  subs.forEach((sub, i) => {
    children.push(buildGroupNode(sub, depth + 1, `${number}.${i + 1}`, childrenOf, layersByGroup))
  })
  const direct = (layersByGroup.get(group.id) ?? []).slice().sort(byOrder)
  for (const layer of direct) children.push({ kind: 'layer', layer, number: null })

  const node: GroupNode = { kind: 'group', group, depth, number, children, layerIds: [] }
  node.layerIds = children.flatMap(collectLayerIds)
  return node
}

export function buildLayerTree(groups: LayerGroup[], layers: Layer[]): TreeNode[] {
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

  // Secciones top-level: grupos y capas sueltas entremezclados por `order`,
  // numerados en secuencia visual final (1., 2., 3.).
  const sections = roots.map((group) => ({
    order: group.order,
    node: buildGroupNode(group, 0, '', childrenOf, layersByGroup),
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
    n += 1
    entry.node.number = String(n)
    if (entry.node.kind === 'group') renumber(entry.node)
  }
  return merged.map((entry) => entry.node)
}

/** Re-numera subgrupos recursivamente (`1.1.`, `2.3.`). Solo los subgrupos
 *  consumen número; las capas directas no alteran la secuencia. */
function renumber(node: GroupNode): void {
  let n = 0
  for (const child of node.children) {
    if (child.kind === 'group') {
      n += 1
      child.number = `${node.number}.${n}`
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
