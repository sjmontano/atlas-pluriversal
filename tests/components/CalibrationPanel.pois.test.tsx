import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.hoisted(() => {
  vi.stubEnv('VITE_DEV_TOOLS', 'true')
})

vi.mock('maplibre-gl', () => ({ default: {} }))

vi.mock('@content', () => ({
  getMapContent: vi.fn(() => ({
    geo: { pgw: [0, 0.001, 0.001, 0, -77, 2], width: 1000, height: 2000 },
    images: { placeholder: '', full: '' },
    config: { initialBearing: -90, dragPan: true, scrollZoom: true, useTransformConstrain: false },
    pois: [
      { id: 'p1', name: 'Uno', coords: [-76, 3], popup: { title: 'U' } },
      { id: 'p2', name: 'Dos', coords: [-75, 4], popup: { title: 'D' } },
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
  const setDataCalls: Array<{ data: unknown }> = []
  const ctrl = {
    map: {
      getSource: vi.fn(() => ({ setData: vi.fn((d: unknown) => { setDataCalls.push({ data: d }) }) })),
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

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function coordsOf(data: unknown, id: string): unknown {
  const fc = data as { features: Array<{ properties: { id: string }; geometry: { coordinates: unknown } }> }
  return fc.features.find((f) => f.properties.id === id)?.geometry.coordinates
}

async function openPois() {
  const { ctrl, listeners, setDataCalls } = makeController()
  render(<CalibrationPanel mapId="chapter2-valle" controllerRef={{ current: ctrl as never }} />)
  fireEvent.click(screen.getByText(/📍 POIs/))
  fireEvent.click(screen.getByTitle('Mostrar panel'))
  await screen.findByText(/1\/2 Uno/)
  return { ctrl, listeners, setDataCalls }
}

describe('CalibrationPanel target pois', () => {
  it('muestra la pestaña solo si el mapa tiene POIs', () => {
    const { ctrl } = makeController()
    render(<CalibrationPanel mapId="chapter2-valle" controllerRef={{ current: ctrl as never }} />)
    expect(screen.getByText(/📍 POIs: 2/)).toBeDefined()
  })

  it('flecha mueve el POI seleccionado (círculo y todo con él)', async () => {
    const { setDataCalls } = await openPois()
    /* centro (-76,3) → -5px X → (-76.5, 3) */
    fireEvent.click(screen.getByTitle('izquierda'))
    const last = setDataCalls[setDataCalls.length - 1]?.data
    expect(coordsOf(last, 'p1')).toEqual([-76.5, 3])
    expect(coordsOf(last, 'p2')).toEqual([-75, 4])
  })

  it('modo Todas mueve la tanda completa', async () => {
    const { setDataCalls } = await openPois()
    fireEvent.click(screen.getByTitle('Mover todos a la vez'))
    fireEvent.click(screen.getByTitle('izquierda'))
    const last = setDataCalls[setDataCalls.length - 1]?.data
    expect(coordsOf(last, 'p1')).toEqual([-76.5, 3])
    expect(coordsOf(last, 'p2')).toEqual([-75.5, 4])
  })

  it('drag en modo mover desplaza el POI y copiar/reset funcionan', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true })
    const { listeners, setDataCalls } = await openPois()
    fireEvent.click(screen.getByText(/↕ Mover/))
    act(() => {
      listeners.pointerdown?.({ pointerId: 1, clientX: 0, clientY: 0 })
      listeners.pointermove?.({ pointerId: 1, clientX: 50, clientY: 0 })
    })
    /* (0,0)→(0,0), (50,0)→(5,0): delta (+5, 0) */
    const last = setDataCalls[setDataCalls.length - 1]?.data
    expect(coordsOf(last, 'p1')).toEqual([-71, 3])

    fireEvent.click(screen.getByTitle('Copiar a portapapeles (formato geo.js)'))
    const text = String(writeText.mock.calls[0]?.[0] ?? '')
    expect(text).toContain('coords: [-71, 3],  // p1')

    fireEvent.click(screen.getByTitle('Reset a valores originales de geo.js'))
    const restored = setDataCalls[setDataCalls.length - 1]?.data
    expect(coordsOf(restored, 'p1')).toEqual([-76, 3])
  })
})
