import { cld, defineMap, sb } from '../../kit.ts'
import type { Encuadre } from '../../../types/content'

/* Encuadres del intro cap 3 — port de v17 (capasIntroCap3.js +
 * namesEncuadresIntroCap3.js + agregarEncueadres.jsx:handleClick).
 * Textos verbatim v17; destinos según el onMapChange original:
 * monocultivo→1, encharcaron→2, cali-deseca→3, humedales→4, arcilla→5.
 * Los geojson son los de atlas_3.0/public/assets/geo-layers (el backend
 * de v17 ya no responde): diagonales MultiLineString color #193965.
 * Etiquetas rotadas 19° como v17 (van en diagonal, bajo su línea). */
const CAP3_BLUE = '#193965'
const LABEL_ROTATE = 19

const encuadres: Encuadre[] = [
  {
    id: 'encuadre-cap3-encharcaron',
    name: 'Nos encharcaron el río',
    targetMapId: 'chapter3-encharcaron',
    labelCoords: [-76.610771, 2.855269],
    url: '/assets/geojson/cap3-nos-encharcaron.json',
    color: CAP3_BLUE,
    labelRotate: LABEL_ROTATE,
    kind: 'line',
  },
  {
    id: 'encuadre-cap3-cali-deseca',
    name: 'Cali deseca',
    targetMapId: 'chapter3-cali-deseca',
    labelCoords: [-76.329046, 3.395506],
    url: '/assets/geojson/cap3-cali-deseca.json',
    color: CAP3_BLUE,
    labelRotate: LABEL_ROTATE,
    kind: 'line',
  },
  {
    id: 'encuadre-cap3-se-encharca',
    name: 'Se encharca arriba se deseca abajo',
    targetMapId: 'chapter3-humedales',
    labelCoords: [-76.81611, 2.99991],
    url: '/assets/geojson/cap3-se-encharca.json',
    color: CAP3_BLUE,
    labelRotate: LABEL_ROTATE,
    /* Una sola línea: override del maxWidth global */
    labelMaxWidth: 340,
    kind: 'line',
  },
  {
    id: 'encuadre-cap3-aguas',
    name: 'Aguas que llegan',
    targetMapId: 'chapter3-arcilla',
    labelCoords: [-76.437826, 3.088097],
    url: '/assets/geojson/cap3-aguas-que-llegan.json',
    color: CAP3_BLUE,
    labelRotate: LABEL_ROTATE,
    kind: 'line',
  },
  {
    id: 'encuadre-cap3-monocultivo',
    name: 'Monocultivo de caña de azúcar',
    targetMapId: 'chapter3-monocultivo',
    labelCoords: [-76.313826, 3.011555],
    url: '/assets/geojson/cap3-monocultivo.json',
    color: CAP3_BLUE,
    labelRotate: LABEL_ROTATE,
    kind: 'line',
  },
]

export default defineMap({
  id: 'chapter3-introduccion',
  title: 'Caminos y conflictos del río Cauca en el valle alto',
  minimap: 'valle',
  zoomMax: 13,
  tiles: { mode: 'detail', source: 'cap3/intro-tramos.png' },
  sidebar: [sb.presentacion('cap3-intro')],
  geo: {
    /* Dims reales Cloudinary (fl_getinfo 7015×12472). Con 1754×3118 el
     * footprint quedaba 4× pequeño y las etiquetas/diagonales caían
     * fuera de cámara (mismo caso que chapter2-valle en BITACORA). */
    pgw: [0, 0.000239511553, 0.000239528625, 0, -77.387345555000, 2.198599777777] as const,
    width: 7015,
    height: 12472,
  },
  base: cld('v1762910449/geoImages/lvjzutoybjbt9hek2nza.webp'),
  full: cld('v1762910384/geoImages/fzz0wacqalycmhq0jehp.webp'),
  encuadres,
})
