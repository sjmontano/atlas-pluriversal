import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter3-encharcaron',
  ui: {
    title: 'Nos encharcaron el río',
    minimap: 'suarez',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap3-presentacion-encharcaron' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1Hj4e_Mlq5JzRbv_Ns38Wlo_IWLwsEEyX/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1serO1G5GM5kWplw8Ax4UhGOce0t6o-29/view' },
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
  extras: { layers: LAYERS, legends: LEGENDS },
})
