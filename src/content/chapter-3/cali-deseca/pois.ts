import type { Poi } from '../../../types/poi'

/**
 * POI de audio — "Cali deseca" (port del btnAudioPlay de v17).
 * En el old era un overlay HTML fijo (audio.svg en 55vw/73vh) que abría el
 * reproductor con `Cali_47SNA.mp3`. Aquí es un POI geo-referenciado
 * variante `audio`: círculo teal + glyph de bocina + pulso que respira.
 */
export const POIS: Poi[] = [
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
]
