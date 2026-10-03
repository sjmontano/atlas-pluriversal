import type { LayerGroup } from '../../../types/layer'

// Año 1970 v17 (nosEncharcaronElRio): encabezado con ojo, sin número ni
// chevron; las 4 filas estáticas cuelgan del grupo. '2022' es sección libre.
export const GROUPS: LayerGroup[] = [
  { id: 'ench-1970', name: '1970', order: 1, numbered: false, collapsible: false },
]
