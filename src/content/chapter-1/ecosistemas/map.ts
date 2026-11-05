import { cld, defineMap, group, rasterFrame, sb } from '../../kit.ts'

// Capas individuales — port de v17 `rasterTilesEcosistemas.js` con la
// organización de `capasAgrupadas` (layerMenu.jsx) y nombres/swatches del
// menú v17. Las 11 primeras viven en Cloudinary; las 19 restantes son los
// `*-low.webp` migrados de v17 a `public/assets/img/capas/...`.
// Primera visita: todo apagado (el layerStore persiste la elección).

// Georreferencia CALIBRADA (misma para las 30 capas): marco de referencia
// de los composites, con origen ajustado por calibración. No usar el
// ECOSYSTEMS_PGW de v17 (las encogía a un rincón).
const eco = rasterFrame({
  pgw: [0.0018443379684604639, 0, 0, -0.0018447264954608695, -77.62265008890559, 6.105405484389904], // ← calibrado
  width: 1374,
  height: 2443,
  category: 'ecosystems',
})

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
  { key: 'humedales', name: 'Humedales', swatch: '#ACF1AE', group: 'eco-1.2', order: 2, url: cld('v1752620855/geoImages/zabqishlczt4jhzan583.webp') },
  { key: 'arbustal', name: 'Vegetación arbustiva (arbustal)', swatch: '#A7C774', group: 'eco-1.2', order: 3, url: cld('v1752616024/geoImages/jmzub122jv4yei2hpchp.webp') },
  { key: 'herbazalPastos', name: 'Campos de hierbas y pastos (herbazal)', swatch: '#F3BE32', group: 'eco-1.2', order: 4, url: cld('v1752620752/geoImages/ab8fmppquopvzo4t9ime.webp') },

  { key: 'xerofitico', name: 'Extremadamente secos (Xerofítico)', swatch: '#DCC248', group: 'eco-1.3', order: 1, url: `${LOW}/xerofitico-low.webp` },
  { key: 'subxerofitico', name: 'Muy secos (Subxerofítico)', swatch: '#EADC79', group: 'eco-1.3', order: 2, url: `${LOW}/subxerofitico-low.webp` },
  { key: 'inundables', name: 'Inundables', swatch: '#4FD381', group: 'eco-1.3', order: 3, url: `${LOW}/inundables-low.webp` },
  { key: 'secosTropicales', name: 'Secos tropicales', swatch: '#81E837', group: 'eco-1.3', order: 4, url: `${LOW}/secos-tropicales-low.webp` },
  { key: 'humedosTropicales', name: 'Húmedos tropicales', swatch: '#AEDE53', group: 'eco-1.3', order: 5, url: `${LOW}/humedos-tropicales-low.webp` },
  { key: 'subandinos', name: 'Subandinos', swatch: '#74C433', group: 'eco-1.3', order: 6, url: `${LOW}/subandinos-low.webp` },
  { key: 'bosqueNiebla', name: 'De niebla', swatch: '#41A968', group: 'eco-1.3', order: 7, url: cld('v1752616666/geoImages/ccrcbspmilcmwnttnijk.webp') },
  { key: 'altoAndinos', name: 'Alto andinos', swatch: '#41854A', group: 'eco-1.3', order: 8, url: cld('v1752615317/geoImages/nsxeretli1c7vs11x6kc.webp') },

  { key: 'pantanoParamo', name: 'Pantano de páramo (Turbera)', swatch: '#E99968', group: 'eco-1.4', order: 1, url: `${LOW}/pantano-paramo-low.webp` },
  { key: 'Paramo', name: 'Páramo', swatch: '#87B3A4', group: 'eco-1.4', order: 2, url: `${LOW}/paramo-low.webp` },
  { key: 'laguna', name: 'Laguna', swatch: '#81E59D', group: 'eco-1.4', order: 3, url: `${LOW}/laguna-low.webp` },
  { key: 'glaciaresNivales', name: 'Glaciares y nivales', swatch: '#CFF5DD', group: 'eco-1.4', order: 4, url: cld('v1752620635/geoImages/fucpwcprskwntuimp3ln.webp') },

  { key: 'bosqueFragmentado', name: 'Bosque fragmentado', swatch: '#B44D5E', group: 'eco-2.1', order: 1, url: cld('v1752616546/geoImages/gsvasgqvuszn6hz18ap4.webp') },
  { key: 'regeneracionVegetal', name: 'Vegetación en regeneración', swatch: '#8E60A1', group: 'eco-2.1', order: 2, url: `${LOW}/regeneracion-vegetal-low.webp` },

  { key: 'agriculturaMixta', name: 'Agricultura mixta', swatch: '#D4BADD', group: 'eco-2.2', order: 1, url: cld('v1752614823/geoImages/ehxtmyhan6sxciwzeqq8.webp') },
  { key: 'areasInundacion', name: 'Áreas de inundación y humedales desecados', swatch: '#EF7CA5', group: 'eco-2.2', order: 2, url: cld('v1752616054/geoImages/g6pgktggt7ni6xiyhupw.webp') },
  { key: 'monocultivos', name: 'Monocultivos', swatch: '#DCAA4F', group: 'eco-2.2', order: 3, url: `${LOW}/monocultivos-low.webp` },
  { key: 'ganaderia', name: 'Ganadería', swatch: '#F4F339', group: 'eco-2.2', order: 4, url: cld('v1752620553/geoImages/gtwqfz5u1o3kmbtl33a4.webp') },

  { key: 'zonaUrbanaIndustrial', name: 'Zonas urbanizadas, industrializadas y con minería intensiva', swatch: '#E24A3C', group: 'eco-2.3', order: 1, url: `${LOW}/zona-urbana-industrial-low.webp` },
  { key: 'aguaSuperficial', name: 'Cuerpos de agua artificial', swatch: '#4342A8', group: 'eco-2.3', order: 2, url: cld('v1752615018/geoImages/uw21wuzdbrqiefckuf4d.webp') },

  { key: 'sinInformacion', name: 'Sin información y otras áreas', swatch: '#F7F5E7', group: '', order: 999, url: `${LOW}/sin-informacion-low.webp` },
]

