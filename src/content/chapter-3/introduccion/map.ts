import { makeMap } from '../../_map.ts'
import { ENCUADRES } from './encuadres'

export default makeMap({
  mapId: 'chapter3-introduccion',
  ui: {
    title: 'Los caminos y conflictos del río Cauca en el valle alto',
    minimap: 'valle',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap3-intro' },
    ],
  },
  geo: {
    /* Dims reales Cloudinary (fl_getinfo 7015×12472). Con 1754×3118 el
     * footprint quedaba 4× pequeño y las etiquetas/diagonales caían
     * fuera de cámara (mismo caso que chapter2-valle en BITACORA). */
    pgw: [0, 0.000239511553, 0.000239528625, 0, -77.387345555000, 2.198599777777] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910449/geoImages/lvjzutoybjbt9hek2nza.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910384/geoImages/fzz0wacqalycmhq0jehp.webp',
  zoomMax: 13,
  extras: { encuadres: ENCUADRES },
})
