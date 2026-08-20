import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { POIS } from './pois'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910985/geoImages/u7oiqxpnvoocf2mym8qw.webp'

const geo = {
  pgw: [0, 0.000105655592, 0.000105661672, 0, -76.847071012304, 2.747088048609] as const,
  width: 5876,
  height: 10446,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  zoomMax: 12,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter4-introduccion',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910781/geoImages/nxrpulpigg0ohxe0bjxy.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter4-introduccion', geo, config.initialBearing, config.zoomMax),
  pois: POIS,
  legends: LEGENDS,
} satisfies MapContent
