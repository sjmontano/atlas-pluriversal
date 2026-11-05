import { cld, defineMap, group, rasterFrame, sb } from '../../kit.ts'
import { SWATCH } from '@content/theme/swatches'
import { LEG_RIO_CAUCA, TEXTO_CUERPOS_DE_AGUA } from '../shared'

const pgw = [0, 0.000065247158, 0.000065249271, 0, -76.744923302940, 3.108582581431] as const

const capa = rasterFrame({ pgw, width: 4960, height: 8822, group: 'cali-1937', iconDir: '/assets/legends/cap3' })

export default defineMap({
  id: 'chapter3-cali-deseca',
  title: 'Cali deseca',
  minimap: 'cali',
  zoomMax: 13,
  tiles: { mode: 'detail', source: 'cap3/cali-deseca.png' },
  sidebar: [
    sb.presentacion('cap3-presentacion-cali-deseca'),
    sb.ficha('FichasCap3/Cali deseca.pdf'),
    sb.descarga('MapasCap3/Cali deseca.pdf'),
  ],
  geo: { pgw, width: 4960, height: 8822 },
  base: cld('v1763852352/geoImages/maiachqmczyrhmph1rql.webp'),
  full: cld('v1763852262/geoImages/llovghvucpft64ea6zad.webp'),
  layers: [
    capa({ id: 'cali1937-cuerpos-de-agua', name: 'Cuerpos de agua', image: cld('v1764432532/geoImages/njp7ngydvrkqtcrkg8pm.webp'), swatch: SWATCH.rio, order: 10, icon: 'cuerpoAgua.svg' }),
    capa({ id: 'cali1937-area-urbana', name: 'Área urbana', image: cld('v1764430100/geoImages/gfi90kqtutbhqgo1zc2m.png'), swatch: SWATCH.zonaUrbana, order: 20, icon: 'urbanA.svg' }),
  ],
  // Año 1937 v17 (caliDeseca): encabezado con ojo, sin número ni chevron.
  // '2022' es sección libre de leyenda.
  groups: [group('cali-1937', '1937', 1, { numbered: false, collapsible: false })],
  // Literales: LEG_RIO_CAUCA emite swatch antes de order y estas filas llevan
  // swatch (legendas no lo admite); el snapshot compara el orden de claves.
  legends: [
    { ...LEG_RIO_CAUCA('cali-deseca-leyenda-rio-cauca', 10), group: '2022' },
    {
      id: 'cali-deseca-leyenda-cuerpos-de-agua',
      name: 'Cuerpos de agua',
      swatch: SWATCH.rio,
      group: '2022',
      order: 20,
      longText: TEXTO_CUERPOS_DE_AGUA,
    },
    {
      id: 'cali-deseca-leyenda-area-urbana',
      name: 'Área urbana',
      swatch: SWATCH.zonaUrbana,
      group: '2022',
      order: 30,
    },
  ],
  /**
   * POI de audio — "Cali deseca" (port del btnAudioPlay de v17).
   * En el old era un overlay HTML fijo (audio.svg en 55vw/73vh) que abría el
   * reproductor con `Cali_47SNA.mp3`. Aquí es un POI geo-referenciado
   * variante `audio`: círculo teal + glyph de bocina + pulso que respira.
   */
  pois: [
    {
      id: 'poi-cap3-cali-deseca-oriente',
      name: 'Iris Moreno y Alexánder Álvarez',
      coords: [-76.493, 3.435],
      capa: 'Oriente de Cali',
      variant: 'audio',
      size: 'large',
      popup: {
        title: 'Iris Moreno y Alexánder Álvarez. Oriente de Cali',
        audio: '/assets/audios/chapter3/Cali_47SNA.mp3',
      },
    },
  ],
})
