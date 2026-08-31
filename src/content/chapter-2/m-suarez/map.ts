import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LAYERS } from './layers'

const geo = {
  pgw: [0, -0.000079124151, -0.000079131596, 0, -76.32673887696231, 3.119152348416211] as const,
  width: 9448,
  height: 5314,
} as const
const config = {
  initialBearing: 180,
  useTransformConstrain: true,
  zoomMax: 12,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter2-m-suarez',
  geo,
  images: {
    base: '/assets/maps/cap2/modelo-territorial-suarez.png',
    full: '/assets/maps/cap2/modelo-territorial-suarez.png',
    placeholder: '/assets/maps/cap2/modelo-territorial-suarez.png',
  },
  config,
  tiles: makeTilesConfig('chapter2-m-suarez', geo, config.initialBearing, config.zoomMax),
  layers: LAYERS,
} satisfies MapContent
