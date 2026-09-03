import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { LEGENDS } from './legends'

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763847570/geoImages/n4gxlxxpeoqnfma5dylj.webp'

export default makeMap({
  mapId: 'chapter3-humedales',
  ui: {
    title: 'Se encharca arriba se deseca abajo',
    minimap: 'valle',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap3-presentacion-humedales' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1swoN32n8SSE_ycZoh4XwbFJOFYAK2U5u/view?usp=sharing' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1tqSNlYiyHNblPsxBe9Lq1GxH9RDX0jXR/view?usp=sharing' },
    ],
  },
  geo: {
    pgw: [0, 0.000247614932, 0.000247615558, 0, -77.374311108763, 2.939066887422] as const,
    width: 5118,
    height: 9114,
  },
  base,
  full: base,
  zoomMax: 11,
  extras: { layers: LAYERS, legends: LEGENDS },
})
