import { makeMap } from '../../_map.ts'
import { POIS } from './pois'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-introduccion',
  ui: {
    title: 'Actores, acciones, capacidades y poderes en los nodos del tejido',
    minimap: 'valle',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-intro' },
      { id: 'datos', type: 'modal', icon: 'datos', label: 'Datos', frame: '3', target: 'cap4-dato-introduccion' },
    ],
  },
  geo: {
    pgw: [0, 0.000105655592, 0.000105661672, 0, -76.847071012304, 2.747088048609] as const,
    width: 5876,
    height: 10446,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910985/geoImages/u7oiqxpnvoocf2mym8qw.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910781/geoImages/nxrpulpigg0ohxe0bjxy.webp',
  zoomMax: 12,
  extras: { pois: POIS, legends: LEGENDS },
})
