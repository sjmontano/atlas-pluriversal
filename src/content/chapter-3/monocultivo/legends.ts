import type { LegendItem } from '../../../types/layer'
import { TEXTO_MONOCULTIVO } from '../shared'

// Leyenda v17 (sección monocultivo): 8 filas con insignia, sin ojos.
const VALLE = '/assets/legends/cap2-valle'
const CAP3 = '/assets/legends/cap3'

const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
  extra?: Partial<LegendItem>,
): LegendItem => ({ id, name, icon, order, ...extra })

export const LEGENDS: LegendItem[] = [
  legenda('monocultivo-leyenda-rios-principales', 'Ríos principales', `${VALLE}/riosPrincipales.svg`, 10),
  legenda('monocultivo-leyenda-rios-tributarios', 'Ríos tributarios', `${VALLE}/riosTributarios.svg`, 20),
  legenda('monocultivo-leyenda-represas', 'Represas', `${VALLE}/represas.svg`, 30),
  legenda('monocultivo-leyenda-zonas-urbanas', 'Zonas urbanas', `${CAP3}/zonaUrbana.svg`, 40),
  legenda('monocultivo-leyenda-red-vial', 'Red víal', `${VALLE}/redVial.svg`, 50),
  legenda('monocultivo-leyenda-fincas-tradicionales', 'Fincas tradicionales y cultivos diversos.', `${CAP3}/fincaTra.svg`, 60),
  legenda('monocultivo-leyenda-bosques', 'Bosques', `${CAP3}/zonaVerde.svg`, 70),
  legenda(
    'monocultivo-leyenda-monocultivos',
    'Monocultivos (caña de azúcar)',
    `${CAP3}/cañaAzucar.svg`,
    80,
    { longText: TEXTO_MONOCULTIVO },
  ),
]
