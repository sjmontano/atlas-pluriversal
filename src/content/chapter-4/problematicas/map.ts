import { makeMap } from '../../_map.ts'
import { LEGENDS } from './legends'

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1768342194/geoImages/yqwuuru4zw9jvfoa4cpl.webp'

export default makeMap({
  mapId: 'chapter4-problematicas',
  ui: {
    title: 'Humedales problemáticas',
    minimap: 'valle',
    sidebar: [
      { id: 'presentacion', type: 'modal', icon: 'presentation', label: 'Presentación', frame: '1', target: 'cap4-presentacion-problematicas' },
      { id: 'ficha-tecnica', type: 'link', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3', href: 'https://drive.google.com/file/d/1ZE41JqK6UrJR9-BfLDedgs7f_OQyLwFY/view' },
      { id: 'descargar', type: 'link', icon: 'download', label: 'Descargar', frame: '3', href: 'https://drive.google.com/file/d/18PA-iS3TvXlhqT2el-9QsaWWeaVbk5gM/view' },
    ],
  },
  geo: {
    pgw: [0.000001194087, -0.00000206822, -0.000002068153, -0.000001194048, -76.48394660129709, 3.4428801608900352] as const,
    width: 4960,
    height: 8822,
  },
  base,
  full: base,
  zoomMax: 17,
  bearing: -30,
  extras: { legends: LEGENDS },
})
