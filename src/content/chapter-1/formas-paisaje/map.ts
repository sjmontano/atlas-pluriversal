import { makeMap } from '../../_map.ts'
import { POIS } from './pois'

export default makeMap({
  mapId: 'chapter1-formas-paisaje',
  ui: {
    title: 'Pliegues, llanuras y otras formas del paisaje',
    minimap: 'cuenca',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap1-presentacion-formas-paisaje' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1lPJsUwLxV2TTlGwkf_F1nEPkroixZxh3/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1gIOicCrLnLeC3aoxVCsHSjPZdGmg4N6d/view?usp=drivesdk' },
    ],
  },
  geo: {
    pgw: [0, 0.002101779729, 0.002098102561, 0, -79.131272642526, -0.005834616506] as const,
    width: 3382,
    height: 6023,
  },
  base: '/assets/maps/cap1/formas-del-paisaje.png',
  full: '/assets/maps/cap1/formas-del-paisaje.png',
  zoomMax: 9,
  extras: { pois: POIS },
})
