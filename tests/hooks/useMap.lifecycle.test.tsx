import { act, render } from '@testing-library/react'
import { useRef } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMap } from '@hooks/useMap'
import { useMapStore } from '@stores/mapStore'

interface Deferred {
  resolve: (value: unknown) => void
  reject: (err: unknown) => void
}

const builds = new Map<string, Deferred>()
const buildGeoreferencedMap = vi.fn((_c: HTMLElement, mapId: string) =>
  new Promise((resolve, reject) => {
    builds.set(mapId, { resolve, reject })
  }),
)

vi.mock('@services/MapRenderer', () => ({
  buildGeoreferencedMap: (c: HTMLElement, mapId: string) => buildGeoreferencedMap(c, mapId),
  applyParallelRequests: vi.fn(),
}))

vi.mock('@content', () => ({
  getMapContent: (mapId: string) => ({ id: mapId }),
}))

function makeResult(name: string) {
  return {
    map: { name },
    destroy: vi.fn(),
    controller: { setTileProfile: vi.fn() },
  }
}

const seen: Record<string, { map: unknown; error: string | null }> = {}

function Probe({ mapId }: { mapId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { mapRef, error } = useMap({ mapId, containerRef })
  seen[mapId] = { map: mapRef.current, error }
  return <div ref={containerRef} />
}

/** Instancia por mapa, igual que `<AtlasMap key={mapId} />` en ChapterPage. */
function Keyed({ mapId }: { mapId: string }) {
  return <Probe key={mapId} mapId={mapId} />
}

const flush = () => act(async () => { await Promise.resolve() })

describe('useMap: navegación rápida entre instancias', () => {
  beforeEach(() => {
    builds.clear()
    buildGeoreferencedMap.mockClear()
    useMapStore.setState({ mapBuilt: false, loading: false, error: null })
  })

  it('una build vieja que resuelve tras el cleanup destruye su mapa y no marca mapBuilt', async () => {
    const { rerender } = render(<Keyed mapId="a" />)
    rerender(<Keyed mapId="b" />)

    const a = makeResult('a')
    builds.get('a')!.resolve(a)
    await flush()

    expect(a.destroy).toHaveBeenCalledTimes(1)
    expect(useMapStore.getState().mapBuilt).toBe(false)
    expect(useMapStore.getState().loading).toBe(true)
  })

  it('la build nueva dispara mapBuilt aunque la vieja resuelva antes', async () => {
    const { rerender } = render(<Keyed mapId="a" />)
    rerender(<Keyed mapId="b" />)
    const a = makeResult('a')
    const b = makeResult('b')
    builds.get('a')!.resolve(a)
    await flush()

    const transitions: boolean[] = []
    const unsub = useMapStore.subscribe((s, prev) => {
      if (s.mapBuilt !== prev.mapBuilt) transitions.push(s.mapBuilt)
    })
    builds.get('b')!.resolve(b)
    await flush()
    unsub()

    expect(transitions).toEqual([true])
    expect(useMapStore.getState().loading).toBe(false)
    expect(b.destroy).not.toHaveBeenCalled()
  })

  it('una build vieja que falla no publica su error', async () => {
    const { rerender } = render(<Keyed mapId="a" />)
    rerender(<Keyed mapId="b" />)

    builds.get('a')!.reject(new Error('fallo viejo'))
    await flush()

    expect(useMapStore.getState().error).toBeNull()
    expect(useMapStore.getState().loading).toBe(true)
  })

  it('desmontar con la build en vuelo no deja loading ni mapBuilt activos', async () => {
    const { unmount } = render(<Keyed mapId="a" />)
    unmount()
    expect(useMapStore.getState().loading).toBe(false)

    const a = makeResult('a')
    builds.get('a')!.resolve(a)
    await flush()

    expect(a.destroy).toHaveBeenCalledTimes(1)
    expect(useMapStore.getState().mapBuilt).toBe(false)
  })

  it('el cleanup destruye el mapa ya construido', async () => {
    const { unmount } = render(<Keyed mapId="a" />)
    const a = makeResult('a')
    builds.get('a')!.resolve(a)
    await flush()
    expect(useMapStore.getState().mapBuilt).toBe(true)

    unmount()

    expect(a.destroy).toHaveBeenCalledTimes(1)
    expect(useMapStore.getState().mapBuilt).toBe(false)
  })
})
