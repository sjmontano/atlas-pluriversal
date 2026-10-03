import type { LegendItem } from '../../../types/layer'

// Leyenda informativa v17 (TNATransformadoras, layerMenu.jsx): 14 filas
// con insignia circular, SIN ojos — el menú solo describe, no alterna.

const ICONS = '/assets/legends/cap2-valle'

const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
): LegendItem => ({ id, name, icon: `${ICONS}/${icon}`, order })

export const LEGENDS: LegendItem[] = [
  legenda('valle-rio-cauca', 'Río Cauca', 'image.svg', 10),
  legenda('valle-rios-principales', 'Ríos principales', 'riosPrincipales.svg', 20),
  legenda('valle-rios-tributarios', 'Ríos tributarios', 'riosTributarios.svg', 30),
  legenda('valle-humedales', 'Humedales', 'humedales2.svg', 40),
  legenda('valle-represas', 'Represas', 'represas.svg', 50),
  legenda('valle-zonas-urbanas', 'Zonas urbanas', 'zonasUrbanas.svg', 60),
  legenda('valle-red-vial', 'Red víal', 'redVial.svg', 70),
  legenda('valle-areas-mixtas', 'Áreas mixtas (Fincas tradicionales, bosques, zonas verdes y policultivos)', 'areasMixtas.svg', 80),
  legenda('valle-monocultivos', 'Monocultivos (caña de azúcar y otros)', 'monocultivos.svg', 90),
  legenda('valle-sur-valle-alto', 'Sur del valle alto del río Cauca', 'surValleAlto.svg', 100),
  legenda('valle-entramados', 'Entramados territoriales', 'entramados.svg', 110),
  legenda('valle-nodo-suarez', 'Nodo-entramado territorial Suárez', 'suarez.svg', 120),
  legenda('valle-nodo-villa-rica', 'Nodo-entramado territorial Villa Rica', 'villaRica.svg', 130),
  legenda('valle-nodo-cali', 'Nodo-entramado territorial Oriente de Cali', 'cali.svg', 140),
]
