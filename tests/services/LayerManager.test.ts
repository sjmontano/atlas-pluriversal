import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as maplibregl from 'maplibre-gl'
import { sync, addLayer, removeLayer, removeAll, updateLayerPGW, bindLayerTooltips } from '@services/LayerManager'
import { useLayerStore } from '@stores/layerStore'
import type { RasterPgwLayer, GeojsonLayer } from '@types/layer'

vi.mock('maplibre-gl', () => ({
  Map: vi.fn(),
}))

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  return {
    getSource: vi.fn((id) => sources.get(id) ?? null),
    getLayer: vi.fn((id) => layers.get(id) ?? null),
    addSource: vi.fn((id, def) => { sources.set(id, def) }),
    addLayer: vi.fn((def, beforeId) => { layers.set(def.id, { ...def, beforeId }) }),
    removeLayer: vi.fn((id) => { layers.delete(id) }),
    removeSource: vi.fn((id) => { sources.delete(id) }),
    setLayoutProperty: vi.fn(),
    setPaintProperty: vi.fn(),
    getStyle: vi.fn(() => ({ sources: Object.fromEntries(sources), layers: [...layers.values()] })),
    on: vi.fn(),
    off: vi.fn(),
    getCanvas: vi.fn(() => ({ style: {} })),
    getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }) })),
    unproject: vi.fn(() => ({ lng: -77, lat: 2 })),
    _sources: sources,
    _layers: layers,
  } as unknown as maplibregl.Map
}

const RASTER_LAYER: RasterPgwLayer = {
  id: 'test-layer',
  name: 'Test Layer',
  type: 'raster-pgw',
  category: 'ecosystems',
  image: 'https://example.com/test.webp',
  pgw: [0, 0.001, 0.001, 0, -77, 2],
  width: 1000,
  height: 2000,
  order: 10,
  opacity: 0.8,
  visibleByDefault: true,
}

const GEOJSON_LAYER: GeojsonLayer = {
  id: 'nodo-suarez',
  name: 'Nodo Suárez',
  type: 'geojson',
  category: 'nodes',
  url: '/data/nodos/suarez.geojson',
  geometry: 'fill',
  paint: { 'fill-color': '#ffaf25', 'fill-opacity': 0.4 },
  order: 20,
  opacity: 0.4,
  visibleByDefault: true,
}

