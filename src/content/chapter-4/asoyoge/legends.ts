import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (asoyoge, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('asoyoge-leyenda-01-1-vivienda-y-espacios-as', '1.Vivienda y espacios asociados', '/assets/legends/cap4/viviendaEspaciosAsociados.svg', 10, 'ZonificaciÃ³n'),
  legenda('asoyoge-leyenda-02-5-transformaciÃ³n-product', '5.TransformaciÃ³n productiva', '/assets/legends/cap4/transformacionProductiva.svg', 20, 'ZonificaciÃ³n'),
  legenda('asoyoge-leyenda-03-delimitaciÃ³n', 'DelimitaciÃ³n', '/assets/legends/cap4/delimitacion.svg', 30, 'ZonificaciÃ³n'),
  legenda('asoyoge-leyenda-04-trocha', 'Trocha', '/assets/legends/cap4/trocha.svg', 40, 'ZonificaciÃ³n'),
]
