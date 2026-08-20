# Tiles XYZ con techo de pantalla — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el generador de tiles roto y los `minZoom`/`maxZoom` hardcodeados por un sistema donde el techo de detalle = pantalla (referencia 1920 px): utilidad compartida de cálculo (A+C híbrido), config central de modos por mapa, tiles generados hasta el techo, y runtime con zoom derivado. Total esperado **3.538 tiles (~41 MB)** vs 20.313 (~238 MB) del enfoque actual.

**Architecture:** Una utilidad pura (`src/utils/tileZoom.ts`) computa `screenCeilingZoom` (techo de pantalla), `constrainMinZoom` (bearing-aware) y `computeTileRange`. Una config central (`src/data/tiles.ts`) declara el modo por mapa (`MAP_TILE_MODES`), el template de URL y la fábrica `makeTilesConfig`. Los ~31 content modules eliminan `minZoom`/`maxZoom` de `config` y declaran `tiles: makeTilesConfig(...)`. El runtime deriva el zoom del techo con el ancho real del contenedor. El generador (`scripts/generate-tiles.mjs`) se reescribe para importar los content modules con `tsx`, soportar imágenes locales y AVIF, y limpiar zooms huérfanos.

**Tech Stack:** Vite + React 19 + TypeScript strict + MapLibre GL v6 + Vitest + GDAL CLI + tsx (runner de scripts). Verificación con `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, y conteo real de tiles generados.

> **Decisión base (spec aprobada):** `docs/superpowers/specs/2026-08-17-tiles-techo-pantalla-design.md` (commits `4f798a5` + `445a1c5`). **Ajustes verificados en bitácora (2026-08-17 v2):**
> 1. **Fórmula del techo = `Math.round(log2(canvasW·360/(256·lonSpan)))`** (mejor ajuste 13/21 vs tabla aprobada). El spec dice `floor`/512, pero sus propios ejemplos (m-suarez z12, bredunco z9, cali z15) solo calzan con **256-round** → se corrige el spec en Task 1.
> 2. **`constrainMinZoom` DEBE recibir `bearing`** (confirmado: 26/31 mapas cambian su `floor` según orientación con referencia 1920×1080). Firma: `constrainMinZoom(geo, canvasW, canvasH, bearing)`.
> 3. Total esperado: **3.538 tiles (~41 MB)** con grid Web Mercator exacto + `processBounds` real.

## Global Constraints

- Trabajar desde `D:\Proyectos\Atlas\atlas-pluriversal\atlas`.
- `verbatimModuleSyntax: true` → imports de solo-tipo usan `import type`.
- No versionar tiles en git (`.gitignore` ya cubre `public/assets/maps/tiles/`).
- Verificar con `pnpm typecheck`, `pnpm lint` y `pnpm test` tras cada tarea que toque código; `pnpm build` tras cambios de tipos exportados.
- **WIP del usuario sin commitear — no tocar su intención:** `src/content/chapter-1/bredunco/index.ts` (maxZoom 9.5→7) y `src/content/chapter-1/encuadres/index.ts` (imágenes locales). El refactor de estas archivos debe preservar esos valores/decisiones.
- `pnpm-workspace.yaml` es untracked (`??`) — no se toca ni se commitea en este plan.
- La estructura de carpetas acordada es plana por mapId (NO anidar por capítulo): `public/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp` (+ `capas/` futura reservada).
- `getAllMaps()` NO trae geo → el generador importa cada content module directo (con `tsx`).
- El registro de content replica `src/content/index.ts`: glob `./*/*/index.ts` (capítulos) + `./*/index.ts` (intro suelto), filtrando módulos sin `mapId` (theme/calibration).

---

## Task 1: Utilidad `tileZoom.ts` + corregir spec

**Files:**
- Add: `src/utils/tileZoom.ts`
- Add: `tests/utils/tileZoom.test.ts`
- Modify: `docs/superpowers/specs/2026-08-17-tiles-techo-pantalla-design.md`

**Interfaces:**
- Consumes: `MapGeoEntry` y `processBounds` de `@services/BoundsCalculator`.
- Produces: `screenCeilingZoom`, `constrainMinZoom`, `computeTileRange` y el tipo `TileZoomMode`.

- [ ] **Step 1: Crear `src/utils/tileZoom.ts`**

```ts
import { processBounds } from '@services/BoundsCalculator'
import type { MapGeoEntry } from '@types/content'

export type TileZoomMode = 'detail' | 'initial-only' | 'none'

export interface TileZoomRange {
  minZoom: number
  maxZoom: number
}

const REF_W = 1920
const REF_H = 1080

/**
 * Zoom donde el mapa llena el ancho de pantalla (techo de detalle).
 * Más allá no hay detalle perceptible. Fórmula verificada: round/log2/256.
 */
