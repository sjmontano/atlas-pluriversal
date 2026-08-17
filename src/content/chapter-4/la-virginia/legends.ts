import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('la-virginia-leyenda-entrada', 'Entrada finca', 'entrada-predio.svg', 10, 'Zonificación'),
  legenda('la-virginia-leyenda-riego', 'Cuerpo de agua - sistema de riego', 'sistema-riego.svg', 20, 'Zonificación'),
  legenda('la-virginia-leyenda-burilico', 'Burilico', 'burilico.svg', 30, 'Zonificación'),
  legenda('la-virginia-leyenda-semillero', 'Semillero', 'semillero.svg', 40, 'Zonificación'),
  legenda('la-virginia-leyenda-cultivos', 'Cultivos diversos', 'cultivo-diverso.svg', 50, 'Zonificación'),
  legenda('la-virginia-leyenda-productivas', 'Productivos especiales', 'cultivo-diverso-2.svg', 60, 'Zonificación'),
  legenda('la-virginia-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 70, 'Zonificación'),
  legenda('la-virginia-leyenda-via', 'Vía', 'trocha.svg', 80, 'Zonificación'),
]
