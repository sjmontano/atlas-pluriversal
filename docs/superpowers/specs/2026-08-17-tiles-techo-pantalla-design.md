# Diseño: Generación de tiles XYZ con techo de pantalla (A+C híbrido)

> Fecha: 2026-08-17
> Estado: Aprobado (diseño) — pendiente de plan de implementación
> Contexto: El generador actual (`scripts/generate-tiles.mjs`) está roto desde la
> migración de `src/data/maps/*` → `src/content/*` (commit `f1a743c`). Solo
> `chapter1-ecosistemas` tiene tiles generados (2.417 tiles, ~29 MB).

## Problema

- `scripts/generate-tiles.mjs` importa de `src/data/maps/{geo,images,configs,tiles}.ts`,
  módulos que ya no existen (`ERR_MODULE_NOT_FOUND`). El dato vive ahora inline en
  cada `src/content/*/index.ts`.
- Solo 1 de 32 mapas tiene tiles. El resto renderiza la imagen base estirada.
- Respetar `config.maxZoom` actual generaría **20.313 tiles inútiles (~238 MB)**
  porque esos zooms exceden lo que una pantalla percibe (app pesada + consumo de red
  alto en PCs de bajos recursos y conectividad rural pobre).

## Decisiones de diseño (acordadas)

1. **Techo de detalle = pantalla.** Los tiles se generan solo hasta el zoom donde el
   mapa llena el ancho de pantalla (referencia 1920 px). Más allá no hay detalle
   perceptible → no se generan.
2. **Mapas con detalle:** capítulos 1–3 + `chapter4-problematicas` +
   `chapter4-bosque-comestible`. Tiles hasta su techo de pantalla.
3. **Mapas solo zoom inicial:** las 8 fincas del cap 4 (asoyoge, centro-agropecuario,
   el-buhido, el-paso, la-caicedo, la-virginia, las-mercedes, los-bajios) +
   `chapter1-encuadres` + `intro`. Solo tiles del zoom inicial (~1–36 tiles cada uno).
4. **`minZoom` eliminado de config.** Lo suple `useTransformConstrain` por frame
   (`TransformConstrain.ts:54-63`). Con constrain off (modo dev) `minZoom: 0` permite
   alejarse libremente.
5. **`maxZoom` siempre derivado de la función de techo** (no override por mapa). Los
   tiles se generan hasta ese mismo valor → fuente única, sin desincronización.
6. **Enfoque A+C híbrido:** config central de modos (A) + función compartida de
   cálculo (C).

## Arquitectura

```
src/utils/tileZoom.ts        ← utilidad compartida (C): cálculo del techo de pantalla
src/data/tiles.ts            ← config central (A): modos por mapa + fábrica de tiles config
scripts/generate-tiles.mjs   ← actualizado: lee contenido desde src/content/*
```

### 1. `src/utils/tileZoom.ts` — utilidad compartida

Funciones puras sin dependencias de framework:

- `screenCeilingZoom(geo, canvasW)` → `number`
  `round(log2(canvasW · 360 / (256 · lonSpan)))` donde `lonSpan` es el ancho geográfico
  del footprint (del `processBounds`). Es el zoom donde el mapa llena el ancho de
  pantalla; más allá no hay detalle perceptible.
  > **Ajuste verificado (2026-08-17, bitácora v2):** la fórmula usa `round`/`256`
  > (mejor ajuste 13/21 contra la tabla aprobada). La variante `floor`/`512` del
  > borrador NO calza con los ejemplos del propio spec (m-suarez z12, bredunco z9,
  > cali z15 solo calzan con 256-round).
- `constrainMinZoom(geo, canvasW, canvasH, bearing)` → `number`
  Mismo cálculo que el constrain (bearing-aware, quarter-turn intercambia W↔lat /
  H↔lon): el zoom mínimo donde el viewport cabe en el bound. (Solo para
  validación/consistencia, no obligatorio en runtime.)
  > **Ajuste verificado (2026-08-17, bitácora v2):** el bearing ES necesario — en
  > 26/31 mapas la orientación cambia el `floor` del minZoom en 1 con referencia
  > 1920×1080. Se recibe `config.initialBearing`.
