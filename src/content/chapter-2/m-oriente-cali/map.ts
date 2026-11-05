import { cld, defineMap, legendas, sb } from '../../kit.ts'
import { nodeLayer } from '../shared.ts'

// Leyenda v17 (MOrienteCali, layerMenu.jsx): puramente informativa, sin ojos.
const M = '/assets/legends/sintesis/oriente-cali'
const V2 = '/assets/legends/cap2-valle'

export default defineMap({
  id: 'chapter2-m-oriente-cali',
  title: 'Síntesis territorial del Oriente de Cali',
  minimap: 'cali', ui: { chapterTabs: false },
  zoomMax: 10,
  tiles: { mode: 'detail', source: 'cap2/modelo-territorial-oriente-cali.png' },
  sidebar: [
    sb.presentacion('cap2-sintesis-cali'),
    sb.ficha('FichasCap2/Modelo territorial Cali y Pacifico.pdf'),
    sb.descarga('MapasCap2/Modelo territorial de Oriente de Cali y Pacifico.pdf'),
  ],
  geo: { pgw: [0, 0.000600802103, 0.000600804878, 0, -79.19033199235821, 1.5356283868726415], width: 5138, height: 9037 },
  base: cld('v1762486120/geoImages/jnqo25dhvenvrseezvlt.webp'),
  full: cld('v1762485986/geoImages/xa15iigitokhfyvek9s5.webp'),
  layers: [nodeLayer('nodo-oriente-cali', 'Nodo Oriente de Cali', '/data/nodos/oriente-cali.geojson', '#81c640')],
  legends: [
    ...legendas('moc', '', 'Lo estructural', 10, [
      ['poblaciones', 'Poblaciones del Pacífico colombiano', `${M}/orienteCali.svg`],
      ['oriente', 'Oriente de Cali', `${M}/poblacionesValle.svg`],
      ['manglares', 'Manglares', `${M}/manglares.svg`],
    ]),
    ...legendas('moc', '', 'Lo emblemático o notable', 40, [
      ['region', 'Región Pacífica', `${M}/regionPacifica.svg`],
    ]),
    ...legendas('moc', '', 'Entorno del litoral Pacífico', 50, [
      ['palafitos', 'Palafitos', `${M}/palafitos.svg`],
      ['palmera', 'Palmera', `${M}/palmeras.svg`],
      ['tendederos', 'Tendederos', `${M}/tendederos.svg`],
    ]),
    ...legendas('moc', '', 'Lo problemático o conflictivo', 80, [
      ['vision', 'Visión extractivista', `${M}/visionExtractivista.svg`],
      ['flujos', 'Flujos de migradestierro', `${M}/flujoMigra.svg`],
    ]),
    ...legendas('moc', '', 'Convenciones', 100, [
      ['red-hidrica', 'Red hídrica', `${V2}/riosPrincipales.svg`],
      ['vias', 'vías', `${V2}/redVial.svg`],
      ['centros', 'Centros poblados', `${V2}/zonasUrbanas.svg`],
    ]),
  ],
  pois: [
    {
      id: 'poi-m-oriente-cali-sintesis',
      name: 'Síntesis Cali',
      coords: [-76.484254, 3.386929],
      capa: '',
      variant: 'icon',
      modalId: 'cap2-sintesis-cali-imagen',
      popup: { title: 'Síntesis territorial Oriente de Cali' },
    },
  ],
})
