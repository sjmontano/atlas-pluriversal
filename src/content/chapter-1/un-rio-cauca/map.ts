import { cld, defineMap, group, rasterFrame, sb } from '../../kit.ts'
import type { LegendItem } from '../../../types/layer'

const base = cld('v1752360349/geoImages/icivkz04s6s4ka6onht8.webp')

const URIO_CAUCA_BASE = '/assets/maps/capas/un-rio-cauca'

// Las capas comparten un footprint propio (distinto del `geo` del mapa) y
// entran todas encendidas; sin swatch: la leyenda son las filas estáticas.
const urio = rasterFrame({
  pgw: [0, 0.001232510189, 0.0012309569997728162, 0, -79.27447278696201, -0.6228009147673822],
  width: 5836,
  height: 10388,
  category: 'rivers',
})

const urioLayer = (id: string, name: string, grupo: string, order: number, opacity: number = 0.8) =>
  urio({ id: `urc-${id}`, name, image: `${URIO_CAUCA_BASE}/${id}.webp`, group: grupo, order, opacity, visibleByDefault: true })

// Filas estáticas v17 (menuCapas/Chapter1.jsx): icono plano + nombre,
// anidadas por id de grupo (sin insignia, sin ojo). El ojo del grupo
// alterna su capa; `header: false` en los grupos oculta el encabezado.
const ICONS = '/assets/legends/un-rio-cauca'

const legenda = (id: string, name: string, icon: string | null, order: number, grupo: string): LegendItem => ({
  id,
  name,
  ...(icon === null ? {} : { icon: `${ICONS}/${icon}` }),
  bare: true,
  order,
  group: grupo,
})

// Grupos planos v17 (menuCapas/Chapter1.jsx): una capa por grupo + filas
// estáticas, sin encabezado ni número — solo el ojo + la leyenda.
// El `name` alimenta el aria-label del ojo (no se muestra).
const flat = (id: string, name: string, order: number) => group(id, name, order, { header: false })

export default defineMap({
  id: 'chapter1-un-rio-cauca',
  title: 'Un río Cauca, muchos mundos... en transición',
  minimap: 'cuenca',
  sidebar: [
    sb.presentacion('cap1-presentacion-un-rio-cauca'),
    sb.ficha('FichasCap1/UnRioCaucaCap1.pdf'),
    sb.descarga('MapasCap1/Un rio Cauca muchos mundos en transicion.png'),
  ],
  geo: { pgw: [0, 0.001232510189, 0.0012309569997728162, 0, -79.4475590385131, -0.5982582430346929], width: 6082, height: 10826 },
  base,
  full: base,
  zoomMax: 8,
  tiles: { mode: 'detail', source: 'cap1/un-rio-cauca.png' },
  layers: [
    urioLayer('parteaguas-estrellas-fluviales', 'Parteaguas y estrellas fluviales', 'urc-1', 100, 0.8),
    urioLayer('planicies', 'Planicies', 'urc-2', 200, 0.8),
    urioLayer('aguas-superficiales', 'Aguas superficiales', 'urc-3', 300, 1),
    urioLayer('paramos-nivales-volcanes', 'Páramos, nivales y volcanes', 'urc-4', 400, 0.8),
    urioLayer('cuenca-rio-cauca', 'Cuenca del río Cauca', 'urc-5', 500, 1),
    urioLayer('vias', 'Vías', 'urc-6', 600, 0.8),
    urioLayer('areas-metropolitanas', 'Áreas metropolitanas', 'urc-7', 700, 1),
  ],
  groups: [
    flat('urc-1', 'Parteaguas, estrellas fluviales, macizos y cordilleras', 1),
    flat('urc-2', 'Planicies', 2),
    flat('urc-3', 'Aguas superficiales', 3),
    flat('urc-4', 'Páramos, nivales y volcanes', 4),
    flat('urc-5', 'Alto, Medio y Bajo Cauca', 5),
    flat('urc-6', 'Vías principales, proyectadas y caminos alternos', 6),
    flat('urc-7', 'Áreas metropolitanas', 7),
  ],
  legends: [
    legenda('urc-leyenda-parteaguas', 'Parteaguas', 'Parteaguas.webp', 10, 'urc-1'),
    legenda('urc-leyenda-estrellas', 'Estrellas fluviales', 'Estrellas_fluviales.webp', 20, 'urc-1'),
    legenda('urc-leyenda-macizo', 'Macizo', 'Macizo.webp', 30, 'urc-1'),
    legenda('urc-leyenda-cordillera', 'Cordillera', 'cordillera.webp', 40, 'urc-1'),

    legenda('urc-leyenda-planicies', 'Planicies', 'Planicies.webp', 50, 'urc-2'),

    legenda('urc-leyenda-aguas', 'Aguas superficiales', 'AguasSuperficiales2.webp', 60, 'urc-3'),

    legenda('urc-leyenda-paramos', 'Páramos', 'Paramos.webp', 70, 'urc-4'),
    legenda('urc-leyenda-niviales', 'Nivales', 'Niviales.webp', 80, 'urc-4'),
    legenda('urc-leyenda-volcanes', 'Volcanes', 'Volcanes.webp', 90, 'urc-4'),

    legenda('urc-leyenda-alto', 'Alto Cauca', 'AltoCauca.webp', 100, 'urc-5'),
    legenda('urc-leyenda-medio', 'Cauca Medio', 'CaucaMedio.webp', 110, 'urc-5'),
    legenda('urc-leyenda-bajo', 'Bajo Cauca', 'BajoCauca.webp', 120, 'urc-5'),

    legenda('urc-leyenda-vias-principales', 'Vías principales', 'ViasPrincipales.webp', 130, 'urc-6'),
    legenda('urc-leyenda-vias-proyectadas', 'Vías proyectadas', null, 140, 'urc-6'),
    legenda('urc-leyenda-caminos', 'Caminos alternos', 'CaminosAlternos.webp', 150, 'urc-6'),

    legenda('urc-leyenda-areas-metro', 'Áreas metropolitanas', 'AreasMetropolitanas.webp', 160, 'urc-7'),
  ],
  /* Port v17 (MapComponent.jsx): océanos, solo vistas Colombia completa. */
  oceanLabels: [
    { id: 'oceano-pacifico', name: 'OCÉANO PACÍFICO', coords: [-78.45, 6.3] },
    { id: 'mar-caribe', name: 'MAR CARIBE', coords: [-76.5319, 11.85] },
  ],
})
