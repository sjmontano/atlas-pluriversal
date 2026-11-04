import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type * as maplibregl from 'maplibre-gl'
import type { ImageCoordinates } from '@services/BoundsCalculator'
import type { MapContent } from '../../src/types/content'

const prepareRasterUrl = vi.fn<(...args: unknown[]) => Promise<string>>()

vi.mock('@services/TextureLimiter', () => ({
  maxTextureEdge: () => 4096,
  prepareRasterUrl: (...args: unknown[]) => prepareRasterUrl(...args),
}))

const { attachBaseZoomFallback } = await import('@services/MapRenderer')

/** Imagen ficticia con el tamaño del PNG de la Síntesis de Suárez. */
class FakeImage {
  naturalWidth = 9448
  naturalHeight = 5314
  complete = true
  crossOrigin = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  set src(_url: string) {
    queueMicrotask(() => this.onload?.())
  }
}

const COORDS = [[0, 1], [1, 1], [1, 0], [0, 0]] as unknown as ImageCoordinates

function setup(url: string) {
  const updateImage = vi.fn()
  const map = {
    getSource: () => ({ updateImage }),
    getZoom: () => 6,
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as maplibregl.Map
  const entry = {
    geo: { width: 9448, height: 5314 },
    images: { base: url, full: url, placeholder: '/preview.webp' },
    tiles: { minZoom: 6, maxZoom: 10, preview: '/preview.webp' },
    config: { initialBearing: 0 },
  } as unknown as MapContent
  const detach = attachBaseZoomFallback(map, 'test-local', entry, COORDS)
  return { updateImage, detach }
}

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0))

describe('base local mayor que el límite de textura', () => {
  beforeEach(() => {
    prepareRasterUrl.mockReset()
    vi.stubGlobal('Image', FakeImage)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sube la versión reducida, nunca el original', async () => {
    prepareRasterUrl.mockResolvedValue('blob:reducida')
    const { updateImage, detach } = setup('/local-reducible.png')
    await settle()
    expect(prepareRasterUrl).toHaveBeenCalledWith(expect.anything(), '/local-reducible.png', 9448, 5314, 4096)
    expect(updateImage).toHaveBeenCalledWith({ url: 'blob:reducida', coordinates: COORDS })
    detach()
  })

  it('conserva el preview si no se puede reducir', async () => {
    prepareRasterUrl.mockImplementation(async (_map, url) => url as string)
    const { updateImage, detach } = setup('/local-sin-reducir.png')
    await settle()
    expect(updateImage).not.toHaveBeenCalled()
    detach()
  })
})
