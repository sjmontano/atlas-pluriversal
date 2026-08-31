import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996447/geoImages/rvdipsrqu6fbn4repgay.webp'

const geo = {
  pgw: [0, 0.000307843615, 0.0003078655575, 0, -76.939551386912, 2.497068728525] as const,
  width: 2806,
  height: 4989,
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
  mapId: 'chapter3-monocultivo',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996331/geoImages/jje1a33z8enjmlrwfa4j.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter3-monocultivo', geo, config.initialBearing, config.zoomMax),
  legends: LEGENDS,
} satisfies MapContent
