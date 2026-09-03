import { makeMap } from '../../_map.ts'
import { POIS } from './pois'
import { LAYERS, GROUPS } from './layers'

export default makeMap({
  mapId: 'chapter1-bredunco',
  ui: {
    title: 'Bredunco',
    minimap: 'valle',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap1-presentacion-bredunco' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1A7Jw4LORNUxoopVOMvVyahswDT4-VxS1/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/19t24x_n0A_Fe_tgzWX57uP6azJc-PHyo/view' },
    ],
  },
  geo: {
    pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033] as const,
    width: 5649,
    height: 11141,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360535/geoImages/kv5mawmj8cefhcqho8np.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif',
  zoomMax: 9,
  extras: { layers: LAYERS, groups: GROUPS, pois: POIS },
})
