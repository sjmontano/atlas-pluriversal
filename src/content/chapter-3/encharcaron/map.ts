import { cld, defineMap, group, legendas, rasterFrame, sb } from '../../kit.ts'
import { SWATCH } from '@content/theme/swatches'
import { TEXTO_RIO_CAUCA, TEXTO_SALVAJINA } from '../shared'

const pgw = [0, 0.000035559180, 0.000035560332, 0, -76.801058760121, 2.743972429392] as const

const capa = rasterFrame({ pgw, width: 4960, height: 8822, group: 'ench-1970' })

export default defineMap({
  id: 'chapter3-encharcaron',
  title: 'Nos encharcaron el río',
  minimap: 'suarez',
  zoomMax: 14,
  tiles: { mode: 'detail', source: 'cap3/nos-encharcaron-el-rio.png' },
  sidebar: [
    sb.presentacion('cap3-presentacion-encharcaron'),
    sb.ficha('FichasCap3/Nos encharcaron el rio.pdf'),
    sb.descarga('MapasCap3/Nos encharcaron el rio.png'),
  ],
  geo: { pgw, width: 4960, height: 8822 },
  base: cld('v1762998575/geoImages/ladieazp24oyoyqszzlo.webp'),
  full: cld('v1762997781/geoImages/b8zivpviw5iz5yz6cgbz.webp'),
  layers: [
    capa({ id: 'suarez1970', name: '1970', image: cld('v1764428583/geoImages/nq4xkltmzu1obibxz6sw.webp'), swatch: SWATCH.historico, order: 10 }),
  ],
  // Año 1970 v17 (nosEncharcaronElRio): encabezado con ojo, sin número ni
  // chevron; las 4 filas estáticas cuelgan del grupo. '2022' es sección libre.
  groups: [group('ench-1970', '1970', 1, { numbered: false, collapsible: false })],
  // Filas v17 (nosEncharcaronElRio): insignias, orden e iconos exactos.
  // '1970' cuelga del grupo 'ench-1970' (con ojo); '2022' es sección libre.
  // construccion.svg y represas.svg no existen en public (ver tests/content/integrity.test.ts).
  legends: [
    ...legendas('encharcaron-leyenda', '/assets/legends/cap3', 'ench-1970', 10, [
      ['construcciones-1970', 'Construcciones', 'hum.svg'],
      ['vias-1970', 'Vías', 'hum.svg'],
      ['quebradas-1970', 'Quebradas', '/assets/legends/cap2-valle/riosPrincipales.svg'],
      { id: 'rio-1970', name: 'Río Cauca', icon: 'rioCauca.svg', longText: TEXTO_RIO_CAUCA },
    ]),
    ...legendas('encharcaron-leyenda', '/assets/legends/cap3', '2022', 50, [
      ['construcciones-2022', 'Construcciones', 'construccion.svg'],
      { id: 'salvajina', name: 'Salvajina', icon: 'represas.svg', longText: TEXTO_SALVAJINA },
      ['red-hidrica', 'Red hídrica', '/assets/legends/cap2-valle/riosPrincipales.svg'],
    ]),
  ],
  /**
   * POI de audio — "Nos encharcaron el río" (port del btnAudioPlay de v17).
   * En el old era un overlay HTML fijo (audio.svg en 67vw/76vh) que abría el
   * reproductor con `Salvajina_47SNA.mp3`. Aquí es un POI geo-referenciado
   * variante `audio`: círculo teal + glyph de bocina + pulso que respira.
   */
  pois: [
    {
      id: 'poi-cap3-encharcaron-erley-ibarra',
      name: 'Erley Ibarra',
      coords: [-76.692, 2.955],
      capa: 'Suárez, Cauca',
      variant: 'audio',
      size: 'large',
      popup: {
        title: 'Erley Ibarra. Suárez, Cauca',
        audio: '/assets/audios/chapter3/Salvajina_47SNA.mp3',
      },
    },
  ],
})
