import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (laVirginia, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('la-virginia-leyenda-01-entrada-finca', 'Entrada finca', '/assets/legends/cap4/entradaPredio.svg', 10, 'ZonificaciÃ³n'),
  legenda('la-virginia-leyenda-02-cuerpo-de-agua---sistema', 'Cuerpo de agua - sistema de riego', '/assets/legends/cap4/sistemaRiego.svg', 20, 'ZonificaciÃ³n'),
  legenda('la-virginia-leyenda-03-burilico', 'Burilico', '/assets/legends/cap4/burilico.svg', 30, 'ZonificaciÃ³n'),
  legenda('la-virginia-leyenda-04-semillero', 'Semillero', '/assets/legends/cap4/semillero.svg', 40, 'ZonificaciÃ³n'),
  legenda('la-virginia-leyenda-05-cultivos-diversos', 'Cultivos diversos', '/assets/legends/cap4/cultivoDiverso.svg', 50, 'ZonificaciÃ³n'),
  legenda('la-virginia-leyenda-06-productivos-especiales', 'Productivos especiales', '/assets/legends/cap4/cultivoDiverso2.svg', 60, 'ZonificaciÃ³n'),
  legenda('la-virginia-leyenda-07-delimitaciÃ³n', 'DelimitaciÃ³n', '/assets/legends/cap4/delimitacion.svg', 70, 'ZonificaciÃ³n'),
  legenda('la-virginia-leyenda-08-vÃ­a', 'VÃ­a', '/assets/legends/cap4/trocha.svg', 80, '1.Vestigios de Casa'),
]
