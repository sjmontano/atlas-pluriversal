import type { Poi } from '../../../types/poi'
import { cld, defineMap, sb } from '../../kit.ts'

const arrow = (id: string, numero: number, name: string, coords: [number, number], icon: string, angle: number, modalId?: string): Poi => ({
  id,
  numero,
  name,
  coords,
  capa: 'Nodo Oriente de Cali',
  variant: 'arrow',
  icon,
  angle,
  modalId,
  popup: { title: name, image: icon },
})

export default defineMap({
  id: 'chapter2-cali',
  title: 'Entramado territorial Oriente de Cali con sus alternativas transformadoras',
  minimap: 'cali',
  zoomMax: 15,
  tiles: { mode: 'detail', source: 'cap2/alternativas-cali.png' },
  sidebar: [
    sb.ficha('FichasCap2/Entramado territorial Distrito de Aguablanca Cali con sus alternativas transformadoras.pdf'),
    sb.modal('galeria', 'cap2-galeria-cali'),
    sb.descarga('MapasCap2/Mapa alternativas transformadoras del Oriente de Cali.pdf'),
    sb.sintesis('/capitulo/2/chapter2-m-oriente-cali'),
  ],
  geo: { pgw: [0, 0.000015918409, 0.000015918925, 0, -76.53676820822001, 3.348181582808], width: 4960, height: 8822 },
  base: cld('v1759512015/geoImages/roog2p6gjo3dnnqpcfel.webp'),
  full: cld('v1759511931/geoImages/ku7ikq6ottmty9pl91u0.webp'),
  pois: [
    arrow('poi-cap2-cali-chontaduro', 1, 'Casa del Chontaduro', [-76.486678, 3.432277], cld('v1761794279/geoImages/gqy5xtw09p0qfta46jr6.webp'), 270, 'cap2-at-casa-cultural'),
    arrow('poi-cap2-cali-huerta', 2, 'Huerta Madre La Laguna', [-76.486929, 3.433365], cld('v1761792935/geoImages/lnyyorgnj7zmdzzi93p1.webp'), 90, 'cap2-at-red-nativos'),
    arrow('poi-cap2-cali-chicas', 3, 'Chicas Comunicativas', [-76.495738, 3.413591], '/assets/pois/photos/organizaciones/chicas-comunicativas.webp', 140, 'cap2-at-chicas-comunicativas'),
    arrow('poi-cap2-cali-afroyoga-1', 4, 'Afro Yoga', [-76.506431, 3.390553], cld('v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp'), 140, 'cap2-at-afro-yoga'),
    arrow('poi-cap2-cali-afroyoga-2', 4, 'Afro Yoga', [-76.516033, 3.443108], cld('v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp'), 140, 'cap2-at-afro-yoga'),
    arrow('poi-cap2-cali-afroyoga-3', 4, 'Afro Yoga', [-76.489738, 3.45103], cld('v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp'), 140, 'cap2-at-afro-yoga'),
    arrow('poi-cap2-cali-matamba', 5, 'Revista Afro Juvenil Matamba', [-76.486678, 3.432277], cld('v1761794790/geoImages/mecisufjjucxdzzalslg.webp'), 270, 'cap2-at-matamba'),
    arrow('poi-cap2-cali-red-mujeres-1', 6, 'Red de mujeres y organizaciones del Oriente', [-76.480056, 3.447839], '/assets/pois/photos/organizaciones/mujeres-del-oriente.webp', 280, 'cap2-at-red-mujeres'),
    arrow('poi-cap2-cali-red-mujeres-2', 6, 'Red de mujeres y organizaciones del Oriente', [-76.521509, 3.435984], '/assets/pois/photos/organizaciones/mujeres-del-oriente.webp', 270, 'cap2-at-red-mujeres'),
  ],
})