describe('LayerManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const store = useLayerStore.getState()
    store.resetAll('test')
  })

  describe('addLayer (raster-pgw)', () => {
    it('adds image source and raster layer with bounds', () => {
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(['test-layer']), opacities: {} })
      expect(map.addSource).toHaveBeenCalledWith(
        'atlas-layer-test-layer',
        expect.objectContaining({ type: 'image' }),
      )
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'atlas-layer-test-layer', type: 'raster' }),
        undefined,
      )
    })

    it('sets visibility to none when layer not in visibleLayers', () => {
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(), opacities: {} })
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ layout: { visibility: 'none' } }),
        undefined,
      )
    })

    it('uses calibrated PGW when LAYER_CALIBRATIONS has entry', async () => {
      const { LAYER_CALIBRATIONS } = await import('@content/calibration/layers')
      LAYER_CALIBRATIONS['test-layer'] = {
        pgw: [0, 0.002, 0.002, 0, -78, 3],
        width: 500,
        height: 1000,
      }
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(), opacities: {} })
      const coords = (map.addSource as ReturnType<typeof vi.fn>).mock.calls[0][1].coordinates
      expect(coords).toBeDefined()
      expect(coords.length).toBe(4)
      LAYER_CALIBRATIONS['test-layer'] = undefined as unknown as typeof LAYER_CALIBRATIONS[string]
    })
  })

  describe('addLayer (geojson)', () => {
    it('adds geojson source and fill layer with paint', () => {
      const map = makeMap()
      addLayer(map, GEOJSON_LAYER, { visibleLayers: new Set(['nodo-suarez']), opacities: {} })
      expect(map.addSource).toHaveBeenCalledWith(
        'atlas-layer-nodo-suarez',
        expect.objectContaining({ type: 'geojson', data: '/data/nodos/suarez.geojson' }),
      )
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'atlas-layer-nodo-suarez',
          type: 'fill',
          paint: expect.objectContaining({ 'fill-color': '#ffaf25' }),
        }),
        undefined,
      )
    })

    it('sets visibility none when geojson layer not visible', () => {
      const map = makeMap()
      addLayer(map, GEOJSON_LAYER, { visibleLayers: new Set(), opacities: {} })
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ layout: { visibility: 'none' } }),
        undefined,
      )
    })
  })

  describe('removeLayer', () => {
    it('removes both layer and source', () => {
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(), opacities: {} })
      removeLayer(map, 'test-layer')
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-test-layer')
      expect(map.removeSource).toHaveBeenCalledWith('atlas-layer-test-layer')
    })
  })

  describe('removeAll', () => {
    it('removes all atlas-layer-* sources and layers', () => {
      const map = makeMap()
      map._layers.set('atlas-layer-a', { id: 'atlas-layer-a' })
      map._layers.set('atlas-layer-b', { id: 'atlas-layer-b' })
      map._layers.set('atlas-base-image-layer', { id: 'atlas-base-image-layer' })
      removeAll(map)
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-a')
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-b')
      expect(map.removeLayer).not.toHaveBeenCalledWith('atlas-base-image-layer')
    })
  })

  describe('sync', () => {
    it('adds missing layers and removes stale ones', () => {
      const map = makeMap()
      map._layers.set('atlas-layer-stale', { id: 'atlas-layer-stale' })
      sync(map, 'test', [RASTER_LAYER], [], {
        visibleLayers: new Set(['test-layer']),
        opacities: {},
      })
      expect(map.addSource).toHaveBeenCalledWith(
        'atlas-layer-test-layer',
        expect.objectContaining({ type: 'image' }),
      )
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-stale')
    })

    it.each([
      ['fill', 'fill-opacity'],
      ['line', 'line-opacity'],
      ['circle', 'circle-opacity'],
      ['symbol', 'icon-opacity'],
    ] as const)('usa %s-opacity en capas geojson %s (no raster-opacity)', (geometry, paintProp) => {
      const map = makeMap()
      const layer: GeojsonLayer = {
        ...GEOJSON_LAYER,
        id: `test-${geometry}`,
        geometry,
      }
      const sid = `atlas-layer-test-${geometry}`
      map._layers.set(sid, { id: sid })
      sync(map, 'test', [layer], [], {
        visibleLayers: new Set([`test-${geometry}`]),
        opacities: {},
      })
      expect(map.setPaintProperty).toHaveBeenCalledWith(
        `atlas-layer-test-${geometry}`,
        paintProp,
        expect.any(Number),
      )
    })
  })

  describe('bindLayerTooltips', () => {
    function makeHoverMap() {
      const map = makeMap()
      ;(map.getCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
        style: {},
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
      })
      ;(map as unknown as Record<string, unknown>).project = vi.fn(() => ({ x: 100, y: 200 }))
      return map
    }

    it('muestra el nombre de la capa al hover y lo oculta al salir', () => {
      const map = makeHoverMap()
      bindLayerTooltips(map, [GEOJSON_LAYER])
      const calls = (map.on as ReturnType<typeof vi.fn>).mock.calls as Array<[string, string, (e?: never) => void]>
      const move = calls.find((c) => c[0] === 'mousemove' && c[1] === 'atlas-layer-nodo-suarez')
      const leave = calls.find((c) => c[0] === 'mouseleave' && c[1] === 'atlas-layer-nodo-suarez')
      expect(move).toBeDefined()
      expect(leave).toBeDefined()
      move![2]({ lngLat: { lng: -77, lat: 2 } } as never)
      expect(document.body.innerHTML).toContain('Nodo Suárez')
      const tip = document.body.lastElementChild as HTMLElement
      expect(tip.style.display).toBe('block')
      leave![2]()
      expect(tip.style.display).toBe('none')
    })

    it('no duplica listeners al llamar dos veces', () => {
      const map = makeMap()
      bindLayerTooltips(map, [GEOJSON_LAYER])
      bindLayerTooltips(map, [GEOJSON_LAYER])
      const moves = ((map.on as ReturnType<typeof vi.fn>).mock.calls as Array<[string, string]>)
        .filter((c) => c[0] === 'mousemove' && c[1] === 'atlas-layer-nodo-suarez')
      expect(moves.length).toBe(1)
    })
  })

  describe('hitArea (hover de líneas)', () => {
    const LINE_LAYER: GeojsonLayer = {
      id: 'rio-cauca',
      name: 'Río Cauca',
      type: 'geojson',
      category: 'rivers',
      url: '/data/rios/cauca.geojson',
      geometry: 'line',
      paint: { 'line-color': '#377eb8', 'line-width': 2 },
      order: 9,
      visibleByDefault: true,
    }

    it('crea gemela invisible con ancho por zoom solo en líneas con flag', () => {
      const map = makeMap()
      addLayer(map, LINE_LAYER, { visibleLayers: new Set(['rio-cauca']), opacities: {} }, [], { hitArea: true })
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'atlas-layer-rio-cauca-hit',
          type: 'line',
          source: 'atlas-layer-rio-cauca',
          paint: expect.objectContaining({
            'line-opacity': 0,
            'line-width': expect.arrayContaining(['interpolate']),
          }),
          layout: expect.objectContaining({ visibility: 'visible' }),
        }),
        'atlas-layer-rio-cauca',
      )
    })

    it('no crea gemela sin flag o en geometrías no-lineales', () => {
      const map = makeMap()
      addLayer(map, LINE_LAYER, { visibleLayers: new Set(['rio-cauca']), opacities: {} })
      addLayer(map, GEOJSON_LAYER, { visibleLayers: new Set(['nodo-suarez']), opacities: {} }, [], { hitArea: true })
      const ids = ((map.addLayer as ReturnType<typeof vi.fn>).mock.calls as Array<[{ id: string }]>)
        .map((c) => c[0].id)
      expect(ids).not.toContain('atlas-layer-rio-cauca-hit')
      expect(ids).not.toContain('atlas-layer-nodo-suarez-hit')
    })

    it('removeLayer elimina también la gemela', () => {
      const map = makeMap()
      addLayer(map, LINE_LAYER, { visibleLayers: new Set(['rio-cauca']), opacities: {} }, [], { hitArea: true })
      removeLayer(map, 'rio-cauca')
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-rio-cauca-hit')
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-rio-cauca')
    })

    it('sync crea la gemela aunque la línea esté apagada y la deja visible', () => {
      const map = makeMap()
      // Línea apagada: el padre ni se agrega… salvo con hitArea.
      sync(map, 'test', [LINE_LAYER], [], {
        visibleLayers: new Set(),
        opacities: {},
      }, { hitArea: true })
      expect(map.addSource).toHaveBeenCalledWith(
        'atlas-layer-rio-cauca',
        expect.objectContaining({ type: 'geojson' }),
      )
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'atlas-layer-rio-cauca-hit' }),
        'atlas-layer-rio-cauca',
      )
      // Segunda pasada (padre ya existe, apagado): la gemela sigue visible.
      ;(map.addSource as ReturnType<typeof vi.fn>).mockClear()
      sync(map, 'test', [LINE_LAYER], [], {
        visibleLayers: new Set(),
        opacities: {},
      }, { hitArea: true })
      expect(map.addSource).not.toHaveBeenCalled()
      expect(map.setLayoutProperty).toHaveBeenCalledWith('atlas-layer-rio-cauca', 'visibility', 'none')
      expect(map.setLayoutProperty).toHaveBeenCalledWith('atlas-layer-rio-cauca-hit', 'visibility', 'visible')
    })

    it('bindLayerTooltips escucha la gemela en líneas', () => {
      const map = makeMap()
      bindLayerTooltips(map, [LINE_LAYER])
      const targets = ((map.on as ReturnType<typeof vi.fn>).mock.calls as Array<[string, string]>)
        .filter((c) => c[0] === 'mousemove')
        .map((c) => c[1])
      expect(targets).toContain('atlas-layer-rio-cauca-hit')
      expect(targets).toContain('atlas-layer-rio-cauca')
    })

    it('omite capas con tooltip:false y enlaza por order (la de arriba gana)', () => {
      const map = makeMap()
      const river: GeojsonLayer = { ...LINE_LAYER, id: 'rio-x', name: 'Río X', order: 6 }
      const basin: GeojsonLayer = { ...GEOJSON_LAYER, id: 'cuenca-x', name: 'Cuenca X', order: 4, tooltip: false }
      const node: GeojsonLayer = { ...GEOJSON_LAYER, id: 'nodo-x', name: 'Nodo X', order: 20 }
      bindLayerTooltips(map, [river, basin, node])
      const moves = ((map.on as ReturnType<typeof vi.fn>).mock.calls as Array<[string, string]>)
        .filter((c) => c[0] === 'mousemove')
        .map((c) => c[1])
      // Cuenca excluida; el nodo (order mayor) se enlaza al final y gana el hover.
      expect(moves).not.toContain('atlas-layer-cuenca-x')
      expect(moves).toEqual([
        'atlas-layer-rio-x-hit',
        'atlas-layer-rio-x',
        'atlas-layer-nodo-x',
      ])
    })
  })

  describe('updateLayerPGW', () => {    it('calls setCoordinates on the image source', () => {
      const map = makeMap()
      const setCoords = vi.fn()
      map._sources.set('atlas-layer-test-layer', { setCoordinates: setCoords, type: 'image' })
      updateLayerPGW(map, 'test-layer', [0, 0.002, 0.002, 0, -78, 3], 500, 1000)
      expect(setCoords).toHaveBeenCalled()
    })

    it('no-ops if source does not exist', () => {
      const map = makeMap()
      expect(() =>
        updateLayerPGW(map, 'nonexistent', [0, 0.001, 0.001, 0, -77, 2], 1000, 2000),
      ).not.toThrow()
    })
  })
})
