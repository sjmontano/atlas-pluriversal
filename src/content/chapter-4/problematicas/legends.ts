import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('problematicas-leyenda-urbanas-nuevas', 'Áreas urbanas nuevas', 'area-urbana-nueva.svg', 10, 'Problemáticas'),
  legenda('problematicas-leyenda-residuos', 'Disposición de residuos y escombros', 'disposicion-residuos.svg', 20, 'Problemáticas'),
  legenda('problematicas-leyenda-ocupacion-franjas', 'Ocupación de las franjas de protección del humedal', 'ocupacion-franjas.svg', 30, 'Problemáticas'),
  legenda('problematicas-leyenda-vertimiento', 'Vertimiento de aguas residuales', 'palenke.svg', 40, 'Problemáticas'),
  legenda('problematicas-leyenda-canales', 'Canales', 'canales.svg', 50, 'Agua'),
  legenda('problematicas-leyenda-humedales-actualidad', 'Humedales y actualidad', 'aljibe.svg', 60, 'Agua'),
  legenda('problematicas-leyenda-humedales-pot', 'Humedales POT 2000-2014', 'humedales-pot.svg', 70, 'Agua'),
  legenda('problematicas-leyenda-area-urbana', 'Área urbana 2022', 'area-urbana.svg', 80, 'Elementos'),
  legenda('problematicas-leyenda-zonas-verdes', 'Zonas verdes 2014', 'zona-verdes-2014.svg', 90, 'Elementos'),
]
