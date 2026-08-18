import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/yodemiucfhtp0iklk2fi.png'

const geo = {
  pgw: [2.17e-10, -8.75649e-7, -8.75586e-7, -2.17e-10, -76.48242978189349, 3.43619004516839] as const,
  width: 7015,
  height: 12472,
} as const
const config = {
  initialZoom: 12,
  initialBearing: 0,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter4-bosque-comestible',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765989453/geoImages/p9npqvcz4r2f7zziqi6e.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter4-bosque-comestible', geo, config.initialZoom, config.initialBearing),
  legends: LEGENDS,
} satisfies MapContent
