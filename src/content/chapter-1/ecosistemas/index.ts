import { makeTilesConfig } from '@data/tiles'
import type { MapContent } from '../../../types/content'
import { GROUPS } from './groups'
import { LAYERS } from './layers'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350981/geoImages/g9xrqxop5nmfciklng1b.webp'

const geo = {
  pgw: [0, 0.0004706619148, 0.0004706895898, 0, -77.717574036785, 1.505615411172] as const,
  width: 5729,
  height: 10186,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  viewportMarginH: -0.03,
  viewportMarginV: -0.12,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter1-ecosistemas',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350945/geoImages/keozbw51ancathhw6cwk.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter1-ecosistemas', geo, config.initialBearing),
  layers: LAYERS,
  groups: GROUPS,
} satisfies MapContent
