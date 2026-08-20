import type { TileZoomMode } from '@utils/tileZoom'
import { computeTileRange } from '@utils/tileZoom'
import type { MapGeoEntry, MapTilesConfig, TileDeliveryProfile } from '../types/content'

export const MAP_TILE_MODES: Record<string, TileZoomMode> = {
  intro: 'initial-only',
  'chapter1-encuadres': 'initial-cover',
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

const TILESET_VERSION = 'local-standard-hd-v3-nearest-pyramid'
const TILE_ROOTS: Record<TileDeliveryProfile, string> = {
  standard: '/assets/maps/tiles/mapas-standard',
  hd: '/assets/maps/tiles/mapas-hd',
}
const HD_TILE_PIXEL_SIZE_BY_ZOOM: Record<string, Record<number, number>> = {
  'chapter1-un-rio-cauca': { 6: 2048, 7: 1024, 8: 512 },
  'chapter1-formas-paisaje': { 6: 1024, 7: 1024, 8: 512 },
}
const LOCAL_TILE_SOURCES: Record<string, string> = {
  intro: '/assets/maps/intro/cuenca-cauca.png',
  'chapter1-bredunco': '/assets/maps/cap1/bredunco.png',
  'chapter1-ecosistemas': '/assets/maps/cap1/ecosistemas.png',
  'chapter1-encuadres': '/assets/maps/cap1/encuadres.png',
  'chapter1-formas-paisaje': '/assets/maps/cap1/formas-del-paisaje.png',
  'chapter1-mosaicos-del-agua': '/assets/maps/cap1/mosaicos-del-agua.png',
  'chapter1-un-rio-cauca': '/assets/maps/cap1/un-rio-cauca.png',
  'chapter2-valle': '/assets/maps/cap2/intro-cap2.png',
  'chapter2-suarez': '/assets/maps/cap2/alternativas-suarez.png',
  'chapter2-cali': '/assets/maps/cap2/alternativas-cali.png',
  'chapter2-villa-rica': '/assets/maps/cap2/alternativas-villa-rica.png',
  'chapter2-m-oriente-cali': '/assets/maps/cap2/modelo-territorial-oriente-cali.png',
  'chapter2-m-villa-rica': '/assets/maps/cap2/modelo-territorial-villa-rica.png',
  'chapter2-m-suarez': '/assets/maps/cap2/modelo-territorial-suarez.png',
  'chapter3-introduccion': '/assets/maps/cap3/intro-tramos.png',
  'chapter3-monocultivo': '/assets/maps/cap3/el-desierto-verde.png',
  'chapter3-encharcaron': '/assets/maps/cap3/nos-encharcaron-el-rio.png',
  'chapter3-cali-deseca': '/assets/maps/cap3/cali-deseca.png',
  'chapter3-humedales': '/assets/maps/cap3/se-encharca-arriba-se-deseca-abajo.png',
  'chapter3-arcilla': '/assets/maps/cap3/aguas-que-llegan.png',
  'chapter4-introduccion': '/assets/maps/cap4/intro-localizacion-fincas.png',
  'chapter4-asoyoge': '/assets/maps/cap4/asoyoge.png',
  'chapter4-el-buhido': '/assets/maps/cap4/finca-el-buhido.png',
  'chapter4-bosque-comestible': '/assets/maps/cap4/bosque-comestible.png',
  'chapter4-centro-agropecuario': '/assets/maps/cap4/centro-agropecuario.png',
  'chapter4-el-paso': '/assets/maps/cap4/finca-el-paso.png',
  'chapter4-la-caicedo': '/assets/maps/cap4/finca-la-caicedo.png',
  'chapter4-la-virginia': '/assets/maps/cap4/finca-la-virginia.png',
  'chapter4-las-mercedes': '/assets/maps/cap4/finca-las-mercedes.png',
  'chapter4-los-bajios': '/assets/maps/cap4/finca-los-bajios.png',
  'chapter4-problematicas': '/assets/maps/cap4/pondaje-problematicas.png',
}

export function tileUrlTemplate(mapId: string, profile: TileDeliveryProfile = 'standard'): string {
  return `${TILE_ROOTS[profile]}/${mapId}/{z}/{x}/{y}.webp?v=${TILESET_VERSION}`
}

/**
 * Fabrica MapTilesConfig para un mapa. La referencia de pantalla es 1920×1080;
 * el bearing es el del mapa (initialBearing) para que el constrainMinZoom sea
 * coherente con el runtime. `initial-cover` usa este mismo nivel como único
 * nivel del tileset, apropiado para mapas sin zoom.
 */
export function makeTilesConfig(
  mapId: string,
  geo: MapGeoEntry,
  initialBearing: number,
): MapTilesConfig | null {
  const mode = MAP_TILE_MODES[mapId]
  if (!mode) return null
  const range = computeTileRange(geo, mode, 1920, 1080, initialBearing)
  if (!range) return null
  return {
    urlTemplate: tileUrlTemplate(mapId, 'standard'),
    urlTemplateStandard: tileUrlTemplate(mapId, 'standard'),
    urlTemplateHd: tileUrlTemplate(mapId, 'hd'),
    tileSize: 512,
    minZoom: range.minZoom,
    maxZoom: range.maxZoom,
    fadeDuration: 300,
    source: LOCAL_TILE_SOURCES[mapId],
    preview: `/assets/maps/previews/${mapId}.webp`,
    sourceRotate: 'auto',
    tilePixelSizeByProfile: {
      standard: {},
      hd: {
        [range.minZoom]: 1024,
        ...HD_TILE_PIXEL_SIZE_BY_ZOOM[mapId],
      },
    },
  }
}