export function screenCeilingZoom(geo: MapGeoEntry, canvasW: number): number {
  const { bounds } = processBounds(geo.pgw, geo.width, geo.height)
  const lonSpan = bounds[2] - bounds[0]
  if (lonSpan <= 0) return 0
  return Math.round(Math.log2((canvasW * 360) / (256 * lonSpan)))
}

/**
 * Mismo cálculo que TransformConstrain (Paso A): el zoom mínimo donde el
 * viewport cabe en el bound, bearing-aware (quarter-turn intercambia ejes).
 * Solo para validación/consistencia; el runtime clampea por frame.
 */
export function constrainMinZoom(
  geo: MapGeoEntry,
  canvasW: number,
  canvasH: number,
  bearing: number,
): number {
  const { bounds } = processBounds(geo.pgw, geo.width, geo.height)
  const [west, south, east, north] = bounds
  const latSpan = north - south
  const lonSpan = east - west
  const normalized = ((bearing % 360) + 360) % 360
  const isQuarterTurn = normalized === 90 || normalized === 270
  if (isQuarterTurn) {
    const mw = latSpan > 0 ? Math.log2((canvasW * 360) / (512 * latSpan)) : 0
    const mh = lonSpan > 0 ? Math.log2((canvasH * 360) / (512 * lonSpan)) : 0
    return Math.max(mw, mh)
  }
  const mw = lonSpan > 0 ? Math.log2((canvasW * 360) / (512 * lonSpan)) : 0
  const mh = latSpan > 0 ? Math.log2((canvasH * 360) / (512 * latSpan)) : 0
  return Math.max(mw, mh)
}

/**
 * Rango de zooms para generar/servir tiles.
 * - detail: minZoom = floor(constrainMinZoom), maxZoom = screenCeilingZoom.
 * - initial-only: minZoom = maxZoom = floor(initialZoom).
 * - none: null (sin tiles; reservado para mapas futuros).
 */
export function computeTileRange(
  geo: MapGeoEntry,
  initialZoom: number,
  mode: TileZoomMode,
  canvasW: number = REF_W,
  canvasH: number = REF_H,
  bearing: number = 0,
): TileZoomRange | null {
  if (mode === 'none') return null
  if (mode === 'initial-only') {
    const z = Math.floor(initialZoom)
    return { minZoom: z, maxZoom: z }
  }
  const minZoom = Math.floor(constrainMinZoom(geo, canvasW, canvasH, bearing))
  const maxZoom = Math.max(minZoom, screenCeilingZoom(geo, canvasW))
  return { minZoom, maxZoom }
}
```

> La línea `const maxZoom = Math.max(minZoom, screenCeilingZoom(...))` es un guardrail: si el techo cayera bajo el constrain, se clampa al min (nunca un rango invertido).

- [ ] **Step 2: Crear `tests/utils/tileZoom.test.ts`**

Usar el patrón de `tests/services/BoundsCalculator.test.ts` (vitest). Casos:
- `screenCeilingZoom` devuelve el techo esperado para ecosistemas (bounds reales, 1920 → **10**) y para m-suarez (→ **12**). Valores tomados de la bitácora v2.
- `screenCeilingZoom` con canvasW menor devuelve un zoom menor (proporcionalidad).
- `constrainMinZoom` es bearing-aware: para un geo rotado (quarter-turn), la orientación 90/270 difiere de 0/180 en el valor (aunque el floor pueda coincidir, el número es distinto). Caso concreto de ecosistemas: bearing −90 → min ≈ 8.14.
- `computeTileRange('detail')` → `{ minZoom: floor(constrain), maxZoom: ceiling }`, `minZoom ≤ maxZoom`.
- `computeTileRange('initial-only')` con initialZoom 6.39 → `{ 6, 6 }`.
- `computeTileRange('none')` → `null`.
- Contrato de concordancia con la bitácora v2 para **3 mapas representativos** (ecosistemas z8-10, m-suarez z10-12, intro z6).

- [ ] **Step 3: Corregir el spec (512→256-round + firma con bearing)**

En `docs/superpowers/specs/2026-08-17-tiles-techo-pantalla-design.md`:
- §1 `screenCeilingZoom`: cambiar a `round(log2(canvasW·360/(256·lonSpan)))`.
- §1 `constrainMinZoom`: firmar `(geo, canvasW, canvasH, bearing)` y nota "quarter-turn intercambia W↔lat / H↔lon".
- §2 `makeTilesConfig(mapId, geo, initialZoom, initialBearing)`.
- §"Resultado esperado": actualizar total a **~3.538 tiles (~41 MB)**.

- [ ] **Step 4: Verificar + commit**

```powershell
pnpm typecheck
pnpm test
git add src/utils/tileZoom.ts tests/utils/tileZoom.test.ts docs/superpowers/specs/2026-08-17-tiles-techo-pantalla-design.md
git commit -m "feat(tiles): utilidad tileZoom (techo de pantalla 256-round + constrainMinZoom bearing-aware) con tests"
```

---

## Task 2: Config central `src/data/tiles.ts` + tests

**Files:**
- Add: `src/data/tiles.ts`
- Add: `tests/data/tiles.test.ts`

**Interfaces:**
- Consumes: `MapGeoEntry`, `MapTilesConfig`, `computeTileRange`, `TileZoomMode`.
- Produces: `MAP_TILE_MODES` (31 mapas reales), `tileUrlTemplate(mapId)`, `makeTilesConfig`.

- [ ] **Step 1: Crear `src/data/tiles.ts`**

```ts
import type { MapGeoEntry, MapTilesConfig } from '@types/content'
import { computeTileRange } from '@utils/tileZoom'
import type { TileZoomMode } from '@utils/tileZoom'

