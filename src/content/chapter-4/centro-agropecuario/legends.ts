import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('centro-agropecuario-leyenda-aljibe', 'Cuerpos de agua - Aljibe', 'aljibe-2.svg', 10, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-hormiga', 'Nido de hormiga arriera', 'nido-hormiga.svg', 20, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-vivienda', 'Vivienda y espacios asociados', 'vivienda-espacios-asociados.svg', 30, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-animales', 'Cría de animales', 'cria-animales.svg', 40, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-bosques', 'Bosques y áreas de conservación', 'bosque-area-extracion.svg', 50, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-transicion', 'Zonas de transición', 'zona-transicion.svg', 60, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-cultivos', 'Cultivos diversos', 'cultivo-diverso.svg', 70, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-productivas', 'Productivas especiales', 'productivas-especiales.svg', 80, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 90, 'Zonificación'),
  legenda('centro-agropecuario-leyenda-trocha', 'Trocha', 'trocha.svg', 100, 'Zonificación'),
]
