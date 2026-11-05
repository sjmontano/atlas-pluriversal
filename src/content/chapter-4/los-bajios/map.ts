import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-los-bajios',
  title: 'Finca Los Bajíos',
  minimap: 'valle',
  zoomMax: 21,
  tiles: { mode: 'initial-only', source: 'cap4/finca-los-bajios.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-los-bajios'),
    sb.ficha('FichasCap4/Finca Los Bajios.pdf'),
    sb.modal('perfil', 'cap4-perfil-los-bajios'),
    sb.modal('mapa-arbol', 'cap4-arbol-los-bajios'),
  ],
  geo: { pgw: [0, 1.98448e-7, 1.98462e-7, 0, -76.4406963166678, 3.191896067095853], width: 7015, height: 12472 },
  base: cld('v1765991292/geoImages/xrssyymmhamqorcf5gb0.png'),
  full: cld('v1765991261/geoImages/o0jnbtkeiddi6ielq1ow.png'),
  // Leyenda v17 (losBajios, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('los-bajios-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-cuerpos-de-agua---aljibe', 'Cuerpos de agua - Aljibe', 'aljibe.svg'],
    ['02-huerta', 'Huerta', 'huertas.svg'],
    ['03-construcción', 'Construcción', 'construccion.svg'],
    ['04-cultivos-diversos', 'Cultivos diversos', 'cultivoDiverso.svg'],
    ['05-delimitación', 'Delimitación', 'delimitacion.svg'],
    ['06-trocha', 'Trocha', 'trocha.svg'],
  ]),
})
