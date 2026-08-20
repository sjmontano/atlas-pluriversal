import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360535/geoImages/kv5mawmj8cefhcqho8np.webp'
const full =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif'

const geo = {
  pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033] as const,
  width: 5649,
  height: 11141,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter1-bredunco',
  geo,
  images: { base, full, placeholder: ph(base) },
  config,
  tiles: makeTilesConfig('chapter1-bredunco', geo, config.initialBearing),
  pois: POIS,
} satisfies MapContent
