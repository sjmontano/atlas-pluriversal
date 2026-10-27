import { makeMap } from '../../_map.ts'
import { LAYERS } from './layers'
import { GROUPS } from './groups'
import { POIS } from './pois'
import { SUBCUENCAS } from './rivers'

export default makeMap({
  mapId: 'chapter1-mosaicos-del-agua',
  ui: {
    title: 'Mosaico de cuencas y aguas',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap1-presentacion-mosaicos-del-agua' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: '/pdf/FichasTecnicas/FichasCap1/Mosaicos_subcuencas_Cap1.pdf' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: '/pdf/Descargables/MapasCap1/Mosaico de cuencas y aguas.pdf' },
    ],
  },
  geo: {
    pgw: [0, 0.000166382730, 0.000166392514, 0, -76.968456199726, 2.161908918459] as const,
    width: 5845,
    height: 10393,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360161/geoImages/fpno8nmueqi0duweghhf.webp',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360193/geoImages/ycxghm0xralzkptnbqqj.webp',
  zoomMax: 11,
  extras: { layers: LAYERS, groups: GROUPS, pois: POIS, subcuencas: SUBCUENCAS },
})
