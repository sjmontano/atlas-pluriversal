import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (centroAgropecuario, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('centro-agropecuario-leyenda-01-cuerpos-de-agua---aljibe', 'Cuerpos de agua - Aljibe', '/assets/legends/cap4/aljibe2.svg', 10, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-02-nido-de-hormiga-arriera', 'Nido de hormiga arriera', '/assets/legends/cap4/nidoHormiga.svg', 20, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-03-vivienda-y-espacios-asoc', 'Vivienda y espacios asociados', '/assets/legends/cap4/viviendaEspaciosAsociados.svg', 30, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-04-crÃ­a-de-animales', 'CrÃ­a de animales', '/assets/legends/cap4/criaAnimales.svg', 40, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-05-bosques-y-Ã¡reas-de-conse', 'Bosques y Ã¡reas de conservaciÃ³n', '/assets/legends/cap4/bosqueAreaExtracion.svg', 50, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-06-zonas-de-transiciÃ³n', 'Zonas de transiciÃ³n', '/assets/legends/cap4/zonaTransicion.svg', 60, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-07-cultivos-diversos', 'Cultivos diversos', '/assets/legends/cap4/cultivoDiverso.svg', 70, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-08-productivas-especiales', 'Productivas especiales', '/assets/legends/cap4/productivasEspeciales.svg', 80, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-09-delimitaciÃ³n', 'DelimitaciÃ³n', '/assets/legends/cap4/delimitacion.svg', 90, 'ZonificaciÃ³n'),
  legenda('centro-agropecuario-leyenda-10-trocha', 'Trocha', '/assets/legends/cap4/trocha.svg', 100, 'ZonificaciÃ³n'),
]
