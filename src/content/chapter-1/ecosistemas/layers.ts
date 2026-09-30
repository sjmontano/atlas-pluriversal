import type { PGWData } from '@services/BoundsCalculator'
import type { Layer } from '../../../types/layer'

// Capas individuales — port de v17 `rasterTilesEcosistemas.js` con la
// organización de `capasAgrupadas` (layerMenu.jsx) y nombres/swatches del
// menú v17. Las 11 primeras viven en Cloudinary; las 19 restantes son los
// `*-low.webp` migrados de v17 a `public/assets/img/capas/...`.
// Primera visita: todo apagado (el layerStore persiste la elección).

const ECOSYSTEMS_PGW: PGWData = [0, 0.000441431774, 0.000441457732, 0, -77.621312825, 1.602929017]
const ECOSYSTEMS_W = 1462
const ECOSYSTEMS_H = 2599

const CDN = 'https://res.cloudinary.com/dvluvxfvn/image/upload'
const LOW = '/assets/img/capas/ecosistemas/webp/low'

interface Row {
  key: string
  name: string
  swatch: string
  group: string
  order: number
  url: string
}

// Grupo eco-1.1 — De litoral y aguas poco profundas
// Grupo eco-1.2 — Con vegetación de baja altura
// Grupo eco-1.3 — Bosques
// Grupo eco-1.4 — Altas cumbres
// Grupo eco-2.1 — Intervenciones moderadas
// Grupo eco-2.2 — Zonas con agricultura y ganadería
// Grupo eco-2.3 — Intervenciones severas (aguaSuperficial = Cuerpos de agua artificial en v17)
// Sin grupo — Capa top-level (ítem 3 del menú v17)
const ROWS: Row[] = [
  { key: 'sedimentosSubmarinos', name: 'Sedimentos submarinos', swatch: '#69D3BF', group: 'eco-1.1', order: 1, url: `${LOW}/sedimentos-submarinos-low.webp` },
  { key: 'manglar', name: 'Manglar', swatch: '#7ECABD', group: 'eco-1.1', order: 2, url: `${LOW}/manglar-low.webp` },
  { key: 'llanuraMareal', name: 'Llanura mareal', swatch: '#57BB8A', group: 'eco-1.1', order: 3, url: `${LOW}/llanura-mareal-low.webp` },
  { key: 'playas', name: 'Playas', swatch: '#F4EDBF', group: 'eco-1.1', order: 4, url: `${LOW}/playas-low.webp` },
  { key: 'zonaPantanosa', name: 'Zona pantanosa', swatch: '#B1804D', group: 'eco-1.1', order: 5, url: `${LOW}/zona-pantanosa-low.webp` },

  { key: 'rocasExpuestas', name: 'Rocas expuestas', swatch: '#888977', group: 'eco-1.2', order: 1, url: `${LOW}/rocas-expuestas-low.webp` },
  { key: 'humedales', name: 'Humedales', swatch: '#ACF1AE', group: 'eco-1.2', order: 2, url: `${CDN}/v1752620855/geoImages/zabqishlczt4jhzan583.webp` },
  { key: 'arbustal', name: 'Vegetación arbustiva (arbustal)', swatch: '#A7C774', group: 'eco-1.2', order: 3, url: `${CDN}/v1752616024/geoImages/jmzub122jv4yei2hpchp.webp` },
  { key: 'herbazalPastos', name: 'Campos de hierbas y pastos (herbazal)', swatch: '#F3BE32', group: 'eco-1.2', order: 4, url: `${CDN}/v1752620752/geoImages/ab8fmppquopvzo4t9ime.webp` },

  { key: 'xerofitico', name: 'Extremadamente secos (Xerofítico)', swatch: '#DCC248', group: 'eco-1.3', order: 1, url: `${LOW}/xerofitico-low.webp` },
  { key: 'subxerofitico', name: 'Muy secos (Subxerofítico)', swatch: '#EADC79', group: 'eco-1.3', order: 2, url: `${LOW}/subxerofitico-low.webp` },
  { key: 'inundables', name: 'Inundables', swatch: '#4FD381', group: 'eco-1.3', order: 3, url: `${LOW}/inundables-low.webp` },
  { key: 'secosTropicales', name: 'Secos tropicales', swatch: '#81E837', group: 'eco-1.3', order: 4, url: `${LOW}/secos-tropicales-low.webp` },
  { key: 'humedosTropicales', name: 'Húmedos tropicales', swatch: '#AEDE53', group: 'eco-1.3', order: 5, url: `${LOW}/humedos-tropicales-low.webp` },
  { key: 'subandinos', name: 'Subandinos', swatch: '#74C433', group: 'eco-1.3', order: 6, url: `${LOW}/subandinos-low.webp` },
  { key: 'bosqueNiebla', name: 'De niebla', swatch: '#41A968', group: 'eco-1.3', order: 7, url: `${CDN}/v1752616666/geoImages/ccrcbspmilcmwnttnijk.webp` },
  { key: 'altoAndinos', name: 'Alto andinos', swatch: '#41854A', group: 'eco-1.3', order: 8, url: `${CDN}/v1752615317/geoImages/nsxeretli1c7vs11x6kc.webp` },

  { key: 'pantanoParamo', name: 'Pantano de páramo (Turbera)', swatch: '#E99968', group: 'eco-1.4', order: 1, url: `${LOW}/pantano-paramo-low.webp` },
  { key: 'Paramo', name: 'Páramo', swatch: '#87B3A4', group: 'eco-1.4', order: 2, url: `${LOW}/paramo-low.webp` },
  { key: 'laguna', name: 'Laguna', swatch: '#81E59D', group: 'eco-1.4', order: 3, url: `${LOW}/laguna-low.webp` },
  { key: 'glaciaresNivales', name: 'Glaciares y nivales', swatch: '#CFF5DD', group: 'eco-1.4', order: 4, url: `${CDN}/v1752620635/geoImages/fucpwcprskwntuimp3ln.webp` },

  { key: 'bosqueFragmentado', name: 'Bosque fragmentado', swatch: '#B44D5E', group: 'eco-2.1', order: 1, url: `${CDN}/v1752616546/geoImages/gsvasgqvuszn6hz18ap4.webp` },
  { key: 'regeneracionVegetal', name: 'Vegetación en regeneración', swatch: '#8E60A1', group: 'eco-2.1', order: 2, url: `${LOW}/regeneracion-vegetal-low.webp` },

  { key: 'agriculturaMixta', name: 'Agricultura mixta', swatch: '#D4BADD', group: 'eco-2.2', order: 1, url: `${CDN}/v1752614823/geoImages/ehxtmyhan6sxciwzeqq8.webp` },
  { key: 'areasInundacion', name: 'Áreas de inundación y humedales desecados', swatch: '#EF7CA5', group: 'eco-2.2', order: 2, url: `${CDN}/v1752616054/geoImages/g6pgktggt7ni6xiyhupw.webp` },
  { key: 'monocultivos', name: 'Monocultivos', swatch: '#DCAA4F', group: 'eco-2.2', order: 3, url: `${LOW}/monocultivos-low.webp` },
  { key: 'ganaderia', name: 'Ganadería', swatch: '#F4F339', group: 'eco-2.2', order: 4, url: `${CDN}/v1752620553/geoImages/gtwqfz5u1o3kmbtl33a4.webp` },

  { key: 'zonaUrbanaIndustrial', name: 'Zonas urbanizadas, industrializadas y con minería intensiva', swatch: '#E24A3C', group: 'eco-2.3', order: 1, url: `${LOW}/zona-urbana-industrial-low.webp` },
  { key: 'aguaSuperficial', name: 'Cuerpos de agua artificial', swatch: '#4342A8', group: 'eco-2.3', order: 2, url: `${CDN}/v1752615018/geoImages/uw21wuzdbrqiefckuf4d.webp` },

  { key: 'sinInformacion', name: 'Sin información y otras áreas', swatch: '#F7F5E7', group: '', order: 999, url: `${LOW}/sin-informacion-low.webp` },
]

export const LAYERS: Layer[] = ROWS.map((row) => ({
  id: `${row.key}-layer`,
  name: row.name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: row.url,
  pgw: ECOSYSTEMS_PGW,
  width: ECOSYSTEMS_W,
  height: ECOSYSTEMS_H,
  opacity: 0.8,
  visibleByDefault: false,
  order: row.order,
  ...(row.group === '' ? {} : { group: row.group }),
  legend: { swatch: row.swatch, description: row.name },
}))
