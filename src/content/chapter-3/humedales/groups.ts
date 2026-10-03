import type { LayerGroup } from '../../../types/layer'

// Año 1970 v17 (humedalesCap3): encabezado con ojo, sin número ni chevron;
// sus filas cuelgan del grupo. '2022' es sección libre.
export const GROUPS: LayerGroup[] = [
  { id: 'hum-1970', name: '1970', order: 1, numbered: false, collapsible: false },
]
