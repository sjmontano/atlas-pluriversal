import { defineMap, sb } from '../../kit.ts'

export default defineMap({
  id: 'chapter1-encuadres',
  title: 'El valle alto del río Cauca, su cuenca y sus mundos',
  minimap: 'cuenca',
  sidebar: [sb.presentacion('cap1-presentacion-encuadres'), sb.modal('perfil-cuenca', 'cap1-perfil-cuenca')],
  geo: { pgw: [0, 0.002291904891, 0.002292263474, 0, -79.43968707918096, -1.987827190702011], width: 3649, height: 6496 },
  // Imágenes locales (no pasan por cld()); el placeholder es propio.
  base: '/assets/maps/cap1/encuadres-mid.webp',
  full: '/assets/maps/cap1/encuadres-high.webp',
  placeholder: '/assets/maps/cap1/encuadres-low.webp',
  zoomMax: 6,
  tiles: { mode: 'initial-cover', source: 'cap1/encuadres.png' },
  config: { dragPan: false },
  /* Encuadres navegables — port de v17 (encuadres.js + namesEncuadres.js +
   * agregarEncuadres.jsx). El click en polígono o etiqueta navega (URL-first)
   * al `targetMapId`; en v17 era un if/else por texto del popup. */
  encuadres: [
    {
      id: 'encuadre-mosaicos',
      name: 'Mosaico de \ncuencas y aguas',
      targetMapId: 'chapter1-mosaicos-del-agua',
      labelCoords: [-75.75, 2.404437],
      url: '/assets/geojson/encuadre-sur-valle.json',
    },
    {
      id: 'encuadre-ecosistemas',
      name: 'Existencias y transformaciones ecosistémicas',
      targetMapId: 'chapter1-ecosistemas',
      labelCoords: [-74.92, 3.124437],
      /* Una sola línea: override del maxWidth global (230) */
      labelMaxWidth: 340,
      url: '/assets/geojson/encuadre-cuenca-alta.json',
    },
    {
      id: 'encuadre-bredunco',
      name: 'Bredunco, Caucayaco o \nCauca en la vertiente del Caribe',
      targetMapId: 'chapter1-bredunco',
      labelCoords: [-77.87, 9.48],
      url: '/assets/geojson/encuadre-cuenca-completa.json',
    },
    {
      id: 'encuadre-formas-paisaje',
      name: 'Pliegues, llanuras y otras formas del paisaje',
      targetMapId: 'chapter1-formas-paisaje',
      labelCoords: [-72.2, 9.624437],
    },
    {
      id: 'encuadre-un-rio-cauca',
      name: 'Un río Cauca, muchos mundos... \nen transición',
      targetMapId: 'chapter1-un-rio-cauca',
      labelCoords: [-72.2, 1.324437],
      url: '/assets/geojson/encuadre-limites-cuenca.json',
    },
  ],
  /* Port v17 (MapComponent.jsx): etiquetas de océanos, solo en esta vista
   * Colombia completa. Coordenadas originales de v17. */
  oceanLabels: [
    { id: 'oceano-pacifico', name: 'OCÉANO PACÍFICO', coords: [-78.45, 6.3] },
    { id: 'mar-caribe', name: 'MAR CARIBE', coords: [-76.5319, 11.85] },
  ],
})
