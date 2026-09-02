import { makeTilesConfig } from '@data/tiles'
import type { MapContent } from '../../types/content'

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
  zoomMax: 9,
  viewportMaxBounds: null,
  dragPan: false,
  scrollZoom: false,
}

export default {
  mapId: 'intro',
  ui: {
    title: 'Iniciamos nuestro recorrido',
    minimap: 'cuenca',
    sidebar: [
      { id: 'intro-presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'presentacion' },
      { id: 'intro-recursos', type: 'link', icon: 'gallery', label: 'Recursos', frame: '2', href: 'https://drive.google.com/file/d/1AEAngJNFZ7GfjTYXwGPhhS2bbJGz9XCq/view?usp=sharing' },
      { id: 'intro-tejidos', type: 'modal', icon: 'credits', label: 'Tejidos para el atlas', frame: '4', target: 'en-construccion' },
    ],
  },
  geo,
  images: { base, full, placeholder: ph(base) },
  config,
  tiles: makeTilesConfig('intro', geo, config.initialBearing, config.zoomMax),
} satisfies MapContent
