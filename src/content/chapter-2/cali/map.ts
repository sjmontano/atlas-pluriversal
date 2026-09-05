import { makeMap } from '../../_map.ts'
import { POIS } from './pois'

export default makeMap({
  mapId: 'chapter2-cali',
  ui: {
    title: 'Entramado territorial Oriente de Cali con sus alternativas transformadoras',
    minimap: 'cali',
    sidebar: [
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1cDppV8K6vz00NcfmmbNmpl2Eb7RCdHq9/view?usp=sharing' },
      { id: 'galeria', type: 'modal', icon: 'gallery', label: 'Galería de imágenes', frame: '2', target: 'cap2-galeria-cali' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1y97OfUXrTP9R8mo2FZKOhBI_po8SFUoH/view' },
      { id: 'sintesis', type: 'goto', icon: 'sintesis', label: 'Síntesis', frame: '2', to: '/capitulo/2/chapter2-m-oriente-cali' },
    ],
  },
  geo: {
    pgw: [0, 0.000015918409, 0.000015918925, 0, -76.53676820822001, 3.348181582808] as const,
    width: 4960,
    height: 8822,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512015/geoImages/roog2p6gjo3dnnqpcfel.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759511931/geoImages/ku7ikq6ottmty9pl91u0.webp',
  zoomMax: 15,
  extras: { pois: POIS },
})
