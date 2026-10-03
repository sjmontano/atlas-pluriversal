import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (MOrienteCali, layerMenu.jsx): puramente informativa, sin ojos.
const M = '/assets/legends/sintesis/oriente-cali'
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
  litoral: 'Entorno del litoral Pacífico',
  problematico: 'Lo problemático o conflictivo',
  convenciones: 'Convenciones',
} as const

export const LEGENDS: LegendItem[] = [
  legenda('moc-poblaciones', 'Poblaciones del Pacífico colombiano', `${M}/orienteCali.svg`, 10, G.estructural),
  legenda('moc-oriente', 'Oriente de Cali', `${M}/poblacionesValle.svg`, 20, G.estructural),
  legenda('moc-manglares', 'Manglares', `${M}/manglares.svg`, 30, G.estructural),
  legenda('moc-region', 'Región Pacífica', `${M}/regionPacifica.svg`, 40, G.emblematico),
  legenda('moc-palafitos', 'Palafitos', `${M}/palafitos.svg`, 50, G.litoral),
  legenda('moc-palmera', 'Palmera', `${M}/palmeras.svg`, 60, G.litoral),
  legenda('moc-tendederos', 'Tendederos', `${M}/tendederos.svg`, 70, G.litoral),
  legenda('moc-vision', 'Visión extractivista', `${M}/visionExtractivista.svg`, 80, G.problematico),
  legenda('moc-flujos', 'Flujos de migradestierro', `${M}/flujoMigra.svg`, 90, G.problematico),
  legenda('moc-red-hidrica', 'Red hídrica', `${V2}/riosPrincipales.svg`, 100, G.convenciones),
  legenda('moc-vias', 'vías', `${V2}/redVial.svg`, 110, G.convenciones),
  legenda('moc-centros', 'Centros poblados', `${V2}/zonasUrbanas.svg`, 120, G.convenciones),
]
