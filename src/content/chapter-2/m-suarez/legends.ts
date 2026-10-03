import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (MSuarez, layerMenu.jsx): puramente informativa, sin ojos.
const S = '/assets/legends/sintesis/suarez'
const V = '/assets/legends/sintesis/villa-rica'
const V2 = '/assets/legends/cap2-valle'

const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
  group: string,
): LegendItem => ({ id, name, icon, order, group })

const G = {
  estructural: 'Lo estructural',
  emblematico: 'Lo emblemático o notable',
  problematico: 'Lo problemático o conflictivo',
  transformador: 'Lo transformador',
  convenciones: 'Convenciones',
} as const

export const LEGENDS: LegendItem[] = [
  legenda('msuarez-consejos', 'Consejos Comunitarios', `${S}/concejoSuarez.svg`, 10, G.estructural),
  legenda('msuarez-cabecera', 'Cabecera de Suárez', `${V}/fincaTradicional.svg`, 20, G.estructural),
  legenda('msuarez-lugares', 'Lugares emblemáticos', `${V}/lugaresEmblematicos.svg`, 30, G.emblematico),
  legenda('msuarez-mineria', 'Minería', `${V}/haciendas.svg`, 40, G.problematico),
  legenda('msuarez-coca', 'Cultivos de Coca (ha)', `${S}/coca.svg`, 50, G.problematico),
  legenda('msuarez-area-influencia', 'Área de influencia de Consejos Comunitarios', `${S}/zonaInfluencia.svg`, 60, G.transformador),
  legenda('msuarez-trayectorias', 'Trayectorias de paz', `${S}/trayectorias.svg`, 70, G.transformador),
  legenda('msuarez-red-hidrica', 'Red hídrica', `${V2}/riosPrincipales.svg`, 80, G.convenciones),
  legenda('msuarez-vias', 'vías', `${V2}/redVial.svg`, 90, G.convenciones),
]
