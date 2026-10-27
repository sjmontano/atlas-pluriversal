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
  { slug: 'piendamo', image: `${BASE}/subcuenca-piendamo.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.160647], width: 5893, height: 10477 },
  { slug: 'salado', image: `${BASE}/subcuenca-salado.webp`, pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.165771], width: 5844, height: 10390 },
  { slug: 'ovejas', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-ovejas.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.158158], width: 5893, height: 10477 },
{ slug: 'timba', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-timba.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], width: 5893, height: 10477 },
{ slug: 'quinamayo', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-quinamayo.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], width: 5893, height: 10477 },
{ slug: 'claro-jamundi', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-claro-jamundi.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], width: 5893, height: 10477 },
{ slug: 'palo', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-palo.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.96691, 2.166241], width: 5834, height: 10372 },
{ slug: 'lili-melendez-canaveralejo', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-lili-melendez-canaveralejo.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], width: 5893, height: 10477 },
{ slug: 'desbaratado', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-desbaratado.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.971656, 2.155522], width: 5893, height: 10477 },
{ slug: 'cali', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-cali.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.970182, 2.155522], width: 5893, height: 10477 },
{ slug: 'guachal', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-guachal.webp',  // rivers.ts
  pgw: [0, 0.000166, 0.000166, 0, -76.973057, 2.154454], width: 5893, height: 10477 },
]
