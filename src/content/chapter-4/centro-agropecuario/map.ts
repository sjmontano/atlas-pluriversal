import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

export default makeMap({
  mapId: 'chapter4-centro-agropecuario',
  ui: {
    title: 'Centro agropecuario',
    minimap: 'sur',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-centro-agropecuario' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1Kj6wFrSig47Sk_9WaD6hCek1k95cmohT/view?usp=sharing' },
    ],
  },
  geo: {
    pgw: [0, 5.15928e-7, 5.15965e-7, 0, -76.43109465694656, 3.183850151162395] as const,
    width: 6904,
    height: 12163,
  },
  base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/drkxyppqvzpngqura5qg.png',
  full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765993765/geoImages/gecszuuozkmhyng5w6y7.png',
  zoomMax: 20,
  extras: { legends: LEGENDS },
})
