import type { PGWData } from '@services/BoundsCalculator'
import type { MiniMapKey } from './chapter'
import type { Layer, LayerGroup, LegendItem } from './layer'
import type { Poi } from './poi'

export type { Layer, LayerGroup, LegendItem } from './layer'
export type { Poi } from './poi'

export type TileDeliveryProfile = 'standard' | 'hd'

export interface MapGeoEntry {
  /** PGW formato rotado [A, D, B, E, C, F] con A=0, E=0 */
  readonly pgw: PGWData
  readonly width: number
  readonly height: number
}

export interface MapImageUrls {
  base: string
  full?: string
  placeholder: string
}

export interface MapConfig {
  initialBearing: number
  useTransformConstrain: boolean
  viewportMaxBounds: null | { west: number; south: number; east: number; north: number }
  /** Margen del viewportMaxBounds alrededor de la imagen (fracción por lado). Default: 0.5 */
  viewportMargin?: number
  /** Margen horizontal (izq/der) por lado. Si existe, sobrescribe viewportMargin en el eje H. */
  viewportMarginH?: number
  /** Margen vertical (arriba/abajo) por lado. Si existe, sobrescribe viewportMargin en el eje V. */
  viewportMarginV?: number
  dragPan: boolean
  scrollZoom: boolean
  /** Máximo z hasta el que se generan tiles (manual, por mapa). Si se omite,
   *  se usa el techo automático de detalle del tileset. La cámara puede hacer
   *  zoom más allá (overzoom: los tiles del último nivel se escalan). */
  zoomMax?: number
  /** Omite la imagen atlas en runtime y usa únicamente la capa XYZ. */
  useImageBase?: boolean
  /** Carga opcionalmente la imagen full como fallback/debug. */
  loadFullImage?: boolean
}

export interface MapTilesConfig {
  urlTemplate: string
  urlTemplateStandard?: string
  urlTemplateHd?: string
  tileSize: number
  minZoom: number
  maxZoom: number
  fadeDuration?: number
  /** Fuente local usada únicamente por el generador offline. */
  source?: string
  /** Preview local rápida usada como imagen base debajo de los tiles. */
  preview?: string
  /** Rotación física de la fuente antes de georreferenciarla. */
  sourceRotate?: 'auto' | 'cw' | 'ccw'
  /** Resolución física opcional por nivel; tileSize sigue siendo lógico. */
  tilePixelSizeByZoom?: Record<number, number>
  /** Resolución física por perfil y nivel; tileSize sigue siendo lógico. */
  tilePixelSizeByProfile?: Partial<Record<TileDeliveryProfile, Record<number, number>>>
}

/* ─── UI config por mapa ─────────────────────────────────────────────── */

export interface MapUISidebarItem {
  /** ID único del item. */
  id: string
  /** Tipo de acción. */
  type: 'modal' | 'link' | 'goto'
  /** Nombre del glyph (components/modal/Glyph.tsx). */
  icon: string
  /** Label del botón (aparece en hover). */
  label: string
  /** Frame visual (1-4). Default: '1'. */
  frame?: string
  /** Para type='modal': ID del modal en el registro global. */
  target?: string
  /** Para type='link': URL externa. */
  href?: string
  /** Para type='goto': ruta interna. */
  to?: string
  /** Habilitar/deshabilitar item. Default: true. */
  enabled?: boolean
}

export interface MapUI {
  /** Título del mapa (aparece en SectionHeader). */
  title: string
  /** Variante de minimapa. Default: 'cuenca'. Si se omite, no se muestra. */
  minimap?: MiniMapKey
  /** Mostrar indicador de norte. Default: true. */
  northIndicator?: boolean
  /** Mostrar botón HomeNav. Default: true. */
  homeNav?: boolean
  /** Botones del sidebar (ToolRail). Si se omite, sidebar vacío. */
  sidebar?: MapUISidebarItem[]
}

export interface MapContent {
  mapId: string
  /** Configuración UI del mapa (título, sidebar, minimapa, etc.). */
  ui?: MapUI
  geo: MapGeoEntry
  images: MapImageUrls
  config: MapConfig
  tiles?: MapTilesConfig | null
  layers?: Layer[]
  groups?: LayerGroup[]
  legends?: LegendItem[]
  pois?: Poi[]
  /** Encuadres navegables (rectángulos clickeables que llevan a otro mapa). */
  encuadres?: Encuadre[]
}

/** Encuadre navegable: polígono opcional + etiqueta clickeable que lleva
 *  a otro mapa del atlas (port data-driven del flujo de v17). */
export interface Encuadre {
  id: string
  name: string
  /** Mapa destino (navegación URL-first: /capitulo/:n/:mapId). */
  targetMapId: string
  /** Posición de la etiqueta [lng, lat]. */
  labelCoords: [number, number]
  /** GeoJSON del polígono (archivo estático en /assets/geojson). */
  url?: string
  /** Color del polígono/borde. Default: #5577af (como v17). */
  color?: string
}
