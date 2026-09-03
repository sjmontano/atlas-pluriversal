import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { GROUPS } from './groups'

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp'

export default makeMap({
  mapId: 'chapter1-un-rio-cauca',
  ui: {
    title: 'Un río Cauca, muchos mundos... en transición',
    minimap: 'cuenca',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap1-presentacion-un-rio-cauca' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk' },
    ],
  },
  geo: {
    pgw: [0, 0.001232510189, 0.0012309569997728162, 0, -79.4475590385131, -0.5982582430346929] as const,
    width: 6082,
    height: 10826,
  },
  base,
  full: base,
  zoomMax: 8,
  extras: { layers: LAYERS, groups: GROUPS },
})
