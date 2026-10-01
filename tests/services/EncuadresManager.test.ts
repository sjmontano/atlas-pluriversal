import { describe, it, expect, vi, afterEach } from 'vitest'
import { addEncuadres, removeEncuadres } from '@services/EncuadresManager'
import type * as maplibregl from 'maplibre-gl'
import type { Encuadre } from '@types/content'

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  const images = new Map()
  const canvas = {
    style: {} as Record<string, string>,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }
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
    setPaintProperty: vi.fn(),
    setLayoutProperty: vi.fn(),
    /* e1 [-76,3] → (100,100); resto → (500,500): hit-test aislado por etiqueta */
    project: vi.fn((c: [number, number]) => (c[0] === -76 ? { x: 100, y: 100 } : { x: 500, y: 500 })),
    getCanvas: vi.fn(() => canvas),
    on: vi.fn(),
    off: vi.fn(),
    _sources: sources,
    _layers: layers,
    _images: images,
  } as unknown as maplibregl.Map & {
    _sources: Map<string, unknown>
    _layers: Map<string, unknown>
    _images: Map<string, unknown>
  }
}

/* Image que falla de inmediato: loadWithTimeout resuelve null sin esperar */
class FailingImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  set src(_v: string) {
    this.onerror?.()
  }
}

const ENCUADRES: Encuadre[] = [
  {
    id: 'e1',
    name: 'Hola\nmundo',
    targetMapId: 'm1',
    labelCoords: [-76, 3],
    url: '/assets/geojson/e1.json',
  },
  {
    id: 'e2',
    name: 'Solo',
    targetMapId: 'm2',
    labelCoords: [-75, 4],
  },
]

