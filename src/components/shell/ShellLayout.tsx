/**
 * 🧱 SHELL LAYOUT — Compositor del chrome compartido del Atlas
 * ============================================================
 * Capa única de interfaz replicada de v17 (TAREA 14): header, rail de
 * herramientas, tabs de capítulos, minimapa, norte y nav de inicio.
 * Cada página (mapa/capítulo/inicio) pasa qué widgets quiere ver.
 *
 * Estrategia de eventos: el shell es `pointer-events:none` y cada
 * widget interactivo re-habilita `pointer-events:auto`, de modo que el
 * canvas MapLibre queda navegable debajo del chrome.
 */

import type { ReactNode } from 'react'
import type { MiniMapKey } from '../../types/chapter.ts'
import { SectionHeader } from './SectionHeader'
import { ToolRail, type ToolRailItem } from './ToolRail'
import { ChapterTabs } from './ChapterTabs'
import { MiniMap } from './MiniMap'
import { NorthIndicator } from './NorthIndicator'
import { HomeNav } from './HomeNav'
import styles from './ShellLayout.module.css'

export interface ShellLayoutProps {
  /** Título de la sección en el header. Si se omite, no se monta el header. */
  title?: string
  /** Ruta del botón atrás. Si se omite, no se muestra la flecha. */
  backTo?: string
  /** Ítems del rail de herramientas izquierdo. Vacío/omiso = oculto. */
  railItems?: ToolRailItem[]
  /** Variante del minimapa. Omiso = oculto (páginas sin mapa). */
  minimap?: MiniMapKey
  /** Tabs de capítulos abajo (default: true). */
  showChapters?: boolean
  /** Icono del norte (default: true). */
  showNorth?: boolean
  /** Botones casa / un-rio-cauca (default: true). */
  showHome?: boolean
  children: ReactNode
}

export function ShellLayout({
  title,
  backTo,
  railItems,
  minimap,
  showChapters = true,
  showNorth = true,
  showHome = true,
  children,
}: ShellLayoutProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>{children}</div>

      {title !== undefined && <SectionHeader title={title} backTo={backTo} />}
      {railItems !== undefined && railItems.length > 0 && <ToolRail items={railItems} />}
      {showChapters && <ChapterTabs />}
      {minimap !== undefined && <MiniMap variant={minimap} />}
      {showNorth && <NorthIndicator />}
      {showHome && <HomeNav />}
    </div>
  )
}
