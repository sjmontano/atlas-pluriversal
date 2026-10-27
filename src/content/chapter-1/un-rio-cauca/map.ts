import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { GROUPS } from './groups'
import { LEGENDS } from './legends'

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp'

export default makeMap({
  mapId: 'chapter1-un-rio-cauca',
  ui: {
    title: 'Un río Cauca, muchos mundos... en transición',
    minimap: 'cuenca',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap1-presentacion-un-rio-cauca' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: '/pdf/FichasTecnicas/FichasCap1/UnRioCaucaCap1.pdf' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: '/pdf/Descargables/MapasCap1/Un rio Cauca muchos mundos en transicion.pdf' },
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
  extras: {
    layers: LAYERS, groups: GROUPS, legends: LEGENDS,
    /* Port v17 (MapComponent.jsx): océanos, solo vistas Colombia completa. */
    oceanLabels: [
      { id: 'oceano-pacifico', name: 'OCÉANO PACÍFICO', coords: [-78.45, 6.3] as [number, number] },
      { id: 'mar-caribe', name: 'MAR CARIBE', coords: [-76.5319, 11.85] as [number, number] },
    ],
  },
})
