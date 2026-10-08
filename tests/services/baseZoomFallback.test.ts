import { describe, it, expect } from 'vitest'
import { baseUrlForLevel } from '@services/MapRenderer'

describe('baseUrlForLevel', () => {
  it('aplica transform medium al base Cloudinary', () => {
    expect(
      baseUrlForLevel('https://res.cloudinary.com/dvluvxfvn/image/upload/v1/geoImages/x.webp', 'medium'),
    ).toContain('w_2560')
  })
  it('local no-op devuelve misma URL', () => {
    expect(baseUrlForLevel('/assets/maps/cap1/encuadres.png', 'high')).toBe(
      '/assets/maps/cap1/encuadres.png',
    )
  })
})

describe('degraded escala base', () => {
  it('zoom alto resuelve high para escalar en degraded', async () => {
    const { resolveBaseLevel } = await import('@utils/baseZoom')
    expect(resolveBaseLevel(11, 8, 10, 'detail')).toBe('high')
  })
})
