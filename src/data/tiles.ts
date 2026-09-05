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

const TILESET_VERSION = 'local-standard-hd-v4-nearest-pyramid'
const TILE_ROOTS: Record<TileDeliveryProfile, string> = {
  standard: '/assets/maps/tiles/mapas-standard',
  hd: '/assets/maps/tiles/mapas-hd',
}
const LOCAL_TILE_SOURCES: Record<string, string> = {
  intro: '/assets-raw/maps/intro/cuenca-cauca.png',
  'chapter1-bredunco': '/assets-raw/maps/cap1/bredunco.png',
  'chapter1-ecosistemas': '/assets-raw/maps/cap1/ecosistemas.png',
  'chapter1-encuadres': '/assets-raw/maps/cap1/encuadres.png',
  'chapter1-formas-paisaje': '/assets-raw/maps/cap1/formas-del-paisaje.png',
  'chapter1-mosaicos-del-agua': '/assets-raw/maps/cap1/mosaicos-del-agua.png',
  'chapter1-un-rio-cauca': '/assets-raw/maps/cap1/un-rio-cauca.png',
  'chapter2-valle': '/assets-raw/maps/cap2/intro-cap2.png',
  'chapter2-suarez': '/assets-raw/maps/cap2/alternativas-suarez.png',
  'chapter2-cali': '/assets-raw/maps/cap2/alternativas-cali.png',
  'chapter2-villa-rica': '/assets-raw/maps/cap2/alternativas-villa-rica.png',
  'chapter2-m-oriente-cali': '/assets-raw/maps/cap2/modelo-territorial-oriente-cali.png',
  'chapter2-m-villa-rica': '/assets-raw/maps/cap2/modelo-territorial-villa-rica.png',
  'chapter2-m-suarez': '/assets-raw/maps/cap2/modelo-territorial-suarez.png',
  'chapter3-introduccion': '/assets-raw/maps/cap3/intro-tramos.png',
  'chapter3-monocultivo': '/assets-raw/maps/cap3/el-desierto-verde.png',
  'chapter3-encharcaron': '/assets-raw/maps/cap3/nos-encharcaron-el-rio.png',
  'chapter3-cali-deseca': '/assets-raw/maps/cap3/cali-deseca.png',
  'chapter3-humedales': '/assets-raw/maps/cap3/se-encharca-arriba-se-deseca-abajo.png',
  'chapter3-arcilla': '/assets-raw/maps/cap3/aguas-que-llegan.png',
  'chapter4-introduccion': '/assets-raw/maps/cap4/intro-localizacion-fincas.png',
  'chapter4-asoyoge': '/assets-raw/maps/cap4/asoyoge.png',
  'chapter4-el-buhido': '/assets-raw/maps/cap4/finca-el-buhido.png',
  'chapter4-bosque-comestible': '/assets-raw/maps/cap4/bosque-comestible.png',
  'chapter4-centro-agropecuario': '/assets-raw/maps/cap4/centro-agropecuario.png',
  'chapter4-el-paso': '/assets-raw/maps/cap4/finca-el-paso.png',
  'chapter4-la-caicedo': '/assets-raw/maps/cap4/finca-la-caicedo.png',
  'chapter4-la-virginia': '/assets-raw/maps/cap4/finca-la-virginia.png',
  'chapter4-las-mercedes': '/assets-raw/maps/cap4/finca-las-mercedes.png',
  'chapter4-los-bajios': '/assets-raw/maps/cap4/finca-los-bajios.png',
  'chapter4-problematicas': '/assets-raw/maps/cap4/pondaje-problematicas.png',
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
  zoomMax?: number,
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
    // Techo de GENERACIÓN: zoomMax manual del mapa o techo automático de
    // detalle. La cámara puede superarlo (MapLibre reutiliza los tiles del
    // último nivel — overzoom — sin nuevos requests).
    maxZoom: Math.max(range.minZoom, zoomMax ?? range.maxZoom),
    fadeDuration: 300,
    source: LOCAL_TILE_SOURCES[mapId],
    preview: `/assets/maps/previews/${mapId}.webp`,
    sourceRotate: 'auto',
    tilePixelSizeByProfile: {
      standard: {},
      // Pirámide HD ligera para todos los mapas: los dos primeros niveles en
      // 1024 (entrada nítida) y el resto en 512 (eficiencia). z8+ → 512.
      hd: {
        [range.minZoom]: 1024,
        [range.minZoom + 1]: 1024,
      },
    },
  }
}
