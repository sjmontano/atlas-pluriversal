import type { TileZoomMode } from '@utils/tileZoom'
import { computeTileRange } from '@utils/tileZoom'
import type { MapGeoEntry, MapTilesConfig, TileDeliveryProfile } from '../types/content'

const TILESET_VERSION = 'local-standard-hd-v4-nearest-pyramid'
const TILE_ROOTS: Record<TileDeliveryProfile, string> = {
  standard: '/assets/maps/tiles/mapas-standard',
  hd: '/assets/maps/tiles/mapas-hd',
}
export function tileUrlTemplate(mapId: string, profile: TileDeliveryProfile = 'standard'): string {
  return `${TILE_ROOTS[profile]}/${mapId}/{z}/{x}/{y}.webp?v=${TILESET_VERSION}`
}

/**
 * Fabrica MapTilesConfig para un mapa. La referencia de pantalla es 1920×1080;
 * el bearing es el del mapa (initialBearing) para que el constrainMinZoom sea
 * coherente con el runtime. `initial-cover` usa este mismo nivel como único
 * nivel del tileset, apropiado para mapas sin zoom. `declared` son los tiles
 * declarados en el map.ts; sin ellos el mapa no tiene tileset.
 */
export function makeTilesConfig(
  mapId: string,
  geo: MapGeoEntry,
  declared: { mode: TileZoomMode; source: string } | undefined,
  initialBearing: number,
  zoomMax?: number,
): MapTilesConfig | null {
  if (!declared) return null
  const { mode, source } = declared
  const range = computeTileRange(geo, mode, 1920, 1080, initialBearing)
  if (!range) return null
  return {
    mode,
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
    source,
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
