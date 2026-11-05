import { cld, defineMap, legendas, sb } from '../../kit.ts'

const base = cld('v1768342194/geoImages/yqwuuru4zw9jvfoa4cpl.webp')

export default defineMap({
  id: 'chapter4-problematicas',
  title: 'Humedales problemáticas',
  minimap: 'valle',
  bearing: -30,
  zoomMax: 17,
  tiles: { mode: 'detail', source: 'cap4/pondaje-problematicas.png' },
  sidebar: [
    sb.presentacion('cap4-presentacion-problematicas'),
    sb.ficha('FichasCap4/Metadata_4_Cap_Agropalenke.pdf'),
    sb.descarga('MapasCap4/Humedales problematicas.png'),
  ],
  geo: { pgw: [0.000001194087, -0.00000206822, -0.000002068153, -0.000001194048, -76.48394660129709, 3.4428801608900352], width: 4960, height: 8822 },
  base,
  full: base,
  // Leyenda v17 (problematicas, layerMenu.jsx): puramente informativa, sin ojos.
  legends: [
    ...legendas('problematicas-leyenda', '/assets/legends/cap4', 'Problematicas', 10, [
      ['01-áreas-urbanas-nuevas', 'Áreas urbanas nuevas', 'areaUrbanaNueva.svg'],
      ['02-disposición-de-residuos', 'Disposición de residuos y escombros', 'disposicionResiduos.svg'],
      ['03-ocupación-de-las-franjas', 'Ocupación de las franjas de protección del humedal', 'ocupacionFranjas.svg'],
      ['04-verimiento-de-aguas-resi', 'Verimiento de aguas residuales', 'palenke.svg'],
    ]),
    ...legendas('problematicas-leyenda', '/assets/legends/cap4', 'Agua', 50, [
      ['05-canales', 'Canales', 'Canales.svg'],
      ['06-humedales-y-actualidad', 'Humedales y actualidad', 'aljibe.svg'],
      ['07-humedales--pot-2000-2014', 'Humedales  POT 2000-2014', 'humedalesPot.svg'],
    ]),
    ...legendas('problematicas-leyenda', '/assets/legends/cap4', 'Elementos', 80, [
      ['08-área-urbana-2022', 'Área urbana 2022', 'areaUrbana.svg'],
      ['09-zonas-verdes-2014', 'Zonas verdes 2014', 'zonaVerdes2014.svg'],
    ]),
  ],
})
