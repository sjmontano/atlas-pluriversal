import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (bosqueComestible, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('bosque-comestible-leyenda-01-botadero-de-colchones-y', 'Botadero de colchones y escombros', '/assets/legends/cap4/botaderoColchon.svg', 10, 'ZonificaciÃ³n'),
  legenda('bosque-comestible-leyenda-02-botadero-de-escombros-y', 'Botadero de escombros y basura', '/assets/legends/cap4/botaderoEscombro.svg', 20, 'ZonificaciÃ³n'),
  legenda('bosque-comestible-leyenda-03-compuerta-de-vertimiento', 'Compuerta de vertimiento de aguas residuales', '/assets/legends/cap4/compuertaVertedero.svg', 30, 'ZonificaciÃ³n'),
  legenda('bosque-comestible-leyenda-04-quema-de-basuras', 'Quema de basuras', '/assets/legends/cap4/zonaBasura.svg', 40, 'ZonificaciÃ³n'),
  legenda('bosque-comestible-leyenda-05-cuerpo-de-agua', 'Cuerpo de agua', '/assets/legends/cap4/cuerpoAgua2.svg', 50, 'ZonificaciÃ³n'),
  legenda('bosque-comestible-leyenda-06-zona-colmatada', 'Zona colmatada', '/assets/legends/cap4/zonaColmatada.svg', 60, 'ZonificaciÃ³n'),
]
