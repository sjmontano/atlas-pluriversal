import type { Poi } from '../../../types/poi'

const CLOUD = 'https://res.cloudinary.com/dvluvxfvn/image/upload'

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

export const POIS: Poi[] = [
  arrow('poi-cap2-villarica-casilda', 1, 'Casilda Cundumí', [-76.461, 3.178], `${CLOUD}/v1761186657/geoImages/wwd81a1kiqgrxi4fra4v.webp`, 310, 'cap2-at-escuela-itinerante'),
  arrow('poi-cap2-villarica-casa-nino', 2, 'Casa del Niño y de La Niña', [-76.45, 3.183], `${CLOUD}/v1761186701/geoImages/pyhbpjnlbhiezwueuzxb.webp`, 275, 'cap2-at-casa-nino'),
  arrow('poi-cap2-villarica-huellas', 3, 'Huellas', [-76.429, 3.213], `${CLOUD}/v1761187057/geoImages/dtarbfe6sduopq1q4xca.webp`, 310, 'cap2-at-palenques-juveniles'),
  arrow('poi-cap2-villarica-uaofroc', 4, 'UAOFROC', [-76.425, 3.226], `${CLOUD}/v1761187126/geoImages/ki5sktr8jnwo2oowkpqt.webp`, 250, 'cap2-at-uoafroc'),
  arrow('poi-cap2-villarica-territorio-paz', 5, 'Consejo Comunitario Territorio y Paz', [-76.453, 3.23], `${CLOUD}/v1761187204/geoImages/to8dj0cmmtlzlztkvqr7.webp`, 130, 'cap2-at-territorio-paz'),
]
