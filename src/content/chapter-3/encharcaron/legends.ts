import type { LegendItem } from '../../../types/layer'
import { TEXTO_RIO_CAUCA, TEXTO_SALVAJINA } from '../shared'

// Filas v17 (nosEncharcaronElRio): insignias, orden e iconos exactos.
// '1970' cuelga del grupo 'ench-1970' (con ojo); '2022' es sección libre.
const CAP3 = '/assets/legends/cap3'
const VALLE = '/assets/legends/cap2-valle'

const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
  group: string,
  extra?: Partial<LegendItem>,
): LegendItem => ({ id, name, icon, order, group, ...extra })

export const LEGENDS: LegendItem[] = [
  legenda('encharcaron-leyenda-construcciones-1970', 'Construcciones', `${CAP3}/hum.svg`, 10, 'ench-1970'),
  legenda('encharcaron-leyenda-vias-1970', 'Vías', `${CAP3}/hum.svg`, 20, 'ench-1970'),
  legenda('encharcaron-leyenda-quebradas-1970', 'Quebradas', `${VALLE}/riosPrincipales.svg`, 30, 'ench-1970'),
  legenda(
    'encharcaron-leyenda-rio-1970',
    'Río Cauca',
    `${CAP3}/rioCauca.svg`,
    40,
    'ench-1970',
    { longText: TEXTO_RIO_CAUCA },
  ),
  legenda('encharcaron-leyenda-construcciones-2022', 'Construcciones', `${CAP3}/construccion.svg`, 50, '2022'),
  legenda(
    'encharcaron-leyenda-salvajina',
    'Salvajina',
    `${CAP3}/represas.svg`,
    60,
    '2022',
    { longText: TEXTO_SALVAJINA },
  ),
  legenda('encharcaron-leyenda-red-hidrica', 'Red hídrica', `${VALLE}/riosPrincipales.svg`, 70, '2022'),
]
