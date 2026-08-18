import type { MapGeoEntry, MapTilesConfig } from '../types/content'
import { computeTileRange } from '@utils/tileZoom'
import type { TileZoomMode } from '@utils/tileZoom'

export const MAP_TILE_MODES: Record<string, TileZoomMode> = {
  intro: 'initial-only',
  'chapter1-encuadres': 'initial-only',
  'chapter1-ecosistemas': 'detail',
  'chapter1-formas-paisaje': 'detail',
  'chapter1-bredunco': 'detail',
  'chapter1-mosaicos-del-agua': 'detail',
  'chapter1-un-rio-cauca': 'detail',
  'chapter2-valle': 'detail',
  'chapter2-suarez': 'detail',
  'chapter2-cali': 'detail',
  'chapter2-villa-rica': 'detail',
  'chapter2-m-oriente-cali': 'detail',
  'chapter2-m-villa-rica': 'detail',
  'chapter2-m-suarez': 'detail',
  'chapter3-introduccion': 'detail',
  'chapter3-monocultivo': 'detail',
  'chapter3-encharcaron': 'detail',
  'chapter3-cali-deseca': 'detail',
  'chapter3-humedales': 'detail',
  'chapter3-arcilla': 'detail',
  'chapter4-introduccion': 'detail',
  'chapter4-asoyoge': 'initial-only',
  'chapter4-el-buhido': 'initial-only',
  'chapter4-bosque-comestible': 'detail',
  'chapter4-los-bajios': 'initial-only',
  'chapter4-el-paso': 'initial-only',
  'chapter4-las-mercedes': 'initial-only',
  'chapter4-la-virginia': 'initial-only',
  'chapter4-centro-agropecuario': 'initial-only',
  'chapter4-la-caicedo': 'initial-only',
  'chapter4-problematicas': 'detail',
}

const BASE_URL = '/assets/maps/tiles/mapas'

export function tileUrlTemplate(mapId: string): string {
  return `${BASE_URL}/${mapId}/{z}/{x}/{y}.webp`
}

/**
 * Fabrica MapTilesConfig para un mapa. La referencia de pantalla es 1920×1080;
 * el bearing es el del mapa (initialBearing) para que el constrainMinZoom sea
 * coherente con el runtime.
 */
export function makeTilesConfig(
  mapId: string,
  geo: MapGeoEntry,
  initialZoom: number,
  initialBearing: number,
): MapTilesConfig | null {
  const mode = MAP_TILE_MODES[mapId]
  if (!mode) return null
  const range = computeTileRange(geo, initialZoom, mode, 1920, 1080, initialBearing)
  if (!range) return null
  return {
    urlTemplate: tileUrlTemplate(mapId),
    tileSize: 256,
    minZoom: range.minZoom,
    maxZoom: range.maxZoom,
    fadeDuration: 300,
  }
}
