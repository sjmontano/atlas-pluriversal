import type { Poi } from '../../../types/poi'
import { cld, defineMap, sb } from '../../kit.ts'

const arrow = (id: string, numero: number, name: string, coords: [number, number], icon: string, angle: number, modalId?: string): Poi => ({
  id,
  numero,
  name,
  coords,
  capa: 'Nodo Villa Rica',
  variant: 'arrow',
  icon,
  angle,
  modalId,
  popup: { title: name, image: icon },
})

export default defineMap({
  id: 'chapter2-villa-rica',
  title: 'Entramado territorial Villa Rica con sus alternativas transformadoras',
  minimap: 'villa-rica',
  zoomMax: 13,
  tiles: { mode: 'detail', source: 'cap2/alternativas-villa-rica.png' },
  sidebar: [
    sb.ficha('FichasCap2/Entramado territorial Villa Rica con sus alternativas transformadoras.pdf'),
    sb.modal('galeria', 'cap2-galeria-villa-rica'),
    sb.descarga('MapasCap2/Mapa alternativas transformadoras villa rica.png'),
    sb.sintesis('chapter2-m-villa-rica'),
  ],
  geo: { pgw: [0, 0.000055581180, 0.000055587544, 0, -76.549878031544, 2.974893043424], width: 4960, height: 8818 },
  base: cld('v1759512655/geoImages/pdxepthixmeebgei59yq.webp'),
  full: cld('v1759512616/geoImages/sj5c6kcyz8oilmta1ra8.webp'),
  pois: [
    arrow('poi-cap2-villarica-casa-nino', 2, 'Casa del Niño y de La Niña', [-76.44941, 3.185797], cld('v1761186701/geoImages/pyhbpjnlbhiezwueuzxb.webp'), 275, 'cap2-at-casa-nino'),
    arrow('poi-cap2-villarica-huellas', 3, 'Huellas', [-76.460893, 3.174849], cld('v1761187057/geoImages/dtarbfe6sduopq1q4xca.webp'), 310, 'cap2-at-palenques-juveniles'),
    arrow('poi-cap2-villarica-uaofroc', 4, 'UAOFROC', [-76.423267, 3.225334], cld('v1761187126/geoImages/ki5sktr8jnwo2oowkpqt.webp'), 250, 'cap2-at-uoafroc'),
    arrow('poi-cap2-villarica-territorio-paz', 5, 'Consejo Comunitario Territorio y Paz', [-76.450547, 3.228123], cld('v1761187204/geoImages/to8dj0cmmtlzlztkvqr7.webp'), 130, 'cap2-at-territorio-paz'),
  ],
})
