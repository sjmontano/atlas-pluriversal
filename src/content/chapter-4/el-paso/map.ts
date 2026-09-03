import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-el-paso',
  ui: {
    title: 'Finca El Paso',
    minimap: 'villa-rica',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-el-paso' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1DAQ5cwhkgnVCpojfYjbnIVJUlBUT9mod/view' },
    ],
  },
  geo: {
    pgw: [0, 4.90819e-7, 4.90854e-7, 0, -76.67269057988042, 2.953934089665147] as const,
    width: 7366,
    height: 13096,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/gqczkzh18jqhgatzwiht.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765992022/geoImages/tljpufqwb78r7nkqt27y.png',
  zoomMax: 20,
  extras: { legends: LEGENDS },
})
