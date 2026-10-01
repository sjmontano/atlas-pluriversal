import type { Layer } from '../../../types/layer'

/**
 * 🗺️ Capas GeoJSON del mapa Bredunco — port de v17 capasBredunco.js.
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

const line = (
  id: string,
  name: string,
  color: string,
  order: number,
  modalId?: string,
): Layer => ({
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

export const LAYERS: Layer[] = [
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
]

export const GROUPS = [
  { id: 'cuencas', name: 'Cuencas', order: 1 },
  { id: 'nodos', name: 'Nodos del tejido', order: 2 },
  { id: 'rios', name: 'Ríos', order: 3 },
]
