import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { GROUPS } from './groups'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter3-arcilla',
  ui: {
    title: 'Aguas que llegan',
    minimap: 'villa-rica',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap3-presentacion-arcilla' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1ocQi7dr8UDtar9dr666Fp4Gpwo5KYoxl/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1k6iPW9SNs2E_WaI_tCrGE1y6Edz9mYet/view' },
    ],
  },
  geo: {
    pgw: [0, 0.000020719422, 0.000020719464, 0, -76.462515214762, 3.159866654268] as const,
    width: 1969,
    height: 3500,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763846278/geoImages/zbtnuchm9uvshuqnaota.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763845021/geoImages/ps2z0y6in7o5bbvjedyz.webp',
  zoomMax: 16,
  extras: { layers: LAYERS, groups: GROUPS, legends: LEGENDS },
})