export const MAP_TILE_MODES: Record<string, TileZoomMode> = {
  intro: 'initial-only',
  'chapter1-encuadres': 'initial-only',
  'chapter1-ecosistemas': 'detail',
  'chapter1-formas-paisaje': 'detail',
  'chapter1-bredunco': 'detail',
  'chapter1-mosaicos-del-agua': 'detail',
  'chapter1-un-rio-cauca': 'detail',
  'chapter2-valle': 'detail',
  'chapter2-suarez': 'detail',
  'chapter2-cali': 'detail',
  'chapter2-villa-rica': 'detail',
  'chapter2-m-oriente-cali': 'detail',
  'chapter2-m-villa-rica': 'detail',
  'chapter2-m-suarez': 'detail',
  'chapter3-introduccion': 'detail',
  'chapter3-monocultivo': 'detail',
  'chapter3-encharcaron': 'detail',
  'chapter3-cali-deseca': 'detail',
  'chapter3-humedales': 'detail',
  'chapter3-arcilla': 'detail',
  'chapter4-introduccion': 'detail',
  'chapter4-asoyoge': 'initial-only',
  'chapter4-el-buhido': 'initial-only',
  'chapter4-bosque-comestible': 'detail',
  'chapter4-los-bajios': 'initial-only',
  'chapter4-el-paso': 'initial-only',
  'chapter4-las-mercedes': 'initial-only',
  'chapter4-la-virginia': 'initial-only',
  'chapter4-centro-agropecuario': 'initial-only',
  'chapter4-la-caicedo': 'initial-only',
  'chapter4-problematicas': 'detail',
}

const BASE_URL = '/assets/maps/tiles/mapas'

export function tileUrlTemplate(mapId: string): string {
  return `${BASE_URL}/${mapId}/{z}/{x}/{y}.webp`
}

/**
 * Fabrica MapTilesConfig para un mapa. La referencia de pantalla es 1920×1080;
 * el bearing es el del mapa (initialBearing) para que el constrainMinZoom sea
 * coherente con el runtime.
 */
