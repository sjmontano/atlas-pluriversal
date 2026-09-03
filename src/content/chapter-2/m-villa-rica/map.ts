import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'

export default makeMap({
  mapId: 'chapter2-m-villa-rica',
  ui: {
    title: 'Síntesis territorial de Villa Rica',
    minimap: 'villa-rica',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap2-sintesis-villa-rica' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1mM9vTOorSN0IwCMen3qHezxYXQ5gdmUw/view?usp=sharing' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1MgqxX2ZC73RWk7YBgIqeHe64e78eopG_/view' },
    ],
  },
  geo: {
    pgw: [0, 0.000036518263, 0.000036520866, 0, -76.53721204001468, 2.9674982215900085] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759612261/geoImages/pabcndrbg0gjx29iuccg.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1767891949/geoImages/knk721fgkqtvdxnppxzr.webp',
  zoomMax: 13,
  extras: { layers: LAYERS },
})
