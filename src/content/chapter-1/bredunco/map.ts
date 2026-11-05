import { cld, defineMap, group, sb } from '../../kit.ts'
import type { Layer } from '../../../types/layer'

/**
 * Capas GeoJSON del mapa Bredunco — port de v17 capasBredunco.js.
 * Los GeoJSON se extrajeron del backend a archivos estáticos
 * (scripts/fetch-geojson.mjs → /assets/geojson). El río Cauca abre la
 * Voz del río · Cuenca alta (modalId), como el flujo de agregarCapas de v17.
 */

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
  id: 'chapter1-bredunco',
  title: 'Bredunco, Caucayaco o Cauca en la vertiente del Caribe',
  minimap: 'valle',
  ui: { layerTooltips: true, layerMenu: false },
  sidebar: [
    sb.presentacion('cap1-presentacion-bredunco'),
    sb.ficha('FichasCap1/Bredunco_Cap_1.pdf'),
    sb.descarga('MapasCap1/Bredunco Caucayaco Cauca.png'),
  ],
  geo: { pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033], width: 5649, height: 11141 },
  base: cld('v1752360535/geoImages/kv5mawmj8cefhcqho8np.webp'),
  full: cld('v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif'),
  zoomMax: 9,
  tiles: { mode: 'detail', source: 'cap1/bredunco.png' },
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
  groups: [group('cuencas', 'Cuencas', 1), group('nodos', 'Nodos del tejido', 2), group('rios', 'Ríos', 3)],
  pois: [
    {
      id: 'poi-bredunco-cuenca-alta',
      name: 'Cuenca Alta',
      coords: [-76.501, 2.3],
      capa: '',
      variant: 'number',
      modalId: 'cap1-voz-cuenca-alta',
      popup: { title: 'Cuenca Alta' },
    },
    {
      id: 'poi-bredunco-cuenca-media',
      name: 'Cuenca media',
      coords: [-75.39, 5.766],
      capa: '',
      variant: 'number',
      modalId: 'cap1-voz-cuenca-media',
      popup: { title: 'Cuenca media' },
    },
    {
      id: 'poi-bredunco-cuenca-baja',
      name: 'Cuenca Baja',
      coords: [-74.582, 7.843],
      capa: '',
      variant: 'number',
      modalId: 'cap1-voz-cuenca-baja',
      popup: { title: 'Cuenca Baja' },
    },
    {
      id: 'poi-bredunco-valle-alto',
      name: 'Valle alto del rio cauca',
      coords: [-76.307, 3.505],
      capa: '',
      variant: 'number',
      modalId: 'cap1-voz-valle-alto',
      popup: { title: 'Valle alto del rio cauca' },
    },
  ],
  /* Port v17 (MapComponent.jsx): océanos, solo vistas Colombia completa. */
  oceanLabels: [
    { id: 'oceano-pacifico', name: 'OCÉANO PACÍFICO', coords: [-78.45, 6.3] },
    { id: 'mar-caribe', name: 'MAR CARIBE', coords: [-76.5319, 11.85] },
  ],
})