export function makeTilesConfig(
  mapId: string,
  geo: MapGeoEntry,
  initialZoom: number,
  initialBearing: number,
): MapTilesConfig | null {
  const mode = MAP_TILE_MODES[mapId]
  if (!mode) return null
  const range = computeTileRange(geo, initialZoom, mode, 1920, 1080, initialBearing)
  if (!range) return null
  return {
    urlTemplate: tileUrlTemplate(mapId),
    tileSize: 256,
    minZoom: range.minZoom,
    maxZoom: range.maxZoom,
    fadeDuration: 300,
  }
}
```

> El modo `'none'` no existe hoy en `MAP_TILE_MODES`; si un mapId no está registrado, `makeTilesConfig` devuelve `null` (mapa sin tiles).

- [ ] **Step 2: Crear `tests/data/tiles.test.ts`**

- `MAP_TILE_MODES` cubre exactamente los 31 mapIds de `getAllMaps()` + `intro` (verificar contra `src/data/chapters/chapters.ts`).
- `tileUrlTemplate('chapter1-ecosistemas')` → `/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp`.
- `makeTilesConfig('chapter1-ecosistemas', geoEco, 6.4, -90)` → `{ minZoom: 8, maxZoom: 10, tileSize: 256, urlTemplate: … }` (concordancia bitácora v2).
- `makeTilesConfig('chapter1-ecosistemas', geoEco, 6.4, 0)` → `minZoom` distinto (confirma que el bearing fluye hasta el rango).
- `makeTilesConfig('mapa-desconocido', …)` → `null`.

- [ ] **Step 3: Verificar + commit**

```powershell
pnpm typecheck
pnpm test
git add src/data/tiles.ts tests/data/tiles.test.ts
git commit -m "feat(tiles): config central de modos por mapa (MAP_TILE_MODES) y fabrica makeTilesConfig"
```

---

## Task 3: Tipo `MapConfig` sin `minZoom`/`maxZoom`

**Files:**
- Modify: `src/types/content.ts`
- Modify: `tests/components/CalibrationPanel.test.tsx`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: `MapConfig` sin `minZoom`/`maxZoom`; `MapTilesConfig` intacto.

- [ ] **Step 1: Eliminar de `MapConfig`**

En `src/types/content.ts:21-36`, quitar las propiedades `minZoom` y `maxZoom`. Permanecen: `initialZoom`, `initialBearing`, `useTransformConstrain`, `viewportMaxBounds`, `viewportMargin?`, `viewportMarginH?`, `viewportMarginV?`, `dragPan`, `scrollZoom`.

- [ ] **Step 2: Actualizar el fixture de test**

En `tests/components/CalibrationPanel.test.tsx:18`, el mock de `config` incluye `minZoom: 3, maxZoom: 8` → quitarlos (deja `{ initialZoom: 5, initialBearing: -90, dragPan: true, scrollZoom: true, useTransformConstrain: false }`).

- [ ] **Step 3: Verificar (aún sin content modules corregidos)**

Se espera que `pnpm typecheck` FALLE aquí en los content modules que aún declaran `minZoom`/`maxZoom` — eso es esperado y se resuelve en Task 4. Verificar solo que `tests/` compila:

```powershell
pnpm typecheck  # se acepta que falle con errores SOLO de minZoom/maxZoom en src/content/*
pnpm test       # CalibrationPanel pasa tras quitar minZoom/maxZoom del mock
```

- [ ] **Step 4: Commit**

```bash
git add src/types/content.ts tests/components/CalibrationPanel.test.tsx
git commit -m "refactor(tiles): eliminar minZoom/maxZoom de MapConfig (derivados ahora)"
```

---

## Task 4: Refactor de los 31 content modules

**Files:**
- Modify: `src/content/intro/index.ts`
- Modify: `src/content/chapter-1/{encuadres,ecosistemas,formas-paisaje,bredunco,mosaicos-del-agua,un-rio-cauca}/index.ts`
- Modify: `src/content/chapter-2/{valle,suarez,cali,villa-rica,m-oriente-cali,m-villa-rica,m-suarez}/index.ts`
- Modify: `src/content/chapter-3/{introduccion,monocultivo,encharcaron,cali-deseca,humedales,arcilla}/index.ts`
- Modify: `src/content/chapter-4/{introduccion,asoyoge,el-buhido,bosque-comestible,los-bajios,el-paso,las-mercedes,la-virginia,centro-agropecuario,la-caicedo,problematicas}/index.ts`

**Interfaces:**
- Consumes: `makeTilesConfig` de `@data/tiles`.
- Produces: cada módulo sin `minZoom`/`maxZoom` en `config`, con `tiles: makeTilesConfig('<mapId>', geo, config.initialZoom, config.initialBearing)`.

**Patrón mecánico por archivo (ej. `chapter-1/ecosistemas/index.ts`):**

Antes:
```ts
import type { MapContent } from '../../../types/content'
import { GROUPS } from './groups'
import { LAYERS } from './layers'
// ...
export default {
  mapId: 'chapter1-ecosistemas',
  geo: { pgw: [...], width: 5729, height: 10186 },
  images: { base, full, placeholder },
  config: { initialZoom: 6.4, minZoom: 2, maxZoom: 9.5, initialBearing: -90, ... },
  tiles: { urlTemplate: '/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp', tileSize: 256, minZoom: 6, maxZoom: 12, fadeDuration: 300 },
  layers: LAYERS,
  groups: GROUPS,
} satisfies MapContent
```

Después:
```ts
import type { MapContent } from '../../../types/content'
import { makeTilesConfig } from '@data/tiles'
import { GROUPS } from './groups'
import { LAYERS } from './layers'

