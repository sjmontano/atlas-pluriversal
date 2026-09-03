import { makeMap } from '../../_map.ts'

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
    pgw: [0, 0.000239511553, 0.000239528625, 0, -77.387345555000, 2.198599777777] as const,
    width: 1754,
    height: 3118,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910449/geoImages/lvjzutoybjbt9hek2nza.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910384/geoImages/fzz0wacqalycmhq0jehp.webp',
  zoomMax: 13,
})
