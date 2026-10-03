import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (MVillaRica, layerMenu.jsx): puramente informativa, sin ojos.
// Arranca con 3 filas sin encabezado.
const V = '/assets/legends/sintesis/villa-rica'
const V2 = '/assets/legends/cap2-valle'

const legenda = (
  id: string,
  name: string,
  icon: string | null,
  order: number,
  group?: string,
): LegendItem => ({
  id,
  name,
  ...(icon === null ? {} : { icon }),
  order,
  ...(group === undefined ? {} : { group }),
})

const G = {
  estructural: 'Lo estructural',
  emblematico: 'Lo emblemático o notable',
  problematico: 'Lo problemático o conflictivo',
  transformador: 'Lo transformador',
} as const

export const LEGENDS: LegendItem[] = [
  legenda('mvr-cabeceras', 'Cabeceras municipales', null, 10),
  legenda('mvr-cuerpos-agua', 'Cuerpos de agua', `${V2}/riosPrincipales.svg`, 20),
  legenda('mvr-red-vial', 'Red Víal', `${V2}/redVial.svg`, 30),
  legenda('mvr-fincas', 'Fincas tradicionales, bosques, zonas verdes y policultivos', `${V}/fincaTradicional.svg`, 40, G.estructural),
  legenda('mvr-lugares', 'Lugares emblemáticos', `${V}/lugaresEmblematicos.svg`, 50, G.emblematico),
  legenda('mvr-panamericana', 'Vía Panamericana', `${V}/panamericana.svg`, 60, G.emblematico),
  legenda('mvr-ingenios', 'Ingenios', `${V}/ingenios.svg`, 70, G.problematico),
  legenda('mvr-haciendas', 'Haciendas', `${V}/haciendas.svg`, 80, G.problematico),
  legenda('mvr-zona-industrial', 'Zona industrial', `${V}/zonaIndustrial.svg`, 90, G.problematico),
  legenda('mvr-cana', 'Caña de azúcar', `${V}/canaAzucar.svg`, 100, G.problematico),
  legenda('mvr-proyectos', 'Proyectos de urbanización', `${V}/proyectosUrbanizacion.svg`, 110, G.problematico),
  legenda('mvr-lagos', 'Lagos de minería de arcilla', `${V}/lagosMineria.svg`, 120, G.problematico),
  legenda('mvr-ganaderia', 'Ganadería', `${V}/ganaderia.svg`, 130, G.problematico),
  legenda('mvr-casa-nino', 'Asociación cultural casa del niño y la niña', `${V}/casaNiña.svg`, 140, G.transformador),
  legenda('mvr-consejos-titulados', 'Consejos comunitarios titulados', `${V}/consejoTitulado.svg`, 150, G.transformador),
  legenda('mvr-consejos', 'Consejos Comunitarios', `${V}/concejoComunitario.svg`, 160, G.transformador),
]
