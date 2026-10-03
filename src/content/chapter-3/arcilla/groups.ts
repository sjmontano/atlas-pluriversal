import type { LayerGroup } from '../../../types/layer'

// Encabezado estático v17 (sin ojo, sin número, sin chevron): las 3 capas
// se alternan individual y las filas estáticas cuelgan del grupo.
export const GROUPS: LayerGroup[] = [
  {
    id: 'arcilla-lagos',
    name: 'Lagos de mineria de arcillas',
    order: 1,
    eye: false,
    numbered: false,
    collapsible: false,
  },
]
