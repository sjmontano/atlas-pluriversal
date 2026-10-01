import type * as maplibregl from 'maplibre-gl'
import { logger } from './MapLogger'

export type BasemapStyle = 'light' | 'streets' | 'satellite'

const CATEGORY = 'BasemapManager'

const BASEMAP_SOURCE_ID = 'basemap-devtool'
const BASEMAP_LAYER_ID = 'basemap-devtool-layer'

/** Prefijo para las capas/fuentes del basemap vectorial (OpenFreeMap). */
const VECTOR_PREFIX = 'basemap-devtool'

/** Estilo vectorial Positron sin key (reemplazo del raster CARTO, que desde
 *  sep-2026 exige `?key=` y marca "API KEY REQUIRED" sin ella).
 *  Ver https://openfreemap.org/quick_start/ */
const POSITRON_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

const BASEMAP_TILES: Record<Exclude<BasemapStyle, 'light'>, string> = {
  streets: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}

const BASEMAP_ATTRIBUTION: Record<BasemapStyle, string> = {
  light: '© OpenMapTiles © OpenStreetMap contributors',
  streets: '© OpenStreetMap contributors',
  satellite: '© ESRI',
}

/** Inserta el basemap vectorial Positron debajo de la imagen del Atlas.
 *  Prefija fuentes/capas con VECTOR_PREFIX para no colisionar con el
 *  `background` del BLANK_STYLE ni con las capas propias. */
async function addVectorBasemap(map: maplibregl.Map, requestId: number): Promise<void> {
  try {
    const res = await fetch(POSITRON_STYLE_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status} descargando estilo Positron`)
    // Si el usuario apagó/cambió el basemap mientras se descargaba, abortar.
    if (requestId !== vectorRequestId) return
    const style = (await res.json()) as {
      sources?: Record<string, unknown>
      layers?: Array<Record<string, unknown>>
      glyphs?: string
      sprite?: string
    }

    const beforeLayer = map.getLayer('atlas-base-image-layer') ? 'atlas-base-image-layer' : undefined

    if (style.glyphs) {
      try { (map as unknown as { setGlyphs?: (url: string) => void }).setGlyphs?.(style.glyphs) } catch { /* noop */ }
    }
    if (style.sprite) {
      try { (map as unknown as { setSprite?: (url: string) => void }).setSprite?.(style.sprite) } catch { /* noop */ }
    }

    for (const [sourceId, def] of Object.entries(style.sources ?? {})) {
      if (requestId !== vectorRequestId) return
      const namespaced = `${VECTOR_PREFIX}-${sourceId}`
      if (!map.getSource(namespaced)) {
        map.addSource(namespaced, def as never)
      }
    }

    for (const layer of style.layers ?? []) {
      if (requestId !== vectorRequestId) return
      const source = layer['source'] as string | undefined
      const namespacedLayer = {
        ...layer,
        id: `${VECTOR_PREFIX}-${layer['id']}`,
        ...(source ? { source: `${VECTOR_PREFIX}-${source}` } : {}),
      }
      if (!map.getLayer(namespacedLayer.id as string)) {
        map.addLayer(namespacedLayer as never, beforeLayer)
      }
    }

    logger.info(CATEGORY, 'Basemap added: light (OpenFreeMap Positron, vector)')
  } catch (e) {
    logger.warn(CATEGORY, 'Error adding vector basemap', e)
  }
}

let vectorRequestId = 0

export function addBasemap(map: maplibregl.Map, style: BasemapStyle): void {
  try {
    removeBasemap(map)

    if (style === 'light') {
      vectorRequestId += 1
      void addVectorBasemap(map, vectorRequestId)
      return
    }

    const tiles = BASEMAP_TILES[style]

    map.addSource(BASEMAP_SOURCE_ID, {
      type: 'raster',
      tiles: [tiles],
      tileSize: 256,
      attribution: BASEMAP_ATTRIBUTION[style],
    })

    const beforeLayer = map.getLayer('atlas-base-image-layer') ? 'atlas-base-image-layer' : undefined
    map.addLayer({
      id: BASEMAP_LAYER_ID,
      type: 'raster',
      source: BASEMAP_SOURCE_ID,
      paint: { 'raster-fade-duration': 0 },
    }, beforeLayer)

    logger.info(CATEGORY, `Basemap added: ${style}`)
  } catch (e) {
    logger.warn(CATEGORY, 'Error adding basemap', e)
  }
}

export function removeBasemap(map: maplibregl.Map): void {
  try {
    // Invalida descargas vectoriales en curso.
    vectorRequestId += 1
    // Capas vectoriales (prefijo basemap-devtool-), de arriba hacia abajo.
    try {
      const layers = map.getStyle()?.layers ?? []
      for (let i = layers.length - 1; i >= 0; i--) {
        const id = layers[i]?.id
        if (id && id.startsWith(`${VECTOR_PREFIX}-`) && id !== BASEMAP_LAYER_ID && map.getLayer(id)) {
          map.removeLayer(id)
        }
      }
    } catch { /* noop */ }
    try {
      const sources = Object.keys(map.getStyle()?.sources ?? {})
      for (const id of sources) {
        if (id.startsWith(`${VECTOR_PREFIX}-`) && id !== BASEMAP_SOURCE_ID && map.getSource(id)) {
          map.removeSource(id)
        }
      }
    } catch { /* noop */ }
    if (map.getLayer(BASEMAP_LAYER_ID)) {
      map.removeLayer(BASEMAP_LAYER_ID)
    }
    if (map.getSource(BASEMAP_SOURCE_ID)) {
      map.removeSource(BASEMAP_SOURCE_ID)
    }
    logger.info(CATEGORY, 'Basemap removed')
  } catch (e) {
    logger.warn(CATEGORY, 'Error removing basemap', e)
  }
}

const IMAGE_LAYER_ID = 'atlas-base-image-layer'
const TILES_LAYER_ID = 'atlas-tiles-layer'

/** Opacidad de la base visible: tiles XYZ + imagen base.
 *  Solo la imagen no sirve — los tiles opacos la tapan por completo. */
export function setImageOpacity(map: maplibregl.Map, opacity: number): void {
  const clamped = Math.max(0, Math.min(1, opacity))
  try {
    if (map.getLayer(TILES_LAYER_ID)) {
      map.setPaintProperty(TILES_LAYER_ID, 'raster-opacity', clamped)
    }
    if (map.getLayer(IMAGE_LAYER_ID)) {
      map.setPaintProperty(IMAGE_LAYER_ID, 'raster-opacity', clamped)
    }
  } catch (e) {
    logger.warn(CATEGORY, 'Error setting image opacity', e)
  }
}
