import type { MapContent, MapUI, MapUISidebarItem } from '../types/content'
import { MAP_CALIBRATIONS } from './calibration/map'

const mapModules = import.meta.glob<{ default: MapContent }>('./*/*/map.ts', { eager: true })
const looseModules = import.meta.glob<{ default: MapContent }>('./*/map.ts', { eager: true })

const CONTENT = new Map<string, MapContent>()

for (const mod of [...Object.values(mapModules), ...Object.values(looseModules)]) {
  const content = mod.default
  if (!content || typeof content.mapId !== 'string') continue
  if (CONTENT.has(content.mapId)) {
    throw new Error(`mapId duplicado en content: ${content.mapId}`)
  }
  CONTENT.set(content.mapId, content)
}

export function getMapContent(mapId: string): MapContent | null {
  const content = CONTENT.get(mapId)
  if (!content) return null
  const calib = MAP_CALIBRATIONS[mapId]
  if (!calib) return content
  return {
    ...content,
    geo: { ...content.geo, pgw: calib.pgw, width: calib.width, height: calib.height },
    config: {
      ...content.config,
      ...(calib.viewportMargin !== undefined ? { viewportMargin: calib.viewportMargin } : {}),
      ...(calib.viewportMarginH !== undefined ? { viewportMarginH: calib.viewportMarginH } : {}),
      ...(calib.viewportMarginV !== undefined ? { viewportMarginV: calib.viewportMarginV } : {}),
    },
  }
}

/* ─── resolveMapUI ──────────────────────────────────────────────────────
   Resuelve la UI de un mapa con defaults aplicados.
   Si map.ui no está definido, retorna defaults sensatos. */

const DEFAULT_SIDEBAR: MapUISidebarItem[] = []

export function resolveMapUI(map: MapContent): Required<MapUI> & { sidebar: MapUISidebarItem[] } {
  return {
    title: map.ui?.title ?? map.mapId,
    minimap: map.ui?.minimap ?? 'cuenca',
    northIndicator: map.ui?.northIndicator ?? true,
    homeNav: map.ui?.homeNav ?? true,
    sidebar: map.ui?.sidebar ?? DEFAULT_SIDEBAR,
  }
}
