/**
 * 🧰 TOOL RAIL — Columna de herramientas del mapa (ex SidebarLeft de v17)
 * =======================================================================
 * Formato columna: IconButton (contenedor fondo-icon + glyph centrado)
 * uno debajo del otro. En hover aparece el decorador de fondo oficial
 * de v17 (`item-hover-bg.webp`) junto a la etiqueta.
 * Los ítems derivan del registro de modales vía `buildToolRailItems()`.
 */

import { useNavigate } from 'react-router-dom'
import { getModalById } from '@content/modals'
import { useUIStore } from '@stores/uiStore'
import { SHELL_ASSETS } from './assets'
import { IconButton } from '../modal/IconButton'
import styles from './ToolRail.module.css'

export type RailAction =
  /** Abre un modal del registro por id. */
  | { kind: 'modal'; modalId: string }
  /** Abre una URL externa en pestaña nueva (Drive, Sheets…). */
  | { kind: 'link'; href: string }
  /** Navega internamente a otra ruta/mapa (ej. "Síntesis"). */
  | { kind: 'goto'; to: string }

export interface ToolRailItem {
  id: string
  /** Nombre del glyph (components/modal/Glyph.tsx). */
  icon: string
  label: string
  frame?: string
  action: RailAction
}

export interface ToolRailProps {
  items: ToolRailItem[]
}

export function ToolRail({ items }: ToolRailProps) {
  const openModal = useUIStore((s) => s.openModal)
  const navigate = useNavigate()

  const run = (item: ToolRailItem) => {
    const { action } = item
    if (action.kind === 'modal') {
      const modal = getModalById(action.modalId)
      if (modal) openModal(modal)
      return
    }
    if (action.kind === 'link') {
      window.open(action.href, '_blank', 'noopener,noreferrer')
      return
    }
    navigate(action.to)
  }

  return (
    <aside className={styles.rail} aria-label="Herramientas del mapa">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.itemWrap}>
            <IconButton
              icon={item.icon}
              label={item.label}
              frame={item.frame ?? '1'}
              bg={SHELL_ASSETS.sidebar.fondoIcon}
              onClick={() => run(item)}
            />
          </li>
        ))}
      </ul>
    </aside>
  )
}
