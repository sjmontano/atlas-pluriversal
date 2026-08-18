import { describe, it, expect } from 'vitest'
import {
  screenCeilingZoom,
  constrainMinZoom,
  computeTileRange,
} from '@utils/tileZoom'
import { processBounds } from '@services/BoundsCalculator'

// PGW reales de los content modules (fuente: src/content/*/index.ts)
const ECOSISTEMAS = {
  pgw: [0, 0.0004706619148, 0.0004706895898, 0, -77.717574036785, 1.505615411172] as const,
  width: 5729,
  height: 10186,
}
const M_SUAREZ = {
  pgw: [0, -0.000079124151, -0.000079131596, 0, -76.32673887696231, 3.119152348416211] as const,
  width: 9448,
  height: 5314,
}
const INTRO = {
  pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033] as const,
  width: 5649,
  height: 11141,
}

describe('tileZoom', () => {
  describe('screenCeilingZoom', () => {
    it('ecosistemas: techo de pantalla en 1920 = z10 (bitácora v2)', () => {
      expect(screenCeilingZoom(ECOSISTEMAS, 1920)).toBe(10)
    })

    it('m-suarez: techo de pantalla en 1920 = z12 (bitácora v2)', () => {
      expect(screenCeilingZoom(M_SUAREZ, 1920)).toBe(12)
    })

    it('es proporcional al ancho del canvas', () => {
      const at1920 = screenCeilingZoom(ECOSISTEMAS, 1920)
      const at960 = screenCeilingZoom(ECOSISTEMAS, 960)
      expect(at960).toBeLessThan(at1920)
    })
  })

  describe('constrainMinZoom', () => {
    it('ecosistemas con bearing -90 (quarter-turn) ≈ 8.14', () => {
      const min = constrainMinZoom(ECOSISTEMAS, 1920, 1080, -90)
      expect(min).toBeCloseTo(8.14, 2)
    })

    it('es bearing-aware: quarter-turn difiere de 0/180', () => {
      const qt = constrainMinZoom(ECOSISTEMAS, 1920, 1080, -90)
      const straight = constrainMinZoom(ECOSISTEMAS, 1920, 1080, 0)
      expect(qt).not.toBeCloseTo(straight, 2)
    })
  })

  describe('computeTileRange', () => {
    it('detail: ecosistemas z8-10 con bearing -90 (bitácora v2)', () => {
      const range = computeTileRange(ECOSISTEMAS, 6.4, 'detail', 1920, 1080, -90)
      expect(range).toEqual({ minZoom: 8, maxZoom: 10 })
    })

    it('detail: m-suarez z10-12 con bearing 180 (bitácora v2)', () => {
      const range = computeTileRange(M_SUAREZ, 9, 'detail', 1920, 1080, 180)
      expect(range).toEqual({ minZoom: 10, maxZoom: 12 })
    })

    it('initial-only: intro z6 (bitácora v2)', () => {
      const range = computeTileRange(INTRO, 6.39, 'initial-only', 1920, 1080, -90)
      expect(range).toEqual({ minZoom: 6, maxZoom: 6 })
    })

    it('detail: nunca devuelve rango invertido (minZoom ≤ maxZoom)', () => {
      const range = computeTileRange(ECOSISTEMAS, 6.4, 'detail', 1920, 1080, -90)
      expect(range).not.toBeNull()
      expect(range!.minZoom).toBeLessThanOrEqual(range!.maxZoom)
    })

    it('none: devuelve null', () => {
      expect(computeTileRange(ECOSISTEMAS, 6.4, 'none')).toBeNull()
    })
  })

  it('processBounds real de ecosistemas es consistente (utilizado internamente)', () => {
    const { bounds } = processBounds(ECOSISTEMAS.pgw, ECOSISTEMAS.width, ECOSISTEMAS.height)
    expect(bounds[2] - bounds[0]).toBeCloseTo(2.696, 3)
  })
})