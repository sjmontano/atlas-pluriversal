import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import type * as maplibregl from 'maplibre-gl'
import { addTilesLayer } from '@services/MapRenderer'
import { useMapStore } from '@stores/mapStore'

vi.mock('maplibre-gl', () => ({
  Map: vi.fn(),
  setWorkerUrl: vi.fn(),
  config: {},
}))

type Handler = (e: Record<string, unknown>) => void

function makeMap() {
  const handlers = new Map<string, Handler[]>()
  const sources = new Set<string>()
  const layers = new Set<string>()
  const map = {
    getSource: (id: string) => (sources.has(id) ? {} : undefined),
    getLayer: (id: string) => (layers.has(id) ? {} : undefined),
    addSource: (id: string) => { sources.add(id) },
    addLayer: (l: { id: string }) => { layers.add(l.id) },
    removeSource: (id: string) => { sources.delete(id) },
    removeLayer: (id: string) => { layers.delete(id) },
    on: (type: string, fn: Handler) => {
      handlers.set(type, [...(handlers.get(type) ?? []), fn])
    },
    off: vi.fn(),
  }
  const fire = (type: string, e: Record<string, unknown> = {}) => {
    for (const fn of handlers.get(type) ?? []) fn({ type, ...e })
  }
  return { map: map as unknown as maplibregl.Map, fire }
}

const coord = (z = 6, x = 1, y = 2) => ({ canonical: { z, x, y } })
const SRC = { dataType: 'source', sourceId: 'atlas-tiles' }

const ENTRY = {
  tiles: { urlTemplate: '/t/{z}/{x}/{y}.webp', tileSize: 512, minZoom: 6, maxZoom: 9 },
} as never
const BOUNDS = [-77, 1, -76, 2] as never

const status = () => useMapStore.getState().tilesStatus

/** Eventos que MapLibre emite al agregar un source raster, sin ningún tile. */
function fireSourceLevel(fire: (t: string, e?: Record<string, unknown>) => void) {
  fire('dataloading', SRC)
  fire('data', { ...SRC, sourceDataType: 'metadata' })
  fire('data', { ...SRC, sourceDataType: 'content' })
}

describe('telemetría de tiles', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useMapStore.setState({ tilesStatus: 'idle' })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('el evento content del source no cuenta como tile cargado', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fireSourceLevel(fire)
    expect(status()).toBe('loading')
  })

  it('el primer tile real pasa a ready y cancela el degraded', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fireSourceLevel(fire)
    fire('dataloading', { ...SRC, tile: {}, coord: coord() })
    fire('data', { ...SRC, tile: {}, coord: coord() })
    expect(status()).toBe('ready')
    vi.advanceTimersByTime(20000)
    expect(status()).toBe('ready')
  })

  it('una caída (tiles pedidos, ninguno cargado) entra en degraded a los 15 s', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fireSourceLevel(fire)
    fire('dataloading', { ...SRC, tile: {}, coord: coord() })
    vi.advanceTimersByTime(14999)
    expect(status()).toBe('loading')
    vi.advanceTimersByTime(1)
    expect(status()).toBe('degraded')
  })

  it('sin tiles que pedir para el viewport, idle resuelve el spinner', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fireSourceLevel(fire)
    fire('data', { ...SRC, sourceDataType: 'idle' })
    expect(status()).toBe('ready')
  })

  it('sin pedidos ni idle (capa apagada), a los 15 s no queda spinner ni degraded', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fireSourceLevel(fire)
    vi.advanceTimersByTime(15000)
    expect(status()).toBe('ready')
  })

  it('reaplicar el mismo perfil tras ready no vuelve a loading', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fire('data', { ...SRC, tile: {}, coord: coord() })
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    expect(status()).toBe('ready')
  })

  it('reaplicar el mismo perfil no saca del degraded', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fire('dataloading', { ...SRC, tile: {}, coord: coord() })
    vi.advanceTimersByTime(15000)
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    expect(status()).toBe('degraded')
  })

  it('cambiar de perfil vuelve a loading y se recupera con el primer tile', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fire('data', { ...SRC, tile: {}, coord: coord() })
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'hd' })
    expect(status()).toBe('loading')
    fire('data', { ...SRC, tile: {}, coord: coord() })
    expect(status()).toBe('ready')
  })

  it('una caída durante el cambio de perfil también entra en degraded', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fire('data', { ...SRC, tile: {}, coord: coord() })
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'hd' })
    fire('dataloading', { ...SRC, tile: {}, coord: coord() })
    vi.advanceTimersByTime(15000)
    expect(status()).toBe('degraded')
  })

  it('un mapa destruido no toca el estado del mapa siguiente', () => {
    const { map, fire } = makeMap()
    addTilesLayer(map, 'm', ENTRY, BOUNDS, { tileProfile: 'standard' })
    fire('dataloading', { ...SRC, tile: {}, coord: coord() })
    fire('remove')
    useMapStore.setState({ tilesStatus: 'ready' })
    vi.advanceTimersByTime(20000)
    expect(status()).toBe('ready')
  })
})
