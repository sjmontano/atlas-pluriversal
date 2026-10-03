import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (laCaicedo, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('la-caicedo-leyenda-01-2-disposiciÃ³n-de-residuo', '2.DisposiciÃ³n de residuos', '/assets/legends/cap4/dispocisionResiduos2.svg', 10, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-02-1-entrada-finca', '1.Entrada finca', '/assets/legends/cap4/entradaPredio.svg', 20, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-03-1-vivienda-y-espacios-as', '1.Vivienda y espacios asociados', '/assets/legends/cap4/viviendaEspaciosAsociados.svg', 30, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-04-4-crÃ­a-de-animales', '4.CrÃ­a de animales', '/assets/legends/cap4/criaAnimales.svg', 40, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-05-5-transformaciÃ³n-product', '5.TransformaciÃ³n productiva', '/assets/legends/cap4/transformacionProductiva.svg', 50, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-06-7-zonas-en-transiciÃ³n', '7.Zonas en transiciÃ³n', '/assets/legends/cap4/zonaTransicion.svg', 60, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-07-9-cultivos-diversos', '9.Cultivos diversos', '/assets/legends/cap4/cultivoDiverso.svg', 70, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-08-delimitaciÃ³n', 'DelimitaciÃ³n', '/assets/legends/cap4/delimitacion.svg', 80, 'ZonificaciÃ³n'),
  legenda('la-caicedo-leyenda-09-vÃ­a', 'VÃ­a', '/assets/legends/cap4/trocha.svg', 90, 'ZonificaciÃ³n'),
]
