import { makeMap } from '../../_map.ts'
import { POIS } from './pois'

export default makeMap({
  mapId: 'chapter2-suarez',
  ui: {
    title: 'Entramado territorial Suárez con sus alternativas transformadoras',
    minimap: 'suarez',
    sidebar: [
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1tx_X8KsUHx0q4mJvhJ-MhvTbMI3ENkz0/view?usp=sharing' },
      { id: 'galeria', type: 'modal', icon: 'gallery', label: 'Galería de imágenes', frame: '2', target: 'cap2-galeria-suarez' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1ndp-Y4eOTq62w20vqb72DrwD8SfkjmNH/view' },
      { id: 'sintesis', type: 'goto', icon: 'sintesis', label: 'Síntesis', frame: '2', to: '/capitulo/2/chapter2-m-suarez' },
    ],
  },
  geo: {
    pgw: [0, 0.0000220378935, 0.000022038657, 0, -76.771441329681, 2.758437617084] as const,
    width: 6300,
    height: 11200,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061326/geoImages/mwz79qubfmr0x5zqtzto.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061249/geoImages/nkxiwrxtbovp66gobcdq.webp',
  zoomMax: 14,
  extras: { pois: POIS },
})
