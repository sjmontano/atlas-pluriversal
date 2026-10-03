import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (problematicas, layerMenu.jsx): puramente informativa, sin ojos.
const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
  group?: string,
): LegendItem => ({
  id,
  name,
  icon,
  order,
  ...(group === undefined ? {} : { group }),
})

export const LEGENDS: LegendItem[] = [

  legenda('problematicas-leyenda-01-Ã¡reas-urbanas-nuevas', 'Ãreas urbanas nuevas', '/assets/legends/cap4/areaUrbanaNueva.svg', 10, 'Problematicas'),
  legenda('problematicas-leyenda-02-disposiciÃ³n-de-residuos', 'DisposiciÃ³n de residuos y escombros', '/assets/legends/cap4/disposicionResiduos.svg', 20, 'Problematicas'),
  legenda('problematicas-leyenda-03-ocupaciÃ³n-de-las-franjas', 'OcupaciÃ³n de las franjas de protecciÃ³n del humedal', '/assets/legends/cap4/ocupacionFranjas.svg', 30, 'Problematicas'),
  legenda('problematicas-leyenda-04-verimiento-de-aguas-resi', 'Verimiento de aguas residuales', '/assets/legends/cap4/palenke.svg', 40, 'Problematicas'),
  legenda('problematicas-leyenda-05-canales', 'Canales', '/assets/legends/cap4/Canales.svg', 50, 'Agua'),
  legenda('problematicas-leyenda-06-humedales-y-actualidad', 'Humedales y actualidad', '/assets/legends/cap4/aljibe.svg', 60, 'Agua'),
  legenda('problematicas-leyenda-07-humedales--pot-2000-2014', 'Humedales  POT 2000-2014', '/assets/legends/cap4/humedalesPot.svg', 70, 'Agua'),
  legenda('problematicas-leyenda-08-Ã¡rea-urbana-2022', 'Ãrea urbana 2022', '/assets/legends/cap4/areaUrbana.svg', 80, 'Elementos'),
  legenda('problematicas-leyenda-09-zonas-verdes-2014', 'Zonas verdes 2014', '/assets/legends/cap4/zonaVerdes2014.svg', 90, 'Elementos'),
]
