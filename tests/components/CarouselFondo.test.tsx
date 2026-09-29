import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CarouselFondo } from '@components/modal/layouts/CarouselFondo'

const IMAGES = [
  { src: '/img/a.svg', alt: 'Imagen A' },
  { src: '/img/b.svg', alt: 'Imagen B' },
]

describe('CarouselFondo', () => {
  it('muestra la primera imagen y navega con siguiente/anterior', () => {
    render(<CarouselFondo images={IMAGES} />)
    expect(screen.getByAltText('Imagen A')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente imagen' }))
    expect(screen.getByAltText('Imagen B')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Imagen anterior' }))
    expect(screen.getByAltText('Imagen A')).toBeTruthy()
  })

  it('renderiza un dot por imagen', () => {
    render(<CarouselFondo images={IMAGES} />)
    expect(screen.getByRole('button', { name: 'Ir a imagen 1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ir a imagen 2' })).toBeTruthy()
  })
})