const base = cld('v1752350981/geoImages/g9xrqxop5nmfciklng1b.webp')

export default defineMap({
  id: 'chapter1-ecosistemas',
  title: 'Existencias y transformaciones ecosistémicas',
  minimap: 'valle',
  sidebar: [
    sb.presentacion('cap1-presentacion-ecosistemas'),
    sb.ficha('FichasCap1/Exist_transf_ecosist_Cap1.pdf'),
    sb.descarga('MapasCap1/Mapa existencias y transformaciones ecosistemicas.pdf'),
  ],
  geo: { pgw: [0, 0.0004706619148, 0.0004706895898, 0, -77.717574036785, 1.505615411172], width: 5729, height: 10186 },
  base,
  full: cld('v1752350945/geoImages/keozbw51ancathhw6cwk.webp'),
  zoomMax: 10,
  tiles: { mode: 'detail', source: 'cap1/ecosistemas.png' },
  config: { viewportMarginH: -0.03, viewportMarginV: -0.12 },
  menuTitle: 'Ecosistemas y transformaciones',
  layers: ROWS.map((row) =>
    eco({
      id: `${row.key}-layer`,
      name: row.name,
      image: row.url,
      swatch: row.swatch,
      order: row.order,
      ...(row.group === '' ? {} : { group: row.group }),
    }),
  ),
  // Jerarquía del menú v17 (layerMenu.jsx → `ecosistemas`):
  // 2 macro-grupos con subgrupos anidados (`parent`) + capas sueltas top-level
  // (ítem 3). La numeración (1., 1.1.) la genera el menú, no los nombres.
  groups: [
    group('eco-1', 'Amenazados y en estado vulnerable', 1),
    group('eco-1.1', 'De litoral y aguas poco profundas', 1, { parent: 'eco-1' }),
    group('eco-1.2', 'Con vegetación de baja altura', 2, { parent: 'eco-1' }),
    group('eco-1.3', 'Bosques', 3, { parent: 'eco-1' }),
    group('eco-1.4', 'Altas cumbres', 4, { parent: 'eco-1' }),
    group('eco-2', 'Entornos del ser humano que transforman ecosistemas', 2),
    group('eco-2.1', 'Intervenciones moderadas', 5, { parent: 'eco-2' }),
    group('eco-2.2', 'Zonas con agricultura y ganadería', 6, { parent: 'eco-2' }),
    group('eco-2.3', 'Intervenciones severas', 7, { parent: 'eco-2' }),
  ],
})