const geo = { pgw: [...], width: 5729, height: 10186 } as const
const config = { initialZoom: 6.4, initialBearing: -90, useTransformConstrain: true, viewportMaxBounds: null, viewportMarginH: -0.03, viewportMarginV: -0.12, dragPan: true, scrollZoom: true }

export default {
  mapId: 'chapter1-ecosistemas',
  geo,
  images: { base, full, placeholder },
  config,
  tiles: makeTilesConfig('chapter1-ecosistemas', geo, config.initialZoom, config.initialBearing),
  layers: LAYERS,
  groups: GROUPS,
} satisfies MapContent
```

Reglas por archivo:
- `geo` y `config` se hoistean como consts sobre el `export default` (necesarios para referenciar `config.initialZoom`/`config.initialBearing` en `tiles`). Si el módulo ya tiene `const geo = …` / `const config = …`, solo se usan.
- Si el módulo **ya tiene** un campo `tiles` hardcodeado (como ecosistemas), se **reemplaza** por `makeTilesConfig(...)`.
- Si el módulo **no tiene** campo `tiles`, se **agrega** con el mapId real.
- Se eliminan `minZoom` y `maxZoom` del objeto `config`.
- **Preservar WIP del usuario:** `chapter-1/bredunco` conserva sus decisiones de WIP (el campo `maxZoom` se elimina como tal; si el usuario quería un techo menor que la derivación, se discute aparte, no en este plan). `chapter-1/encuadres` conserva sus `images` locales.
- Verificar que el `mapId` del string en `makeTilesConfig` coincide EXACTO con el `mapId` declarado en el módulo.

- [ ] **Step 1: Aplicar el patrón a intro + los 6 módulos de capítulo 1** (7 archivos)
- [ ] **Step 2: Aplicar el patrón a los 7 módulos de capítulo 2**
- [ ] **Step 3: Aplicar el patrón a los 6 módulos de capítulo 3**
- [ ] **Step 4: Aplicar el patrón a los 11 módulos de capítulo 4**
- [ ] **Step 5: Verificar**

```powershell
pnpm typecheck
pnpm lint
pnpm test
```

Expected: PASS (los errores de Task 3 desaparecen).

- [ ] **Step 6: Commit**

```bash
git add src/content
git commit -m "refactor(tiles): content modules con tiles derivado (makeTilesConfig) y sin minZoom/maxZoom en config"
```

---

## Task 5: Runtime — `MapRenderer` con zoom derivado

**Files:**
- Modify: `src/services/MapRenderer.ts`

**Interfaces:**
- Consumes: `screenCeilingZoom` de `@utils/tileZoom`; `entry.tiles` ya viene con `minZoom`/`maxZoom` derivados.
- Produces: `minZoom: 0` (el constrain clampea por frame) y `maxZoom` derivado con el ancho real del contenedor.

- [ ] **Step 1: Sustituir `minZoom`/`maxZoom` en las opciones del mapa**

En `src/services/MapRenderer.ts:152-155`:

```ts
minZoom: 0,
// Techo de detalle: el zoom donde el mapa llena el ancho REAL del contenedor.
// Si hay tiles, no superar su maxZoom (los tiles no se generan más allá).
maxZoom: Math.max(
  Math.floor(config.initialZoom),
  Math.min(screenCeilingZoom(geo, container.clientWidth), entry.tiles?.maxZoom ?? Infinity),
),
```

- `container` ya está disponible en el scope de la función de build (es el elemento del mapa).
- `Math.floor(config.initialZoom)` como piso: nunca dejar que el mapa no pueda al menos mostrar su zoom inicial.
- Si `entry.tiles` no existe (mapa sin tiles), el tope es el techo de pantalla real (`Infinity` se ignora).
- `minZoom: 0` permite alejarse libremente en modo dev (constrain off); con `useTransformConstrain: true` el constrain clampea por frame (comportamiento ya probado).

- [ ] **Step 2: Verificar**

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git add src/services/MapRenderer.ts
git commit -m "feat(tiles): MapRenderer con minZoom 0 y maxZoom derivado del techo de pantalla real"
```

