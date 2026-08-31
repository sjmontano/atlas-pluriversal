import { makeTilesConfig } from '@data/tiles'
import type { MapContent } from '../../../types/content'

/* Encuadres navegables — port de v17 (encuadres.js + namesEncuadres.js +
 * agregarEncuadres.jsx). El click en polígono o etiqueta navega (URL-first)
 * al `targetMapId`; en v17 era un if/else por texto del popup. */
const encuadres = [
  {
    id: 'encuadre-mosaicos',
    name: 'Mosaico de cuencas y aguas',
    targetMapId: 'chapter1-mosaicos-del-agua',
    labelCoords: [-75.955, 2.475] as [number, number],
    url: '/assets/geojson/encuadre-sur-valle.json',
  },
  {
    id: 'encuadre-ecosistemas',
    name: 'Existencias y transformaciones ecosistémicas',
    targetMapId: 'chapter1-ecosistemas',
    labelCoords: [-75.045, 2.68] as [number, number],
    url: '/assets/geojson/encuadre-cuenca-alta.json',
  },
  {
    id: 'encuadre-bredunco',
    name: 'Bredunco, Caucayaco o Cauca en la vertiente del Caribe',
    targetMapId: 'chapter1-bredunco',
    labelCoords: [-78.095, 9.25] as [number, number],
    url: '/assets/geojson/encuadre-cuenca-completa.json',
  },
  {
    id: 'encuadre-formas-paisaje',
    name: 'Pliegues, llanuras y otras formas del paisaje',
    targetMapId: 'chapter1-formas-paisaje',
    labelCoords: [-72.405, 9.64] as [number, number],
  },
  {
    id: 'encuadre-un-rio-cauca',
    name: 'Un río Cauca, muchos mundos... en transición',
    targetMapId: 'chapter1-un-rio-cauca',
    labelCoords: [-67.14, 1.69] as [number, number],
    url: '/assets/geojson/encuadre-limites-cuenca.json',
  },
]

const geo = {
  pgw: [0, 0.002291904891, 0.002292263474, 0, -79.43968707918096, -1.987827190702011] as const,
  width: 3649,
  height: 6496,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  zoomMax: 6,
  viewportMaxBounds: null,
  dragPan: false,
  scrollZoom: true,
  useImageBase: false,
}

export default {
  mapId: 'chapter1-encuadres',
  geo,
  images: {
    base: '/assets/maps/cap1/encuadres.png',
    full: '/assets/maps/cap1/encuadres.png',
    placeholder: '/assets/maps/cap1/encuadres.png',
  },
  config,
  tiles: makeTilesConfig('chapter1-encuadres', geo, config.initialBearing, config.zoomMax),
  encuadres,
} satisfies MapContent
