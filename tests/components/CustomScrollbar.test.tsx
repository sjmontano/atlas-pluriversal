import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { CustomScrollbar } from '@components/modal/shell/CustomScrollbar'

/**
 * jsdom no hace layout: scrollHeight/clientHeight siempre son 0.
 * Se mockean por elemento para simular con/sin overflow.
 */
function makeScrollEl(scrollHeight: number, clientHeight: number): HTMLDivElement {
  const el = document.createElement('div')
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true })
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true })
  Object.defineProperty(el, 'scrollTop', { value: 0, writable: true, configurable: true })
  return el
}

describe('CustomScrollbar', () => {
  afterEach(cleanup)

  it('no renderiza el riel cuando no hay contenido desplazable', () => {
    const el = makeScrollEl(100, 200)
    const { container } = render(<CustomScrollbar scrollRef={{ current: el }} />)
    expect(screen.queryByRole('scrollbar')).toBeNull()
    expect(container.innerHTML).toBe('')
  })

  it('renderiza riel + thumb cuando hay overflow', () => {
    const el = makeScrollEl(500, 100)
    render(<CustomScrollbar scrollRef={{ current: el }} />)
    const track = screen.getByRole('scrollbar')
    expect(track).toBeDefined()
    // El thumb es el único hijo div del track
    expect(track.querySelector(':scope > div')).not.toBeNull()
  })

  it('oculta el riel cuando el contenido cabe exacto (scrollHeight === clientHeight)', () => {
    const el = makeScrollEl(300, 300)
    render(<CustomScrollbar scrollRef={{ current: el }} />)
    expect(screen.queryByRole('scrollbar')).toBeNull()
  })
})
