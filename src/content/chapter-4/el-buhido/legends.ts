import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (elBuhido, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('el-buhido-leyenda-01-2-disposiciÃ³n-de-residuo', '2.DisposiciÃ³n de residuos', '/assets/legends/cap4/disposicionResiduos.svg', 10, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-02-1-entrada', '1.Entrada', '/assets/legends/cap4/entradaPredio.svg', 20, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-03-1-vivienda-y-espacios-as', '1.Vivienda y espacios asociados', '/assets/legends/cap4/viviendaEspaciosAsociados.svg', 30, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-04-4-crÃ­a-de-animales', '4.CrÃ­a de animales', '/assets/legends/cap4/criaAnimales.svg', 40, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-05-6-bosques-y-Ã¡reas-de-con', '6.bosques y Ã¡reas de conservaciÃ³n', '/assets/legends/cap4/bosqueAreaExtracion.svg', 50, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-06-9-cultivos-diversos', '9.Cultivos diversos', '/assets/legends/cap4/cultivoDiverso.svg', 60, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-07-7-zonas-en-transiciÃ³n', '7.Zonas en transiciÃ³n', '/assets/legends/cap4/zonaTransicion.svg', 70, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-08-10-productivas-especiale', '10.Productivas especiales', '/assets/legends/cap4/productivasEspeciales.svg', 80, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-09-delimitaciÃ³n', 'DelimitaciÃ³n', '/assets/legends/cap4/delimitacion.svg', 90, 'ZonificaciÃ³n'),
  legenda('el-buhido-leyenda-10-trocha', 'Trocha', '/assets/legends/cap4/trocha.svg', 100, 'ZonificaciÃ³n'),
]
