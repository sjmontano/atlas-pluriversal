# Fallback Cloudinary por zoom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Base Cloudinary low/medium/high por zoom sin tiles, sin verse feo.

**Architecture:** Un solo ImageSource piramidal con `resolveBaseLevel()` puro + `attachBaseZoomFallback()` con preload/histeresis, reutilizando `cloudinaryVariant` y `preloadImage` en `MapRenderer.ts`.

**Tech Stack:** TypeScript strict, MapLibre GL 6, Vitest + jsdom, Cloudinary fetch transforms.

## Global Constraints

- No añadir URLs low/medium/high por mapa; derivar de `images.base` vía `cloudinaryVariant`.
- No tocar PGW, bounds, ni `scripts/generate-tiles.mjs`.
- `raster-fade-duration: 0` en base, `300` (o `0` en lowPower) en tiles.
- `VITE_TILES_ENABLED=false` nunca pide `/assets/maps/tiles/*`.
- Thresholds: `low <= min+0.5`, `medium <= min+1.0`, `high > min+1.0`; `initial-only/cover` siempre `medium` (salvo demo que usa `high`).

---

### Task 1: Helper puro resolveBaseLevel + transforms

**Files:**
- Create: `src/utils/baseZoom.ts`
- Test: `tests/utils/baseZoom.test.ts`

**Interfaces:**
- Consumes: nada (puro).
- Produces: `export type BaseLevel = 'low' | 'medium' | 'high'`, `export function resolveBaseLevel(zoom: number, minZoom: number, maxZoom: number, mode: 'detail' | 'initial-only' | 'initial-cover'): BaseLevel`, `export const BASE_TRANSFORMS: Record<BaseLevel, string> = { low: 'w_512,q_auto,f_webp', medium: 'w_1600,q_auto,f_webp', high: 'w_2048,q_auto,f_webp' }`, `export function baseRangeForEntry(entryTiles: { minZoom: number; maxZoom: number } | null | undefined, fallbackMin: number, fallbackMax: number): { minZoom: number; maxZoom: number }`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest'
import { resolveBaseLevel, BASE_TRANSFORMS, baseRangeForEntry } from '@utils/baseZoom'

