/**
 * 🔗 TOOL RAIL ITEMS — Derivación de ítems del rail desde los datos
 * =================================================================
 * Puente datos→UI: convierte `map.ui.sidebar` en ítems tipados del ToolRail.
 * La configuración vive en cada `map.ts` (map.ui.sidebar), no en un índice global.
 */

import type { MapUISidebarItem } from '../../types/content'
import type { ToolRailItem } from './ToolRail'

/** Convierte MapUISidebarItem[] (de map.ui.sidebar) en ToolRailItem[]. */
export function buildRailFromSidebar(sidebar: MapUISidebarItem[]): ToolRailItem[] {
  return sidebar
    .filter((item) => item.enabled !== false)
    .map((item) => {
      let action: ToolRailItem['action'] = { kind: 'modal', modalId: item.target ?? item.id }

      if (item.type === 'link' && item.href) {
        action = { kind: 'link', href: item.href }
      } else if (item.type === 'goto' && item.to) {
        action = { kind: 'goto', to: item.to }
      }

      return {
        id: item.id,
        icon: item.icon,
        label: item.label,
        frame: item.frame ?? '1',
        action,
      }
    })
}
