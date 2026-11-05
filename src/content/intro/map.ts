import { cld, defineMap } from '../kit.ts'

export default defineMap({
  id: 'intro',
  title: 'Iniciamos nuestro recorrido',
  minimap: 'cuenca',
  // Ids propios (prefijo `intro-`): no usan los presets de `sb`.
  sidebar: [
    { id: 'intro-presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'presentacion' },
    { id: 'intro-recursos', type: 'link', icon: 'gallery', label: 'Recursos', frame: '2', href: '/pdf/FichasTecnicas/Intro Recursos mapas.pdf' },
    { id: 'intro-tejidos', type: 'goto', icon: 'credits', label: 'Tejidos para el atlas', frame: '4', to: '/entramados' },
  ],
  geo: { pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033], width: 5649, height: 11141 },
  base: cld('v1752360535/geoImages/kv5mawmj8cefhcqho8np.webp'),
  full: cld('v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif'),
  zoomMax: 9,
  tiles: { mode: 'initial-only', source: 'intro/cuenca-cauca.png' },
  config: { dragPan: false, scrollZoom: false },
})
