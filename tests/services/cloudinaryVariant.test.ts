import { describe, it, expect } from 'vitest'
import { cloudinaryVariant } from '@services/MapRenderer'

describe('cloudinaryVariant', () => {
  it('inserta el transform tras /upload/ en URLs Cloudinary', () => {
    expect(
      cloudinaryVariant(
        'https://res.cloudinary.com/dvluvxfvn/image/upload/v123/geoImages/x.webp',
        'w_1280,q_auto,f_webp',
      ),
    ).toBe(
      'https://res.cloudinary.com/dvluvxfvn/image/upload/w_1280,q_auto,f_webp/v123/geoImages/x.webp',
    )
  })

  it('devuelve intactas las URLs locales (no-op)', () => {
    expect(cloudinaryVariant('/assets/maps/cap1/encuadres.png', 'w_1280,q_auto,f_webp')).toBe(
      '/assets/maps/cap1/encuadres.png',
    )
  })
})