describe('resolveBaseLevel', () => {
  it('ecosistemas z8-10: low hasta 8.5', () => {
    expect(resolveBaseLevel(8.0, 8, 10, 'detail')).toBe('low')
    expect(resolveBaseLevel(8.5, 8, 10, 'detail')).toBe('low')
  })
  it('ecosistemas z8-10: medium 8.5-9.0, high 9+', () => {
    expect(resolveBaseLevel(8.6, 8, 10, 'detail')).toBe('medium')
    expect(resolveBaseLevel(9.0, 8, 10, 'detail')).toBe('medium')
    expect(resolveBaseLevel(9.1, 8, 10, 'detail')).toBe('high')
    expect(resolveBaseLevel(12, 8, 10, 'detail')).toBe('high')
  })
  it('initial-only siempre medium', () => {
    expect(resolveBaseLevel(9, 9, 9, 'initial-only')).toBe('medium')
    expect(resolveBaseLevel(12, 9, 9, 'initial-only')).toBe('medium')
  })
  it('transforms usan w_512/1600/2048', () => {
    expect(BASE_TRANSFORMS.low).toContain('w_512')
    expect(BASE_TRANSFORMS.medium).toContain('w_1600')
    expect(BASE_TRANSFORMS.high).toContain('w_2048')
  })
  it('baseRangeForEntry prefiere tiles y cae a fallback', () => {
    expect(baseRangeForEntry({ minZoom: 8, maxZoom: 10 }, 0, 0)).toEqual({ minZoom: 8, maxZoom: 10 })
    expect(baseRangeForEntry(null, 8, 10)).toEqual({ minZoom: 8, maxZoom: 10 })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/utils/baseZoom.test.ts`
Expected: FAIL with "Failed to resolve import @utils/baseZoom"

- [ ] **Step 3: Write minimal implementation**

```typescript
export type BaseLevel = 'low' | 'medium' | 'high'
export type BaseZoomMode = 'detail' | 'initial-only' | 'initial-cover'

export const BASE_TRANSFORMS: Record<BaseLevel, string> = {
  low: 'w_512,q_auto,f_webp',
  medium: 'w_1600,q_auto,f_webp',
  high: 'w_2048,q_auto,f_webp',
}

export function resolveBaseLevel(zoom: number, minZoom: number, _maxZoom: number, mode: BaseZoomMode): BaseLevel {
  if (mode === 'initial-only' || mode === 'initial-cover') return 'medium'
  if (zoom <= minZoom + 0.5) return 'low'
  if (zoom <= minZoom + 1.0) return 'medium'
  return 'high'
}

export function baseRangeForEntry(
  entryTiles: { minZoom: number; maxZoom: number } | null | undefined,
  fallbackMin: number,
  fallbackMax: number,
): { minZoom: number; maxZoom: number } {
  if (entryTiles) return { minZoom: entryTiles.minZoom, maxZoom: entryTiles.maxZoom }
  return { minZoom: fallbackMin, maxZoom: fallbackMax }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/utils/baseZoom.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/utils/baseZoom.ts tests/utils/baseZoom.test.ts
git commit -m "feat: base zoom levels low/medium/high"
```

### Task 2: Zoom fallback en MapRenderer (preload + swap + cleanup)

**Files:**
- Modify: `src/services/MapRenderer.ts:341-367` (reemplazar bloque `5b Base intermedia` por wiring a `attachBaseZoomFallback`, añadir funciones exportadas)
- Test: `tests/services/baseZoomFallback.test.ts`

**Interfaces:**
- Consumes: `resolveBaseLevel`, `BASE_TRANSFORMS`, `baseRangeForEntry` de Task 1; `cloudinaryVariant`, `preloadImage` existentes; `computeTileRange`, `constrainMinZoom`, `screenCeilingZoom` existentes; `MAP_TILE_MODES` de `@data/tiles`.
- Produces: `export function baseUrlForLevel(base: string, level: BaseLevel): string`, `export function attachBaseZoomFallback(map, mapId, entry, coordinates, opts): () => void`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { baseUrlForLevel } from '@services/MapRenderer'

describe('baseUrlForLevel', () => {
  it('aplica transform medium al base Cloudinary', () => {
    expect(
      baseUrlForLevel('https://res.cloudinary.com/dvluvxfvn/image/upload/v1/geoImages/x.webp', 'medium'),
    ).toContain('w_1600')
  })
  it('local no-op devuelve misma URL', () => {
    expect(baseUrlForLevel('/assets/maps/cap1/encuadres.png', 'high')).toBe('/assets/maps/cap1/encuadres.png')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/services/baseZoomFallback.test.ts`
Expected: FAIL with "baseUrlForLevel is not a function"

- [ ] **Step 3: Write minimal implementation**

```typescript
import { resolveBaseLevel, BASE_TRANSFORMS, baseRangeForEntry, type BaseLevel } from '@utils/baseZoom'
import { computeTileRange, constrainMinZoom, screenCeilingZoom } from '@utils/tileZoom'
import { MAP_TILE_MODES } from '@data/tiles'

export function baseUrlForLevel(base: string, level: BaseLevel): string {
  return cloudinaryVariant(base, BASE_TRANSFORMS[level])
}

export function attachBaseZoomFallback(
  map: maplibregl.Map,
  mapId: string,
  entry: MapContent,
  coordinates: ImageCoordinates,
  opts?: BuildOptions,
): () => void {
  const tilesEnabled = opts?.tilesEnabled !== false
  const mode = MAP_TILE_MODES[mapId] ?? 'detail'
  let range = entry.tiles
    ? baseRangeForEntry(entry.tiles, 0, 0)
    : (() => {
        const r = computeTileRange(entry.geo, mode, 1920, 1080, entry.config.initialBearing)
        if (r) return r
        const min = Math.floor(constrainMinZoom(entry.geo, 1920, 1080, entry.config.initialBearing))
        return { minZoom: min, maxZoom: Math.max(min, screenCeilingZoom(entry.geo, 1920)) }
      })()
  let current: BaseLevel | null = null
  let raf = 0
  let disposed = false

  const applyLevel = (level: BaseLevel) => {
    if (disposed || level === current) return
    const target = tilesEnabled ? level : 'high'
    if (target === current) return
    const url = baseUrlForLevel(entry.images.base, target)
    const existing = (() => {
      try { return (map.getSource(IMAGE_SOURCE_ID) as maplibregl.ImageSource | undefined)?.updateImage ? 'ok' : null } catch { return null }
    })()
    if (!existing && !map.getSource(IMAGE_SOURCE_ID)) return
    if (url === (entry.tiles?.preview ?? entry.images.placeholder)) { current = target; return }
    preloadImage(url).then(() => {
      if (disposed || current === target) return
      try {
        const src = map.getSource(IMAGE_SOURCE_ID) as maplibregl.ImageSource | undefined
        if (src) { src.updateImage({ url, coordinates }); current = target }
      } catch { /* noop: conserva nivel actual */ }
    }).catch(() => { /* noop: conserva nivel actual */ })
    const next: BaseLevel | null = target === 'low' ? 'medium' : target === 'medium' ? 'high' : null
    if (next) preloadImage(baseUrlForLevel(entry.images.base, next)).catch(() => {})
  }

  const onZoom = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      try { applyLevel(resolveBaseLevel(map.getZoom(), range.minZoom, range.maxZoom, mode)) } catch { /* noop */ }
    })
  }
  try { applyLevel(resolveBaseLevel(map.getZoom(), range.minZoom, range.maxZoom, mode)) } catch { /* noop */ }
  map.on('zoom', onZoom)
  map.on('zoomend', onZoom)
  return () => {
    disposed = true
    cancelAnimationFrame(raf)
    try { map.off('zoom', onZoom) } catch { /* noop */ }
    try { map.off('zoomend', onZoom) } catch { /* noop */ }
  }
}
```

Luego en `buildGeoreferencedMap`: reemplazar bloque `5b` por llamada a `attachBaseZoomFallback` cuando `useImageBase !== false || needsPreviewFallback`, guardar `detach` y llamarlo en `destroy()`. Mantener `tilesEnabled===false` → `high` directo vía `target`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run tests/services/baseZoomFallback.test.ts tests/utils/baseZoom.test.ts tests/services/cloudinaryVariant.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/MapRenderer.ts tests/services/baseZoomFallback.test.ts
git commit -m "feat: fallback Cloudinary por zoom con preload"
```

### Task 3: Degraded escala a high + verificación manual

**Files:**
- Modify: `src/services/MapRenderer.ts:556-579` (`attachTileTelemetry` timeout → `updateImage` a high si existe base)
- Test: manual (red + zoom)

**Interfaces:**
- Consumes: `baseUrlForLevel` de Task 2, `useMapStore.setTilesStatus` existente.
- Produces: ningún export nuevo.

- [ ] **Step 1: Write the failing test (documenta comportamiento sin mock pesado)**

```typescript
import { describe, it, expect } from 'vitest'
import { resolveBaseLevel } from '@utils/baseZoom'

describe('degraded escala base', () => {
  it('zoom alto resuelve high para escalar en degraded', () => {
    expect(resolveBaseLevel(11, 8, 10, 'detail')).toBe('high')
  })
})
```

Append a `tests/services/baseZoomFallback.test.ts` (mismo archivo Task 2).

- [ ] **Step 2: Run test to verify it passes (ya implementado en Task 1)**

Run: `pnpm vitest run tests/services/baseZoomFallback.test.ts`
Expected: PASS

- [ ] **Step 3: Implement degraded → high en timeout existente**

En `attachTileTelemetry` timeout 15s, tras `setTilesStatus('degraded')`, intentar `preloadImage(baseUrlForLevel(entryBase, 'high'))` → `updateImage`. Requiere pasar `entry` + `coordinates` a `attachTileTelemetry(map, mapId, entry, coordinates)`. Si falla o es local no-op, no hacer nada. No cambiar el timeout ni el store.

- [ ] **Step 4: Run full suite + typecheck**

Run: `pnpm vitest run tests/services/baseZoomFallback.test.ts tests/utils/baseZoom.test.ts && pnpm typecheck`
Expected: PASS + 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/services/MapRenderer.ts tests/services/baseZoomFallback.test.ts
git commit -m "feat: degraded escala base a high"
```
