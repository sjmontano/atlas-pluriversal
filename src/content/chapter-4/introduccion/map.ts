import type { Poi } from '../../../types/poi'
import { cld, defineMap, legendas, sb } from '../../kit.ts'

const POPUP_NODE = '/assets/pois/markers/popup-node.svg'
const ARROW_COLOR = '#3D80A5'

const nodo = (id: string, name: string, capa: string, coords: [number, number], angle: number, targetMapId: string): Poi => ({
  id,
  name,
  coords,
  capa,
  variant: 'arrow',
  icon: POPUP_NODE,
  arrowColor: ARROW_COLOR,
  angle,
  popup: { title: name },
  /* v17 (agregarToponimos.jsx: el primer toponimo es "Nodo Suárez" →
   * onMapChange(index+1)): en el intro el clic navega al mapa de la
   * finca en vez de abrir modal. Orden 1:1 con chapters.ts. */
  targetMapId,
})

const POIS: Poi[] = [
  nodo('poi-cap4-intro-asoyoge', 'ASOYOGE', 'Nodo Suárez', [-76.710153, 2.948455], 5, 'chapter4-asoyoge'),
  nodo('poi-cap4-intro-el-buhido', 'Finca El Buhido', 'Nodo Suárez', [-76.708394, 2.96013], 70, 'chapter4-el-buhido'),
  nodo('poi-cap4-intro-bosque-comestible', 'Bosque comestible del oriente de Cali', 'Nodo Oriente de Cali', [-76.575406, 3.467092], 0, 'chapter4-bosque-comestible'),
  nodo('poi-cap4-intro-los-bajios', 'Finca Los Bajios', 'Nodo Villa Rica', [-76.485365, 3.23002], 260, 'chapter4-los-bajios'),
  nodo('poi-cap4-intro-el-paso', 'Finca El Paso', 'Nodo Suárez', [-76.69915, 2.975909], 210, 'chapter4-el-paso'),
  nodo('poi-cap4-intro-las-mercedes', 'Finca Las Mercedes', 'Nodo Suárez', [-76.709398, 2.954486], 280, 'chapter4-las-mercedes'),
  nodo('poi-cap4-intro-la-virginia', 'Finca La Virginia', 'Nodo Villa Rica', [-76.355482, 3.286452], 90, 'chapter4-la-virginia'),
  nodo('poi-cap4-intro-centro-agropecuario', 'Centro agropecuario de Villa Rica', 'Nodo Villa Rica', [-76.488842, 3.229798], 0, 'chapter4-centro-agropecuario'),
  nodo('poi-cap4-intro-la-caicedo', 'Finca La Caicedo', 'Nodo Villa Rica', [-76.500006, 3.23554], 150, 'chapter4-la-caicedo'),
]

export default defineMap({
  id: 'chapter4-introduccion',
  title: 'Resistencias en transición',
  minimap: 'valle',
  zoomMax: 12,
  tiles: { mode: 'detail', source: 'cap4/intro-localizacion-fincas.png' },
  sidebar: [
    sb.presentacion('cap4-intro'),
    sb.modal('datos', 'cap4-dato-introduccion'),
  ],
  geo: { pgw: [0, 0.000105655592, 0.000105661672, 0, -76.847071012304, 2.747088048609], width: 5876, height: 10446 },
  base: cld('v1765910985/geoImages/u7oiqxpnvoocf2mym8qw.webp'),
  full: cld('v1765910781/geoImages/nxrpulpigg0ohxe0bjxy.webp'),
  pois: POIS,
  // Leyenda v17 (introduccionCap4, layerMenu.jsx): puramente informativa, sin ojos.
  legends: legendas('introduccion-leyenda', '/assets/legends/cap4', undefined, 10, [
    ['01-monocultivo-de-caña-de-a', 'Monocultivo de caña de azúcar', 'monocultivoAzucar.svg'],
    ['02-áreas-urbanas', 'Áreas urbanas', 'areaUrbana.svg'],
    ['03-fincas-tradicionales--cu', 'Fincas tradicionales, cultivos diversos y bosques', 'fincaTradicional.svg'],
    ['04-cuerpos-de-agua', 'Cuerpos de agua', '/assets/legends/cap2-valle/riosPrincipales.svg'],
    ['05-curvas-de-nivel', 'Curvas de nivel', 'curvaNivel.svg'],
    ['06-fincas-tradicionales-agr', 'Sistema creativo de producción de alimentos', 'chapter4-cacao.svg'],
  ]),
})
