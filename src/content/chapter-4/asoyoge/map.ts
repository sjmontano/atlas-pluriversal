import { cld, defineMap, legendas, sb } from '../../kit.ts'

const base = cld('v1765986412/geoImages/u2dqe5dcdqzn1am0whlj.png')

export default defineMap({
  id: 'chapter4-asoyoge',
  title: 'Centro agropecuario ASOYOGE',
  minimap: 'sur',
  zoomMax: 21,
  tiles: { mode: 'initial-only', source: 'cap4/asoyoge.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-asoyoge'),
    sb.ficha('FichasCap4/Centro agropecuario ASOYOGE.pdf'),
    sb.modal('perfil', 'cap4-perfil-asoyoge'),
  ],
  geo: { pgw: [0, 5.06536e-7, 5.06572e-7, 0, -76.68490913590671, 2.9357762363425706], width: 3578, height: 6361 },
  base,
  full: base,
  // Leyenda v17 (asoyoge, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('asoyoge-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-1-vivienda-y-espacios-as', '1.Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg'],
    ['02-5-transformación-product', '5.Transformación productiva', 'transformacionProductiva.svg'],
    ['03-delimitación', 'Delimitación', 'delimitacion.svg'],
    ['04-trocha', 'Trocha', 'trocha.svg'],
  ]),
})
