import { describe, it, expect } from 'vitest'
import {
  MODALS,
  getModalById,
  listModalsBySection,
} from '@content/modals'
import { POIS } from '@content/inicio/pois'

describe('Registro de modales (content/modals)', () => {
  it('todos los modales tienen forma y datos coherentes', () => {
    for (const modal of Object.values(MODALS)) {
      expect(modal.id).toBeTruthy()
      expect(['xs', 'small', 'medium', 'large', 'xl', 'full']).toContain(modal.variant)
      expect([
        'text',
        'gallery',
        'datasheet',
        'alert',
        'inicio',
        'feature',
      ]).toContain(modal.layout)
      expect(modal.title).toBeTruthy()
      expect(modal.trigger.type).toBeTruthy()
      expect(Array.isArray(modal.body)).toBe(true)
    }
  })

  it('los 16 POIs de la home se registran como modales (layout inicio)', () => {
    expect(POIS).toHaveLength(16)
    const inicio = Object.values(MODALS).filter((m) => m.layout === 'inicio')
    expect(inicio).toHaveLength(16)
    for (const modal of inicio) {
      expect(modal.variant).toBe('xl')
      expect(modal.section).toBe('inicio')
      expect(modal.image).toBeTruthy()
      expect(modal.texto?.length).toBeGreaterThan(0)
      expect(modal.trigger.type).toBe('poi')
    }
  })

  it('los-farallones usa el texto e imagen reales de lugares.js', () => {
    const farallones = getModalById('los-farallones')
    expect(farallones).not.toBeNull()
    expect(farallones?.layout).toBe('inicio')
    expect(farallones?.title).toBe('Los Farallones')
    expect(farallones?.texto).toContain('Somos altos y rocosos')
    expect(farallones?.image).toContain('iil0mxcdrfozmq0cjq0d')
  })

  it('la ficha técnica (datasheet) tiene meta', () => {
    const ficha = getModalById('ficha-tecnica')
    expect(ficha).not.toBeNull()
    expect(ficha?.layout).toBe('datasheet')
    expect(Object.keys(ficha?.meta ?? {}).length).toBeGreaterThan(0)
  })

  it('getModalById devuelve null para ids inexistentes', () => {
    expect(getModalById('no-existe')).toBeNull()
  })

  it('listModalsBySection filtra por sección', () => {
    expect(listModalsBySection('legales').length).toBeGreaterThan(0)
    expect(listModalsBySection('inicio')).toHaveLength(17) // 16 POIs + CREDITOS_MODAL
    expect(listModalsBySection('intro')).toHaveLength(3) // presentacion + cuenca-cauca + cap1-atlas-proyecto
    expect(listModalsBySection('nada')).toEqual([])
  })
})