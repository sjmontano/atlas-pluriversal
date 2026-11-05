import { cld, defineMap, group, legendas, rasterFrame, sb } from '../../kit.ts'
import { SWATCH } from '@content/theme/swatches'
import { TEXTO_HUMEDALES, TEXTO_RIO_CAUCA } from '../shared'
import type { Encuadre } from '../../../types/content'

const base = cld('v1763847570/geoImages/n4gxlxxpeoqnfma5dylj.webp')

// PGW en el mismo marco rotado de la base ([0, B, D, 0, C, F]).
// v17 traía residuo ±4.5e-5 en A/E que el detector isRotatedPGW (ε=1e-10)
// no reconoce como rotado: la capa quedaba a 90° de la base (río E-O
// en vez de N-S). Con ceros exactos entra a convertRotatedPGW igual
// que la base y ambas calzan (v17 lo ignoraba igual con bounds rectos).
const pgw = [0, 0.000247614932, 0.000247615558, 0, -77.374311108763, 2.939066887422] as const

const capa = rasterFrame({ pgw, width: 5118, height: 9114, group: 'hum-1970' })

/* Etiquetas de tramos del mapa humedales — port de v17
 * (src/data/geojsonLayers/tramos.js `namesTramos`, coords verbatim).
 * Son etiquetas estáticas: con `modalId` abren su modal full-bleed
 * (`cap3-tramo-1..4`). Sin `targetMapId` el click no navega. */
const LABEL_W = 300

const encuadres: Encuadre[] = [
  {
    id: 'tramo-cap3-1',
    name: 'Tramo 1: Buenos Aires - Yumbo',
    labelCoords: [-76.385307, 3.465347],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-1',
  },
  {
    id: 'tramo-cap3-2',
    name: 'Tramo 2: Yumbo - San Pedro',
    labelCoords: [-76.383307, 3.922157],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-2',
  },
  {
    id: 'tramo-cap3-3',
    name: 'Tramo 3: San Pedro - Zarzal',
    labelCoords: [-76.380307, 4.390433],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-3',
  },
  {
    id: 'tramo-cap3-4',
    name: 'Tramo 4: Zarzal - La Victoria',
    labelCoords: [-76.377307, 4.86483],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-4',
  },
]

export default defineMap({
  id: 'chapter3-humedales',
  title: 'Se encharca arriba se deseca abajo',
  minimap: 'valle',
  zoomMax: 11,
  tiles: { mode: 'detail', source: 'cap3/se-encharca-arriba-se-deseca-abajo.png' },
  sidebar: [
    sb.presentacion('cap3-presentacion-humedales'),
    sb.ficha('FichasCap3/Se encharca arriba se deseca abajo.pdf'),
    sb.descarga('MapasCap3/Se encharca arriba se deseca abajo.png'),
  ],
  geo: { pgw, width: 5118, height: 9114 },
  base,
  full: base,
  layers: [
    capa({ id: 'humedalesCapa1970', name: '1970', image: cld('v1763849225/geoImages/lbbcrnrecpdfu5kqf1vp.webp'), swatch: SWATCH.historico, order: 10 }),
  ],
  // Año 1970 v17 (humedalesCap3): encabezado con ojo, sin número ni chevron;
  // sus filas cuelgan del grupo. '2022' es sección libre.
  groups: [group('hum-1970', '1970', 1, { numbered: false, collapsible: false })],
  // Filas v17 (humedalesCap3): insignias, orden e iconos exactos.
  legends: [
    ...legendas('humedales-leyenda', '/assets/legends/cap3', 'hum-1970', 10, [
      { id: 'rio-1970', name: 'Río Cauca', icon: 'hum.svg', longText: TEXTO_RIO_CAUCA },
    ]),
    ...legendas('humedales-leyenda', '/assets/legends/cap3', '2022', 20, [
      { id: 'rio-2022', name: 'Río Cauca', icon: 'rioCauca.svg', longText: TEXTO_RIO_CAUCA },
      ['rios-principales', 'Ríos principales', '/assets/legends/cap2-valle/riosPrincipales.svg'],
      ['represas', 'Represas', '/assets/legends/cap2-valle/represas.svg'],
      { id: 'humedales', name: 'Humedales', icon: 'humedal.svg', longText: TEXTO_HUMEDALES },
      ['zonas-urbanas', 'Zonas urbanas', 'zonasUrbana.svg'],
      ['diques-bordas', 'Diques y bordas', 'diques.svg'],
      ['curvas-nivel', 'Curvas de nivel', 'curvasNivel.svg'],
    ]),
  ],
  encuadres,
})
