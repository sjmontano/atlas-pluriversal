import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-la-caicedo',
  ui: {
    title: 'Finca La Caicedo',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-la-caicedo' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/12KlWauZzbL7T44OGlV88imoofpFz3fP_/view?usp=sharing' },
    ],
  },
  geo: {
    pgw: [0, 3.17488e-7, 3.17511e-7, 0, -76.42831830916282, 3.1837989140567857] as const,
    width: 6945,
    height: 12347,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/fmyppc7aotckznz2zsah.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765994205/geoImages/ssdze3oougoysjid5icz.png',
  zoomMax: 20,
  extras: { legends: LEGENDS },
})
