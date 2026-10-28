import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-las-mercedes',
  ui: {
    title: 'Finca Las Mercedes',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-las-mercedes' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: '/pdf/FichasTecnicas/FichasCap4/Finca Las Mercedes.pdf' },
      { id: 'mapa-arbol', type: 'modal', icon: 'mapa-arbol', label: 'Mapa de árbol', frame: '1', target: 'cap4-arbol-las-mercedes' },
    ],
  },
  geo: {
    pgw: [0, 2.37423e-7, 2.3744e-7, 0, -76.68619953199119, 2.930137907002091] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/uda3sxgw61nf5tt6mtfp.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765992502/geoImages/xndkrm7tpgdbw881co0v.png',
  zoomMax: 21,
  extras: { legends: LEGENDS },
})
