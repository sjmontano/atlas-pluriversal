import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { getMapContent, resolveMapUI } from '@content'
import { ALL_MODALS, getModalById } from '@content/modals'
import { ICON_SRC, ICON_FALLBACK } from '@content/theme/icons.ts'
import { getAllMaps } from '@data/chapters/chapters.ts'
import { Glyph } from '@components/modal/primitives/Glyph'

const CATALOG = new Set(Object.keys(ICON_SRC))

describe('Sidebar ↔ catálogo de iconos ↔ modales', () => {
  it('todo icon del sidebar existe en el catálogo (content/theme/icons)', () => {
    const missing: string[] = []
    const mapIds = ['intro', ...getAllMaps().map((m) => m.mapId)]
    for (const mapId of mapIds) {
      const content = getMapContent(mapId)
      if (!content) continue
      for (const item of resolveMapUI(content).sidebar) {
        if (!CATALOG.has(item.icon)) missing.push(`${mapId} sidebar:${item.id} icon '${item.icon}'`)
      }
    }
    expect(missing).toEqual([])
  })

  it('todo icon de modal (icon + trigger.icon) existe en el catálogo', () => {
    const missing: string[] = []
    for (const modal of ALL_MODALS) {
      if (!CATALOG.has(modal.icon)) missing.push(`modal:${modal.id} icon '${modal.icon}'`)
      if (modal.trigger.icon && !CATALOG.has(modal.trigger.icon)) {
        missing.push(`modal:${modal.id} trigger.icon '${modal.trigger.icon}'`)
      }
    }
    expect(missing).toEqual([])
  })

  it('todo goto del sidebar es ruta interna válida', () => {
    const bad: string[] = []
    for (const mapId of ['intro', ...getAllMaps().map((m) => m.mapId)]) {
      const content = getMapContent(mapId)
      if (!content) continue
      for (const item of resolveMapUI(content).sidebar) {
        if (item.type === 'goto' && (!item.to || !item.to.startsWith('/capitulo/'))) {
          bad.push(`${mapId} sidebar:${item.id} to '${item.to}'`)
        }
      }
    }
    expect(bad).toEqual([])
  })

  it('cableado v17: perfiles, árboles, galerías y síntesis resuelven', () => {
    const targets = [
      'cap4-dato-introduccion',
      'cap4-perfil-asoyoge',
      'cap4-perfil-el-buhido',
      'cap4-arbol-el-buhido',
      'cap4-perfil-el-paso',
      'cap4-arbol-el-paso',
      'cap4-perfil-la-virginia',
      'cap4-arbol-la-virginia',
      'cap4-perfil-la-caicedo',
      'cap4-arbol-la-caicedo',
      'cap4-perfil-centro-agropecuario',
      'cap4-arbol-centro-agropecuario',
      'cap4-arbol-los-bajios',
      'cap4-arbol-las-mercedes',
      'cap2-galeria-suarez',
      'cap2-galeria-villa-rica',
      'cap2-galeria-cali',
    ]
    for (const id of targets) {
      expect(getModalById(id), `modal inexistente: ${id}`).not.toBeNull()
    }
  })
})

describe('Glyph', () => {
  afterEach(cleanup)

  it('renderiza el svg de referencia por nombre', () => {
    const { container } = render(<Glyph name="sintesis" />)
    expect(container.innerHTML).toContain('<svg')
    expect(container.innerHTML).toContain('currentColor')
  })

  it('nombre desconocido → fallback info (nunca vacío)', () => {
    const { container } = render(<Glyph name="no-existe" />)
    expect(container.innerHTML).toBe(
      render(<Glyph name={ICON_FALLBACK} />).container.innerHTML,
    )
    expect(container.innerHTML).toContain('<svg')
  })
})
