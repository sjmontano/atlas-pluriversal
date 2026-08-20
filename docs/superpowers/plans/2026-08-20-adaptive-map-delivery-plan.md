# Adaptive Map Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver an immediate local preview plus connection-aware standard and HD raster tile profiles without requiring `images.full` in the normal map path.

**Architecture:** Keep the original local raster as the tile master. Add a small preview as the always-available underlay, choose one versioned tile URL by a shared connection profile, and limit prefetch/cache pressure according to that profile. Preserve the existing PGW/GDAL pipeline and generate standard/HD assets from the same source.

**Tech Stack:** React 19, Zustand, MapLibre GL, TypeScript, GDAL, WebP.

## Global Constraints

- Do not generate all tile assets during implementation; the user will run the generation command.
- Do not use `images.full` as the normal delivery path when tiles are configured.
- Keep `tileSize` logical at 512.
- Use versioned URLs and immutable cache headers.
- Network Information API is optional; conservative fallback is required.

### Task 1: Shared delivery profiles

**Files:** `src/stores/connectionStore.ts`, `src/types/content.ts`, `src/data/tiles.ts`

- Add `saveData`, `isConstrained`, and `tileProfile` (`standard` or `hd`) to the connection profile.
- Add standard/HD URL templates and preserve explicit local source paths.
- Keep the current map range and use 512 physical pixels for standard.

### Task 2: Preview-first renderer

**Files:** `src/services/MapRenderer.ts`, content image declarations

- Make `images.preview` the immediate underlay.
- Do not preload or upgrade `images.full` when tiles are configured.
- Keep full image only as an opt-in debug/fallback property.

### Task 3: Adaptive prefetch and caching pressure

**Files:** `src/hooks/useTilePrefetch.ts`, `src/services/TilePrefetcher.ts`, `src/hooks/usePrefetchAdjacent.ts`

- Disable prefetch for constrained profiles.
- Limit prefetch to a small number of nearby levels on HD/normal connections.
- Stop prefetch on connection changes and avoid adjacent full-image preloads.

### Task 4: Generator profiles

**Files:** `src/types/content.ts`, `src/data/tiles.ts`, `scripts/generate-tiles.mjs`, `docs/GUIA_GENERAR_TILES_LOCALES.md`

- Generate standard and HD directories from the same local master.
- Keep the user-facing command explicit and do not run the full generation.
- Document expected byte/quality measurements before adopting AVIF or lossless output.

### Task 5: Verification

- Add focused tests for profile selection, URL selection, and constrained prefetch.
- Run only focused tests/typecheck if requested; do not claim generated output until the user runs the generator.
