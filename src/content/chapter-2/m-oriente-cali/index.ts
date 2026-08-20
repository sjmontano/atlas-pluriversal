import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LAYERS } from './layers'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762486120/geoImages/jnqo25dhvenvrseezvlt.webp'

const geo = {
  pgw: [0, 0.000600802103, 0.000600804878, 0, -79.19033199235821, 1.5356283868726415] as const,
  width: 5138,
  height: 9037,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  zoomMax: 10,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter2-m-oriente-cali',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762485986/geoImages/xa15iigitokhfyvek9s5.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter2-m-oriente-cali', geo, config.initialBearing, config.zoomMax),
  layers: LAYERS,
} satisfies MapContent
