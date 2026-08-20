import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LAYERS } from './layers'
import { GROUPS } from './groups'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp'

const geo = {
  pgw: [0, 0.001232510189, 0.0012309569997728162, 0, -79.4475590385131, -0.5982582430346929] as const,
  width: 6082,
  height: 10826,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter1-un-rio-cauca',
  geo,
  images: {
    base,
    full: base,
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter1-un-rio-cauca', geo, config.initialBearing),
  layers: LAYERS,
  groups: GROUPS,
} satisfies MapContent
