import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.hoisted(() => {
  vi.stubEnv('VITE_DEV_TOOLS', 'true')
})

vi.mock('maplibre-gl', () => ({ default: {} }))

vi.mock('@content', () => ({
  getMapContent: vi.fn((mapId: string) => ({
    geo: { pgw: [0, 0.002, 0.002, 0, -79, -1], width: 3649, height: 6496 },
    images: { placeholder: '', full: '' },
    config: { initialBearing: -90, dragPan: false, scrollZoom: true, useTransformConstrain: false },
    encuadres:
      mapId === 'chapter1-encuadres'
        ? [
            { id: 'e1', name: 'Uno', targetMapId: 'm1', labelCoords: [-76, 3], url: '/assets/geojson/e1.json' },
            { id: 'e2', name: 'Dos', targetMapId: 'm2', labelCoords: [-75, 4] },
          ]
        : undefined,
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
  const sources: Record<string, { setData: (d: unknown) => void }> = {}
  for (const id of ['atlas-encuadre-src-e1', 'atlas-encuadre-labelsrc-e1', 'atlas-encuadre-labelsrc-e2']) {
    sources[id] = {
      setData: vi.fn((d: unknown) => { setDataCalls.push({ id, data: d }) }),
    }
  }
  const ctrl = {
    map: {
      getSource: vi.fn((id: string) => sources[id] ?? undefined),
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

const POLYGON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
    },
  ],
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      String(url).includes('e1.json')
        ? { ok: true, json: async () => structuredClone(POLYGON) }
        : { ok: false },
    ),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function openEncuadres() {
  const { ctrl, listeners, setDataCalls } = makeController()
  render(<CalibrationPanel mapId="chapter1-encuadres" controllerRef={{ current: ctrl as never }} />)
  fireEvent.click(screen.getByText(/⬚ Encuadres/))
  fireEvent.click(screen.getByTitle('Mostrar panel'))
  await screen.findByText(/1\/2 Uno/)
  return { ctrl, listeners, setDataCalls }
}

describe('CalibrationPanel target encuadres', () => {
  it('muestra la pestaña solo si el mapa tiene encuadres', async () => {
    const { ctrl } = makeController()
    render(<CalibrationPanel mapId="chapter1-encuadres" controllerRef={{ current: ctrl as never }} />)
    expect(screen.getByText(/⬚ Encuadres: 2/)).toBeDefined()
  })

  it('flecha mueve polígono y etiqueta juntos (mismo delta)', async () => {
    const { setDataCalls } = await openEncuadres()
    /* centro (-76,3) → px (-760,30); -5px X → lng -76.5: offset (-0.5, 0) */
    fireEvent.click(screen.getByTitle('izquierda'))
    const poly = setDataCalls.filter((c) => c.id === 'atlas-encuadre-src-e1')
    const label = setDataCalls.filter((c) => c.id === 'atlas-encuadre-labelsrc-e1')
    expect(poly.length).toBeGreaterThan(0)
    expect(label.length).toBeGreaterThan(0)
    const ring = (poly[poly.length - 1]?.data as { features: Array<{ geometry: { coordinates: number[][][] } }> })
      .features[0]?.geometry.coordinates[0]
    expect(ring?.[0]).toEqual([-0.5, 0])
    const point = (label[label.length - 1]?.data as { features: Array<{ geometry: { coordinates: number[] } }> })
      .features[0]?.geometry.coordinates
    expect(point).toEqual([-76.5, 3])
  })

  it('drag en modo mover desplaza el encuadre seleccionado', async () => {
    const { listeners, setDataCalls } = await openEncuadres()
    fireEvent.click(screen.getByText(/↕ Mover/))
    act(() => {
      listeners.pointerdown?.({ pointerId: 1, clientX: 0, clientY: 0 })
      listeners.pointermove?.({ pointerId: 1, clientX: 50, clientY: 0 })
    })
    /* unproject: (0,0)→(0,0), (50,0)→(5,0): delta (+5, 0) */
    const label = setDataCalls.filter((c) => c.id === 'atlas-encuadre-labelsrc-e1')
    const point = (label[label.length - 1]?.data as { features: Array<{ geometry: { coordinates: number[] } }> })
      ?.features[0]?.geometry.coordinates
    expect(point).toEqual([-71, 3])
  })

  it('copiar genera comando + labelCoords y reset restaura originales', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true })
    const { setDataCalls } = await openEncuadres()
    fireEvent.click(screen.getByTitle('izquierda'))
    fireEvent.click(screen.getByTitle('Copiar a portapapeles (formato geo.js)'))
    expect(writeText).toHaveBeenCalledTimes(1)
    const text = String(writeText.mock.calls[0]?.[0] ?? '')
    expect(text).toContain('node scripts/shift-geojson.mjs --lng -0.5 --lat 0 assets/geojson/e1.json')
    expect(text).toContain('labelCoords: [-76.5, 3],  // e1')

    setDataCalls.length = 0
    fireEvent.click(screen.getByTitle('Reset a valores originales de geo.js'))
    const restored = setDataCalls.filter((c) => c.id === 'atlas-encuadre-src-e1')
    const ring = (restored[restored.length - 1]?.data as { features: Array<{ geometry: { coordinates: number[][][] } }> })
      .features[0]?.geometry.coordinates[0]
    expect(ring?.[0]).toEqual([0, 0])
  })
})
