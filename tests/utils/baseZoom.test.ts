import { describe, it, expect } from 'vitest'
import { resolveBaseLevel, BASE_TRANSFORMS, baseRangeForEntry, matchesGeoAspect, pickBaseSource } from '@utils/baseZoom'

describe('resolveBaseLevel', () => {
  it('ecosistemas z8-10: base hasta 8.5', () => {
    expect(resolveBaseLevel(8.0, 8, 10, 'detail')).toBe('base')
    expect(resolveBaseLevel(8.5, 8, 10, 'detail')).toBe('base')
  })
  it('ecosistemas z8-10: medium 8.5-9.0, high 9+', () => {
    expect(resolveBaseLevel(8.6, 8, 10, 'detail')).toBe('medium')
    expect(resolveBaseLevel(9.0, 8, 10, 'detail')).toBe('medium')
    expect(resolveBaseLevel(9.1, 8, 10, 'detail')).toBe('high')
    expect(resolveBaseLevel(12, 8, 10, 'detail')).toBe('high')
  })
  it('initial-only siempre medium', () => {
    expect(resolveBaseLevel(9, 9, 9, 'initial-only')).toBe('medium')
    expect(resolveBaseLevel(12, 9, 9, 'initial-only')).toBe('medium')
  })
  it('transforms: base w_1600, medium w_2560, high original sin límite', () => {
    expect(BASE_TRANSFORMS.base).toContain('w_1600')
    expect(BASE_TRANSFORMS.medium).toContain('w_2560')
    expect(BASE_TRANSFORMS.high).not.toContain('w_')
    expect(BASE_TRANSFORMS.high).toContain('q_auto,f_webp')
  })
  it('baseRangeForEntry prefiere tiles y cae a fallback', () => {
    expect(baseRangeForEntry({ minZoom: 8, maxZoom: 10 }, 0, 0)).toEqual({ minZoom: 8, maxZoom: 10 })
    expect(baseRangeForEntry(null, 8, 10)).toEqual({ minZoom: 8, maxZoom: 10 })
  })
})

describe('pickBaseSource', () => {
  it('prefiere el full cuando difiere del base', () => {
    expect(pickBaseSource({ base: 'https://x/base.webp', full: 'https://x/full.avif' })).toBe(
      'https://x/full.avif',
    )
  })
  it('usa el base si no hay full o es el mismo', () => {
    expect(pickBaseSource({ base: 'https://x/base.webp' })).toBe('https://x/base.webp')
    expect(pickBaseSource({ base: '/a.png', full: '/a.png' })).toBe('/a.png')
  })
})

describe('matchesGeoAspect', () => {
  it('PNG rotado 90° (6035x3389 vs geo 3382x6023) no coincide', () => {
    expect(matchesGeoAspect(6035, 3389, 3382, 6023)).toBe(false)
  })
  it('preview vertical (1024x1823 vs geo 3382x6023) coincide', () => {
    expect(matchesGeoAspect(1024, 1823, 3382, 6023)).toBe(true)
  })
  it('mismo aspecto exacto coincide', () => {
    expect(matchesGeoAspect(2048, 1024, 3382, 1691)).toBe(true)
  })
  it('dimensiones inválidas no coinciden', () => {
    expect(matchesGeoAspect(0, 100, 3382, 6023)).toBe(false)
    expect(matchesGeoAspect(100, 100, 0, 6023)).toBe(false)
  })
})
