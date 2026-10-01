import type { Poi } from '../../../types/poi'

/**
 * 📍 Topónimos del mosaico de cuencas (port de v17 toponimos/tejidosDelAgua.js).
 * El `numero` de cada POI coincide con el icono y el modal de su cuenca
 * (`cap1-cuenca-<slug>`), así el click abre la ficha "Soy una cuenca…".
 */

const cuenca = (
  numero: number,
  slug: string,
  name: string,
  coords: [number, number],
  capa = '',
): Poi => ({
  id: `poi-mosaicos-cuenca-${numero}`,
  numero,
  name,
  capa,
  coords,
  variant: 'number',
  modalId: `cap1-cuenca-${slug}`,
  popup: { title: name },
})

export const POIS: Poi[] = [
  cuenca(1, 'piendamo', 'Cuenca río Piendamó', [-76.358227, 2.658617]),
  cuenca(2, 'salado', 'Cuenca río Salado', [-76.755442, 2.85712], 'y otros directos al río Cauca'),
  cuenca(3, 'ovejas', 'Cuenca río Ovejas', [-76.478, 2.77]),
  cuenca(4, 'timba', 'Cuenca río Timba', [-76.696899, 3.049322]),
  cuenca(5, 'quinamayo', 'Cuenca río Quinamayó', [-76.498159, 2.993928], 'y otros directos al río Cauca'),
  cuenca(6, 'claro-jamundi', 'Cuencas ríos Claro y Jamundí', [-76.605457, 3.188538]),
  cuenca(7, 'palo', 'Cuenca río Palo', [-76.252, 3.045]),
  cuenca(8, 'lili-melendez-canaveralejo', 'Cuencas ríos Lili, Meléndez y Cañaveralejo', [-76.534, 3.31111]),
  cuenca(9, 'desbaratado', 'Cuenca río Desbaratado', [-76.38151, 3.242923]),
  cuenca(10, 'cali', 'Cuenca río Cali', [-76.574864, 3.397155]),
  cuenca(11, 'guachal', 'Cuenca río Guachal', [-76.298468, 3.330369], '(Bolo - Fraile y Párraga)'),
]
