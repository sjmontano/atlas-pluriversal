import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('el-buhido-leyenda-residuos', '2. Disposición de residuos', 'disposicion-residuos.svg', 10, 'Zonificación'),
  legenda('el-buhido-leyenda-entrada', '1. Entrada', 'entrada-predio.svg', 20, 'Zonificación'),
  legenda('el-buhido-leyenda-vivienda', '1. Vivienda y espacios asociados', 'vivienda-espacios-asociados.svg', 30, 'Zonificación'),
  legenda('el-buhido-leyenda-animales', '4. Cría de animales', 'cria-animales.svg', 40, 'Zonificación'),
  legenda('el-buhido-leyenda-bosques', '6. Bosques y áreas de conservación', 'bosque-area-extracion.svg', 50, 'Zonificación'),
  legenda('el-buhido-leyenda-cultivos', '9. Cultivos diversos', 'cultivo-diverso.svg', 60, 'Zonificación'),
  legenda('el-buhido-leyenda-transicion', '7. Zonas en transición', 'zona-transicion.svg', 70, 'Zonificación'),
  legenda('el-buhido-leyenda-productivas', '10. Productivas especiales', 'productivas-especiales.svg', 80, 'Zonificación'),
  legenda('el-buhido-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 90, 'Zonificación'),
  legenda('el-buhido-leyenda-trocha', 'Trocha', 'trocha.svg', 100, 'Zonificación'),
]
