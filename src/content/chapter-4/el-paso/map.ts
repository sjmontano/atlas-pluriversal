import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-el-paso',
  title: 'Finca El Paso',
  minimap: 'villa-rica',
  zoomMax: 20,
  tiles: { mode: 'initial-only', source: 'cap4/finca-el-paso.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-el-paso'),
    sb.ficha('FichasCap4/Finca el Paso.pdf'),
    sb.modal('perfil', 'cap4-perfil-el-paso'),
    sb.modal('mapa-arbol', 'cap4-arbol-el-paso'),
  ],
  geo: { pgw: [0, 4.90819e-7, 4.90854e-7, 0, -76.67269057988042, 2.953934089665147], width: 7366, height: 13096 },
  base: cld('v1765991292/geoImages/gqczkzh18jqhgatzwiht.png'),
  full: cld('v1765992022/geoImages/tljpufqwb78r7nkqt27y.png'),
  // Leyenda v17 (elPaso, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('el-paso-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-charco-de-baño', 'Charco de baño', 'charcoBaño.svg'],
    ['02-zocavones-de-oro', 'Zocavones de oro', 'zocabonOro.svg'],
    ['03-entradas-al-predio', 'Entradas al predio', 'entradaPredio.svg'],
    ['04-extracción-de-oro-aluvió', 'Extracción de oro Aluvión', 'extraccionOro.svg'],
    ['05-6-bosques-y-áreas-de-con', '6.bosques y áreas de conservación', 'bosqueAreaExtracion.svg'],
    ['06-zonas-en-transición', 'Zonas en transición', 'zonaTransicion.svg'],
    ['07-8-pastoreo', '8.Pastoreo', 'pastoreo.svg'],
    ['08-mineria', 'Mineria', 'mineria.svg'],
    ['09-cuerpos-de-agua', 'Cuerpos de agua', 'cuerposAgua.svg'],
  ]),
})
