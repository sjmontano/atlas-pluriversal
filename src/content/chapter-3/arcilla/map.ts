import { cld, defineMap, group, legendas, rasterFrame, sb } from '../../kit.ts'
import { SWATCH } from '@content/theme/swatches'

const pgw = [0, 0.000010359711, 0.000010359732, 0, -76.462515214762, 3.159866654268] as const

const capa = rasterFrame({ pgw, width: 3937, height: 7000, group: 'arcilla-lagos', iconDir: '/assets/legends/cap3' })

export default defineMap({
  id: 'chapter3-arcilla',
  title: 'Aguas que llegan',
  minimap: 'villa-rica',
  zoomMax: 16,
  tiles: { mode: 'detail', source: 'cap3/aguas-que-llegan.png' },
  sidebar: [
    sb.presentacion('cap3-presentacion-arcilla'),
    sb.ficha('FichasCap3/Aguas que llegan.pdf'),
    sb.descarga('MapasCap3/Aguas que llegan.pdf'),
  ],
  geo: {
    pgw: [0, 0.000020719422, 0.000020719464, 0, -76.462515214762, 3.159866654268] as const,
    width: 1969,
    height: 3500,
  },
  base: cld('v1763846278/geoImages/zbtnuchm9uvshuqnaota.webp'),
  full: cld('v1763845021/geoImages/ps2z0y6in7o5bbvjedyz.webp'),
  layers: [
    capa({ id: 'enExplotacion', name: 'En explotación (abiertos)', image: cld('v1764944934/geoImages/qzloplawdce64nyoiedi.webp'), swatch: SWATCH.explotacion, order: 10, icon: 'explotacionAbiertos.svg' }),
    capa({ id: 'enReanatualizacion', name: 'En proceso renaturalización', image: cld('v1764946045/geoImages/sspftyweahtwn6ibv3hx.webp'), swatch: SWATCH.renaturalizacion, order: 20, icon: 'procesoNaturalizacion.svg' }),
    capa({ id: 'enRellenados', name: 'Rellenados (cerrados)', image: cld('v1764946527/geoImages/mvyoglamwzd6uq5rfxig.webp'), swatch: SWATCH.relleno, order: 30, icon: 'rellenos.svg' }),
  ],
  // Encabezado estático v17 (sin ojo, sin número, sin chevron): las 3 capas
  // se alternan individual y las filas estáticas cuelgan del grupo.
  groups: [group('arcilla-lagos', 'Lagos de minería de arcillas', 1, { eye: false, numbered: false, collapsible: false })],
  // Filas estáticas v17 (sección arcilla): cuelgan del grupo 'arcilla-lagos'
  // (group = id) y se renderizan tras las 3 capas con ojo.
  legends: legendas('arcilla-leyenda', '/assets/legends/cap3', 'arcilla-lagos', 40, [
    ['fincas-tradicionales', 'Fincas tradicionales, cultivos diversos y bosques.', 'fincaTradi.svg'],
    ['titulo-minero', 'Título minero vigente', 'tituloMinero.svg'],
    ['veredas', 'Veredas', 'veredas.svg'],
    ['rios-quebradas', 'Ríos y quebradas', 'quebradas.svg'],
  ]),
})
