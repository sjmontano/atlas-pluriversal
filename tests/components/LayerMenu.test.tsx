import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LayerMenu } from '@components/map/LayerMenu'
import { useLayerStore } from '@stores/layerStore'

vi.mock('@content', () => ({
  getMapContent: vi.fn((mapId) => {
    if (mapId === 'test') {
      return {
        layers: [
          {
            id: 'layer-1',
            name: 'Layer One',
            type: 'raster-pgw',
            category: 'ecosystems',
            group: 'group-1',
            order: 1,
            opacity: 0.8,
            visibleByDefault: true,
            legend: { swatch: '#ff0000', description: 'Red layer' },
            image: '',
            pgw: [0, 1, 1, 0, 0, 0],
            width: 1,
            height: 1,
          },
          {
            id: 'layer-2',
            name: 'Layer Two',
            type: 'raster-pgw',
            category: 'ecosystems',
            group: 'group-1',
            order: 2,
            opacity: 0.5,
            legend: { swatch: '#00ff00' },
            image: '',
            pgw: [0, 1, 1, 0, 0, 0],
            width: 1,
            height: 1,
          },
        ],
        groups: [{ id: 'group-1', name: 'Group 1', order: 1 }],
      }
    }
    if (mapId === 'legend-only') {
      return {
        legends: [
          { id: 'leg-1', name: 'Río Cauca', swatch: '#2b83ba', order: 1, longText: 'Texto largo confirmado' },
          { id: 'leg-2', name: 'Represas', swatch: '#0c4c8a', group: '2022', order: 2 },
        ],
      }
    }
    return null
  }),
}))

describe('LayerMenu', () => {
  beforeEach(() => {
    useLayerStore.getState().resetAll('test')
  })

  it('renders toggle button plus group and layer names', () => {
    render(<LayerMenu mapId="test" />)
    expect(screen.getByRole('button', { name: 'Menú de capas' })).toBeDefined()
    expect(screen.getByText(/Group 1/)).toBeDefined()
    expect(screen.getByText(/Layer One/)).toBeDefined()
  })

  it('pins the panel open on toggle click', () => {
    const { container } = render(<LayerMenu mapId="test" />)
    const toggle = screen.getByRole('button', { name: 'Menú de capas' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('.pinned')).not.toBeNull()
  })

  it('pins the panel open on click inside the panel', () => {
    const { container } = render(<LayerMenu mapId="test" />)
    fireEvent.click(screen.getByText(/Group 1/))
    expect(container.querySelector('.pinned')).not.toBeNull()
  })

  it('toggles layer visibility on eye click', () => {
    render(<LayerMenu mapId="test" />)
    fireEvent.click(screen.getByRole('button', { name: 'Menú de capas' }))
    const store = useLayerStore.getState()
    expect(store.visibleLayers.size).toBe(0)
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar Layer One' }))
    const after = useLayerStore.getState()
    expect(after.visibleLayers.has('layer-1')).toBe(true)
    expect(screen.getByRole('button', { name: 'Ocultar Layer One' })).toBeDefined()
  })

  it('renders nothing when map has no layers', () => {
    const { container } = render(<LayerMenu mapId="empty" />)
    expect(container.innerHTML).toBe('')
  })

  it('toggles group expansion on click', () => {
    render(<LayerMenu mapId="test" />)
    const groupHeader = screen.getByText(/Group 1/)
    fireEvent.click(groupHeader!)
    expect(useLayerStore.getState().expandedGroups['group-1']).toBe(true)
  })

  it('toggles whole group visibility on group eye click', () => {
    render(<LayerMenu mapId="test" />)
    fireEvent.click(screen.getByRole('button', { name: 'Menú de capas' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar Group 1' }))
    const after = useLayerStore.getState()
    expect(after.visibleLayers.has('layer-1')).toBe(true)
    expect(after.visibleLayers.has('layer-2')).toBe(true)
  })

  it('renders legends without eyes for a map with only legends', () => {
    const { container } = render(<LayerMenu mapId="legend-only" />)
    expect(screen.getByText('Leyenda')).toBeDefined()
    expect(screen.getByText('Río Cauca')).toBeDefined()
    expect(screen.getByText('Represas')).toBeDefined()
    expect(screen.getByText('2022')).toBeDefined()
    expect(container.querySelectorAll('.eye').length).toBe(0)
  })

  it('does not render a master eye when there are no activable layers', () => {
    render(<LayerMenu mapId="legend-only" />)
    expect(screen.queryByText(/Todas/)).toBeNull()
  })
})
