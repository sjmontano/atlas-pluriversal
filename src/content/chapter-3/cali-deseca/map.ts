import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LAYERS } from './layers'
import { GROUPS } from './groups'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852352/geoImages/maiachqmczyrhmph1rql.webp'

const geo = {
  pgw: [0, 0.000065247158, 0.000065249271, 0, -76.744923302940, 3.108582581431] as const,
  width: 4960,
  height: 8822,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  zoomMax: 13,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter3-cali-deseca',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852262/geoImages/llovghvucpft64ea6zad.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter3-cali-deseca', geo, config.initialBearing, config.zoomMax),
  layers: LAYERS,
  groups: GROUPS,
  legends: LEGENDS,
} satisfies MapContent
