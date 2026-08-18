import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { LAYERS } from './layers'
import { GROUPS } from './groups'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360161/geoImages/fpno8nmueqi0duweghhf.webp'

const geo = {
  pgw: [0, 0.000166382730, 0.000166392514, 0, -76.968456199726, 2.161908918459] as const,
  width: 5845,
  height: 10393,
} as const
const config = {
  initialZoom: 8.5,
  initialBearing: -90,
  useTransformConstrain: true,
  viewportMaxBounds: null,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter1-mosaicos-del-agua',
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360193/geoImages/ycxghm0xralzkptnbqqj.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter1-mosaicos-del-agua', geo, config.initialZoom, config.initialBearing),
  layers: LAYERS,
  groups: GROUPS,
} satisfies MapContent
