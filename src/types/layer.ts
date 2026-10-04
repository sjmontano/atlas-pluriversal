import type { PGWData } from '@services/BoundsCalculator'

export type LayerCategory = 'rivers' | 'ecosystems' | 'boundaries' | 'nodes' | 'conflicts' | 'other'

export interface LayerMetadata {
  id: string
  name: string
  slug: string
  category: LayerCategory
  geometryType: string
  featureCount: number
  description: string
}

export type LayerType = 'raster-pgw' | 'raster-tiles' | 'geojson'

export interface LayerBase {
  id: string
  name: string
  category: LayerCategory
  group?: string
  visibleByDefault?: boolean
  opacity?: number
  order: number
  /** Oculta la capa del menú (sigue renderizándose en el mapa).
   *  Para menús puramente informativos estilo v17. Default: false. */
  hideInMenu?: boolean
  /** Si está presente, el click sobre la capa abre este modal del sistema
   *  (mismo patrón que Poi.modalId). Ej: cuencas Tejidos del Agua. */
  modalId?: string
  /** Etiqueta de hover con el nombre (opt-in por mapa: ui.layerTooltips).
   *  Default: true. En false la capa no muestra tooltip. */
  tooltip?: boolean
  legend?: {
    swatch?: string
    /** URL de icono (estilo v17: se muestra plano en la fila). */
    icon?: string
    description?: string
    longText?: string
  }
}

export interface RasterPgwLayer extends LayerBase {
  type: 'raster-pgw'
  image: string
  pgw: PGWData
  width: number
  height: number
}

export interface RasterTilesLayer extends LayerBase {
  type: 'raster-tiles'
  urlTemplate: string
  tileSize: number
  minZoom: number
  maxZoom: number
  fadeDuration?: number
}

export interface GeojsonLayer extends LayerBase {
  type: 'geojson'
  url: string
  geometry: 'fill' | 'line' | 'symbol' | 'circle'
  paint: Record<string, unknown>
}

export type Layer = RasterPgwLayer | RasterTilesLayer | GeojsonLayer

export interface LayerGroup {
  id: string
  name: string
  /** Id del grupo padre. Ausente = macro-grupo top-level. */
  parent?: string
  order: number
  /** Desplegado al abrir el menú. Default: true. */
  expandedByDefault?: boolean
  /** Muestra encabezado (chevron+ojo+nombre). false = render plano:
   *  solo ojo + filas (estilo v17 un-rio-cauca). Default: true. */
  header?: boolean
  /** Muestra el ojo del encabezado (toggle en cascada). false = título
   *  estático (estilo v17 arcilla). Default: true. */
  eye?: boolean
  /** Permite colapsar (chevron). false = siempre expandido.
   *  Default: automático (subgrupos o más de una capa). */
  collapsible?: boolean
  /** Prefija el número de sección (1., 2.3.). Años y títulos como
   *  '1970' no se numeran. Default: true. */
  numbered?: boolean
}

export interface LegendItem {
  id: string
  name: string
  /** Color de swatch (para leyendas de color sólido) */
  swatch?: string
  /** URL de icono SVG (para leyendas con símbolo propio del mapa) */
  icon?: string
  /** Icono plano sin insignia (estilo v17 un-rio-cauca). Default: insignia. */
  bare?: boolean
  group?: string
  order: number
  description?: string
  longText?: string
  /** Tamaño del icono. Default: 'normal'. 'large' = 50% más grande. */
  iconSize?: 'normal' | 'large'
}
