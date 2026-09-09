import type { Poi } from '../../../types/poi'

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

export const POIS: Poi[] = [
  nodo('poi-cap4-intro-asoyoge', 'ASOYOGE', 'Nodo Suárez', [-76.669, 2.928], 5, 'chapter4-asoyoge'),
  nodo('poi-cap4-intro-el-buhido', 'Finca El Buhido', 'Nodo Suárez', [-76.69, 2.96], 90, 'chapter4-el-buhido'),
  nodo('poi-cap4-intro-bosque-comestible', 'Bosque comestible del oriente de Cali', 'Nodo Oriente de Cali', [-76.54, 3.448], 0, 'chapter4-bosque-comestible'),
  nodo('poi-cap4-intro-los-bajios', 'Finca Los Bajios', 'Nodo Villa Rica', [-76.434, 3.238], 260, 'chapter4-los-bajios'),
  nodo('poi-cap4-intro-el-paso', 'Finca El Paso', 'Nodo Suárez', [-76.65, 3.0], 210, 'chapter4-el-paso'),
  nodo('poi-cap4-intro-las-mercedes', 'Finca Las Mercedes', 'Nodo Suárez', [-76.645, 2.953], 280, 'chapter4-las-mercedes'),
  nodo('poi-cap4-intro-la-virginia', 'Finca La Virginia', 'Nodo Villa Rica', [-76.344, 3.284], 90, 'chapter4-la-virginia'),
  nodo('poi-cap4-intro-centro-agropecuario', 'Centro agropecuario de Villa Rica', 'Nodo Villa Rica', [-76.465, 3.214], 0, 'chapter4-centro-agropecuario'),
  nodo('poi-cap4-intro-la-caicedo', 'Finca La Caicedo', 'Nodo Villa Rica', [-76.48444, 3.25], 150, 'chapter4-la-caicedo'),
]
