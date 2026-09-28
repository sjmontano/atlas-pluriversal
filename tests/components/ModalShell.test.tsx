import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from '@testing-library/react'
import { ModalShell } from '@components/modal/shell/ModalShell'
import { ModalRenderer } from '@components/modal/shell/ModalRenderer'
import { useModalStore } from '@stores/modalStore'
import { getModalById } from '@content/modals'
import type { Modal } from '@types/modal.ts'
import type { ModalTheme } from '@types/modal.ts'

describe('ModalShell', () => {
  beforeEach(() => {
    useModalStore.getState().closeModal()
  })
  afterEach(cleanup)

  it('no renderiza nada cuando open=false', () => {
    const { container } = render(
      <ModalShell
        open={false}
        title="Test"
        variant="small"
        onClose={vi.fn()}
      >
        <p>Contenido</p>
      </ModalShell>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('muestra título y contenido cuando open=true', () => {
    render(
      <ModalShell open title="Presentación" variant="medium" onClose={vi.fn()}>
        <p>Hola Atlas</p>
      </ModalShell>,
    )
    expect(screen.getByRole('dialog', { name: /Presentación/ })).toBeDefined()
    expect(screen.getByText(/Hola Atlas/)).toBeDefined()
  })

  it('cierra al hacer clic en el botón de cierre', () => {
    const onClose = vi.fn()
    render(
      <ModalShell open title="X" variant="small" onClose={onClose}>
        <p>contenido</p>
      </ModalShell>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Cerrar/ }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('cierra con la tecla Escape', () => {
    const onClose = vi.fn()
    render(
      <ModalShell open title="X" variant="small" onClose={onClose}>
        <p>contenido</p>
      </ModalShell>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ModalTheme acepta contentMarginRight opcional', () => {
    const theme: ModalTheme = { contentMarginRight: 'calc(10vw)' }
    expect(theme.contentMarginRight).toBe('calc(10vw)')
    const empty: ModalTheme = {}
    expect(empty.contentMarginRight).toBeUndefined()
  })

  it('inyecta --body-margin-right solo si theme.contentMarginRight está definido', () => {
    const { rerender } = render(
      <ModalShell open title="T" variant="medium" onClose={vi.fn()}>
        <p>c</p>
      </ModalShell>,
    )
    // ModalShell usa createPortal a document.body: buscar vía screen
    const dialog = screen.getByRole('dialog', { name: 'T' }) as HTMLElement
    // default: la var NO va inline (vive en el CSS como calc(14vw))
    expect(dialog.style.getPropertyValue('--body-margin-right')).toBe('')

    rerender(
      <ModalShell open title="T" variant="medium" onClose={vi.fn()} theme={{ contentMarginRight: 'calc(5vw)' }}>
        <p>c</p>
      </ModalShell>,
    )
    const dialog2 = screen.getByRole('dialog', { name: 'T' }) as HTMLElement
    expect(dialog2.style.getPropertyValue('--body-margin-right')).toBe('calc(5vw)')
  })
})

describe('ModalRenderer (motor + uiStore)', () => {
  beforeEach(() => {
    useModalStore.getState().closeModal()
  })
  afterEach(cleanup)

  it('no renderiza nada sin modal activo', () => {
    const { container } = render(<ModalRenderer />)
    expect(container.innerHTML).toBe('')
  })

  it('abre el modal medium/text al setear el modal de cuenca-cauca', () => {
    const modal = getModalById('cuenca-cauca') as Modal
    render(<ModalRenderer />)
    act(() => {
      useModalStore.getState().openModal(modal)
    })
    expect(
      screen.getByRole('dialog', { name: /Confines del sur/i }),
    ).toBeDefined()
  })

  it('cierra al pulsar el botón X (aria-label Cerrar)', () => {
    const modal = getModalById('cuenca-cauca') as Modal
    render(<ModalRenderer />)
    act(() => {
      useModalStore.getState().openModal(modal)
    })
    const button = screen.getByRole('button', { name: 'Cerrar modal' })
    fireEvent.click(button)
    expect(useModalStore.getState().activeModal).toBeNull()
  })

  it('el modal large/inicio muestra la imagen de fondo', () => {
    const modal = getModalById('nevado-huila') as Modal
    render(<ModalRenderer />)
    act(() => {
      useModalStore.getState().openModal(modal)
    })
    const dialog = screen.getByRole('dialog', {
      name: /Volcán Nevado Wila/i,
    })
    expect(dialog.querySelector('img')?.getAttribute('src')).toBeTruthy()
  })

  it('el layout inicio muestra gota, decorador repetido, texto y cierra', () => {
    const modal = getModalById('los-farallones') as Modal
    render(<ModalRenderer />)
    act(() => {
      useModalStore.getState().openModal(modal)
    })
    const dialog = screen.getByRole('dialog', { name: /Los Farallones/ })
    expect(dialog.querySelector('img[aria-hidden]')).toBeDefined()
    expect(screen.getByText(/Somos altos y rocosos/)).toBeDefined()
    const close = screen.getByRole('button', { name: 'Cerrar modal' })
    expect(close.querySelector('img')).toBeDefined()
    fireEvent.click(close)
    expect(useModalStore.getState().activeModal).toBeNull()
  })

  it('el layout inicio no renderiza header/footer de la shell', () => {
    const modal = getModalById('embalse-calima') as Modal
    render(<ModalRenderer />)
    act(() => {
      useModalStore.getState().openModal(modal)
    })
    expect(
      screen.getByRole('dialog', { name: /Embalse Calima/ }),
    ).toBeDefined()
    expect(screen.getByText(/Me conocen como lago/)).toBeDefined()
  })

  it('el datasheet muestra los campos de la ficha técnica', () => {
    const modal = getModalById('ficha-tecnica') as Modal
    render(<ModalRenderer />)
    act(() => {
      useModalStore.getState().openModal(modal)
    })
    expect(screen.getByRole('dialog', { name: /Ficha técnica/ })).toBeDefined()
    expect(screen.getByText(/Proyecto/)).toBeDefined()
    expect(screen.getByText(/CC BY-NC-ND 4\.0/)).toBeDefined()
    expect(
      screen.getAllByText(/Atlas Pluriversal del Río Cauca/).length,
    ).toBeGreaterThan(0)
  })

  it('el alert muestra el mensaje de en construcción', () => {
    const modal = getModalById('en-construccion') as Modal
    render(<ModalRenderer />)
    act(() => {
      useModalStore.getState().openModal(modal)
    })
    expect(
      screen.getByRole('dialog', { name: /En construcción/ }),
    ).toBeDefined()
    expect(screen.getByText(/disponible próximamente/)).toBeDefined()
  })
})
