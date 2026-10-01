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
    subcuencas: [
      { slug: 'a', image: 'u-a', pgw: [0, 0.001, 0.001, 0, -77, 2], width: 100, height: 200 },
      { slug: 'b', image: 'u-b' },
    ],
  })),
}))

import { render, screen, fireEvent, act } from '@testing-library/react'
import { CalibrationPanel } from '@components/dev/calibration/CalibrationPanel'
import { shiftOrigin } from '@services/MapCalibration'
import { processBounds } from '@services/BoundsCalculator'

function makeController() {
  const listeners: Record<string, (e: unknown) => void> = {}
  const canvas = {
    style: {} as Record<string, string>,
    setPointerCapture: vi.fn(),
    addEventListener: (name: string, fn: (e: unknown) => void) => { listeners[name] = fn },
    removeEventListener: vi.fn(),
  }
  const updates: Array<{ id: string; coords: unknown }> = []
  const ctrl = {
    map: {
      getSource: vi.fn((id: string) => ({
        updateImage: vi.fn(({ coordinates }: { coordinates: unknown }) => {
          updates.push({ id, coords: coordinates })
        }),
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
  return { ctrl, listeners, updates }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

async function openSubcuencas() {
  const { ctrl, listeners, updates } = makeController()
  render(<CalibrationPanel mapId="chapter1-mosaicos-del-agua" controllerRef={{ current: ctrl as never }} />)
  fireEvent.click(screen.getByText(/🌊 Subcuencas/))
  fireEvent.click(screen.getByTitle('Mostrar panel'))
  await screen.findByText(/1\/2 a/)
  return { ctrl, listeners, updates }
}

describe('CalibrationPanel target subcuencas', () => {
  it('muestra la pestaña solo si el mapa tiene subcuencas', () => {
    const { ctrl } = makeController()
    render(<CalibrationPanel mapId="chapter1-mosaicos-del-agua" controllerRef={{ current: ctrl as never }} />)
    expect(screen.getByText(/🌊 Subcuencas: 2/)).toBeDefined()
  })

  it('flecha mueve la subcuenca (pgw propio) vía updateImage', async () => {
    const { updates } = await openSubcuencas()
    /* centro (-76,3) → -5px X → delta (-0.5, 0) → shiftOrigin(pgw, +0.5, 0) */
    fireEvent.click(screen.getByTitle('izquierda'))
    const expected = processBounds(
      shiftOrigin([0, 0.001, 0.001, 0, -77, 2], 0.5, 0),
      100,
      200,
    ).coordinates
    const last = updates.filter((u) => u.id === 'atlas-subcuenca-src-a').pop()
    expect(last?.coords).toEqual(expected)
  })

  it('width/height y tamaño % escalan la imagen y salen en copiar', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true })
    const { updates } = await openSubcuencas()
    /* width 100 → 110 (+ paso): coordenadas con nuevo ancho */
    const plusBtns = screen.getAllByTitle('+ paso')
    fireEvent.click(plusBtns[0]!)
    const expected = processBounds(
      shiftOrigin([0, 0.001, 0.001, 0, -77, 2], 0, 0),
      110,
      200,
    ).coordinates
    const last = updates.filter((u) => u.id === 'atlas-subcuenca-src-a').pop()
    expect(last?.coords).toEqual(expected)

    /* tamaño 150%: width 150, height 300 */
    const slider = screen.getByTitle('Escalar width y height en porcentaje')
    fireEvent.change(slider, { target: { value: '150' } })
    fireEvent.click(screen.getByTitle('Copiar a portapapeles (formato geo.js)'))
    const text = String(writeText.mock.calls[0]?.[0] ?? '')
    expect(text).toContain('width: 150, height: 300')
    expect(text).toContain(`slug: 'a'`)
  })

  it('modo Todas aplica tamaño a toda la lista', async () => {
    const { updates } = await openSubcuencas()
    fireEvent.click(screen.getByTitle('Mover todas a la vez'))
    const plusBtns = screen.getAllByTitle('+ paso')
    fireEvent.click(plusBtns[0]!)
    const ids = new Set(updates.map((u) => u.id))
    expect(ids.has('atlas-subcuenca-src-a')).toBe(true)
    expect(ids.has('atlas-subcuenca-src-b')).toBe(true)
  })

  it('modo Todas + drag + copiar/reset', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true })
    const { listeners, updates } = await openSubcuencas()
    fireEvent.click(screen.getByTitle('Mover todas a la vez'))
    fireEvent.click(screen.getByTitle('izquierda'))
    const ids = new Set(updates.map((u) => u.id))
    expect(ids.has('atlas-subcuenca-src-a')).toBe(true)
    expect(ids.has('atlas-subcuenca-src-b')).toBe(true)

    fireEvent.click(screen.getByText(/↕ Mover/))
    act(() => {
      listeners.pointerdown?.({ pointerId: 1, clientX: 0, clientY: 0 })
      listeners.pointermove?.({ pointerId: 1, clientX: 0, clientY: 20 })
    })
    expect(updates.length).toBeGreaterThan(2)

    fireEvent.click(screen.getByTitle('Copiar a portapapeles (formato geo.js)'))
    const text = String(writeText.mock.calls[0]?.[0] ?? '')
    /* flecha (-0.5, 0) + drag (0, +2): pgw con C+0.5 y F-2 */
    expect(text).toContain(`pgw: [0, 0.001, 0.001, 0, -76.5, 0]`)
    expect(text).toContain(`slug: 'a'`)
  })
})
