import { describe, it, expect } from 'vitest'
import {
  ALL_MODALS,
  MODALS,
  getModalById,
  listModalsBySection,
} from '@content/modals'
import { getMapContent, resolveMapUI } from '@content'
import { getAllMaps } from '@data/chapters/chapters.ts'

describe('Registro de modales (content/modals)', () => {
  it('todos los modales tienen forma coherente (esquema variant/body)', () => {
    const modals = Object.values(MODALS)
    expect(modals.length).toBeGreaterThan(0)
    for (const modal of modals) {
      expect(modal.id).toBeTruthy()
      expect(['xs', 'small', 'medium', 'large', 'xl', 'full']).toContain(modal.variant)
      expect(modal.title).toBeTruthy()
      expect(modal.icon).toBeTruthy()
      expect(['button', 'marker', 'poi']).toContain(modal.trigger.type)
      expect(Array.isArray(modal.body)).toBe(true)
    }
  })

  it('no hay ids duplicados (el dict MODALS no colapsa entradas)', () => {
    const ids = ALL_MODALS.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todo sidebar type=modal y todo poi.modalId apuntan a un modal existente', () => {
    const missing: string[] = []
    const mapIds = ['intro', ...getAllMaps().map((m) => m.mapId)]
    for (const mapId of mapIds) {
      const content = getMapContent(mapId)
      if (!content) {
        missing.push(`${mapId}: sin contenido en el registry`)
        continue
      }
      const ui = resolveMapUI(content)
      for (const item of ui.sidebar) {
        if (item.type !== 'modal') continue
        if (!item.target) {
          missing.push(`${mapId} sidebar:${item.id} sin target`)
        } else if (!getModalById(item.target)) {
          missing.push(`${mapId} sidebar:${item.id} -> modal inexistente '${item.target}'`)
        }
      }
      for (const poi of content.pois ?? []) {
        if (poi.modalId && !getModalById(poi.modalId)) {
          missing.push(`${mapId} poi:${poi.id} -> modal inexistente '${poi.modalId}'`)
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('la ficha técnica tiene bloque meta', () => {
    const ficha = getModalById('ficha-tecnica')
    expect(ficha).not.toBeNull()
    expect(ficha?.variant).toBe('small')
    const meta = ficha?.body.find((b) => b.type === 'meta')
    expect(meta).toBeTruthy()
    if (meta?.type === 'meta') {
      expect(Object.keys(meta.data).length).toBeGreaterThan(0)
    }
  })

  it('getModalById devuelve null para ids inexistentes', () => {
    expect(getModalById('no-existe')).toBeNull()
  })

  it('listModalsBySection filtra por sección', () => {
    expect(listModalsBySection('legales').length).toBeGreaterThan(0)
    expect(listModalsBySection('nada')).toEqual([])
  })
})
