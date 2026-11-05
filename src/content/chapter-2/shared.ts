import type { GeojsonLayer } from '../../types/layer'

/** Capa de nodo (polígono relleno, siempre visible, oculta en el menú). Usada por los tres mapas de síntesis; valle conserva su variante. */
export const nodeLayer = (id: string, name: string, url: string, color: string): GeojsonLayer => ({
  id,
  name,
  category: 'nodes',
  type: 'geojson',
  url,
  geometry: 'fill',
  paint: { 'fill-color': color, 'fill-opacity': 0.4 },
  order: 10,
  opacity: 0.4,
  visibleByDefault: true,
  legend: { swatch: color, description: name },
  hideInMenu: true,
})
