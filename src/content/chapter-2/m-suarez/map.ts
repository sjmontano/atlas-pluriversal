import { defineMap, legendas, sb } from '../../kit.ts'
import { nodeLayer } from '../shared.ts'

// Imagen local (no Cloudinary): no usar cld().
const base = '/assets/maps/cap2/modelo-territorial-suarez.png'

// Leyenda v17 (MSuarez, layerMenu.jsx): puramente informativa, sin ojos.
const S = '/assets/legends/sintesis/suarez'
const V = '/assets/legends/sintesis/villa-rica'
const V2 = '/assets/legends/cap2-valle'

export default defineMap({
  id: 'chapter2-m-suarez',
  title: 'Síntesis territorial de Suárez',
  minimap: 'suarez',
  zoomMax: 12,
  bearing: 180,
  tiles: { mode: 'detail', source: 'cap2/modelo-territorial-suarez.png' },
  sidebar: [
    sb.presentacion('cap2-sintesis-suarez'),
    sb.ficha('FichasCap2/Modelo territorial de Suarez.pdf'),
    sb.descarga('MapasCap2/Modelo territorial de Suarez.pdf'),
  ],
  geo: { pgw: [0, -0.000079124151, -0.000079131596, 0, -76.32673887696231, 3.119152348416211], width: 9448, height: 5314 },
  base,
  full: base,
  layers: [nodeLayer('nodo-suarez', 'Nodo Suárez', '/data/nodos/suarez.geojson', '#ffaf25')],
  legends: [
    ...legendas('msuarez', '', 'Lo estructural', 10, [
      ['consejos', 'Consejos Comunitarios', `${S}/concejoSuarez.svg`],
      ['cabecera', 'Cabecera de Suárez', `${V}/fincaTradicional.svg`],
    ]),
    ...legendas('msuarez', '', 'Lo emblemático o notable', 30, [
      ['lugares', 'Lugares emblemáticos', `${V}/lugaresEmblematicos.svg`],
    ]),
    ...legendas('msuarez', '', 'Lo problemático o conflictivo', 40, [
      ['mineria', 'Minería', `${V}/haciendas.svg`],
      { id: 'coca', name: 'Cultivos de Coca (ha)', icon: `${S}/coca.svg`, iconSize: 'large' },
    ]),
    ...legendas('msuarez', '', 'Lo transformador', 60, [
      ['area-influencia', 'Área de influencia de Consejos Comunitarios', `${S}/zonaInfluencia.svg`],
      ['trayectorias', 'Trayectorias de paz', `${S}/trayectorias.svg`],
    ]),
    ...legendas('msuarez', '', 'Convenciones', 80, [
      ['red-hidrica', 'Red hídrica', `${V2}/riosPrincipales.svg`],
      ['vias', 'vías', `${V2}/redVial.svg`],
    ]),
  ],
})
