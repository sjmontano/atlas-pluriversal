/** Variante de minimapa de ubicación (esquina superior derecha). */
export type MiniMapKey = 'cuenca' | 'valle' | 'sur' | 'suarez' | 'villa-rica' | 'cali'

export interface ChapterMapRef {
  /** Mapa desde el que se entra: define su URL anidada y el botón de regreso. */
  parent?: string
  mapId: string
  title: string
  /** Minimapa de este mapa. Default: 'cuenca'. */
  minimap?: MiniMapKey
}

export interface Chapter {
  id: number
  /** Numeral romano del capítulo (I–IV) para ChapterTabs. */
  roman: string
  title: string
  description: string
  maps: ChapterMapRef[]
  territories?: string[]
  /** Imagen que se muestra en el hover del tab del capítulo. */
  hoverImage?: string
}
