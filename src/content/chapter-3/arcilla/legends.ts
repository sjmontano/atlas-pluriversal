import type { LegendItem } from '../../../types/layer'

const ICONS = '/assets/legends/cap3'

// Filas estáticas v17 (sección arcilla): cuelgan del grupo 'arcilla-lagos
// (group = id) y se renderizan tras las 3 capas con ojo.
const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
): LegendItem => ({ id, name, icon: `${ICONS}/${icon}`, order, group: 'arcilla-lagos' })

export const LEGENDS: LegendItem[] = [
  legenda('arcilla-leyenda-fincas-tradicionales', 'Fincas tradicionales, cultivos diversos y bosques.', 'fincaTradi.svg', 40),
  legenda('arcilla-leyenda-titulo-minero', 'Título minero vigente', 'tituloMinero.svg', 50),
  legenda('arcilla-leyenda-veredas', 'Veredas', 'veredas.svg', 60),
  legenda('arcilla-leyenda-rios-quebradas', 'Ríos y quebradas', 'quebradas.svg', 70),
]
