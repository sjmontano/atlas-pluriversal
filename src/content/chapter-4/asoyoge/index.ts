import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/u2dqe5dcdqzn1am0whlj.png'

const geo = {
  pgw: [0, 5.06536e-7, 5.06572e-7, 0, -76.68490913590671, 2.9357762363425706] as const,
  width: 3578,
  height: 6361,
} as const
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter4-asoyoge',
  geo,
  images: {
    base,
    full: base,
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter4-asoyoge', geo, config.initialBearing),
  legends: LEGENDS,
} satisfies MapContent
