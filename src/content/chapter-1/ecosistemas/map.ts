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
  zoomMax: 10,
  viewportMaxBounds: null,
  viewportMarginH: -0.03,
  viewportMarginV: -0.12,
  dragPan: true,
  scrollZoom: true,
}

export default {
  mapId: 'chapter1-ecosistemas',
  ui: {
    title: 'Existencias y transformaciones ecosistémicas',
    minimap: 'valle',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap1-presentacion-ecosistemas' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/13Fd5C8St_BArPKEgTQC8ZefT0gI_LXpE/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/13mmmAcE0odjgSLI2-u00DtReF13ZFy5p/view?usp=drivesdk' },
    ],
  },
  geo,
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350945/geoImages/keozbw51ancathhw6cwk.webp',
    placeholder: ph(base),
  },
  config,
  tiles: makeTilesConfig('chapter1-ecosistemas', geo, config.initialBearing, config.zoomMax),
  layers: LAYERS,
  groups: GROUPS,
} satisfies MapContent
