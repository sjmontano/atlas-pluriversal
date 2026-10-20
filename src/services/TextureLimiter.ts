import { LAYER_CALIBRATIONS } from '@content/calibration/layers'
import type * as maplibregl from 'maplibre-gl'
import type { Layer, RasterPgwLayer } from '../types/layer.ts'
import { clampCloudinaryUrl, downscalePlan, isCloudinaryUpload, MAX_TEXTURE_EDGE, type DownscalePlan } from '@utils/textureLimit'
import { logger } from './MapLogger'

const CATEGORY = 'TextureLimiter'

const preparedCache = new Map<string, Promise<string>>()
const edgeByMap = new WeakMap<maplibregl.Map, number>()

function detectEdge(map: maplibregl.Map): number {
  const cached = edgeByMap.get(map)
  if (cached !== undefined) return cached

  let edge = MAX_TEXTURE_EDGE
  try {
    const canvas = map.getCanvas()
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    const reported = gl?.getParameter(gl.MAX_TEXTURE_SIZE)
    if (typeof reported === 'number' && reported > 0) {
      edge = Math.min(MAX_TEXTURE_EDGE, reported)
    }
  } catch { /* contexto aún no disponible */ }

  edgeByMap.set(map, edge)
  return edge
}

async function encodeDownscaled(url: string, plan: DownscalePlan): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const source = await response.blob()
  const bitmap = await createImageBitmap(source, {
    resizeWidth: plan.width,
    resizeHeight: plan.height,
    resizeQuality: 'high',
  })

  try {
    if (typeof OffscreenCanvas === 'function') {
      const canvas = new OffscreenCanvas(plan.width, plan.height)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Sin contexto 2D')
      ctx.drawImage(bitmap, 0, 0, plan.width, plan.height)
      const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.9 })
      return URL.createObjectURL(blob)
    }

    const canvas = document.createElement('canvas')
    canvas.width = plan.width
    canvas.height = plan.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Sin contexto 2D')
    ctx.drawImage(bitmap, 0, 0, plan.width, plan.height)
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', 0.9)
    })
    if (!blob) throw new Error('Sin blob')
    return URL.createObjectURL(blob)
  } finally {
    bitmap.close()
  }
}

export function maxTextureEdge(map: maplibregl.Map): number {
  return detectEdge(map)
}

export function prepareRasterUrl(
  map: maplibregl.Map,
  url: string,
  width: number,
  height: number,
  requestedEdge: number = MAX_TEXTURE_EDGE,
): Promise<string> {
  const edge = Math.min(requestedEdge, detectEdge(map))

  if (isCloudinaryUpload(url)) {
    return Promise.resolve(clampCloudinaryUrl(url, edge))
  }

  const plan = downscalePlan(width, height, edge)
  if (plan === null) return Promise.resolve(url)
  if (typeof fetch !== 'function' || typeof createImageBitmap !== 'function') {
    return Promise.resolve(url)
  }

  const key = `${plan.width}x${plan.height}:${url}`
  const cached = preparedCache.get(key)
  if (cached !== undefined) return cached

  const pending = encodeDownscaled(url, plan).catch((error: unknown) => {
    preparedCache.delete(key)
    logger.warn(CATEGORY, `No se pudo reducir ${url}: conserva original`, error)
    return url
  })
  preparedCache.set(key, pending)
  return pending
}

export async function prepareLayerImages(
  map: maplibregl.Map,
  layers: Layer[],
): Promise<Record<string, string>> {
  const images: Record<string, string> = {}
  for (const layer of layers) {
    if (layer.type !== 'raster-pgw') continue
    const raster = layer as RasterPgwLayer
    const calib = LAYER_CALIBRATIONS[layer.id]
    const width = calib ? calib.width : raster.width
    const height = calib ? calib.height : raster.height
    const url = await prepareRasterUrl(map, raster.image, width, height)
    if (url !== raster.image) images[layer.id] = url
  }
  return images
}
