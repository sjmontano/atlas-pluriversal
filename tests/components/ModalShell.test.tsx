import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from '@testing-library/react'
import { ModalShell } from '@components/modal/ModalShell'
import { ModalRenderer } from '@components/modal/ModalRenderer'
import { useUIStore } from '@stores/uiStore'
import { getModalById } from '@content/modals'
import type { Modal } from '@types/modal.ts'

describe('ModalShell', () => {
  beforeEach(() => {
    useUIStore.getState().closeModal()
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
})

describe('ModalRenderer (motor + uiStore)', () => {
  beforeEach(() => {
    useUIStore.getState().closeModal()
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
      useUIStore.getState().openModal(modal)
    })
    expect(
      screen.getByRole('dialog', { name: /Confines del sur/i }),
    ).toBeDefined()
  })

  it('cierra al pulsar la acción del footer', () => {
    const modal = getModalById('cuenca-cauca') as Modal
    render(<ModalRenderer />)
    act(() => {
      useUIStore.getState().openModal(modal)
    })
    const button = screen.getByText('Cerrar', { selector: 'button' })
    fireEvent.click(button)
    expect(useUIStore.getState().activeModal).toBeNull()
  })

  it('el modal large/inicio muestra la imagen de fondo', () => {
    const modal = getModalById('nevado-huila') as Modal
    render(<ModalRenderer />)
    act(() => {
      useUIStore.getState().openModal(modal)
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
      useUIStore.getState().openModal(modal)
    })
    const dialog = screen.getByRole('dialog', { name: /Los Farallones/ })
    expect(dialog.querySelector('img[aria-hidden]')).toBeDefined()
    expect(screen.getByText(/Somos altos y rocosos/)).toBeDefined()
    const close = screen.getByRole('button', { name: /Cerrar/ })
    expect(close.querySelector('img')).toBeDefined()
    fireEvent.click(close)
    expect(useUIStore.getState().activeModal).toBeNull()
  })

  it('el layout inicio no renderiza header/footer de la shell', () => {
    const modal = getModalById('embalse-calima') as Modal
    render(<ModalRenderer />)
    act(() => {
      useUIStore.getState().openModal(modal)
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
      useUIStore.getState().openModal(modal)
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
      useUIStore.getState().openModal(modal)
    })
    expect(
      screen.getByRole('dialog', { name: /En construcción/ }),
    ).toBeDefined()
    expect(screen.getByText(/disponible próximamente/)).toBeDefined()
  })
})