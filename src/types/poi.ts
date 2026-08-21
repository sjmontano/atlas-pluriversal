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
  variant?: PoiVariant
  /** Color de la flecha (variante arrow). Default: #03103a */
  arrowColor?: string
}
