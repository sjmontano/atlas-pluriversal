import type { RasterPgwLayer } from '../../../types/layer'
import { rasterLayer, CLOUD } from '../shared'
import { SWATCH } from '@content/theme'

// PGW en el mismo marco rotado de la base ([0, B, D, 0, C, F]).
// v17 traía residuo ±4.5e-5 en A/E que el detector isRotatedPGW (ε=1e-10)
// no reconoce como rotado: la capa quedaba a 90° de la base (río E-O
// en vez de N-S). Con ceros exactos entra a convertRotatedPGW igual
// que la base y ambas calzan (v17 lo ignoraba igual con bounds rectos).
const PGW: readonly [number, number, number, number, number, number] = [
  0, 0.000247614932, 0.000247615558, 0, -77.374311108763, 2.939066887422,
]

export const LAYERS: RasterPgwLayer[] = [
  rasterLayer(
    'humedalesCapa1970',
    '1970',
    `${CLOUD}/v1763849225/geoImages/lbbcrnrecpdfu5kqf1vp.webp`,
    PGW,
    5118,
    9114,
    SWATCH.historico,
    10,
    { group: 'hum-1970' },
  ),
]
