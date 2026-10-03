import type { Encuadre } from '../../../types/content'

/* Etiquetas de tramos del mapa humedales — port de v17
 * (src/data/geojsonLayers/tramos.js `namesTramos`, coords verbatim).
 * Son etiquetas estáticas: con `modalId` abren su modal full-bleed
 * (`cap3-tramo-1..4`). Sin `targetMapId` el click no navega. */
const LABEL_W = 300

export const ENCUADRES: Encuadre[] = [
  {
    id: 'tramo-cap3-1',
    name: 'Tramo 1: Buenos Aires - Yumbo',
    labelCoords: [-76.385307, 3.465347],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-1',
  },
  {
    id: 'tramo-cap3-2',
    name: 'Tramo 2: Yumbo - San Pedro',
    labelCoords: [-76.383307, 3.922157],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-2',
  },
  {
    id: 'tramo-cap3-3',
    name: 'Tramo 3: San Pedro - Zarzal',
    labelCoords: [-76.380307, 4.390433],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-3',
  },
  {
    id: 'tramo-cap3-4',
    name: 'Tramo 4: Zarzal - La Victoria',
    labelCoords: [-76.377307, 4.86483],
    labelMaxWidth: LABEL_W,
    modalId: 'cap3-tramo-4',
  },
]
