import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/u2dqe5dcdqzn1am0whlj.png'

export default makeMap({
  mapId: 'chapter4-asoyoge',
  ui: {
    title: 'Centro agropecuario ASOYOGE',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-asoyoge' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1zU1brROKItcLuutpzRhmLOoSCu_rPHL5/view?usp=sharing' },
      { id: 'perfil', type: 'modal', icon: 'perfil', label: 'Perfil', frame: '1', target: 'cap4-perfil-asoyoge' },
    ],
  },
  geo: {
    pgw: [0, 5.06536e-7, 5.06572e-7, 0, -76.68490913590671, 2.9357762363425706] as const,
    width: 3578,
    height: 6361,
  },
  base,
  full: base,
  zoomMax: 21,
  extras: { legends: LEGENDS },
})
