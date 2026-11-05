import { describe, it, expect } from 'vitest'
import { LngLat } from 'maplibre-gl'
import { createBearingAwareConstrain, obliqueFrame, obliqueMinZoom } from '@services/TransformConstrain'
import { processBounds, type GeographicBounds } from '@services/BoundsCalculator'

// Bounds de prueba (similares al mapa intro)
const VMB: GeographicBounds = [-78.9, -0.29, -65.74, 6.39]

// Canvas de escritorio
const getCanvas = () => ({ clientWidth: 1920, clientHeight: 1080 })

describe('TransformConstrain', () => {
  describe('createBearingAwareConstrain con bearing −90', () => {
    const constrain = createBearingAwareConstrain(getCanvas, VMB, -90)

    it('no altera un centro dentro de los bounds', () => {
      // Con zoom 10 el viewport es pequeño y el centro queda libre
      const result = constrain(new LngLat(-72, 3), 10)
      expect(result.center.lng).toBeCloseTo(-72, 5)
      expect(result.center.lat).toBeCloseTo(3, 5)
    })

    it('clampea un centro fuera de los bounds al hacer zoom in', () => {
      // zoom 8 con 1920×1080: el centro debe quedar dentro de
      // lat [south+halfLat, north−halfLat], lng [west+halfLon, east−halfLon]
      const result = constrain(new LngLat(-78.5, 6.3), 8)

      const dpp = 360 / (512 * 2 ** 8)
      const halfLat = (1920 / 2) * dpp
      const halfLon = (1080 / 2) * dpp

      expect(result.center.lat).toBeGreaterThanOrEqual(-0.29 + halfLat - 1e-9)
      expect(result.center.lat).toBeLessThanOrEqual(6.39 - halfLat + 1e-9)
      expect(result.center.lng).toBeGreaterThanOrEqual(-78.9 + halfLon - 1e-9)
      expect(result.center.lng).toBeLessThanOrEqual(-65.74 - halfLon + 1e-9)
    })

    it('eleva el zoom a minZoom si es demasiado bajo', () => {
      // Con bearing −90 y 1920×1080, el minZoom para que el viewport
      // quepa en los bounds es ≈ 7.66 (limitado por latSpan en W)
      const result = constrain(new LngLat(-72, 3), 2)
      expect(result.zoom).toBeGreaterThan(6)
    })

    it('es idempotente: clampear dos veces no mueve el centro', () => {
      const first = constrain(new LngLat(-78.5, 6.3), 8)
      const second = constrain(first.center, first.zoom)

      expect(second.center.lng).toBeCloseTo(first.center.lng, 6)
      expect(second.center.lat).toBeCloseTo(first.center.lat, 6)
      expect(second.zoom).toBeCloseTo(first.zoom, 6)
    })
  })

  describe('createBearingAwareConstrain con maxZoom', () => {
    const constrain = createBearingAwareConstrain(getCanvas, VMB, -90, 9)

    it('clampea un zoom por encima del techo al maxZoom', () => {
      const result = constrain(new LngLat(-72, 3), 14)
      expect(result.zoom).toBe(9)
    })

    it('respeta un zoom dentro del rango [minZoom, maxZoom]', () => {
      const result = constrain(new LngLat(-72, 3), 8.5)
      expect(result.zoom).toBeCloseTo(8.5, 6)
    })

    it('sigue elevando el zoom por debajo del minZoom', () => {
      const result = constrain(new LngLat(-72, 3), 2)
      expect(result.zoom).toBeGreaterThan(6)
      expect(result.zoom).toBeLessThanOrEqual(9)
    })
  })

  describe('createBearingAwareConstrain con bearing 0', () => {
    const constrain = createBearingAwareConstrain(getCanvas, VMB, 0)

    it('no altera un centro dentro de los bounds', () => {
      const result = constrain(new LngLat(-72, 3), 10)
      expect(result.center.lng).toBeCloseTo(-72, 5)
      expect(result.center.lat).toBeCloseTo(3, 5)
    })

    it('usa los ejes normales (W↔lon, H↔lat)', () => {
      const result = constrain(new LngLat(-79, 7), 8)

      const dpp = 360 / (512 * 2 ** 8)
      const halfLon = (1920 / 2) * dpp
      const halfLat = (1080 / 2) * dpp

      expect(result.center.lng).toBeGreaterThanOrEqual(-78.9 + halfLon - 1e-9)
      expect(result.center.lat).toBeLessThanOrEqual(6.39 - halfLat + 1e-9)
    })
  })
})

describe('createBearingAwareConstrain con bearing oblicuo', () => {
  // Humedales problemáticas: imagen girada 30° respecto al norte.
  const { coordinates, bounds } = processBounds(
    [0.000001194087, -0.00000206822, -0.000002068153, -0.000001194048, -76.48394660129709, 3.4428801608900352],
    4960,
    8822,
  )
  const W = 1920
  const H = 945
  const frame = obliqueFrame(coordinates, -30)!
  const constrain = createBearingAwareConstrain(() => ({ clientWidth: W, clientHeight: H }), bounds, -30, 22, frame)

  /** Las 4 esquinas del viewport, en el marco de la imagen, no salen de ella. */
  const viewportInside = (lng: number, lat: number, zoom: number): boolean => {
    const dpp = 360 / (512 * 2 ** zoom)
    const y = (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI
    const u = lng * frame.right[0] + y * frame.right[1]
    const v = lng * frame.up[0] + y * frame.up[1]
    const eps = 1e-9
    return (
      u - (W / 2) * dpp >= frame.uMin - eps &&
      u + (W / 2) * dpp <= frame.uMax + eps &&
      v - (H / 2) * dpp >= frame.vMin - eps &&
      v + (H / 2) * dpp <= frame.vMax + eps
    )
  }

  it('solo aplica a bearings que no son múltiplos de 90°', () => {
    for (const b of [0, 90, -90, 180, 270]) expect(obliqueFrame(coordinates, b)).toBeNull()
    expect(frame).not.toBeNull()
  })

  it('el zoom mínimo llena la pantalla sin mostrar bordes', () => {
    const { center, zoom } = constrain(new LngLat(-76.49, 3.43), 1)
    expect(zoom).toBeCloseTo(obliqueMinZoom(frame, W, H), 8)
    expect(viewportInside(center.lng, center.lat, zoom)).toBe(true)
  })

  it.each([
    [-76.6, 3.3],
    [-76.3, 3.3],
    [-76.6, 3.6],
    [-76.3, 3.6],
  ])('al arrastrar hacia (%d, %d) el viewport no sale de la imagen', (lng, lat) => {
    for (const z of [obliqueMinZoom(frame, W, H) + 0.2, 17, 19]) {
      const { center, zoom } = constrain(new LngLat(lng, lat), z)
      expect(viewportInside(center.lng, center.lat, zoom)).toBe(true)
    }
  })

  it('un centro válido no se altera', () => {
    const [cLng, cLat] = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2]
    const { center } = constrain(new LngLat(cLng, cLat), 19)
    expect(center.lng).toBeCloseTo(cLng, 8)
    expect(center.lat).toBeCloseTo(cLat, 8)
  })
})
