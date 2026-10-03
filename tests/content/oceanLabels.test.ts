import { describe, it, expect } from 'vitest'

const MAPS = [
  'chapter1-encuadres',
  'chapter1-bredunco',
  'chapter1-formas-paisaje',
  'chapter1-un-rio-cauca',
]

describe('oceanLabels (contenido)', () => {
  it('los 4 mapas Colombia-completa exponen Pacífico y Caribe', async () => {
    const { getMapContent } = await import('@content')
    for (const mapId of MAPS) {
      const content = getMapContent(mapId)
      const labels = content?.oceanLabels ?? []
      expect(labels.map((l) => l.id)).toEqual(['oceano-pacifico', 'mar-caribe'])
    }
  })

  it('las coordenadas caen en mar abierto dentro del footprint', async () => {
    const { getMapContent } = await import('@content')
    const { processBounds } = await import('@services/BoundsCalculator')
    for (const mapId of MAPS) {
      const content = getMapContent(mapId)
      if (!content) throw new Error(`sin contenido: ${mapId}`)
      const { bounds } = processBounds(content.geo.pgw, content.geo.width, content.geo.height)
      const [west, south, east, north] = bounds
      for (const label of content.oceanLabels ?? []) {
        const [lng, lat] = label.coords
        expect(lng).toBeGreaterThan(west)
        expect(lng).toBeLessThan(east)
        expect(lat).toBeGreaterThan(south)
        expect(lat).toBeLessThan(north)
      }
    }
  })
})
