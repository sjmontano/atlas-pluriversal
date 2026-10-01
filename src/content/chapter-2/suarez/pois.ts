import type { Poi } from '../../../types/poi'

const CLOUD = 'https://res.cloudinary.com/dvluvxfvn/image/upload'

const arrow = (id: string, numero: number, name: string, coords: [number, number], icon: string, angle: number, modalId?: string): Poi => ({
  id,
  numero,
  name,
  coords,
  capa: 'Nodo Suárez',
  variant: 'arrow',
  icon,
  angle,
  modalId,
  popup: { title: name, image: icon },
})

export const POIS: Poi[] = [
  arrow('poi-cap2-suarez-asoyoge', 1, 'ASOYOGE', [-76.686, 2.93], `${CLOUD}/v1761185904/geoImages/jx2ox2ihls7j9pv15kbg.webp`, 330, 'cap2-at-asoyoge'),
  arrow('poi-cap2-suarez-guardia-cimarrona', 2, 'Guardia Cimarrona', [-76.691, 2.938], `${CLOUD}/v1761185272/geoImages/reblala1pv2puebswzmc.webp`, 0, 'cap2-at-guardia-cimarrona'),
  arrow('poi-cap2-suarez-asomuafroyo', 3, 'ASOMUAFROYO', [-76.682, 2.946], `${CLOUD}/v1761186008/geoImages/i44mm4ct4uxhaga8zlnj.webp`, 270, 'cap2-at-asomuafroyo'),
  arrow('poi-cap2-suarez-consejo-ovejas', 4, 'Consejo Comunitario de Comunidades Negras Cuenca Río Ovejas', [-76.682, 2.96], `${CLOUD}/v1761186036/geoImages/mbyeccjbklrgzx4c3824.webp`, 215, 'cap2-at-consejo-ovejas'),
  arrow('poi-cap2-suarez-plataforma-juventudes', 6, 'Plataforma de Juventudes', [-76.695, 2.953], `${CLOUD}/v1761186274/geoImages/nlbvtqpoldaecg2ym9ls.webp`, 105, 'cap2-at-plataforma-juventudes'),
  arrow('poi-cap2-suarez-cmj', 7, 'Consejo Municipal de Juventud', [-76.699, 2.956], `${CLOUD}/v1761186247/geoImages/ul3u7hmi5jzvmwgars7z.webp`, 105, 'cap2-at-cmj'),
]
