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

  it('tileUrlTemplate separa el perfil standard', () => {
    expect(tileUrlTemplate('chapter1-ecosistemas')).toBe(
      '/assets/maps/tiles/mapas-standard/chapter1-ecosistemas/{z}/{x}/{y}.webp?v=local-standard-hd-v4-nearest-pyramid',
    )
    expect(tileUrlTemplate('chapter1-ecosistemas', 'hd')).toBe(
      '/assets/maps/tiles/mapas-hd/chapter1-ecosistemas/{z}/{x}/{y}.webp?v=local-standard-hd-v4-nearest-pyramid',
    )
  })

  it('makeTilesConfig: ecosistemas detail sirve z8-z10', () => {
    const cfg = makeTilesConfig('chapter1-ecosistemas', ECOSISTEMAS, -90)
    expect(cfg).not.toBeNull()
    expect(cfg!.urlTemplate).toBe(
      '/assets/maps/tiles/mapas-standard/chapter1-ecosistemas/{z}/{x}/{y}.webp?v=local-standard-hd-v4-nearest-pyramid',
    )
    expect(cfg!.tileSize).toBe(512)
    expect(cfg!.minZoom).toBe(8)
    expect(cfg!.maxZoom).toBe(10)
    expect(cfg!.fadeDuration).toBe(300)
    expect(cfg!.tilePixelSizeByProfile).toEqual({ standard: {}, hd: { 8: 1024, 9: 1024 } })
  })

  it('makeTilesConfig: encuadres initial-cover sirve z6', () => {
    const cfg = makeTilesConfig('chapter1-encuadres', {
      pgw: [0, 0.002291904891, 0.002292263474, 0, -79.43968707918096, -1.987827190702011],
      width: 3649,
      height: 6496,
    }, -90)
    expect(cfg!.minZoom).toBe(6)
    expect(cfg!.maxZoom).toBe(6)
  })

  it('makeTilesConfig: un rio usa la pirámide HD ligera global (1024/1024, resto 512)', () => {
    const cfg = makeTilesConfig('chapter1-un-rio-cauca', {
      pgw: [0, 0.001232510189, 0.0012309569997728162, 0, -79.4475590385131, -0.5982582430346929],
      width: 6082,
      height: 10826,
    }, -90)
    expect(cfg!.tilePixelSizeByProfile?.hd).toEqual({ 6: 1024, 7: 1024 })
  })

  it('makeTilesConfig: formas-paisaje usa la pirámide HD ligera global', () => {
    const cfg = makeTilesConfig('chapter1-formas-paisaje', {
      pgw: [0, 0.002101779729, 0.002098102561, 0, -79.131272642526, -0.005834616506],
      width: 3382,
      height: 6023,
    }, -90)
    expect(cfg).not.toBeNull()
    expect(cfg!.minZoom).toBe(6)
    expect(cfg!.maxZoom).toBe(9)
    expect(cfg!.tilePixelSizeByProfile?.hd).toEqual({ 6: 1024, 7: 1024 })
  })

  it('makeTilesConfig: zoomMax manual reduce el techo de generación', () => {
    const cfg = makeTilesConfig('chapter1-ecosistemas', ECOSISTEMAS, -90, 9)
    expect(cfg!.maxZoom).toBe(9)
    expect(cfg!.tilePixelSizeByProfile?.hd).toEqual({ 8: 1024, 9: 1024 })
  })

  it('makeTilesConfig: zoomMax manual extiende el techo más allá del natural', () => {
    const cfg = makeTilesConfig('chapter1-ecosistemas', ECOSISTEMAS, -90, 12)
    expect(cfg!.maxZoom).toBe(12)
  })

  it('makeTilesConfig: sin zoomMax usa el techo automático del tileset', () => {
    const cfg = makeTilesConfig('chapter1-un-rio-cauca', {
      pgw: [0, 0.001232510189, 0.0012309569997728162, 0, -79.4475590385131, -0.5982582430346929],
      width: 6082,
      height: 10826,
    }, -90)
    expect(cfg!.maxZoom).toBe(8)
  })

  it('makeTilesConfig: mapId no registrado devuelve null', () => {
    expect(makeTilesConfig('no-existe', ECOSISTEMAS, 0)).toBeNull()
  })
})
