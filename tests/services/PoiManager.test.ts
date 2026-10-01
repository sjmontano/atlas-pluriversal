import { describe, it, expect, vi } from 'vitest'
import { addPois, removePois } from '@services/PoiManager'
import type * as maplibregl from 'maplibre-gl'
import type { Poi } from '@types/poi'

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  return {
    getSource: vi.fn((id) => sources.get(id) ?? null),
    getLayer: vi.fn((id) => layers.get(id) ?? null),
    addSource: vi.fn((id, def) => { sources.set(id, def) }),
    addLayer: vi.fn((def) => { layers.set(def.id, def) }),
    removeLayer: vi.fn((id) => { layers.delete(id) }),
    removeSource: vi.fn((id) => { sources.delete(id) }),
    setPaintProperty: vi.fn(),
    getCanvas: vi.fn(() => ({ style: {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }) })),
    setMissingStyleImageResolver: vi.fn(),
    setFeatureState: vi.fn(),
    project: vi.fn((c: [number, number]) => ({ x: c[0] * 10, y: c[1] * 10 })),
    on: vi.fn(),
    off: vi.fn(),
    getStyle: vi.fn(() => ({ sources: Object.fromEntries(sources), layers: [...layers.values()] })),
    _sources: sources,
    _layers: layers,
  } as unknown as maplibregl.Map
}

function stubRaf() {
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
}

const POIS: Poi[] = [
  {
    id: 'p-1',
    name: 'Point A',
    coords: [-77, 2],
    popup: { title: 'A', body: 'Body A' },
    numero: 1,
  },
  {
    id: 'p-2',
    name: 'Point B',
    coords: [-78, 3],
    popup: { title: 'B' },
  },
]

describe('PoiManager', () => {
  beforeEach(() => {
    stubRaf()
  })

  it('addPois creates a single geojson source, symbol layer and circle layers', () => {
    const map = makeMap()
    addPois(map, 'test', POIS, vi.fn())
    expect(map.addSource).toHaveBeenCalledWith(
      'atlas-pois-source',
      expect.objectContaining({ type: 'geojson' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-layer', type: 'symbol' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-circle-layer', type: 'circle' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-pulse-layer', type: 'circle' }),
    )
  })

  it('removePois removes layer and source', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    map._layers.set('atlas-pois-circle-layer', { id: 'atlas-pois-circle-layer' })
    map._layers.set('atlas-pois-pulse-layer', { id: 'atlas-pois-pulse-layer' })
    map._sources.set('atlas-pois-source', { type: 'geojson' })
    removePois(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-layer')
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-circle-layer')
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-pulse-layer')
    expect(map.removeSource).toHaveBeenCalledWith('atlas-pois-source')
  })

  it('addPois removes existing POIs before adding new', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    addPois(map, 'test', POIS, vi.fn())
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-layer')
    expect(map.addSource).toHaveBeenCalled()
  })

  it('crea capa de anillo hover solo con variantes de punto', () => {
    const map = makeMap()
    addPois(map, 'test', POIS, vi.fn())
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-hover-layer', type: 'circle' }),
    )
  })

  it('hover por hit-test enciende/apaga el anillo vía feature-state', () => {
    const map = makeMap()
    addPois(map, 'test', POIS, vi.fn())
    const onCalls = (map.on as ReturnType<typeof vi.fn>).mock.calls
    const onMove = onCalls.find(([t]) => t === 'mousemove')?.[1] as (e: unknown) => void
    /* p-1 en [-77,2] → proyecta (-770, 20) */
    onMove({ point: { x: -770, y: 20 }, lngLat: { lng: -77, lat: 2 } })
    expect(map.setFeatureState).toHaveBeenCalledWith(
      { source: 'atlas-pois-source', id: 'p-1' },
      { hover: true },
    )
    /* lejos: apaga */
    onMove({ point: { x: 0, y: 0 }, lngLat: { lng: 0, lat: 0 } })
    expect(map.setFeatureState).toHaveBeenCalledWith(
      { source: 'atlas-pois-source', id: 'p-1' },
      { hover: false },
    )
  })

  it('removePois elimina también la capa de anillo', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-hover-layer', { id: 'atlas-pois-hover-layer' })
    removePois(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-hover-layer')
  })

  it('onHover opt-in recibe el POI y null al salir', () => {
    const map = makeMap()
    const onHover = vi.fn()
    addPois(map, 'test', POIS, vi.fn(), { onHover })
    const onCalls = (map.on as ReturnType<typeof vi.fn>).mock.calls
    const onMove = onCalls.find(([t]) => t === 'mousemove')?.[1] as (e: unknown) => void
    onMove({ point: { x: -770, y: 20 }, lngLat: { lng: -77, lat: 2 } })
    expect(onHover).toHaveBeenCalledWith(expect.objectContaining({ id: 'p-1' }))
    onMove({ point: { x: 0, y: 0 }, lngLat: { lng: 0, lat: 0 } })
    expect(onHover).toHaveBeenCalledWith(null)
  })
})
