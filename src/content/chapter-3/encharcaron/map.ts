import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LAYERS } from './layers'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762998575/geoImages/ladieazp24oyoyqszzlo.webp'

const geo = {
  pgw: [0, 0.000035559180, 0.000035560332, 0, -76.801058760121, 2.743972429392] as const,
  width: 4960,
  height: 8822,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  zoomMax: 14,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter3-encharcaron',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762997781/geoImages/b8zivpviw5iz5yz6cgbz.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter3-encharcaron', geo, config.initialBearing, config.zoomMax),
  layers: LAYERS,
  legends: LEGENDS,
} satisfies MapContent
