import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (elPaso, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('el-paso-leyenda-01-charco-de-baÃ±o', 'Charco de baÃ±o', '/assets/legends/cap4/charcoBaÃ±o.svg', 10, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-02-zocavones-de-oro', 'Zocavones de oro', '/assets/legends/cap4/zocabonOro.svg', 20, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-03-entradas-al-predio', 'Entradas al predio', '/assets/legends/cap4/entradaPredio.svg', 30, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-04-extracciÃ³n-de-oro-aluviÃ³', 'ExtracciÃ³n de oro AluviÃ³n', '/assets/legends/cap4/extraccionOro.svg', 40, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-05-6-bosques-y-Ã¡reas-de-con', '6.bosques y Ã¡reas de conservaciÃ³n', '/assets/legends/cap4/bosqueAreaExtracion.svg', 50, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-06-zonas-en-transiciÃ³n', 'Zonas en transiciÃ³n', '/assets/legends/cap4/zonaTransicion.svg', 60, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-07-8-pastoreo', '8.Pastoreo', '/assets/legends/cap4/pastoreo.svg', 70, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-08-mineria', 'Mineria', '/assets/legends/cap4/mineria.svg', 80, 'ZonificaciÃ³n'),
  legenda('el-paso-leyenda-09-cuerpos-de-agua', 'Cuerpos de agua', '/assets/legends/cap4/cuerposAgua.svg', 90, 'ZonificaciÃ³n'),
]
