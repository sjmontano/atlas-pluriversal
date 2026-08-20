# Limpieza y Depuración del Proyecto Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar archivos obsoletos, resolver duplicaciones de código y actualizar documentación del proyecto `atlas/`, sin tocar el trabajo en curso (tiles con techo de pantalla, plan `2026-08-17-tiles-techo-pantalla.md`).

**Architecture:** Depuración de 5 frentes: (1) borrado de artefactos regenerables/obsoletos, (2) unificación de la detección de conexión lenta, (3) eliminación de la doble adaptación de zoom en prefetch y completar el barrel de theme, (4) README a la estructura real, (5) trackear `pnpm-workspace.yaml`.

**Tech Stack:** pnpm 11, Vite 8, React 19, TypeScript strict, Zustand 5, Vitest 4.

## Global Constraints

- NO modificar archivos con cambios sin commitear del trabajo en curso: `src/data/tiles.ts`, `src/services/MapRenderer.ts`, `src/services/TransformConstrain.ts`, `src/types/content.ts`, `src/utils/tileZoom.ts`, `src/content/chapter-*/*/index.ts`.
- `pnpm-workspace.yaml` debe trackearse (es requerido por pnpm 11 para `allowBuilds`).
- Los commits de esta limpieza NO deben incluir los ~40 archivos modificados del trabajo en curso (añadir solo los archivos de esta tarea).
- Verificación por tarea: `pnpm typecheck`, `pnpm lint`, `pnpm test`. Línea base: typecheck 0, lint 0 (warnings pre-existentes), 125 tests OK.

---

### Task 1: Eliminar artefactos obsoletos y assets sin uso

**Files:**
- Delete (untracked/gitignored, del disco): `.tmp-tiles/`, `dist/`, `res/`, `vite.log`, `dev-server.log`, `.tmp-vite.log`, `check-align.mjs`, `scripts/tilecalc.ts`
- Delete (tracked, vía `git rm`): `public/assets/ui/icons/*.svg` (36), `public/assets/ui/graphics/*` (2), `public/assets/ui/sidebar/*` (2)

**Interfaces:**
- Consumes: nada.
- Produces: raíz del proyecto limpia; commits parciales de `chore`.

- [ ] **Step 1: Borrar artefactos untracked/regenerables**

```powershell
Remove-Item -Recurse -Force .tmp-tiles, dist, res
Remove-Item -Force vite.log, dev-server.log, .tmp-vite.log, check-align.mjs
Remove-Item -Force scripts/tilecalc.ts
```

- [ ] **Step 2: Eliminar assets UI no referenciados**

```bash
git rm -r public/assets/ui/icons public/assets/ui/graphics public/assets/ui/sidebar
```

- [ ] **Step 3: Verificar que nada los referencia y commit**

Run: `pnpm typecheck && pnpm lint && pnpm test`
Expected: green (sin cambios de comportamiento).
Commit: `git add -A && git commit -m "chore: eliminar artefactos obsoletos y assets UI sin uso"` (solo si no hay otros cambios staged)

### Task 2: Unificar detección de conexión lenta

**Files:**
- Modify: `src/stores/uiStore.ts:29-42,54`
- Test: `pnpm typecheck && pnpm lint && pnpm test`

**Interfaces:**
- Consumes: `useConnectionStore` de `./connectionStore.ts` (expone `isSlow: boolean`).
- Produces: `uiStore` usa `useConnectionStore.getState().isSlow` como fuente única de lentitud de red; se elimina `isSlowConnection` y `NavigatorWithConnection` locales.

- [ ] **Step 1: Reemplazar lógica duplicada en uiStore**

Importar `useConnectionStore` y usar su `isSlow` en la inicialización de `lowPowerMode`; eliminar `NavigatorWithConnection` y `isSlowConnection` (que quedan sin uso).

```ts
import { useConnectionStore } from './connectionStore.ts'
...
lowPowerMode: isLowPowerDevice || useConnectionStore.getState().isSlow,
```

- [ ] **Step 2: Verificar**

Run: `pnpm typecheck && pnpm lint && pnpm test`
Expected: green.
Commit: `git add src/stores/uiStore.ts && git commit -m "refactor: unificar detección de conexión lenta en connectionStore"`

### Task 3: Prefetch sin doble adaptación + barrel de theme completo

**Files:**
- Modify: `src/hooks/useTilePrefetch.ts:5,32-41`
- Modify: `src/content/theme/index.ts`
- Modify: importadores de `SWATCH` en `src/content/chapter-3/` (shared.ts, monocultivo/{layers,legends}.ts, humedales/{layers,legends}.ts, cali-deseca/{layers,legends}.ts, arcilla/{layers,legends}.ts, encharcaron/{layers,legends}.ts)

**Interfaces:**
- Consumes: `prefetchRegionTiles(config, delayMs)` — ya adapta internamente con `resolveAdaptivePrefetchMaxZoom`.
- Produces: `useTilePrefetch` pasa `entry.tiles.maxZoom` crudo (sin llamar primero a `resolveAdaptivePrefetchMaxZoom`); `theme/index.ts` exporta `SWATCH`.

- [ ] **Step 1: Simplificar useTilePrefetch**

Quitar la primera llamada a `resolveAdaptivePrefetchMaxZoom` y su import; `config.maxZoom = entry.tiles.maxZoom`. `prefetchRegionTiles` ya la adapta.

- [ ] **Step 2: Completar barrel de theme**

Añadir `export { SWATCH } from './swatches'` en `src/content/theme/index.ts` y cambiar los importadores de `chapter-3` de `'../theme/swatches'` / `'../../theme/swatches'` a `'@content/theme'`.

- [ ] **Step 3: Verificar**

Run: `pnpm typecheck && pnpm lint && pnpm test`
Expected: green.
Commit: `git add src/hooks/useTilePrefetch.ts src/content/theme src/content/chapter-3 && git commit -m "refactor: prefetch sin doble adaptación de zoom y barrel de theme completo"`

### Task 4: README a la estructura real

**Files:**
- Modify: `README.md` (secciones "Georreferenciación" y "Estructura")

**Interfaces:**
- Consumes: estructura actual del repo (migración TS, datos en `src/content/chapter-*/index.ts`).
- Produces: README coherente con la realidad.

- [ ] **Step 1: Actualizar README**

Reemplazar la sección "Georreferenciación" (eliminar refs a `src/data/maps/geo.js`) y el árbol de "Estructura" (reflejar `content/`, `data/`, `services/`, `stores/`, `hooks/`, `components/`, `pages/`).

- [ ] **Step 2: Verificar y commit**

Run: `pnpm typecheck` (README no afecta, sanity check).
Commit: `git add README.md && git commit -m "docs: actualizar README a la estructura actual"`

### Task 5: Trackear pnpm-workspace.yaml y verificación final

**Files:**
- Add: `pnpm-workspace.yaml`

**Interfaces:**
- Consumes: nada.
- Produces: `allowBuilds.esbuild: true` versionado (evita recurrencia de `ERR_PNPM_IGNORED_BUILDS`).

- [ ] **Step 1: Trackear el archivo**

```bash
git add pnpm-workspace.yaml && git commit -m "chore: trackear pnpm-workspace.yaml con allowBuilds de esbuild"
```

- [ ] **Step 2: Verificación final completa**

Run: `pnpm install && pnpm typecheck && pnpm lint && pnpm test`
Expected: install sin `ERR_PNPM_IGNORED_BUILDS`, typecheck 0, lint 0, 125 tests OK.