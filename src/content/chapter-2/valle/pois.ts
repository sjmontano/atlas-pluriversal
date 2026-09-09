import type { Poi } from '../../../types/poi'

const node = (id: string, name: string, coords: [number, number], targetMapId: string): Poi => ({
  id,
  name,
  coords,
  capa: `Nodo ${name}`,
  variant: 'icon',
  popup: { title: name },
  /* v17 (agregarToponimos.jsx): en el intro el clic navega al mapa del
   * nodo en vez de abrir modal. */
  targetMapId,
})

export const POIS: Poi[] = [
  node('poi-cap2-valle-suarez', 'Suárez', [-76.675597, 2.966693], 'chapter2-suarez'),
  node('poi-cap2-valle-villa-rica', 'Villa Rica', [-76.464137, 3.179754], 'chapter2-villa-rica'),
  node('poi-cap2-valle-cali', 'Oriente de Cali', [-76.464254, 3.441679], 'chapter2-cali'),
]
