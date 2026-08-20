import { makeTilesConfig } from '@data/tiles'
import type { MapContent } from '../../../types/content'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  '/assets/maps/cap1/formas-del-paisaje.png'

const geo = {
  pgw: [0, 0.002101779729, 0.002098102561, 0, -79.131272642526, -0.005834616506] as const,
  width: 3382,
  height: 6023,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter1-formas-paisaje',
  geo,
  images: {
    base,
    full: '/assets/maps/cap1/formas-del-paisaje.png',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter1-formas-paisaje', geo, config.initialBearing),
  pois: POIS,
} satisfies MapContent
