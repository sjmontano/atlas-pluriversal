import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-bosque-comestible',
  ui: {
    title: 'Bosque comestible',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-bosque-comestible' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1WOTbHyYhsacU0OZOxny76qwoNNud02yH/view?usp=sharing' },
      { id: 'sintesis', type: 'goto', icon: 'datos', label: 'Síntesis', frame: '4', to: '/capitulo/4/chapter4-problematicas' },
    ],
  },
  geo: {
    pgw: [2.17e-10, -8.75649e-7, -8.75586e-7, -2.17e-10, -76.48242978189349, 3.43619004516839] as const,
    width: 7015,
    height: 12472,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/yodemiucfhtp0iklk2fi.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765989453/geoImages/p9npqvcz4r2f7zziqi6e.webp',
  zoomMax: 18,
  bearing: 0,
  extras: { legends: LEGENDS },
})
