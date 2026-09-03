import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter3-monocultivo',
  ui: {
    title: 'El desierto verde del valle alto del río Cauca',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap3-presentacion-monocultivo' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/10nefEH5pOSnpH6wdgBsTzLPUO924KQY-/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1JFb4V6eD-kicm4_kjof2IMxpq6m6dsBR/view' },
      { id: 'datos', type: 'link', icon: 'datos', label: 'Datos', frame: '3', href: 'https://docs.google.com/spreadsheets/d/1TtjNpRPwglIfDh-EvJ6u3_XTIhzcpG-i/edit?usp=sharing' },
    ],
  },
  geo: {
    pgw: [0, 0.000307843615, 0.0003078655575, 0, -76.939551386912, 2.497068728525] as const,
    width: 2806,
    height: 4989,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996447/geoImages/rvdipsrqu6fbn4repgay.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996331/geoImages/jje1a33z8enjmlrwfa4j.webp',
  zoomMax: 12,
  extras: { legends: LEGENDS },
})
