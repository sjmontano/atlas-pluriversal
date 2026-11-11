import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-la-virginia',
  title: 'Finca La Virginia',
  minimap: 'sur',
  zoomMax: 21,
  tiles: { mode: 'initial-only', source: 'cap4/finca-la-virginia.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-la-virginia'),
    sb.ficha('FichasCap4/Finca La Virginia.pdf'),
    sb.modal('perfil', 'cap4-perfil-la-virginia'),
    sb.modal('mapa-arbol', 'cap4-arbol-la-virginia'),
  ],
  geo: { pgw: [0, 2.38227e-7, 2.38244e-7, 0, -76.2901666061832, 3.2244952203163693], width: 7015, height: 12472 },
  base: cld('v1765991292/geoImages/smdehdeaewwwasco6wt5.png'),
  full: cld('v1765993236/geoImages/gikolsdb7i25mvhakxds.png'),
  // Leyenda v17 (laVirginia, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('la-virginia-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-entrada-finca', 'Entrada finca', 'entradaPredio.svg'],
    ['02-cuerpo-de-agua---sistema', 'Cuerpo de agua - sistema de riego', 'sistemaRiego.svg'],
    ['03-burilico', 'Burilico', 'burilico.svg'],
    ['04-semillero', 'Semillero', 'semillero.svg'],
    ['05-cultivos-diversos', 'Cultivos diversos', 'cultivoDiverso.svg'],
    ['06-productivos-especiales', 'Productivos especiales', 'cultivoDiverso2.svg'],
    ['07-delimitación', 'Delimitación', 'delimitacion.svg'],
    ['08-vía', 'Vía', 'trocha.svg'],
  ]),

})
