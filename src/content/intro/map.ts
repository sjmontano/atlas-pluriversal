import { cld, defineMap } from '../kit.ts'
import type { Layer } from '../../types/layer'

const GEOJSON = '/assets/geojson'

const fill = (
  id: string,
  name: string,
  category: Layer['category'],
  color: string,
  order: number,
  modalId?: string,
  tooltip: boolean = true,
): Layer => ({
  id: `bredunco-${id}`,
  name,
  category,
  type: 'geojson',
  url: `${GEOJSON}/${id}.json`,
  geometry: 'fill',
  paint: { 'fill-color': color, 'fill-opacity': 0.25 },
  visibleByDefault: false,
  order,
  modalId,
  tooltip,
  legend: { swatch: color, description: name },
})

const line = (id: string, name: string, color: string, order: number, modalId?: string): Layer => ({
  id: `bredunco-${id}`,
  name,
  category: 'rivers',
  type: 'geojson',
  url: `${GEOJSON}/${id}.json`,
  geometry: 'line',
  paint: { 'line-color': color, 'line-width': 2 },
  visibleByDefault: false,
  order,
  modalId,
  legend: { swatch: color, description: name },
})




export default defineMap({
  id: 'intro',
  title: 'Iniciamos nuestro recorrido',
  minimap: 'cuenca',
  /* El intro no lista sus capas en el menú: las capas viven solo en el
   * mapa y su única interacción es el hover (etiqueta con el nombre). */
  ui: { layerMenu: false, layerTooltips: true },
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
  layers: [
    fill('cuenca-alta', 'Cuenca alta', 'boundaries', '#4bcfff', 1),
    fill('cuenca-media', 'Cuenca media', 'boundaries', '#ffff03', 2),
    fill('cuenca-baja', 'Cuenca baja', 'boundaries', '#ff6b35', 3),
    fill('cuenca-rio-cauca', 'Cuenca del río Cauca', 'boundaries', '#a9f7a4', 4, undefined, false),
    fill('valle-alto-rio-cauca', 'Valle alto del río Cauca', 'boundaries', '#a9f7a4', 5),
    line('rio-cauca', 'Río Cauca', '#377eb8', 6, 'cap1-voz-cuenca-alta'),
    line('rio-magdalena', 'Río Magdalena', '#377eb8', 7),
    line('rio-san-jorge', 'Río San Jorge', '#377eb8', 8),
    line('rio-cesar', 'Río Cesar', '#377eb8', 9),
    line('rio-nechi', 'Río Nechí', '#377eb8', 10),
    line('rio-anchicaya', 'Río Anchicayá', '#377eb8', 11),
    line('rio-san-juan', 'Río San Juan', '#377eb8', 12),
    line('rio-atrato', 'Río Atrato', '#377eb8', 13),
    /* Nodos al final (order alto = encima de todo): son pequeños y el
     * área de hover de los ríos los tapaba. */
    fill('nodo-oriente-cali', 'Nodo Oriente Cali', 'nodes', '#81c640', 20),
    fill('nodo-villa-rica', 'Nodo Villa Rica', 'nodes', '#ffea2b', 21),
    fill('nodo-suarez', 'Nodo Suárez', 'nodes', '#ffaf25', 22),
  ],
  config: { dragPan: false, scrollZoom: false },
  oceanLabels: [
    { id: 'oceano-pacifico', name: 'OCÉANO PACÍFICO', coords: [-78.45, 6.3] },
    { id: 'mar-caribe', name: 'MAR CARIBE', coords: [-76.5319, 11.85] },
  ],
})
