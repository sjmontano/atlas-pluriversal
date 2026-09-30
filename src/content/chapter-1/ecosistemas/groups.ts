import type { LayerGroup } from '../../../types/layer'

// Jerarquía del menú v17 (layerMenu.jsx → `ecosistemas`):
// 2 macro-grupos con subgrupos anidados (`parent`) + capas sueltas top-level
// (ítem 3). La numeración (1., 1.1.) la genera el menú, no los nombres.

export const GROUPS: LayerGroup[] = [
  { id: 'eco-1', name: 'Amenazados y en estado vulnerable', order: 1 },
  { id: 'eco-1.1', name: 'De litoral y aguas poco profundas', parent: 'eco-1', order: 1 },
  { id: 'eco-1.2', name: 'Con vegetación de baja altura', parent: 'eco-1', order: 2 },
  { id: 'eco-1.3', name: 'Bosques', parent: 'eco-1', order: 3 },
  { id: 'eco-1.4', name: 'Altas cumbres', parent: 'eco-1', order: 4 },
  { id: 'eco-2', name: 'Entornos del ser humano que transforman ecosistemas', order: 2 },
  { id: 'eco-2.1', name: 'Intervenciones moderadas', parent: 'eco-2', order: 5 },
  { id: 'eco-2.2', name: 'Zonas con agricultura y ganadería', parent: 'eco-2', order: 6 },
  { id: 'eco-2.3', name: 'Intervenciones severas', parent: 'eco-2', order: 7 },
]