---

## Task 6: Reescribir `scripts/generate-tiles.mjs`

**Files:**
- Modify: `scripts/generate-tiles.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: los content modules `src/content/*/index.ts` (import directo con tsx), `processBounds`/`computeTileRange` (replicados o importados), `MAP_TILE_MODES` y `tileUrlTemplate` de `src/data/tiles.ts`.
- Produces: tiles WebP en `public/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp`.

- [ ] **Step 1: Cambiar el script de npm a tsx**

En `package.json:10`: `"tiles": "node --experimental-strip-types scripts/generate-tiles.mjs"` → `"tiles": "tsx --tsconfig tsconfig.app.json scripts/generate-tiles.mjs"`.

> **Hallazgo verificado (2026-08-17):** `tsx` ejecuta `.mjs` que importa `.ts`, pero **NO resuelve los aliases `@` (p.ej. `@data/tiles`, `@utils/tileZoom`) sin `--tsconfig tsconfig.app.json`** (tsconfig root es solo references). Sin el flag falla con `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 2: Reescribir el generador**

Conservar la estructura actual (gdal_translate → gdalwarp → recorte de tiles XYZ con QUALITY=95) pero con estos cambios:

1. **Walk de content**: en vez de `import { MAP_GEO } from '../src/data/maps/geo.ts'`, enumerar módulos con `readdirSync` en dos niveles (replicando `src/content/index.ts`):
   - `src/content/*/index.ts` (intro suelto)
   - `src/content/*/*/index.ts` (capítulos)
   - Filtrar módulos cuyo `default.mapId` exista en `MAP_TILE_MODES` (excluye theme/calibration).
   - Usar `await import(pathToFileURL(absPath))` — en Windows usar `pathToFileURL` para rutas absolutas.

2. **Rango de zooms**: usar `computeTileRange` replicado inline (o importado de `src/data/tiles.ts` vía tsx) con `(geo, initialZoom, mode, 1920, 1080, initialBearing)` — NO leer `MAP_TILES` hardcodeado.

3. **Origen de imagen**: `images.full` puede ser URL Cloudinary o ruta local `/assets/...`. Si empieza con `/assets/`, leer de `public/` (join con ROOT). Si termina en `.avif`, convertir primero con ffmpeg a `.webp`:
   ```
   ffmpeg -y -i <src.avif> <tmp/source.webp>
   ```
   (AVIF → WebP evita el driver faltante de GDAL. intro + chapter1-bredunco comparten el mismo AVIF.)

4. **`GDAL_PAM_ENABLED=NO`**: añadir `GDAL_PAM_ENABLED: 'NO'` al env de `gdal()` para no escribir sidecars `.aux.xml`.

5. **Limpiar zooms huérfanos**: antes de generar un mapa, listar las subcarpetas `{z}` existentes en `outDir` y borrar las que estén fuera de `[zFrom..zTo]` (ej. ecosistemas actual tiene z6-12 → quedará z8-10; se eliminan z6, z7, z11, z12).

6. **Conteo**: imprimir total por mapa y global al final (útil para verificar ~3.538).

- [ ] **Step 3: Regenerar tiles + verificar conteo**

```powershell
pnpm --config.verify-deps-before-run=false tiles
```

> **Hallazgo de entorno (2026-08-17):** el `pnpm-workspace.yaml` untracked del usuario tiene sintaxis rota (`allowBuilds: esbuild: set this to true or false`), lo que hace fallar el auto-verify de deps de pnpm 10 en TODOS los comandos. Workaround sin tocar el archivo: `--config.verify-deps-before-run=false`. (Pendiente de arreglar por el usuario.)

Expected: 31 mapas procesados; total ≈ **3.538 tiles** (el conteo exacto puede variar ±unos tiles por el grid). Sin `.aux.xml`. Sin carpetas `z*` huérfanas. `gdalinfo` opcional sobre 2-3 tiles para confirmar dimensiones 256×256.

> **Verificado (2026-08-17):** total real **3.538 tiles** en disco (coincide con bitácora v2), 0 `.aux.xml`, tiles 256×256, todos los rangos de zoom por mapa coinciden con la bitácora. Tamaño en disco **~51.9 MB** (vs ~41 MB estimados — la diferencia es el peso real de WebP; anotar en bitácora).

- [ ] **Step 4: Verificar runtime + commit**

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
git add scripts/generate-tiles.mjs package.json
git commit -m "feat(tiles): reescribir generador con techo de pantalla, soporte local/AVIF, sin aux.xml y limpieza de zooms"
```

