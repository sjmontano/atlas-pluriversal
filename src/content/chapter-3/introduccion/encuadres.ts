import type { Encuadre } from '../../../types/content'

/* Encuadres del intro cap 3 — port de v17 (capasIntroCap3.js +
 * namesEncuadresIntroCap3.js + agregarEncueadres.jsx:handleClick).
 * Textos verbatim v17; destinos según el onMapChange original:
 * monocultivo→1, encharcaron→2, cali-deseca→3, humedales→4, arcilla→5.
 * Los geojson son los de atlas_3.0/public/assets/geo-layers (el backend
 * de v17 ya no responde): diagonales MultiLineString color #193965. */
const CAP3_BLUE = '#193965'

export const ENCUADRES: Encuadre[] = [
  {
    id: 'encuadre-cap3-encharcaron',
    name: 'Nos encharcaron el río',
    targetMapId: 'chapter3-encharcaron',
    labelCoords: [-76.638, 2.7],
    url: '/assets/geojson/cap3-nos-encharcaron.json',
    color: CAP3_BLUE,
  },
  {
    id: 'encuadre-cap3-cali-deseca',
    name: 'Cali deseca',
    targetMapId: 'chapter3-cali-deseca',
    labelCoords: [-76.366, 3.248],
    url: '/assets/geojson/cap3-cali-deseca.json',
    color: CAP3_BLUE,
  },
  {
    id: 'encuadre-cap3-se-encharca',
    name: 'Se encharca arriba se deseca abajo',
    targetMapId: 'chapter3-humedales',
    labelCoords: [-76.82, 2.8],
    url: '/assets/geojson/cap3-se-encharca.json',
    color: CAP3_BLUE,
  },
  {
    id: 'encuadre-cap3-aguas',
    name: 'Aguas que llegan',
    targetMapId: 'chapter3-arcilla',
    labelCoords: [-76.467, 2.96],
    url: '/assets/geojson/cap3-aguas-que-llegan.json',
    color: CAP3_BLUE,
  },
  {
    id: 'encuadre-cap3-monocultivo',
    name: 'Monocultivo de caña de azúcar',
    targetMapId: 'chapter3-monocultivo',
    labelCoords: [-76.343, 2.8],
    url: '/assets/geojson/cap3-monocultivo.json',
    color: CAP3_BLUE,
  },
]
