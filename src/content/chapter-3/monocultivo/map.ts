import { cld, defineMap, legendas, sb } from '../../kit.ts'
import { TEXTO_MONOCULTIVO } from '../shared'

const VALLE = '/assets/legends/cap2-valle'

export default defineMap({
  id: 'chapter3-monocultivo',
  title: 'El desierto verde del valle alto del río Cauca',
  minimap: 'sur',
  zoomMax: 12,
  tiles: { mode: 'detail', source: 'cap3/el-desierto-verde.png' },
  sidebar: [
    sb.presentacion('cap3-presentacion-monocultivo'),
    sb.ficha('FichasCap3/Monocultivo de cana de azucar.pdf'),
    sb.descarga('MapasCap3/Monocultivo de cana de azucar.pdf'),
    sb.link('datos', 'https://docs.google.com/spreadsheets/d/1TtjNpRPwglIfDh-EvJ6u3_XTIhzcpG-i/edit?usp=sharing'),
  ],
  geo: {
    pgw: [0, 0.000307843615, 0.0003078655575, 0, -76.939551386912, 2.497068728525] as const,
    width: 2806,
    height: 4989,
  },
  base: cld('v1762996447/geoImages/rvdipsrqu6fbn4repgay.webp'),
  full: cld('v1762996331/geoImages/jje1a33z8enjmlrwfa4j.webp'),
  // Leyenda v17 (sección monocultivo): 8 filas con insignia, sin ojos.
  legends: legendas('monocultivo-leyenda', '/assets/legends/cap3', undefined, 10, [
    ['rios-principales', 'Ríos principales', `${VALLE}/riosPrincipales.svg`],
    ['rios-tributarios', 'Ríos tributarios', `${VALLE}/riosTributarios.svg`],
    ['represas', 'Represas', `${VALLE}/represas.svg`],
    ['zonas-urbanas', 'Zonas urbanas', 'zonaUrbana.svg'],
    ['red-vial', 'Red vial', `${VALLE}/redVial.svg`],
    ['fincas-tradicionales', 'Fincas tradicionales y cultivos diversos.', 'fincaTra.svg'],
    ['bosques', 'Bosques', 'zonaVerde.svg'],
    { id: 'monocultivos', name: 'Monocultivos (caña de azúcar)', icon: 'cañaAzucar.svg', longText: TEXTO_MONOCULTIVO },
  ]),
})
