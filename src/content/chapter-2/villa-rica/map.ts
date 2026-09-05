import { makeMap } from '../../_map.ts'
import { POIS } from './pois'

export default makeMap({
  mapId: 'chapter2-villa-rica',
  ui: {
    title: 'Entramado territorial Villa Rica con sus alternativas transformadoras',
    minimap: 'villa-rica',
    sidebar: [
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/17le_lgMDZmv4ctlBCOE9b8YBFIxOizhb/view?usp=sharing' },
      { id: 'galeria', type: 'modal', icon: 'gallery', label: 'Galería de imágenes', frame: '2', target: 'cap2-galeria-villa-rica' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/16zn-XhEFckoZe4zfEIZxPxzabGy1Z14D/view' },
      { id: 'sintesis', type: 'goto', icon: 'sintesis', label: 'Síntesis', frame: '2', to: '/capitulo/2/chapter2-m-villa-rica' },
    ],
  },
  geo: {
    pgw: [0, 0.000055581180, 0.000055587544, 0, -76.549878031544, 2.974893043424] as const,
    width: 4960,
    height: 8818,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512655/geoImages/pdxepthixmeebgei59yq.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512616/geoImages/sj5c6kcyz8oilmta1ra8.webp',
  zoomMax: 13,
  extras: { pois: POIS },
})
