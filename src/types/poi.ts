export type PoiVariant = 'number' | 'icon' | 'arrow'

export interface Poi {
  id: string
  numero?: number
  name: string
  coords: [number, number]
  capa?: string
  popup: {
    title: string
    body?: string
    image?: string
    audio?: string
  }
  angle?: number
  icon?: string
  size?: 'normal' | 'large'
  /** Si existe, el clic abre el modal del sistema de modales (por id) en
   *  lugar del popup ligero (`popup`). Se indexa así el POI al mapa. */
  modalId?: string
  /** Si existe (y no hay `modalId`), el clic navega URL-first al mapa
   *  indicado (port del `onMapChange(index+1)` de v17 en los intros de
   *  cap 2 y cap 4). Tiene prioridad sobre el popup ligero. */
  targetMapId?: string
  variant?: PoiVariant
  /** Color de la flecha (variante arrow). Default: #03103a */
  arrowColor?: string
}