function stubEnv() {
  vi.stubGlobal('Image', FailingImage)
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, json: async () => ({ type: 'FeatureCollection', features: [] }) })),
  )
  /* jsdom no implementa canvas 2d: contexto falso con medición determinista */
  const ctx = {
    save: vi.fn(),
    restore: vi.fn(),
    clip: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arcTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
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

describe('EncuadresManager (etiquetas canvas)', () => {
  it('crea imágenes + source + capa symbol por etiqueta', async () => {
    stubEnv()
    const map = makeMap()
    await addEncuadres(map, ENCUADRES, vi.fn())
    expect(map.addImage).toHaveBeenCalledWith(
      'atlas-encuadre-img-e1',
      expect.objectContaining({ width: expect.any(Number), height: expect.any(Number), data: expect.anything() }),
    )
    expect(map.addImage).toHaveBeenCalledWith(
      'atlas-encuadre-img-e1-hover',
      expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'atlas-encuadre-label-e1',
        type: 'symbol',
        layout: expect.objectContaining({
          'icon-image': 'atlas-encuadre-img-e1',
          'icon-size': 0.5,
          'icon-allow-overlap': true,
        }),
      }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'atlas-encuadre-label-e2' }))
  })

  it('mantiene polígono + etiqueta navegable aunque falle el fetch', async () => {
    stubEnv()
    const map = makeMap()
    await addEncuadres(map, ENCUADRES, vi.fn())
    /* fill/line solo para e1 (con url) */
    expect(map.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'atlas-encuadre-fill-e1', type: 'fill' }))
    expect(map.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'atlas-encuadre-line-e1', type: 'line' }))
    expect(map.addLayer).not.toHaveBeenCalledWith(expect.objectContaining({ id: 'atlas-encuadre-fill-e2' }))
  })

  it('hover por hit-test conmuta imagen y relleno; click navega', async () => {
    stubEnv()
    const map = makeMap()
    const onNavigate = vi.fn()
    await addEncuadres(map, ENCUADRES, onNavigate)
    const onCalls = (map.on as ReturnType<typeof vi.fn>).mock.calls
    /* globales = 2 args (tipo, fn); polígonos = 3 args (tipo, capa, fn) */
    const onMove = onCalls.find(([t, _a, b]) => t === 'mousemove' && b === undefined)?.[1] as (e: unknown) => void
    const onClick = onCalls.find(([t, _a, b]) => t === 'click' && b === undefined)?.[1] as (e: unknown) => void
    expect(onMove).toBeDefined()
    expect(onClick).toBeDefined()

    /* project → (100,100): dentro de la caja de e1 */
    onMove({ point: { x: 100, y: 100 } })
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      'atlas-encuadre-label-e1',
      'icon-image',
      'atlas-encuadre-img-e1-hover',
    )
    expect(map.setPaintProperty).toHaveBeenCalledWith('atlas-encuadre-fill-e1', 'fill-opacity', 0.25)
    onClick({ point: { x: 100, y: 100 } })
    expect(onNavigate).toHaveBeenCalledWith('m1')

    /* lejos: revierte */
    onMove({ point: { x: 900, y: 900 } })
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      'atlas-encuadre-label-e1',
      'icon-image',
      'atlas-encuadre-img-e1',
    )
    expect(map.setPaintProperty).toHaveBeenCalledWith('atlas-encuadre-fill-e1', 'fill-opacity', 0)
  })

  it('el área tocable nunca baja de 44px aunque lo visual sea menor', async () => {
    stubEnv()
    const map = makeMap()
    await addEncuadres(map, ENCUADRES, vi.fn())
    const onCalls = (map.on as ReturnType<typeof vi.fn>).mock.calls
    const onMove = onCalls.find(([t, _a, b]) => t === 'mousemove' && b === undefined)?.[1] as (e: unknown) => void
    /* e2 'Solo' mide ~30px de alto visual; a 28px del centro ya está fuera
     * de lo visual pero dentro del mínimo táctil (22+8): debe hoverear */
    onMove({ point: { x: 500, y: 528 } })
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      'atlas-encuadre-label-e2',
      'icon-image',
      'atlas-encuadre-img-e2-hover',
    )
  })

  it('labelMaxWidth permite una sola línea sin mover el global', async () => {
    stubEnv()
    const map = makeMap()
    /* 9 palabras (~530px fake): con el global (440 art) partiría en dos */
    const name = 'Palabra uno dos tres cuatro cinco seis siete ocho nueve'
    await addEncuadres(
      map,
      [{ id: 'wide', name, targetMapId: 'mw', labelCoords: [-70, 0], labelMaxWidth: 500 }],
      vi.fn(),
    )
    const img = map._images.get('atlas-encuadre-img-wide') as { width: number; height: number }
    /* 55 caracteres en una sola línea (550) + padding 28 = 578;
     * con el global partiría en dos (448 de ancho, doble alto) */
    expect(img.width).toBe(578)
    expect(img.height).toBe(60)
    const layer = map._layers.get('atlas-encuadre-label-wide') as { layout: Record<string, unknown> }
    expect(layer.layout['icon-image']).toBe('atlas-encuadre-img-wide')
  })

  it('removeEncuadres limpia capas, sources e imágenes', async () => {
    stubEnv()
    const map = makeMap()
    await addEncuadres(map, ENCUADRES, vi.fn())
    removeEncuadres(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-encuadre-label-e1')
    expect(map.removeSource).toHaveBeenCalledWith('atlas-encuadre-labelsrc-e1')
    expect(map.removeImage).toHaveBeenCalledWith('atlas-encuadre-img-e1')
    expect(map.removeImage).toHaveBeenCalledWith('atlas-encuadre-img-e1-hover')
  })

  it('addEncuadres es idempotente (limpia antes de re-añadir)', async () => {
    stubEnv()
    const map = makeMap()
    await addEncuadres(map, ENCUADRES, vi.fn())
    const sizeAfterFirst = map._layers.size
    expect(sizeAfterFirst).toBeGreaterThan(0)
    await addEncuadres(map, ENCUADRES, vi.fn())
    expect(map._layers.size).toBe(sizeAfterFirst)
    expect(map.removeImage).toHaveBeenCalled()
  })
})
