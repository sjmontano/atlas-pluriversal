import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'

const base = '/assets/maps/cap2/modelo-territorial-suarez.png'

export default makeMap({
  mapId: 'chapter2-m-suarez',
  ui: {
    title: 'Síntesis territorial de Suárez',
    minimap: 'suarez',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap2-sintesis-suarez' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1OU4oDKbB7ZBrgZ2ZNqUrzpL2A3JwRdM2/view?usp=sharing' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1FV4jcrdxeRRdOmRuYUlaozv0t4Vq1Ocd/view' },
    ],
  },
  geo: {
    pgw: [0, -0.000079124151, -0.000079131596, 0, -76.32673887696231, 3.119152348416211] as const,
    width: 9448,
    height: 5314,
  },
  base,
  full: base,
  zoomMax: 12,
  bearing: 180,
  extras: { layers: LAYERS },
})
