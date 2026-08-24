/**
 * 🔗 TOOL RAIL ITEMS — Derivación de ítems del rail desde los datos
 * =================================================================
 * Puente datos→UI: convierte `MAP_MODAL_INDEX[mapId]` (registro de
 * modales) en ítems tipados del ToolRail. Agregar un modal a un mapa
 * (en content/modals) lo publica automáticamente en el rail.
 *
 * Futuro: si un `ModalTrigger` declara `href` (Drive/Sheets) o
 * `gotoMapId` ("Síntesis" de v17), se mapea a link/goto sin tocar UI.
 */

import { MAP_MODAL_INDEX, MODALS } from '@content/modals'
import type { ToolRailItem } from './ToolRail'

export function buildToolRailItems(mapId: string): ToolRailItem[] {
  const ids = MAP_MODAL_INDEX[mapId] ?? []
  const items: ToolRailItem[] = []
  for (const id of ids) {
    const modal = MODALS[id]
    if (!modal) continue

    let action: ToolRailItem['action'] = { kind: 'modal', modalId: modal.id }
    if (modal.trigger.href !== undefined && modal.trigger.href !== '') {
      action = { kind: 'link', href: modal.trigger.href }
    } else if (modal.trigger.gotoMapId !== undefined && modal.trigger.gotoMapId !== '') {
      action = { kind: 'goto', to: `/capitulo/mapa/${modal.trigger.gotoMapId}` }
    }

    items.push({
      id: modal.id,
      icon: modal.trigger.icon,
      label: modal.trigger.label ?? modal.title,
      frame: modal.trigger.frame ?? '1',
      action,
    })
  }
  return items
}
