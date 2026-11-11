import { cld, defineMap, legendas, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter4-la-caicedo',
  title: 'Finca La Caicedo',
  minimap: 'sur',
  zoomMax: 20,
  tiles: { mode: 'initial-only', source: 'cap4/finca-la-caicedo.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-la-caicedo'),
    sb.ficha('FichasCap4/Finca La Caicedo.pdf'),
    sb.modal('perfil', 'cap4-perfil-la-caicedo'),
    sb.modal('mapa-arbol', 'cap4-arbol-la-caicedo'),
  ],
  geo: { pgw: [0, 3.17488e-7, 3.17511e-7, 0, -76.42831830916282, 3.1837989140567857], width: 6945, height: 12347 },
  base: cld('v1765991292/geoImages/fmyppc7aotckznz2zsah.png'),
  full: cld('v1765994205/geoImages/ssdze3oougoysjid5icz.png'),
  // Leyenda v17 (laCaicedo, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('la-caicedo-leyenda', '/assets/legends/cap4', 'Zonificación', 10, [
    ['01-2-disposición-de-residuo', 'Disposición de residuos', 'dispocisionResiduos2.svg'],
    ['02-1-entrada-finca', 'Entrada finca', 'entradaPredio.svg'],
    ['03-1-vivienda-y-espacios-as', 'Vivienda y espacios asociados', 'viviendaEspaciosAsociados.svg'],
    ['04-4-cría-de-animales', 'Cría de animales', 'criaAnimales.svg'],
    ['05-5-transformación-product', 'Transformación productiva', 'transformacionProductiva.svg'],
    ['06-7-zonas-en-transición', 'Zonas en transición', 'zonaTransicion.svg'],
    ['07-9-cultivos-diversos', 'Cultivos diversos', 'cultivoDiverso.svg'],
    ['08-delimitación', 'Delimitación', 'delimitacion.svg'],
    ['09-vía', 'Vía', 'trocha.svg'],
  ]),
})
