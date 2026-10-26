import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { LEGENDS } from './legends'
import { POIS } from './pois'

export default makeMap({
  mapId: 'chapter2-valle',
  ui: {
    title: 'Tejidos, nodos y alternativas transformadoras en el sur del valle alto del río Cauca',
    minimap: 'cuenca',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap2-intro' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: '/pdf/Fichas_t%C3%A9nicas_PDF/Fichas_Cap_II/Metadata_2_Cap_.xlsx_-_Tejidos,_nodos_y_alternativas_transformadoras_en_el_sur_del_valle_alto_del_r%C3%ADo_Cauca.pdf' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/1qHF90DfU8z8z4HVw4486_oInkoFyiWBn/view' },
    ],
  },
  geo: {
    pgw: [0, 0.000328128994, 0.000328152382, 0, -77.548017107743, 1.870309514817] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285334/geoImages/kbg62bjm983wn9p6xexl.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285229/geoImages/nhbnbpekarmsu7ernhcj.webp',
  zoomMax: 10,
  extras: { layers: LAYERS, legends: LEGENDS, pois: POIS },
})
