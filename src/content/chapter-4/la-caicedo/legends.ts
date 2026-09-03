import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('la-caicedo-leyenda-residuos', '2. Disposición de residuos', 'disposicion-residuos-2.svg', 10, 'Zonificación'),
  legenda('la-caicedo-leyenda-entrada', '1. Entrada finca', 'entrada-predio.svg', 20, 'Zonificación'),
  legenda('la-caicedo-leyenda-vivienda', '1. Vivienda y espacios asociados', 'vivienda-espacios-asociados.svg', 30, 'Zonificación'),
  legenda('la-caicedo-leyenda-animales', '4. Cría de animales', 'cria-animales.svg', 40, 'Zonificación'),
  legenda('la-caicedo-leyenda-transformacion', '5. Transformación productiva', 'transformacion-productiva.svg', 50, 'Zonificación'),
  legenda('la-caicedo-leyenda-transicion', '7. Zonas en transición', 'zona-transicion.svg', 60, 'Zonificación'),
  legenda('la-caicedo-leyenda-cultivos', '9. Cultivos diversos', 'cultivo-diverso.svg', 70, 'Zonificación'),
  legenda('la-caicedo-leyenda-delimitacion', 'Delimitación', 'delimitacion.svg', 80, 'Zonificación'),
  legenda('la-caicedo-leyenda-via', 'Vía', 'trocha.svg', 90, 'Zonificación'),
]
