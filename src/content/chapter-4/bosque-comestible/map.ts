import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-bosque-comestible',
  title: 'Bosque comestible',
  minimap: 'sur',
  bearing: 0,
  zoomMax: 18,
  tiles: { mode: 'detail', source: 'cap4/bosque-comestible.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-bosque-comestible'),
    sb.ficha('FichasCap4/Bosque comestible.pdf'),
    sb.sintesis('/capitulo/4/chapter4-problematicas'),
  ],
  geo: { pgw: [2.17e-10, -8.75649e-7, -8.75586e-7, -2.17e-10, -76.48242978189349, 3.43619004516839], width: 7015, height: 12472 },
  base: cld('v1765986412/geoImages/yodemiucfhtp0iklk2fi.png'),
  full: cld('v1765989453/geoImages/p9npqvcz4r2f7zziqi6e.webp'),
  // Leyenda v17 (bosqueComestible, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('bosque-comestible-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-botadero-de-colchones-y', 'Botadero de colchones y escombros', 'botaderoColchon.svg'],
    ['02-botadero-de-escombros-y', 'Botadero de escombros y basura', 'botaderoEscombro.svg'],
    ['03-compuerta-de-vertimiento', 'Compuerta de vertimiento de aguas residuales', 'compuertaVertedero.svg'],
    ['04-quema-de-basuras', 'Quema de basuras', 'zonaBasura.svg'],
    ['05-cuerpo-de-agua', 'Cuerpo de agua', 'cuerpoAgua2.svg'],
    ['06-zona-colmatada', 'Zona colmatada', 'zonaColmatada.svg'],
  ]),
})
