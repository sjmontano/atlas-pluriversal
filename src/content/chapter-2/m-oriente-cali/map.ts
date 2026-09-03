import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'

export default makeMap({
  mapId: 'chapter2-m-oriente-cali',
  ui: {
    title: 'Síntesis territorial del Oriente de Cali',
    minimap: 'cali',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap2-sintesis-cali' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1T5Q5cW324L6SKpVvUx9KkePi5CZns6gR/view?usp=sharing' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/118xtXBCisNiXLEXiWVNYAsRAZFYbMzmC/view' },
    ],
  },
  geo: {
    pgw: [0, 0.000600802103, 0.000600804878, 0, -79.19033199235821, 1.5356283868726415] as const,
    width: 5138,
    height: 9037,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762486120/geoImages/jnqo25dhvenvrseezvlt.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762485986/geoImages/xa15iigitokhfyvek9s5.webp',
  zoomMax: 10,
  extras: { layers: LAYERS },
})
