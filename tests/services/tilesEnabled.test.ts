import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as maplibregl from 'maplibre-gl'
import { addTilesLayer } from '@services/MapRenderer'
import { useMapStore } from '@stores/mapStore'

vi.mock('maplibre-gl', () => ({
  Map: vi.fn(),
  setWorkerUrl: vi.fn(),
  config: {},
}))

function makeMap() {
  return {
    getSource: vi.fn(() => null),
    getLayer: vi.fn(() => null),
    addSource: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    removeSource: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as maplibregl.Map
}

const ENTRY = {
  tiles: {
    urlTemplate: '/assets/maps/tiles/mapas-standard/x/{z}/{x}/{y}.webp',
    tileSize: 512,
    minZoom: 6,
    maxZoom: 9,
  },
  geo: { pgw: [0, 0.001, 0.001, 0, -77, 2], width: 1000, height: 2000 },
} as never

const BOUNDS = [-77, 1, -76, 2] as never

describe('addTilesLayer sin tiles (demo)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('omite el source y deja status idle con tilesEnabled:false', () => {
    const map = makeMap()
    addTilesLayer(map, 'demo', ENTRY, BOUNDS, { tilesEnabled: false })
    expect(map.addSource).not.toHaveBeenCalled()
    expect(useMapStore.getState().tilesStatus).toBe('idle')
  })

  it('agrega el source con tilesEnabled por defecto', () => {
    const map = makeMap()
    addTilesLayer(map, 'demo', ENTRY, BOUNDS, {})
    expect(map.addSource).toHaveBeenCalled()
  })
})
