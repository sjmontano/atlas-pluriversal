import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { GROUPS } from './groups'
import { LEGENDS } from './legends'
import { POIS } from './pois'

export default makeMap({
  mapId: 'chapter3-encharcaron',
  ui: {
    title: 'Nos encharcaron el río',
    minimap: 'suarez',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap3-presentacion-encharcaron' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: '/pdf/FichasTecnicas/FichasCap3/Nos encharcaron el rio.pdf' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: '/pdf/Descargables/MapasCap3/Nos encharcaron el rio.pdf' },
    ],
  },
  geo: {
    pgw: [0, 0.000035559180, 0.000035560332, 0, -76.801058760121, 2.743972429392] as const,
    width: 4960,
    height: 8822,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762998575/geoImages/ladieazp24oyoyqszzlo.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762997781/geoImages/b8zivpviw5iz5yz6cgbz.webp',
  zoomMax: 14,
  extras: { layers: LAYERS, groups: GROUPS, legends: LEGENDS, pois: POIS },
})
