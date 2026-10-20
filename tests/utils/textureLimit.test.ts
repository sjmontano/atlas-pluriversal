import { describe, it, expect } from 'vitest'
import { clampCloudinaryUrl, clampTransform, downscalePlan, MAX_TEXTURE_EDGE } from '@utils/textureLimit'

describe('clampCloudinaryUrl', () => {
  it('inserta c_limit antes de la versión', () => {
    expect(
      clampCloudinaryUrl(
        'https://res.cloudinary.com/demo/image/upload/v1752360161/geoImages/foto.webp',
        4096,
      ),
    ).toBe(
      'https://res.cloudinary.com/demo/image/upload/c_limit,w_4096,h_4096/v1752360161/geoImages/foto.webp',
    )
  })

  it('no duplica el límite si ya existe', () => {
    const url =
      'https://res.cloudinary.com/demo/image/upload/c_limit,w_1024,h_1024/v1/geoImages/foto.webp'
    expect(clampCloudinaryUrl(url, MAX_TEXTURE_EDGE)).toBe(url)
  })

  it('deja intactas las URLs locales', () => {
    const url = '/assets/maps/capas/un-rio-cauca/planicies.webp'
    expect(clampCloudinaryUrl(url, MAX_TEXTURE_EDGE)).toBe(url)
  })
})

describe('clampTransform', () => {
  it('recorta ambos ejes al límite detectado', () => {
    expect(clampTransform('c_limit,w_2560,h_4096,q_auto,f_webp', 2048)).toBe(
      'c_limit,w_2048,h_2048,q_auto,f_webp',
    )
  })

  it('no toca transformaciones que ya caben', () => {
    expect(clampTransform('w_1600', 4096)).toBe('w_1600')
  })
})

describe('downscalePlan', () => {
  it('no escala imágenes que caben en el límite', () => {
    expect(downscalePlan(1374, 2443, 4096)).toBeNull()
  })

  it('escala por el lado mayor conservando el aspecto', () => {
    const plan = downscalePlan(6082, 10826, 4096)
    expect(plan).toEqual({ width: 2301, height: 4096 })
  })

  it('devuelve null con dimensiones inválidas', () => {
    expect(downscalePlan(0, 100, 4096)).toBeNull()
    expect(downscalePlan(100, 100, 0)).toBeNull()
  })
})
