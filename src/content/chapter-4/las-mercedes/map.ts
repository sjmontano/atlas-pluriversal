import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-las-mercedes',
  title: 'Finca Las Mercedes',
  minimap: 'sur',
  zoomMax: 21,
  tiles: { mode: 'initial-only', source: 'cap4/finca-las-mercedes.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-las-mercedes'),
    sb.ficha('FichasCap4/Finca Las Mercedes.pdf'),
    sb.modal('perfil', 'cap4-perfil-las-mercedes'),
    sb.modal('mapa-arbol', 'cap4-arbol-las-mercedes'),
  ],
  geo: { pgw: [0, 2.37423e-7, 2.3744e-7, 0, -76.68619953199119, 2.930137907002091], width: 7015, height: 12472 },
  base: cld('v1765991292/geoImages/uda3sxgw61nf5tt6mtfp.png'),
  full: cld('v1765992502/geoImages/xndkrm7tpgdbw881co0v.png'),
  // Leyenda v17 (lasMercedes, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('las-mercedes-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-1-entrada-a-la-finca', 'Entrada a la finca', 'entradaPredio.svg'],
    ['02-estanque-para-peces-que', 'Estanque para peces que se dañó', 'estanque.svg'],
    ['03-zonas-con-desechos-de-pl', 'Zonas con desechos de plastico y botellas de alcohol', 'zonaDesecho.svg'],
    ['04-vivienda-y-espacios-asoc', 'Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg'],
    ['05-cría-de-animales', 'Cría de animales', 'criaAnimales.svg'],
    ['06-zonas-en-transición', 'Zonas en transición', 'zonaTransicion.svg'],
    ['07-cultivos-diversos', 'Cultivos diversos', 'cultivoDiverso2.svg'],
    ['08-productivas-especiales', 'Productivas especiales', 'productivasEspeciales.svg'],
    ['09-finca-las-mercedes--lími', 'Finca Las Mercedes: límite', 'delimitacion.svg'],
    ['10-trocha', 'Trocha', 'trocha.svg'],
  ]),
  
  
})
