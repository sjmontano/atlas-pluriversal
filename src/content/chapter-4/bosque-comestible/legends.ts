import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('bosque-comestible-leyenda-botadero-colchones', 'Botadero de colchones y escombros', 'botadero-colchon.svg', 10, 'Zonificación'),
  legenda('bosque-comestible-leyenda-botadero-escombros', 'Botadero de escombros y basura', 'botadero-escombro.svg', 20, 'Zonificación'),
  legenda('bosque-comestible-leyenda-vertedero', 'Compuerta de vertimiento de aguas residuales', 'compuerta-vertedero.svg', 30, 'Zonificación'),
  legenda('bosque-comestible-leyenda-quema', 'Quema de basuras', 'zona-basura.svg', 40, 'Zonificación'),
  legenda('bosque-comestible-leyenda-cuerpo-agua', 'Cuerpo de agua', 'cuerpo-agua-2.svg', 50, 'Zonificación'),
  legenda('bosque-comestible-leyenda-colmatada', 'Zona colmatada', 'zona-colmatada.svg', 60, 'Zonificación'),
]
