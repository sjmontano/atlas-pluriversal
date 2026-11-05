import { cld, defineMap, legendas, sb } from '../../kit.ts'
import { nodeLayer } from '../shared.ts'

// Leyenda v17 (MVillaRica, layerMenu.jsx): puramente informativa, sin ojos.
// Arranca con 3 filas sin encabezado.
const V = '/assets/legends/sintesis/villa-rica'
const V2 = '/assets/legends/cap2-valle'

export default defineMap({
  id: 'chapter2-m-villa-rica',
  title: 'Síntesis territorial de Villa Rica',
  minimap: 'villa-rica',
  zoomMax: 13,
  tiles: { mode: 'detail', source: 'cap2/modelo-territorial-villa-rica.png' },
  sidebar: [
    sb.presentacion('cap2-sintesis-villa-rica'),
    sb.ficha('FichasCap2/Modelo territorial de Villa Rica.pdf'),
    sb.descarga('MapasCap2/Modelo territorial de Villa Rica.pdf'),
  ],
  geo: { pgw: [0, 0.000036518263, 0.000036520866, 0, -76.53721204001468, 2.9674982215900085], width: 7015, height: 12472 },
  base: cld('v1759612261/geoImages/pabcndrbg0gjx29iuccg.webp'),
  full: cld('v1767891949/geoImages/knk721fgkqtvdxnppxzr.webp'),
  layers: [nodeLayer('nodo-villa-rica', 'Nodo Villa Rica', '/data/nodos/villa-rica.geojson', '#ffea2b')],
  legends: [
    ...legendas('mvr', '', undefined, 10, [
      { id: 'cabeceras', name: 'Cabeceras municipales' },
      ['cuerpos-agua', 'Cuerpos de agua', `${V2}/riosPrincipales.svg`],
      ['red-vial', 'Red vial', `${V2}/redVial.svg`],
    ]),
    ...legendas('mvr', '', 'Lo estructural', 40, [
      ['fincas', 'Fincas tradicionales, bosques, zonas verdes y policultivos', `${V}/fincaTradicional.svg`],
    ]),
    ...legendas('mvr', '', 'Lo emblemático o notable', 50, [
      ['lugares', 'Lugares emblemáticos', `${V}/lugaresEmblematicos.svg`],
      ['panamericana', 'Vía Panamericana', `${V}/panamericana.svg`],
    ]),
    ...legendas('mvr', '', 'Lo problemático o conflictivo', 70, [
      ['ingenios', 'Ingenios', `${V}/ingenios.svg`],
      ['haciendas', 'Haciendas', `${V}/haciendas.svg`],
      ['zona-industrial', 'Zona industrial', `${V}/zonaIndustrial.svg`],
      ['cana', 'Caña de azúcar', `${V}/canaAzucar.svg`],
      ['proyectos', 'Proyectos de urbanización', `${V}/proyectosUrbanizacion.svg`],
      ['lagos', 'Lagos de minería de arcilla', `${V}/lagosMineria.svg`],
      ['ganaderia', 'Ganadería', `${V}/ganaderia.svg`],
    ]),
    ...legendas('mvr', '', 'Lo transformador', 140, [
      ['casa-nino', 'Asociación cultural casa del niño y la niña', `${V}/casaNiña.svg`],
      ['consejos-titulados', 'Consejos comunitarios titulados', `${V}/consejoTitulado.svg`],
      ['consejos', 'Consejos Comunitarios', `${V}/concejoComunitario.svg`],
    ]),
  ],
})
