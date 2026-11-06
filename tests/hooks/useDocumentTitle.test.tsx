import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDocumentTitle } from '../../src/hooks/useDocumentTitle'

describe('useDocumentTitle', () => {
  it('antepone el título de la página al del sitio', () => {
    renderHook(() => useDocumentTitle('Finca El Paso'))
    expect(document.title).toBe('Finca El Paso · Atlas Pluriversal')
  })

  it('sin título deja solo el sitio', () => {
    renderHook(() => useDocumentTitle(null))
    expect(document.title).toBe('Atlas Pluriversal')
  })

  it('quita los saltos de línea de las etiquetas', () => {
    renderHook(() => useDocumentTitle('Mosaico de \ncuencas y aguas'))
    expect(document.title).toBe('Mosaico de cuencas y aguas · Atlas Pluriversal')
  })

  it('se actualiza al cambiar de mapa', () => {
    const { rerender } = renderHook(({ t }) => useDocumentTitle(t), { initialProps: { t: 'A' } })
    rerender({ t: 'B' })
    expect(document.title).toBe('B · Atlas Pluriversal')
  })
})
