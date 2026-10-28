import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (lasMercedes, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('las-mercedes-leyenda-01-1-entrada-a-la-finca', '1.Entrada a la finca', '/assets/legends/cap4/entradaPredio.svg', 10, 'Zonificación'),
  legenda('las-mercedes-leyenda-02-estanque-para-peces-que', 'Estanque para peces que se daÃ±ó', '/assets/legends/cap4/estanque.svg', 20, 'Zonificación'),
  legenda('las-mercedes-leyenda-03-zonas-con-desechos-de-pl', 'Zonas con desechos de plastico y botellas de alcohol', '/assets/legends/cap4/zonaDesecho.svg', 30, 'Zonificación'),
  legenda('las-mercedes-leyenda-04-vivienda-y-espacios-asoc', 'Vivienda y espacios asociados', '/assets/legends/cap4/viviendaEspaciosAsociados.svg', 40, 'Zonificación'),
  legenda('las-mercedes-leyenda-05-crÃ­a-de-animales', 'CrÃ­a de animales', '/assets/legends/cap4/criaAnimales.svg', 50, 'Zonificación'),
  legenda('las-mercedes-leyenda-06-zonas-en-transición', 'Zonas en transición', '/assets/legends/cap4/zonaTransicion.svg', 60, 'Zonificación'),
  legenda('las-mercedes-leyenda-07-cultivos-diversos', 'Cultivos diversos', '/assets/legends/cap4/cultivoDiverso2.svg', 70, 'Zonificación'),
  legenda('las-mercedes-leyenda-08-productivas-especiales', 'Productivas especiales', '/assets/legends/cap4/productivasEspeciales.svg', 80, 'Zonificación'),
  legenda('las-mercedes-leyenda-09-finca-las-mercedes--lÃ­mi', 'Finca Las Mercedes: lÃ­mite', '/assets/legends/cap4/delimitacion.svg', 90, 'Zonificación'),
  legenda('las-mercedes-leyenda-10-trocha', 'Trocha', '/assets/legends/cap4/trocha.svg', 100, 'Zonificación'),
]
