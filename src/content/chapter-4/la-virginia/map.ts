import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-la-virginia',
  ui: {
    title: 'Finca La Virginia',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-la-virginia' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1MJJDDs-F_2J7zeGJ1nhWn4rCaErNXfew/view?usp=sharing' },
      { id: 'perfil', type: 'modal', icon: 'perfil', label: 'Perfil', frame: '1', target: 'cap4-perfil-la-virginia' },
      { id: 'mapa-arbol', type: 'modal', icon: 'mapa-arbol', label: 'Mapa de árbol', frame: '1', target: 'cap4-arbol-la-virginia' },
    ],
  },
  geo: {
    pgw: [0, 2.38227e-7, 2.38244e-7, 0, -76.2901666061832, 3.2244952203163693] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/smdehdeaewwwasco6wt5.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765993236/geoImages/gikolsdb7i25mvhakxds.png',
  zoomMax: 21,
  extras: { legends: LEGENDS },
})
