import type { LegendItem } from '../../../types/layer'
import { TEXTO_RIO_CAUCA, TEXTO_HUMEDALES } from '../shared'

// Filas v17 (humedalesCap3): insignias, orden e iconos exactos.
const CAP3 = '/assets/legends/cap3'
const VALLE = '/assets/legends/cap2-valle'

const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
  group: string | undefined,
  extra?: Partial<LegendItem>,
): LegendItem => ({ id, name, icon, order, ...(group === undefined ? {} : { group }), ...extra })

export const LEGENDS: LegendItem[] = [
  legenda('humedales-leyenda-rio-1970', 'Río Cauca', `${CAP3}/hum.svg`, 10, 'hum-1970', { longText: TEXTO_RIO_CAUCA }),
  legenda('humedales-leyenda-rio-2022', 'Río Cauca', `${CAP3}/rioCauca.svg`, 20, '2022', { longText: TEXTO_RIO_CAUCA }),
  legenda('humedales-leyenda-rios-principales', 'Ríos principales', `${VALLE}/riosPrincipales.svg`, 30, '2022'),
  legenda('humedales-leyenda-represas', 'Represas', `${VALLE}/represas.svg`, 40, '2022'),
  legenda('humedales-leyenda-humedales', 'Humedales', `${CAP3}/humedal.svg`, 50, '2022', { longText: TEXTO_HUMEDALES }),
  legenda('humedales-leyenda-zonas-urbanas', 'Zonas urbanas', `${CAP3}/zonasUrbana.svg`, 60, '2022'),
  legenda('humedales-leyenda-diques-bordas', 'Diques y bordas', `${CAP3}/diques.svg`, 70, '2022'),
  legenda('humedales-leyenda-curvas-nivel', 'Curvas de nivel', `${CAP3}/curvasNivel.svg`, 80, '2022'),
]
