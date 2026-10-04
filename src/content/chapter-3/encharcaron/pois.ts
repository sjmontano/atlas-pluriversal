import type { Poi } from '../../../types/poi'

/**
 * POI de audio — "Nos encharcaron el río" (port del btnAudioPlay de v17).
 * En el old era un overlay HTML fijo (audio.svg en 67vw/76vh) que abría el
 * reproductor con `Salvajina_47SNA.mp3`. Aquí es un POI geo-referenciado
 * variante `audio`: círculo teal + glyph de bocina + pulso que respira.
 */
export const POIS: Poi[] = [
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
]
