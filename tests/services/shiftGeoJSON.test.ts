import { describe, it, expect } from 'vitest'
import {
  shiftFeatureCollection,
  scaleFeatureCollection,
  collectionCentroid,
  shiftLngLat,
} from '@services/shiftGeoJSON'

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

  it('collectionCentroid es el centro del bbox', () => {
    // bbox lng [-76.9,-76.0] lat [2.5,3.6] → centro [-76.45, 3.05]
    expect(collectionCentroid(RECT)).toEqual([-76.45, 3.05])
  })

  it('escala uniforme 2x alrededor del centroide sin mutar', () => {
    const before = JSON.stringify(RECT)
    const out = scaleFeatureCollection(RECT, 2, 2)
    expect(JSON.stringify(RECT)).toBe(before)
    const ring = (
      out.features[0].geometry as { coordinates: number[][][][] }
    ).coordinates[0]?.[0]
    // esquina SW [-76.9,2.5] → centro + (p-centro)*2
    expect(ring?.[0]).toEqual([-77.35, 1.95])
    expect(ring?.[2]).toEqual([-75.55, 4.15])
    expect(out.features[1]?.geometry).toBeNull()
  })

  it('escala 1x deja todo igual y escala por eje solo ese eje', () => {
    const same = scaleFeatureCollection(RECT, 1, 1)
    expect(JSON.stringify(same)).toBe(JSON.stringify(RECT))
    const out = scaleFeatureCollection(RECT, 2, 1)
    const ring = (
      out.features[0].geometry as { coordinates: number[][][][] }
    ).coordinates[0]?.[0]
    expect(ring?.[0]).toEqual([-77.35, 2.5])
    expect(ring?.[2]).toEqual([-75.55, 3.6])
  })
})
