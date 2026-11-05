import type { GeojsonLayer } from '../../../types/layer'
import type { Poi } from '../../../types/poi'
import { cld, defineMap, legendas, sb } from '../../kit.ts'

// Variante propia de valle (hideInMenu antes de legend): no usa chapter-2/shared.ts.
const nodeLayer = (id: string, name: string, url: string, color: string): GeojsonLayer => ({
  id,
  name,
  category: 'nodes',
  type: 'geojson',
  url,
  geometry: 'fill',
  paint: { 'fill-color': color, 'fill-opacity': 0.4 },
  order: 10,
  opacity: 0.4,
  visibleByDefault: true,
  /* Menú v17 puramente informativo: los nodos van siempre visibles,
     la leyenda describe el mapa sin ojos. */
  hideInMenu: true,
  legend: { swatch: color, description: name },
})

const node = (id: string, name: string, coords: [number, number], targetMapId: string): Poi => ({
  id,
  name,
  coords,
  capa: `Nodo ${name}`,
  variant: 'icon',
  popup: { title: name },
  /* v17 (agregarToponimos.jsx): en el intro el clic navega al mapa del
   * nodo en vez de abrir modal. */
  targetMapId,
})

export default defineMap({
  id: 'chapter2-valle',
  title: 'Tejidos, nodos y alternativas transformadoras en el sur del valle alto del río Cauca',
  minimap: 'cuenca',
  zoomMax: 10,
  tiles: { mode: 'detail', source: 'cap2/intro-cap2.png' },
  sidebar: [
    sb.presentacion('cap2-intro'),
    sb.ficha('FichasCap2/Tejidos nodos y alternativas transformadoras en el sur del valle alto del rio Cauca.pdf'),
    sb.descarga('MapasCap2/NodosEntramados.pdf'),
  ],
  geo: { pgw: [0, 0.000328128994, 0.000328152382, 0, -77.548017107743, 1.870309514817], width: 7015, height: 12472 },
  base: cld('v1759285334/geoImages/kbg62bjm983wn9p6xexl.webp'),
  full: cld('v1759285229/geoImages/nhbnbpekarmsu7ernhcj.webp'),
  layers: [
    nodeLayer('nodo-suarez', 'Nodo Suárez', '/data/nodos/suarez.geojson', '#ffaf25'),
    nodeLayer('nodo-villa-rica', 'Nodo Villa Rica', '/data/nodos/villa-rica.geojson', '#ffea2b'),
    nodeLayer('nodo-oriente-cali', 'Nodo Oriente de Cali', '/data/nodos/oriente-cali.geojson', '#81c640'),
  ],
  // Leyenda informativa v17 (TNATransformadoras, layerMenu.jsx): 14 filas
  // con insignia circular, SIN ojos — el menú solo describe, no alterna.
  legends: legendas('valle', '/assets/legends/cap2-valle', undefined, 10, [
    ['rio-cauca', 'Río Cauca', 'image.svg'],
    ['rios-principales', 'Ríos principales', 'riosPrincipales.svg'],
    ['rios-tributarios', 'Ríos tributarios', 'riosTributarios.svg'],
    ['humedales', 'Humedales', 'humedales2.svg'],
    ['represas', 'Represas', 'represas.svg'],
    ['zonas-urbanas', 'Zonas urbanas', 'zonasUrbanas.svg'],
    ['red-vial', 'Red vial', 'redVial.svg'],
    ['areas-mixtas', 'Áreas mixtas (Fincas tradicionales, bosques, zonas verdes y policultivos)', 'areasMixtas.svg'],
    ['monocultivos', 'Monocultivos (caña de azúcar y otros)', 'monocultivos.svg'],
    ['sur-valle-alto', 'Sur del valle alto del río Cauca', 'surValleAlto.svg'],
    ['entramados', 'Entramados territoriales', 'entramados.svg'],
    ['nodo-suarez', 'Nodo-entramado territorial Suárez', 'suarez.svg'],
    ['nodo-villa-rica', 'Nodo-entramado territorial Villa Rica', 'villaRica.svg'],
    ['nodo-cali', 'Nodo-entramado territorial Oriente de Cali', 'cali.svg'],
  ]),
  pois: [
    node('poi-cap2-valle-suarez', 'Suárez', [-76.675597, 2.966693], 'chapter2-suarez'),
    node('poi-cap2-valle-villa-rica', 'Villa Rica', [-76.464137, 3.179754], 'chapter2-villa-rica'),
    node('poi-cap2-valle-cali', 'Oriente de Cali', [-76.464254, 3.441679], 'chapter2-cali'),
  ],
})