- `computeTileRange(geo, initialZoom, mode, canvasW)` → `{ minZoom, maxZoom }`
  Recibe `geo` y `initialZoom` (de `config`, que sí permanece en el contenido).
  - `mode: 'detail'` → `minZoom = floor(constrainMinZoom)`, `maxZoom = screenCeilingZoom`.
  - `mode: 'initial-only'` → `minZoom = maxZoom = floor(initialZoom)`.
  - `mode: 'none'` → `null` (sin tiles). Reservado para futuros mapas; hoy todos los
    mapas caen en `detail` o `initial-only`.

Usada por: **MapRenderer** (con `canvas.clientWidth` real), **generate-tiles.mjs**
(con `1920` como referencia de pantalla) y validación del constrain.

### 2. `src/data/tiles.ts` — config central

- `MAP_TILE_MODES: Record<string, 'detail' | 'initial-only'>`
  Declara el modo por mapa (fuente de verdad de qué mapa tiene detalle).
- `tileUrlTemplate(mapId)` → `'/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp'`
- `makeTilesConfig(mapId, geo, initialZoom, initialBearing)` → `MapTilesConfig | null`
  Arma el objeto completo: `urlTemplate`, `tileSize: 256`, `fadeDuration: 300`, y
  `minZoom`/`maxZoom` derivados de `computeTileRange`. Devuelve `null` para
  `mode: 'none'`.

### 3. Cambios en contenido (`src/content/*/index.ts`)

- **Eliminar** `minZoom` y `maxZoom` de `config` en todos los mapas (derivados ahora).
- **Agregar** `tiles: makeTilesConfig('<mapId>', geo)` en cada mapa con tiles.
- **Tipo `MapConfig`** (`src/types/content.ts`): eliminar `minZoom` y `maxZoom`.
  `initialZoom`, `initialBearing`, `useTransformConstrain`, `viewportMaxBounds`,
  `dragPan`, `scrollZoom` permanecen.

### 4. Cambios en runtime

- `MapRenderer.ts:152` → `minZoom: 0` (el constrain lo clampea por frame).
- `MapRenderer.ts:155` → `maxZoom: screenCeilingZoom(geo, canvas.clientWidth)`.
  Reemplaza el `Math.max(config.maxZoom, entry.tiles?.maxZoom ?? config.maxZoom)`.
- `useTilePrefetch` y `TilePrefetcher` sin cambios: siguen leyendo `entry.tiles`
  (los rangos ya vienen derivados en la config).
- `addTilesLayer` sin cambios: ya consume `entry.tiles` con `minzoom`/`maxzoom`.

### 5. `scripts/generate-tiles.mjs` actualizado

- Importa cada módulo `src/content/*/index.ts` (vía `getAllMaps()` de chapters +
  import directo de módulos; los imports tipo `@services` se eliminan en strip-types).
- Obtiene `geo`, `images`, `config` del módulo (no de `src/data/maps/*`).
- Usa `computeTileRange(geo, mode, 1920)` en vez de `MAP_TILES` hardcodeado.
- **Soporta imágenes locales**: si `images.full` es ruta local (`/assets/...`), lee de
  `public/` en vez de `fetch()`.
- Igual que hoy: salida `public/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp`,
  no versionar en git (`.gitignore` ya lo cubre).

## Resultado esperado

- Total estimado: **~3.538 tiles (~41 MB)** vs 20.313 (~238 MB) del enfoque actual.
- Ejemplos (techo de pantalla):
  - `m-suarez`: z12 (79 tiles) vs z16 actual (14.458).
  - `bredunco`: z9 (~220) vs z9.5 config (1.082).
  - `cali`: z15 (~112) vs z16 config (601).
  - Fincas / encuadres / intro: 1–36 tiles c/u (solo zoom inicial).
- El usuario nunca supera el zoom de detalle real: al acercarse el mapa se detiene en
  el techo (maxZoom derivado).

## Fuera de alcance

- Tiles de capas temáticas (`capas/...`).
- Generación de tiles para `mapas no detalle` más allá del zoom inicial.
- Cambios de UX de zoom más allá de la derivación de `minZoom`/`maxZoom`.