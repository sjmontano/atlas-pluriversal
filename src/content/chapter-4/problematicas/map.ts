import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1768342194/geoImages/yqwuuru4zw9jvfoa4cpl.webp'

const geo = {
  pgw: [0.000001194087, -0.00000206822, -0.000002068153, -0.000001194048, -76.48394660129709, 3.4428801608900352] as const,
  width: 4960,
  height: 8822,
} as const
const config = {
  initialBearing: -30,
  useTransformConstrain: true,
  zoomMax: 17,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter4-problematicas',
  geo,
  images: {
    base,
    full: base,
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter4-problematicas', geo, config.initialBearing, config.zoomMax),
  legends: LEGENDS,
} satisfies MapContent
