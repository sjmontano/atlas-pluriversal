/**
 * 🧱 MAKE MAP — maquetador de MapContent
 * =====================================
 * Centraliza la mecánica repetida en cada `<mapa>/map.ts`:
 * placeholder Cloudinary (`ph`), `config` base y `makeTilesConfig()`.
 *
 * Lo que queda en cada `map.ts` es solo lo único de ese mapa:
 * `mapId`, `ui` (título, sidebar — SE PASA TAL CUAL, sin abstraer),
 * `geo`, imágenes, `zoomMax` y `extras` (layers/groups/legends/pois/encuadres).
 *
 * No migrar mapas atípicos (intro, calibration, márgenes custom):
 * esos quedan literales.
 */

import { makeTilesConfig } from '@data/tiles'
import type { MapContent, MapGeoEntry, MapUI } from '../types/content.ts'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

export interface MakeMapOptions {
  mapId: string
  ui: MapUI
  geo: MapGeoEntry
  base: string
  full?: string
  zoomMax?: number
  /** Default: -90. Mapas atípicos (ej. problematicas -30, bosque-comestible 0). */
  bearing?: number
  extras?: Pick<MapContent, 'layers' | 'groups' | 'legends' | 'pois' | 'encuadres'>
}

export function makeMap(opts: MakeMapOptions): MapContent {
  const initialBearing = opts.bearing ?? -90
  return {
    mapId: opts.mapId,
    ui: opts.ui,
    geo: opts.geo,
    images: { base: opts.base, full: opts.full, placeholder: ph(opts.base) },
    config: {
      initialBearing,
      useTransformConstrain: true,
      zoomMax: opts.zoomMax,
      viewportMaxBounds: null,
      dragPan: true,
      scrollZoom: true,
    },
    tiles: makeTilesConfig(opts.mapId, opts.geo, initialBearing, opts.zoomMax),
    ...opts.extras,
  }
}