---

## Task 7: Verificación completa + navegador

- [ ] **Step 1: `pnpm typecheck`** — PASS
- [ ] **Step 2: `pnpm lint`** — sin errores nuevos
- [ ] **Step 3: `pnpm test`** — todos PASS
- [ ] **Step 4: `pnpm build`** — PASS
- [ ] **Step 5: Contar tiles reales por mapa**

```powershell
(Get-ChildItem -Recurse -File public/assets/maps/tiles/mapas -Filter *.webp | Measure-Object).Count
(Get-ChildItem -Recurse -File public/assets/maps/tiles/mapas -Filter *.aux.xml | Measure-Object).Count  # esperado 0
```

Expected: ~3.538 tiles; 0 `.aux.xml`.

- [ ] **Step 6: Navegador** (`pnpm dev`)

- Cargar un mapa con detalle (ej. `chapter1-ecosistemas`): al acercar, los tiles nítidos llegan hasta z10 y el zoom se detiene (techo). Sin 404 de tiles por encima del techo.
- Cargar un mapa initial-only (ej. `chapter4-asoyoge`): un solo nivel de tiles, sin zoom por debajo que pida tiles inexistentes.
- Verificar sin `minZoom` de config: alejarse en modo dev (constrain off) no rompe el mapa (se ve la imagen base).
- Revisar consola: sin errores de red en `/assets/maps/tiles/mapas/`.

- [ ] **Step 7: Commit final + bitácora**

```bash
git add -A
git commit -m "chore(tiles): verificación final y cierre de tiles con techo de pantalla"
```

Actualizar `docs/BITACORA.md`: nota de cierre de la entrada 2026-08-17 con el total real de tiles generados y el resultado de la verificación en navegador.

---

## Notas de riesgo y trabajo pendiente

- **`import.meta.glob` no funciona en Node**: el generador no puede importar `src/content/index.ts`; por eso el walk manual con `readdirSync` (replicando el mismo criterio de dos niveles).
- **Rendimiento GDAL**: ~3.538 tiles con `gdal_translate` por tile es lento (cada llamada es un proceso). El piloto ecosistemas (2417 tiles) ya se generó así; aceptable. Si fuera muy lento, optimizar con `-outsize` + `-projwin` por lotes, pero no es requisito de este plan.
- **Calibraciones (`MAP_CALIBRATIONS`)**: hoy `{}`; el generador lee el módulo crudo. Si en el futuro un mapa calibrado cambia su geo, los tiles deben regenerarse (se documenta, no se automatiza).
- **`chapter1-bredunco` y `chapter1-encuadres`**: tienen cambios WIP del usuario sin commitear. **Decisión confirmada (2026-08-17):** bredunco usa el **techo derivado z9** (el `maxZoom: 7` del WIP se descarta; la fórmula manda, sin override). `encuadres` conserva su geo recalibrado e imágenes locales.
- **`pnpm-workspace.yaml` untracked**: no se toca. Se revisa si los commits accidentales lo incluyen (evitar `git add -A` con el archivo presente en Task 7; usar `git add docs/BITACORA.md` explícito si es necesario).
- **mapIds**: el `MAP_TILE_MODES` usa los mapIds reales de `getAllMaps()` (con prefijo `chapterN-`, p.ej. `chapter3-introduccion`, no `cap3-introduccion`). Verificado contra `chapters.ts`.
- El spec commiteado se corrige en Task 1 (512→256-round + bearing); la bitácora ya refleja la v2.