import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-el-buhido',
  ui: {
    title: 'Finca El Buhido',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-el-buhido' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1AB_k7XDR3d17TOzXHgJBwPm1pMxeRslA/view' },
      { id: 'perfil', type: 'modal', icon: 'perfil', label: 'Perfil', frame: '1', target: 'cap4-perfil-el-buhido' },
      { id: 'mapa-arbol', type: 'modal', icon: 'mapa-arbol', label: 'Mapa de árbol', frame: '1', target: 'cap4-arbol-el-buhido' },
    ],
  },
  geo: {
    pgw: [0, 0.000000316606, 0.000000316628, 0, -76.683480669945, 2.941142661121] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/l5qj5qxh5onul1b26e71.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765988704/geoImages/p9hryf14z42ilaw0iiez.png',
  zoomMax: 20,
  extras: { legends: LEGENDS },
})
