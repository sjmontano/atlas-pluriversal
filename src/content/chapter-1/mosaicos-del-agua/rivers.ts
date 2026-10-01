/**
 * 🌊 SUBCUENCAS DEL MOSAICO — áreas por cuenca para resaltar en hover
 * ====================================================================
 * Port de v17 (atlas-old): `rasterTilesTejidosDelAgua.js` (Subcuenca_* en
 * `public/assets/capasRios/`) + `agregarToponimos.jsx` (mouseenter ️→
 * muestra la imagen de la cuenca). Arte copiado a local con nombres
 * normalizados por slug (el `modalId` de cada POI es `cap1-cuenca-<slug>`).
 *
 * Cobertura parcial heredada de v17: claro-jamundi usa solo Claro y
 * lili-melendez-canaveralejo usa solo Meléndez (no hay arte Lili/Jamundí/
 * Cañaveralejo); piendamo usa piendamo2 (no existe piendamo1 en v17).
 * Georreferenciación: mismo footprint que las capas de agua (WATER_PGW);
 * si alguna calza distinto, el panel dev la puede mover (capas image no,
 * pero el PGW del módulo sí).
 */

import type { SubcuencaDef } from '../../../types/content'

const BASE = '/assets/maps/capas/mosaicos-del-agua'

export const SUBCUENCAS: SubcuencaDef[] = [
  { slug: 'piendamo', image: `${BASE}/subcuenca-piendamo.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'salado', image: `${BASE}/subcuenca-salado.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'ovejas', image: `${BASE}/subcuenca-ovejas.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'timba', image: `${BASE}/subcuenca-timba.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'quinamayo', image: `${BASE}/subcuenca-quinamayo.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'claro-jamundi', image: `${BASE}/subcuenca-claro-jamundi.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'palo', image: `${BASE}/subcuenca-palo.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'lili-melendez-canaveralejo', image: `${BASE}/subcuenca-lili-melendez-canaveralejo.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'desbaratado', image: `${BASE}/subcuenca-desbaratado.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'cali', image: `${BASE}/subcuenca-cali.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
  { slug: 'guachal', image: `${BASE}/subcuenca-guachal.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.893209, 2.273382], width: 4911, height: 8731 },
]
