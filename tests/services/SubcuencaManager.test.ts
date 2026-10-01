import { describe, it, expect, vi } from 'vitest'
import {
  addSubcuencas,
  removeSubcuencas,
  highlightSubcuenca,
  subcuencaSlugOfModal,
} from '@services/SubcuencaManager'
import type * as maplibregl from 'maplibre-gl'

const DEFS = [
  { slug: 'piendamo', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-piendamo.webp' },
  { slug: 'cali', image: '/assets/maps/capas/mosaicos-del-agua/subcuenca-cali.webp' },
]

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  return {
    getSource: vi.fn((id: string) => sources.get(id) ?? null),
    getLayer: vi.fn((id: string) => layers.get(id) ?? null),
    addSource: vi.fn((id: string, def: unknown) => { sources.set(id, def) }),
    addLayer: vi.fn((def: { id: string }) => { layers.set(def.id, def) }),
    removeLayer: vi.fn((id: string) => { layers.delete(id) }),
    removeSource: vi.fn((id: string) => { sources.delete(id) }),
    setLayoutProperty: vi.fn(),
    _sources: sources,
    _layers: layers,
  } as unknown as maplibregl.Map & {
    _sources: Map<string, unknown>
    _layers: Map<string, unknown>
  }
}

describe('SubcuencaManager', () => {
  it('registra image sources + capas raster ocultas con el footprint de agua', () => {
    const map = makeMap()
    addSubcuencas(map, DEFS)
    expect(map.addSource).toHaveBeenCalledWith(
      'atlas-subcuenca-src-piendamo',
      expect.objectContaining({ type: 'image', url: DEFS[0]?.image }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'atlas-subcuenca-piendamo',
        type: 'raster',
        layout: expect.objectContaining({ visibility: 'none' }),
      }),
    )
  })

  it('highlight muestra una y oculta la anterior; null apaga', () => {
    const map = makeMap()
    addSubcuencas(map, DEFS)
    highlightSubcuenca(map, 'piendamo')
    expect(map.setLayoutProperty).toHaveBeenCalledWith('atlas-subcuenca-piendamo', 'visibility', 'visible')
    highlightSubcuenca(map, 'cali')
    expect(map.setLayoutProperty).toHaveBeenCalledWith('atlas-subcuenca-piendamo', 'visibility', 'none')
    expect(map.setLayoutProperty).toHaveBeenCalledWith('atlas-subcuenca-cali', 'visibility', 'visible')
    highlightSubcuenca(map, null)
    expect(map.setLayoutProperty).toHaveBeenCalledWith('atlas-subcuenca-cali', 'visibility', 'none')
  })

  it('slug desconocido no hace nada y remove limpia todo', () => {
    const map = makeMap()
    addSubcuencas(map, DEFS)
    highlightSubcuenca(map, 'inexistente')
    expect(map.setLayoutProperty).not.toHaveBeenCalled()
    removeSubcuencas(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-subcuenca-piendamo')
    expect(map.removeSource).toHaveBeenCalledWith('atlas-subcuenca-src-cali')
  })
})

describe('subcuencaSlugOfModal', () => {
  it('extrae el slug de cap1-cuenca-<slug>', () => {
    expect(subcuencaSlugOfModal('cap1-cuenca-piendamo')).toBe('piendamo')
    expect(subcuencaSlugOfModal('cap1-cuenca-lili-melendez-canaveralejo')).toBe('lili-melendez-canaveralejo')
  })

  it('null ante otros modales o vacío', () => {
    expect(subcuencaSlugOfModal(undefined)).toBeNull()
    expect(subcuencaSlugOfModal('cap1-presentacion-x')).toBeNull()
    expect(subcuencaSlugOfModal('cap1-cuenca-')).toBeNull()
  })
})
