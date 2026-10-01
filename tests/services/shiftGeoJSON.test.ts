import { describe, it, expect } from 'vitest'
import { shiftFeatureCollection, shiftLngLat } from '@services/shiftGeoJSON'

const RECT = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'r' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-76.9, 2.5],
              [-76.0, 2.5],
              [-76.0, 3.6],
              [-76.9, 3.6],
              [-76.9, 2.5],
            ],
          ],
        ],
      },
    },
    { type: 'Feature', properties: {}, geometry: null },
  ],
}

describe('shiftGeoJSON', () => {
  it('desplaza el polígono por el delta con 6 decimales', () => {
    const out = shiftFeatureCollection(RECT, 0.02, -0.05)
    const ring = (
      out.features[0].geometry as { coordinates: number[][][][] }
    ).coordinates[0]?.[0]
    expect(ring?.[0]).toEqual([-76.88, 2.45])
    expect(ring?.[2]).toEqual([-75.98, 3.55])
  })

  it('no muta la entrada y conserva geometrías nulas', () => {
    const before = JSON.stringify(RECT)
    const out = shiftFeatureCollection(RECT, 0.02, -0.05)
    expect(JSON.stringify(RECT)).toBe(before)
    expect(out.features[1]?.geometry).toBeNull()
    expect(out.features[0]?.properties).toEqual({ name: 'r' })
  })

  it('shiftLngLat mueve el punto (labelCoords)', () => {
    expect(shiftLngLat([-76.4733, 3.0707], 0.02, -0.05)).toEqual([-76.4533, 3.0207])
  })
})
