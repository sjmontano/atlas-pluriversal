import type { Encuadre } from '../../../types/content'

/* Etiquetas de tramos del mapa humedales — port de v17
 * (src/data/geojsonLayers/tramos.js `namesTramos`, coords verbatim).
 * Son etiquetas estáticas sin polígono ni navegación: sin `url` el
 * manager rinde solo la píldora + source calibrable; sin `targetMapId`
 * el click no navega. En el panel salen como target 'Encuadres: 4'
 * (mueve solo la etiqueta, copia emite labelCoords). */
const LABEL_W = 300

export const ENCUADRES: Encuadre[] = [
  {
    id: 'tramo-cap3-1',
    name: 'Tramo 1: Buenos Aires - Yumbo',
    labelCoords: [-76.385307, 3.465347],
    labelMaxWidth: LABEL_W,
  },
  {
    id: 'tramo-cap3-2',
    name: 'Tramo 2: Yumbo - San Pedro',
    labelCoords: [-76.383307, 3.922157],
    labelMaxWidth: LABEL_W,
  },
  {
    id: 'tramo-cap3-3',
    name: 'Tramo 3. San Pedro - Zarzal',
    labelCoords: [-76.380307, 4.390433],
    labelMaxWidth: LABEL_W,
  },
  {
    id: 'tramo-cap3-4',
    name: 'Tramo 4: Zarzal - La Victoria',
    labelCoords: [-76.377307, 4.86483],
    labelMaxWidth: LABEL_W,
  },
]
