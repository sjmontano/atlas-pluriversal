import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { MapContent } from '../../src/types/content'

type Handler = (e: unknown) => void

const instances: FakeMap[] = []

class FakeMap {
  once_ = new Map<string, Handler>()
  remove = vi.fn()
  constructor() {
    instances.push(this)
  }
  once(type: string, fn: Handler) {
    this.once_.set(type, fn)
    return this
  }
  fire(type: string, e: unknown = {}) {
    this.once_.get(type)?.(e)
  }
}

vi.mock('maplibre-gl', () => ({
  Map: FakeMap,
  setWorkerUrl: vi.fn(),
  config: {},
}))

const { buildGeoreferencedMap } = await import('@services/MapRenderer')

const ENTRY = {
  geo: { pgw: [0.001, 0, 0, -0.001, -77, 2], width: 1000, height: 1000 },
  images: { placeholder: '/preview.webp', base: '/b.webp', full: '/f.webp' },
  config: { initialBearing: 0, dragPan: true, scrollZoom: true },
} as unknown as MapContent

describe('buildGeoreferencedMap: la build rechazada no deja el mapa huérfano', () => {
  beforeEach(() => {
    instances.length = 0
  })

  it('un error antes de `load` rechaza y elimina el mapa', async () => {
    const container = document.createElement('div')
    const build = buildGeoreferencedMap(container, 'x', ENTRY)
    await Promise.resolve()

    expect(instances).toHaveLength(1)
    instances[0]!.fire('error', { error: new Error('WebGL no disponible') })

    await expect(build).rejects.toThrow('WebGL no disponible')
    expect(instances[0]!.remove).toHaveBeenCalledTimes(1)
  })
})
