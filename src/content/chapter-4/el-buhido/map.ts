import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-el-buhido',
  title: 'Finca El Buhido',
  minimap: 'sur',
  zoomMax: 20,
  tiles: { mode: 'initial-only', source: 'cap4/finca-el-buhido.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-el-buhido'),
    sb.ficha('FichasCap4/Finca El Buhido.pdf'),
    sb.modal('perfil', 'cap4-perfil-el-buhido'),
    sb.modal('mapa-arbol', 'cap4-arbol-el-buhido'),
  ],
  geo: { pgw: [0, 0.000000316606, 0.000000316628, 0, -76.683480669945, 2.941142661121], width: 7015, height: 12472 },
  base: cld('v1765986412/geoImages/l5qj5qxh5onul1b26e71.png'),
  full: cld('v1765988704/geoImages/p9hryf14z42ilaw0iiez.png'),
  // Leyenda v17 (elBuhido, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('el-buhido-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-2-disposición-de-residuo', 'Disposición de residuos', 'disposicionResiduos.svg'],
    ['02-1-entrada', 'Entrada', 'entradaPredio.svg'],
    ['03-1-vivienda-y-espacios-as', 'Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg'],
    ['04-4-cría-de-animales', 'Cría de animales', 'criaAnimales.svg'],
    ['05-6-bosques-y-áreas-de-con', 'Bosques y áreas de conservación', 'bosqueAreaExtracion.svg'],
    ['06-9-cultivos-diversos', 'Cultivos diversos', 'cultivoDiverso.svg'],
    ['07-7-zonas-en-transición', 'Zonas en transición', 'zonaTransicion.svg'],
    ['08-10-productivas-especiale', 'Productivas especiales', 'productivasEspeciales.svg'],
    ['09-delimitación', 'Delimitación', 'delimitacion.svg'],
    ['10-trocha', 'Trocha', 'trocha.svg'],
  ]),
})
