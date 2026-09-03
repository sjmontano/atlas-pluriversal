import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { GROUPS } from './groups'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter3-cali-deseca',
  ui: {
    title: 'Cali deseca',
    minimap: 'cali',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap3-presentacion-cali-deseca' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/10kcf3ObSpEdLuzZdFZiDh_yJIZlTKHEH/view?usp=sharing' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1CGHbXCMCqEJIbxw7sNKpM88R9QBA8twX/view?usp=sharing' },
    ],
  },
  geo: {
    pgw: [0, 0.000065247158, 0.000065249271, 0, -76.744923302940, 3.108582581431] as const,
    width: 4960,
    height: 8822,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852352/geoImages/maiachqmczyrhmph1rql.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852262/geoImages/llovghvucpft64ea6zad.webp',
  zoomMax: 13,
  extras: { layers: LAYERS, groups: GROUPS, legends: LEGENDS },
})
