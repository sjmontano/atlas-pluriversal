import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'

const geo = {
  pgw: [0, 0.002291904891, 0.002292263474, 0, -79.43968707918096, -1.987827190702011] as const,
  width: 3649,
  height: 6496,
} as const
const config = {
  initialZoom: 6.06,
  initialBearing: -90,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  dragPan: false,
  scrollZoom: false,
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
  tiles: makeTilesConfig('chapter1-encuadres', geo, config.initialZoom, config.initialBearing),
} satisfies MapContent
