import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-los-bajios',
  ui: {
    title: 'Finca Los Bajíos',
    minimap: 'valle',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-los-bajios' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1lFIiuUV5eY1xvbxLIaS0Utn4xAnvUGBy/view?usp=sharing' },
      { id: 'mapa-arbol', type: 'modal', icon: 'mapa-arbol', label: 'Mapa de árbol', frame: '1', target: 'cap4-arbol-los-bajios' },
    ],
  },
  geo: {
    pgw: [0, 1.98448e-7, 1.98462e-7, 0, -76.4406963166678, 3.191896067095853] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/xrssyymmhamqorcf5gb0.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991261/geoImages/o0jnbtkeiddi6ielq1ow.png',
  zoomMax: 21,
  extras: { legends: LEGENDS },
})
