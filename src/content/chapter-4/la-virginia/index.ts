import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/smdehdeaewwwasco6wt5.png'

const geo = {
  pgw: [0, 2.38227e-7, 2.38244e-7, 0, -76.2901666061832, 3.2244952203163693] as const,
  width: 7015,
  height: 12472,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  zoomMax: 21,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter4-la-virginia',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765993236/geoImages/gikolsdb7i25mvhakxds.png',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter4-la-virginia', geo, config.initialBearing, config.zoomMax),
  legends: LEGENDS,
} satisfies MapContent
