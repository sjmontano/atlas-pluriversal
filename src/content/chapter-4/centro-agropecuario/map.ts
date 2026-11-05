import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-centro-agropecuario',
  title: 'Centro agropecuario',
  minimap: 'sur',
  zoomMax: 20,
  tiles: { mode: 'initial-only', source: 'cap4/centro-agropecuario.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-centro-agropecuario'),
    sb.ficha('FichasCap4/Centro agropecuario.pdf'),
    sb.modal('perfil', 'cap4-perfil-centro-agropecuario'),
    sb.modal('mapa-arbol', 'cap4-arbol-centro-agropecuario'),
  ],
  geo: { pgw: [0, 5.15928e-7, 5.15965e-7, 0, -76.43109465694656, 3.183850151162395], width: 6904, height: 12163 },
  base: cld('v1765991292/geoImages/drkxyppqvzpngqura5qg.png'),
  full: cld('v1765993765/geoImages/gecszuuozkmhyng5w6y7.png'),
  // Leyenda v17 (centroAgropecuario, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('centro-agropecuario-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-cuerpos-de-agua---aljibe', 'Cuerpos de agua - Aljibe', 'aljibe2.svg'],
    ['02-nido-de-hormiga-arriera', 'Nido de hormiga arriera', 'nidoHormiga.svg'],
    ['03-vivienda-y-espacios-asoc', 'Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg'],
    ['04-cría-de-animales', 'Cría de animales', 'criaAnimales.svg'],
    ['05-bosques-y-áreas-de-conse', 'Bosques y áreas de conservación', 'bosqueAreaExtracion.svg'],
    ['06-zonas-de-transición', 'Zonas de transición', 'zonaTransicion.svg'],
    ['07-cultivos-diversos', 'Cultivos diversos', 'cultivoDiverso.svg'],
    ['08-productivas-especiales', 'Productivas especiales', 'productivasEspeciales.svg'],
    ['09-delimitación', 'Delimitación', 'delimitacion.svg'],
    ['10-trocha', 'Trocha', 'trocha.svg'],
  ]),
})
