import { cld, defineMap, group, rasterFrame, sb } from '../../kit.ts'
import type { Poi } from '../../../types/poi'
import type { SubcuencaDef } from '../../../types/content'
import { WATER_H, WATER_PGW, WATER_W } from './footprint'

const WATER_BASE = '/assets/maps/capas/mosaicos-del-agua'

const water = rasterFrame({ pgw: WATER_PGW, width: WATER_W, height: WATER_H, category: 'ecosystems' })

// 7 imágenes de ~60Mpx: entran APAGADAS (el usuario enciende; el default de
// rasterFrame es apagado). Todas visibles a la vez = OOM en equipos modestos.
const waterLayer = (id: string, name: string, grupo: string, order: number, swatch: string, opacity?: number) =>
  water({ id: `mda-${id}`, name, image: `${WATER_BASE}/${id}.webp`, group: grupo, order, swatch, opacity })

/**
 * Topónimos del mosaico de cuencas (port de v17 toponimos/tejidosDelAgua.js).
 * El `numero` de cada POI coincide con el icono y el modal de su cuenca
 * (`cap1-cuenca-<slug>`), así el click abre la ficha "Soy una cuenca…".
 */
const cuenca = (numero: number, slug: string, name: string, coords: [number, number], capa = ''): Poi => ({
  id: `poi-mosaicos-cuenca-${numero}`,
  numero,
  name,
  capa,
  coords,
  variant: 'number',
  modalId: `cap1-cuenca-${slug}`,
  popup: { title: name },
})

/**
 * Subcuencas del mosaico: áreas por cuenca para resaltar en hover.
 * Port de v17 (atlas-old): `rasterTilesTejidosDelAgua.js` (Subcuenca_* en
 * `public/assets/capasRios/`) + `agregarToponimos.jsx` (mouseenter →
 * muestra la imagen de la cuenca). Arte copiado a local con nombres
 * normalizados por slug (el `modalId` de cada POI es `cap1-cuenca-<slug>`).
 *
 * Cobertura parcial heredada de v17: claro-jamundi usa solo Claro y
 * lili-melendez-canaveralejo usa solo Meléndez (no hay arte Lili/Jamundí/
 * Cañaveralejo); piendamo usa piendamo2 (no existe piendamo1 en v17).
 * Georreferenciación: mismo footprint que las capas de agua (WATER_PGW);
 * si alguna calza distinto, el panel dev la puede mover (capas image no,
 * pero el PGW del módulo sí).
 */
const sub = (slug: string, pgw: SubcuencaDef['pgw'], width: number, height: number): SubcuencaDef => ({
  slug,
  image: `${WATER_BASE}/subcuenca-${slug}.webp`,
  pgw,
  width,
  height,
})

export default defineMap({
  id: 'chapter1-mosaicos-del-agua',
  title: 'Mosaico de cuencas y aguas',
  minimap: 'sur',
  sidebar: [
    sb.presentacion('cap1-presentacion-mosaicos-del-agua'),
    sb.ficha('FichasCap1/Mosaicos_subcuencas_Cap1.pdf'),
    sb.descarga('MapasCap1/Mosaico de cuencas y aguas.png'),
  ],
  geo: { pgw: [0, 0.000166382730, 0.000166392514, 0, -76.968456199726, 2.161908918459], width: 5845, height: 10393 },
  base: cld('v1752360161/geoImages/fpno8nmueqi0duweghhf.webp'),
  full: cld('v1752360193/geoImages/ycxghm0xralzkptnbqqj.webp'),
  zoomMax: 11,
  tiles: { mode: 'detail', source: 'cap1/mosaicos-del-agua.png' },
  layers: [
    waterLayer('nubosidad', 'Nubosidad', 'mda-agua', 100, '#B1B2AE', 1),
    waterLayer('acuifero1', 'Acuífero del Valle del Cauca', 'mda-acuiferos', 200, '#7CB3B3'),
    waterLayer('acuifero2', 'Acuífero del Cauca', 'mda-acuiferos', 300, '#829D9D'),
    waterLayer('zonaDescarga', 'Descarga', 'mda-flujos', 400, '#6697B2'),
    waterLayer('zonaEquilibrio', 'Equilibrio', 'mda-flujos', 500, '#3DF4E8'),
    waterLayer('zonaRecarga', 'Recarga', 'mda-flujos', 600, '#8AF1CD'),
    waterLayer('zonaAcuifero', 'Zona con acuífero potencial sin estudio', 'mda-flujos', 700, '#9BD1C3'),
  ],
  groups: [
    group('mda-agua', 'El agua de arriba a abajo', 1),
    group('mda-acuiferos', 'Acuíferos', 2),
    group('mda-flujos', 'Flujos y zonas del acuífero', 3),
  ],
  pois: [
    cuenca(1, 'piendamo', 'Cuenca río Piendamó', [-76.341, 2.607]),
    cuenca(2, 'salado', 'Cuenca río Salado', [-76.816, 2.828], 'y otros directos al río Cauca'),
    cuenca(3, 'ovejas', 'Cuenca río Ovejas', [-76.478, 2.77]),
    cuenca(4, 'timba', 'Cuenca río Timba', [-76.744, 3.065]),
    cuenca(5, 'quinamayo', 'Cuenca río Quinamayó', [-76.498159, 2.993928], 'y otros directos al río Cauca'),
    cuenca(6, 'claro-jamundi', 'Cuencas ríos Claro y Jamundí', [-76.592, 3.249]),
    cuenca(7, 'palo', 'Cuenca río Palo', [-76.252, 3.045]),
    cuenca(8, 'lili-melendez-canaveralejo', 'Cuencas ríos Lili, Meléndez y Cañaveralejo', [-76.534, 3.385]),
    cuenca(9, 'desbaratado', 'Cuenca río Desbaratado', [-76.332, 3.299]),
    cuenca(10, 'cali', 'Cuenca río Cali', [-76.589, 3.472]),
    cuenca(11, 'guachal', 'Cuenca río Guachal', [-76.276, 3.45], '(Bolo - Fraile y Párraga)'),
  ],
  subcuencas: [
    sub('piendamo', [0, 0.000166, 0.000166, 0, -76.970182, 2.160647], 5893, 10477),
    sub('salado', [0, 0.000166, 0.000166, 0, -76.970182, 2.165771], 5844, 10390),
    sub('ovejas', [0, 0.000166, 0.000166, 0, -76.970182, 2.158158], 5893, 10477),
    sub('timba', [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], 5893, 10477),
    sub('quinamayo', [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], 5893, 10477),
    sub('claro-jamundi', [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], 5893, 10477),
    sub('palo', [0, 0.000166, 0.000166, 0, -76.96691, 2.166241], 5834, 10372),
    sub('lili-melendez-canaveralejo', [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], 5893, 10477),
    sub('desbaratado', [0, 0.000166, 0.000166, 0, -76.971656, 2.155522], 5893, 10477),
    sub('cali', [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], 5893, 10477),
    sub('guachal', [0, 0.000166, 0.000166, 0, -76.973057, 2.154454], 5893, 10477),
  ],
})
