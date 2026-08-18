import { describe, it, expect } from 'vitest'
import { MAP_TILE_MODES, tileUrlTemplate, makeTilesConfig } from '@data/tiles'
import { getAllMaps } from '@data/chapters/chapters'

const ECOSISTEMAS = {
  pgw: [0, 0.0004706619148, 0.0004706895898, 0, -77.717574036785, 1.505615411172] as const,
  width: 5729,
  height: 10186,
}

describe('tiles config', () => {
  it('MAP_TILE_MODES cubre exactamente los 31 mapIds de getAllMaps() + intro', () => {
    const mapIds = getAllMaps().map((m) => m.mapId)
    expect(mapIds).toHaveLength(30)
    const all = new Set([...mapIds, 'intro'])
    expect(all.size).toBe(31)
    for (const id of all) {
      expect(MAP_TILE_MODES[id]).toBeDefined()
    }
    expect(Object.keys(MAP_TILE_MODES).length).toBe(31)
  })

  it('tileUrlTemplate usa la estructura plana por mapId', () => {
    expect(tileUrlTemplate('chapter1-ecosistemas')).toBe(
      '/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp',
    )
  })

  it('makeTilesConfig: detail deriva rango (ecosistemas z8-10)', () => {
    const cfg = makeTilesConfig('chapter1-ecosistemas', ECOSISTEMAS, 6.4, -90)
    expect(cfg).not.toBeNull()
    expect(cfg!.urlTemplate).toBe(
      '/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp',
    )
    expect(cfg!.tileSize).toBe(256)
    expect(cfg!.minZoom).toBe(8)
    expect(cfg!.maxZoom).toBe(10)
    expect(cfg!.fadeDuration).toBe(300)
  })

  it('makeTilesConfig: initial-only fija min=max=floor(initialZoom)', () => {
    const cfg = makeTilesConfig('intro', ECOSISTEMAS, 6.39, -90)
    expect(cfg!.minZoom).toBe(6)
    expect(cfg!.maxZoom).toBe(6)
  })

  it('makeTilesConfig: mapId no registrado devuelve null', () => {
    expect(makeTilesConfig('no-existe', ECOSISTEMAS, 6, 0)).toBeNull()
  })
})