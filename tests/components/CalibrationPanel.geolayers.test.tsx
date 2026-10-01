import { describe, it, expect, vi, afterEach } from 'vitest'

vi.hoisted(() => {
  vi.stubEnv('VITE_DEV_TOOLS', 'true')
})

vi.mock('maplibre-gl', () => ({ default: {} }))

vi.mock('@content', () => ({
  getMapContent: vi.fn(() => ({
    geo: { pgw: [0, 0.002, 0.002, 0, -79, -1], width: 3649, height: 6496 },
    images: { placeholder: '', full: '' },
    config: { initialBearing: -90, dragPan: false, scrollZoom: true, useTransformConstrain: false },
    layers: [
      { id: 'bredunco-rio-cauca', name: 'Río Cauca', type: 'geojson', url: '/assets/geojson/rio-cauca.json' },
      { id: 'bredunco-rio-magdalena', name: 'Río Magdalena', type: 'geojson', url: '/assets/geojson/rio-magdalena.json' },
    ],
  })),
}))

import { render, screen, fireEvent, act } from '@testing-library/react'
import { CalibrationPanel } from '@components/dev/calibration/CalibrationPanel'

function makeController() {
  const listeners: Record<string, (e: unknown) => void> = {}
  const canvas = {
    style: {} as Record<string, string>,
    setPointerCapture: vi.fn(),
    addEventListener: (name: string, fn: (e: unknown) => void) => { listeners[name] = fn },
    removeEventListener: vi.fn(),
  }
  const setDataCalls: Array<{ id: string; data: unknown }> = []
  const ctrl = {
    map: {
      getSource: vi.fn((id: string) => ({
        setData: vi.fn((d: unknown) => { setDataCalls.push({ id, data: d }) }),
      })),
      getLayer: vi.fn(() => undefined),
      getStyle: vi.fn(() => ({ layers: [], sources: {} })),
      on: vi.fn(),
      off: vi.fn(),
      getCanvas: vi.fn(() => canvas),
      getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })),
      getCenter: vi.fn(() => ({ lng: -76, lat: 3 })),
      project: vi.fn((p: [number, number] | { lng: number; lat: number }) =>
        Array.isArray(p) ? { x: p[0] * 10, y: p[1] * 10 } : { x: p.lng * 10, y: p.lat * 10 },
      ),
      unproject: vi.fn(([x, y]: [number, number]) => ({ lng: x / 10, lat: y / 10 })),
      dragPan: { disable: vi.fn(), enable: vi.fn() },
    },
    updateBounds: vi.fn(() => ({ coordinates: [[0, 0]], bounds: [0, 0, 1, 1] })),
    updateViewportMargins: vi.fn(),
  }
  return { ctrl, listeners, setDataCalls }
}

const LINE = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } },
  ],
}

async function openGeo() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, json: async () => structuredClone(LINE) })),
  )
  const { ctrl, listeners, setDataCalls } = makeController()
  render(<CalibrationPanel mapId="chapter1-bredunco" controllerRef={{ current: ctrl as never }} />)
  fireEvent.click(screen.getByText(/🧭 Vector/))
  fireEvent.click(screen.getByTitle('Mostrar panel'))
  await screen.findByText(/1\/2 Río Cauca/)
  return { ctrl, listeners, setDataCalls }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

function firstCoords(data: unknown): unknown {
  const fc = data as { features: Array<{ geometry: { coordinates: unknown } }> }
  return fc.features[0]?.geometry.coordinates
}

describe('CalibrationPanel target geolayers', () => {
  it('muestra la pestaña con las capas GeoJSON del mapa', () => {
    const { ctrl } = makeController()
    render(<CalibrationPanel mapId="chapter1-bredunco" controllerRef={{ current: ctrl as never }} />)
    expect(screen.getByText(/🧭 Vector: 2/)).toBeDefined()
  })

  it('flecha mueve la capa seleccionada (mismo delta en setData)', async () => {
    const { setDataCalls } = await openGeo()
    /* centro (-76,3) → -5px X → delta (-0.5, 0) */
    fireEvent.click(screen.getByTitle('izquierda'))
    const last = setDataCalls.filter((c) => c.id === 'atlas-layer-bredunco-rio-cauca').pop()
    expect(firstCoords(last?.data)).toEqual([[-0.5, 0], [0.5, 1]])
    /* la otra capa intacta */
    expect(setDataCalls.some((c) => c.id === 'atlas-layer-bredunco-rio-magdalena')).toBe(false)
  })

  it('modo Todas + drag + copiar/reset', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true })
    const { listeners, setDataCalls } = await openGeo()
    fireEvent.click(screen.getByTitle('Mover todas a la vez'))
    fireEvent.click(screen.getByTitle('izquierda'))
    const ids = new Set(setDataCalls.map((u) => u.id))
    expect(ids.has('atlas-layer-bredunco-rio-cauca')).toBe(true)
    expect(ids.has('atlas-layer-bredunco-rio-magdalena')).toBe(true)

    fireEvent.click(screen.getByText(/↕ Mover/))
    act(() => {
      listeners.pointerdown?.({ pointerId: 1, clientX: 0, clientY: 0 })
      listeners.pointermove?.({ pointerId: 1, clientX: 0, clientY: 20 })
    })
    expect(setDataCalls.length).toBeGreaterThan(2)

    fireEvent.click(screen.getByTitle('Copiar a portapapeles (formato geo.js)'))
    const text = String(writeText.mock.calls[0]?.[0] ?? '')
    expect(text).toContain('node scripts/shift-geojson.mjs --lng -0.5 --lat 2 assets/geojson/rio-cauca.json')

    setDataCalls.length = 0
    fireEvent.click(screen.getByTitle('Reset a valores originales de geo.js'))
    const restored = setDataCalls.filter((c) => c.id === 'atlas-layer-bredunco-rio-cauca').pop()
    expect(firstCoords(restored?.data)).toEqual([[0, 0], [1, 1]])
  })
})
