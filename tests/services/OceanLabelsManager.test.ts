import { describe, it, expect, vi, afterEach } from 'vitest'
import { addOceanLabels, removeOceanLabels } from '@services/OceanLabelsManager'
import type * as maplibregl from 'maplibre-gl'
import type { OceanLabel } from '@types/content'

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  const images = new Map()
  return {
    getSource: vi.fn((id: string) => sources.get(id) ?? null),
    getLayer: vi.fn((id: string) => layers.get(id) ?? null),
    addSource: vi.fn((id: string, def: unknown) => { sources.set(id, def) }),
    addLayer: vi.fn((def: { id: string }) => { layers.set(def.id, def) }),
    removeLayer: vi.fn((id: string) => { layers.delete(id) }),
    removeSource: vi.fn((id: string) => { sources.delete(id) }),
    hasImage: vi.fn((id: string) => images.has(id)),
    addImage: vi.fn((id: string, img: unknown) => { images.set(id, img) }),
    removeImage: vi.fn((id: string) => { images.delete(id) }),
    _sources: sources,
    _layers: layers,
    _images: images,
  } as unknown as maplibregl.Map & {
    _sources: Map<string, unknown>
    _layers: Map<string, unknown>
    _images: Map<string, unknown>
  }
}

const LABELS: OceanLabel[] = [
  { id: 'oceano-pacifico', name: 'OCÉANO PACÍFICO', coords: [-78.5319, 7.0516] },
  { id: 'mar-caribe', name: 'MAR CARIBE', coords: [-76.5319, 12.3516] },
]

function stubEnv() {
  /* jsdom no implementa canvas 2d: contexto falso con medición determinista */
  const ctx = {
    fillText: vi.fn(),
    measureText: vi.fn((s: string) => ({ width: s.length * 10 })),
    getImageData: vi.fn((x: number, y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(Math.max(1, w * h * 4)),
    })),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetY: 0,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as never)
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('OceanLabelsManager (etiquetas de océanos)', () => {
  it('crea imagen + source + capa symbol por etiqueta', async () => {
    stubEnv()
    const map = makeMap()
    await addOceanLabels(map, LABELS)
    expect(map.addImage).toHaveBeenCalledWith(
      'atlas-ocean-img-oceano-pacifico',
      expect.objectContaining({ width: expect.any(Number), height: expect.any(Number), data: expect.anything() }),
    )
    expect(map.addImage).toHaveBeenCalledWith(
      'atlas-ocean-img-mar-caribe',
      expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'atlas-ocean-label-oceano-pacifico',
        type: 'symbol',
        layout: expect.objectContaining({
          'icon-image': 'atlas-ocean-img-oceano-pacifico',
          'icon-allow-overlap': true,
        }),
      }),
    )
  })

  it('conserva las coordenadas originales de v17 en el source', async () => {
    stubEnv()
    const map = makeMap()
    await addOceanLabels(map, LABELS)
    const src = map._sources.get('atlas-ocean-src-mar-caribe') as {
      data: { features: Array<{ geometry: { coordinates: [number, number] } }> }
    }
    expect(src.data.features[0].geometry.coordinates).toEqual([-76.5319, 12.3516])
  })

  it('removeOceanLabels limpia capas, sources e imágenes', async () => {
    stubEnv()
    const map = makeMap()
    await addOceanLabels(map, LABELS)
    removeOceanLabels(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-ocean-label-oceano-pacifico')
    expect(map.removeSource).toHaveBeenCalledWith('atlas-ocean-src-mar-caribe')
    expect(map.removeImage).toHaveBeenCalledWith('atlas-ocean-img-mar-caribe')
  })

  it('addOceanLabels es idempotente (limpia antes de re-añadir)', async () => {
    stubEnv()
    const map = makeMap()
    await addOceanLabels(map, LABELS)
    const sizeAfterFirst = map._layers.size
    expect(sizeAfterFirst).toBe(2)
    await addOceanLabels(map, LABELS)
    expect(map._layers.size).toBe(sizeAfterFirst)
    expect(map.removeImage).toHaveBeenCalled()
  })
})
