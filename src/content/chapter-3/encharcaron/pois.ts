import type { Poi } from '../../../types/poi'

/**
 * 📍 Tramos del mapa «Se encharca arriba se deseca abajo» (cap3-encharcaron).
 * Coordenadas portadas de v17 (src/data/geojsonLayers/tramos.js).
 * Cada POI abre su modal de imagen full-bleed (`cap3-tramo-1..4`).
 */

export const POIS: Poi[] = [
  {
    id: 'poi-encharcaron-tramo-1',
    name: 'Tramo 1: Buenos Aires - Yumbo',
    coords: [-76.40, 3.31] as [number, number],
    variant: 'number',
    numero: 1,
    modalId: 'cap3-tramo-1',
    popup: { title: 'Tramo 1: Buenos Aires - Yumbo' },
  },
  {
    id: 'poi-encharcaron-tramo-2',
    name: 'Tramo 2: Yumbo - San Pedro',
    coords: [-76.398, 3.78] as [number, number],
    variant: 'number',
    numero: 2,
    modalId: 'cap3-tramo-2',
    popup: { title: 'Tramo 2: Yumbo - San Pedro' },
  },
  {
    id: 'poi-encharcaron-tramo-3',
    name: 'Tramo 3: San Pedro - Zarzal',
    coords: [-76.395, 4.26] as [number, number],
    variant: 'number',
    numero: 3,
    modalId: 'cap3-tramo-3',
    popup: { title: 'Tramo 3: San Pedro - Zarzal' },
  },
  {
    id: 'poi-encharcaron-tramo-4',
    name: 'Tramo 4: Zarzal - La Victoria',
    coords: [-76.392, 4.73] as [number, number],
    variant: 'number',
    numero: 4,
    modalId: 'cap3-tramo-4',
    popup: { title: 'Tramo 4: Zarzal - La Victoria' },
  },
]