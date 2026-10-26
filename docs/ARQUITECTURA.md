# Arquitectura — Atlas Pluriversal

> **Corte:** 2026-10-19 · **Rama:** `main` (`bcaf692`)
> **Alcance:** aplicación actual en `atlas-pluriversal-main/`.
> Las etapas previas (Leaflet, `atlas_3.0`, `v17`) se describen en
> [CRONOLOGIA_VERSIONES.md](CRONOLOGIA_VERSIONES.md).

---

## 1. Resumen ejecutivo

El Atlas es una **aplicación estática de una sola página** construida con React 19 y
TypeScript estricto. MapLibre GL 6 dibuja un canvas WebGL; Zustand 5 mantiene el estado;
React Router 7 resuelve la navegación. No hay backend en runtime: los datos, las imágenes y
los tiles se sirven como archivos estáticos.

La particularidad del sistema es la **georreferenciación sin rotar imágenes**. Cada mapa tiene
un *world file* (PGW) rotado, con `A=0`, `E=0`, `B≠0`, `D≠0`. MapLibre recibe `bearing: -90` y
muestra la imagen derecha. El *clamping* del viewport se hace con `setTransformConstrain`
(bearing-aware), no con `setMaxBounds`.

La segunda particularidad es la **entrega progresiva**: placeholder de baja resolución →
imagen media → tiles XYZ de alta resolución, con perfiles standard/HD, caché adaptativo y
modo degradado para conectividad lenta.

---

## 2. Stack

| Capa | Tecnología | Versión |
|---|---|---|
| UI | React | 19.2.7 |
| Lenguaje | TypeScript (strict) | ~6.0 |
| Build | Vite | 8 |
| Motor de mapas | MapLibre GL JS | 6.0.0 |
| Estado | Zustand | 5.0.14 |
| Rutas | React Router DOM | 7.18.1 |
| Animación | Framer Motion | 12.42.2 |
| Tests | Vitest + jsdom + Testing Library | 4 |
| Lint | oxlint | — |
| Estilos | CSS Modules + variables CSS | — |

Dependencias de runtime deliberadamente pocas. No hay librería de mapas alterna, ni Turf,
ni GDAL en runtime.

---

## 3. Estructura del repositorio

```
atlas-pluriversal-main/
├── public/
│   ├── assets/
│   │   ├── geojson/          # subcuencas, ríos, nodos
│   │   ├── legends/          # SVGs de leyenda
│   │   ├── maps/             # PNG fuente, capas, previews y tiles
│   │   │   ├── cap{1-4}/
│   │   │   ├── capas/
│   │   │   ├── previews/
│   │   │   └── tiles/        # pirámide XYZ .webp
│   │   ├── modal/
│   │   ├── pois/
│   │   └── ui/
│   ├── vendor/maplibre/      # worker vendorizado de MapLibre v6
│   └── sw.js                 # Service Worker de tiles
├── scripts/
│   ├── generate-tiles.mjs    # generador de pirámide XYZ
│   └── ...                   # utilidades de assets/geojson
├── src/
│   ├── App.tsx               # router
│   ├── main.tsx              # entry, worker, SW, handlers globales
│   ├── config.ts             # constantes de runtime
│   ├── components/
│   │   ├── map/              # AtlasMap, LayerMenu, MapControls, PoiModal, OfflineBanner
│   │   ├── modal/            # shell, layouts, primitives
│   │   ├── shell/            # ShellLayout, ToolRail, ChapterTabs, MiniMap, SectionHeader
│   │   ├── inicio/           # HomePanel
│   │   ├── dev/              # panel de calibración y overlays
│   │   └── ui/               # Tooltip y primitivas
│   ├── content/
│   │   ├── index.ts          # registry global (import.meta.glob)
│   │   ├── chapter-1..4/     # un módulo por mapa: index.ts + datos
│   │   ├── calibration/      # overrides de PGW de mapas y capas
│   │   ├── modals/           # definición y registro de modales
│   │   ├── theme/            # temas de POI, capas y swatches
│   │   ├── inicio/           # POI del home
│   │   └── intro/            # mapa de introducción
│   ├── data/
│   │   ├── chapters/         # CHAPTERS: 4 capítulos y sus mapas
│   │   └── tiles.ts          # MAP_TILE_MODES y configuración de tiles
│   ├── hooks/                # useMap, useTilePrefetch, usePrefetchAdjacent, useAutoLowPower
│   ├── pages/                # Inicio, Intro, Chapter, Entramados, Credits, DevMenu, test
│   ├── services/             # lógica pura: bounds, render, capas, POI, tiles, calibración
│   ├── stores/               # Zustand: map, chapter, layers, modals, UI, conexión
│   ├── styles/               # globals.css, tokens.css
│   ├── types/                # chapter, content, layer, modal, poi, theme
│   └── utils/                # tileZoom, textureLimit, baseZoom, cn
├── tests/
├── docs/
├── ARCHITECTURE.md           # documento previo; ver nota de vigencia
├── DEPLOY.md
└── README.md
```

**Nota de vigencia:** el `ARCHITECTURE.md` de la raíz describe módulos `map.ts` y una
estructura anterior. El código actual usa `src/content/chapter-*/<mapa>/index.ts` y el registry
`src/content/index.ts`. Este documento refleja el código; la divergencia se registra en
[FUENTES_Y_TRAZABILIDAD.md](FUENTES_Y_TRAZABILIDAD.md).

---

## 4. Composición de la aplicación

```
main.tsx
 ├── registra worker de MapLibre (setWorkerUrl)
 ├── registra Service Worker (producción o VITE_ENABLE_SW)
 ├── instala handler de unhandledrejection (AbortError de MapLibre)
 └── monta <App/>

App.tsx (React Router)
 ├── /                     → InicioPage
 ├── /intro                → IntroMapPage
 ├── /capitulo/:n          → redirige al primer mapa del capítulo
 ├── /capitulo/:n/:mapId   → ChapterPage
 ├── /entramados           → EntramadosPage
 ├── /creditos             → CreditsPage
 └── /dev, /test/:mapId    → utilidades de desarrollo
```

`ChapterPage` compone:

```
ShellLayout
 ├── SectionHeader     título y flecha de regreso
 ├── ToolRail         acciones del mapa (modal, goto, link)
 ├── MiniMap           minimapa de contexto
 ├── NorthIndicator    orientación
 ├── HomeNav           home / río
 ├── ChapterTabs       capítulos I–IV
 └── AtlasMap          canvas MapLibre + overlays
```

---

## 5. Modelo de contenido

### 5.1 Capítulos

`src/data/chapters/chapters.ts` define `CHAPTERS`: cuatro capítulos con `id`, `roman`,
`title`, `description`, `territories`, `hoverImage` y `maps[]`. Cada entrada de `maps` tiene
`mapId`, `title` y, opcionalmente, `minimap`.

Funciones: `getChapter(id)`, `getChapterMapIds(id)`, `getAllMaps()`, `routeForMap(mapId)`.

### 5.2 Módulo de mapa

Cada mapa vive en `src/content/chapter-<n>/<mapa>/index.ts`. El registry
`src/content/index.ts` los descubre con `import.meta.glob` y expone `getMapContent(mapId)`.

Forma conceptual:

```ts
{
  mapId: string
  ui?: MapUI                 // título, sidebar, minimapa, indicador norte
  geo: MapGeoEntry           // PGW [A,D,B,E,C,F] + width/height
  images: MapImageUrls       // base, full?, placeholder
  config: MapConfig          // initialBearing, dragPan, scrollZoom, zoomMax?
  tiles?: MapTilesConfig     // perfil y rango XYZ
  layers?: Layer[]           // overlays raster o GeoJSON
  groups?: LayerGroup[]      // agrupación para LayerMenu
  legends?: LegendItem[]
  pois?: Poi[]
  encuadres?: Encuadre[]     // marcos navegables entre mapas
}
```

`makeMap` y `makeTilesConfig` son fábricas que reducen duplicación y validan la forma.

### 5.3 Flujo de datos

```
content/chapter-*/<mapa>/index.ts
        │ import.meta.glob
        ▼
Map<string, MapContent>  (registry)
        │ getMapContent(mapId)
        ▼
MapContent + calibración PGW
        │ resolveMapUI(map)
        ▼
ChapterPage → ShellLayout + AtlasMap
        │ useMap(mapId)
        ▼
MapRenderer.buildGeoreferencedMap()
```

---

## 6. Georreferenciación

### 6.1 PGW rotado

Un *world file* define la transformación afín de píxel a coordenada:

```
lng = A·col + B·row + C
lat = D·col + E·row + F
```

En el Atlas, el PGW es el **original rotado**: `A=0`, `E=0`, `B≠0`, `D≠0`. La imagen tiene el
norte hacia la derecha. MapLibre la endereza con `bearing: -90`.

No hay conversión de coordenadas en runtime y no se rotan archivos. Esto elimina GDAL del
pipeline y mantiene la alineación con los tiles, que se generan desde la misma imagen.

### 6.2 Bounds

`BoundsCalculator` aplica la transformación afín y una **corrección de medio píxel**:
`C` y `F` son el centro del píxel `(0,0)`, no su esquina.

```
x0 = C − 0.5·A − 0.5·B
y0 = F − 0.5·D − 0.5·E

TL = [x0, y0]
TR = [x0 + A·W, y0 + D·W]
BR = [x0 + A·W + B·H, y0 + D·W + E·H]
BL = [x0 + B·H, y0 + E·H]
```

API: `calculateImageCoordinates`, `calculateGeographicBounds`, `calculateCenter`,
`validateBounds`, `processBounds`.

`processBounds` detecta PGW «retrato» puro (`A≈0`, `E≈0`) y lo normaliza; si el PGW tiene
rotación real (`A≠0`, `E≠0`), usa la transformación general y **no** la deshace. Este detalle
es crítico para `chapter4-problematicas`, que usa −30°.

### 6.3 Constrain bearing-aware

`TransformConstrain` reemplaza a `setMaxBounds`. MapLibre clampea longitud contra el ancho y
latitud contra el alto; con `bearing: ±90°` los ejes visuales se intercambian y esa restricción
es incorrecta.

Pasos:

1. **minZoom**: con `dpp(z) = 360 / (512·2^z)`, el viewport cabe si se cumple el mínimo para
   latitud y longitud según el bearing.
2. **clamp de zoom** antes de calcular `dpp`.
3. **clamp de centro**: se resta el medio extent del viewport al bound. Si el span es menor
   que el viewport, se centra.
4. **guardrail**: lat en `[−89.9, 89.9]`, lng en `[−179.9, 179.9]`.

Se ejecuta antes de cada render. No usa el patrón `move` + `setCenter`, que genera un bucle de
retroalimentación.

### 6.4 Calibración

- `MapCalibration`: `pgwToState`, `stateToPGW`, `shiftOrigin`, `scaleParam`, `resizeDims`,
  `clampCalibration`. Conserva los seis coeficientes, incluidos signos y ceros legítimos.
- `CalibrationPanel` (solo desarrollo): steppers, arrastre, slider de tamaño, lectura viva y
  copia del PGW.
- Persistencia: `SaveCalibration` hace `POST /__calibration/save`; un plugin de Vite
  (`apply: 'serve'`) reescribe la entrada en el archivo de calibración. Solo existe en el
  servidor de desarrollo.
- `TextureLimiter`: limita texturas raster y base a 4096 px para evitar fallos de GPU en
  equipos de gama baja (2026-10-19).

---

## 7. Pipeline de render

### 7.1 Orden de capas

De abajo hacia arriba:

```
1. Basemap            raster tiles (OSM/CARTO/ESRI) o vector Positron
2. Imagen atlas       image source georreferenciada (PGW)
3. Tiles XYZ          raster tiles de alta resolución
4. Capas GeoJSON      ríos, subcuencas, ecosistemas, nodos, conflictos
5. Etiquetas          symbol layers (encuadres, océanos, tramos)
6. POI                pulse + circle + número/icono/flecha
```

El basemap debe quedar **debajo** de la imagen y de los tiles. Un error de ciclo de vida lo
colocaba por encima y ocultaba el mapa (corregido el 2026-09-30).

### 7.2 Construcción

```
useMap(mapId)
 → getMapContent(mapId)
 → buildGeoreferencedMap()
    → PGW → bounds → MapLibre (estilo en blanco)
    → addSource('atlas-base-image') → placeholder inmediato
    → addTilesLayer()
       → ensureTilesSource() → perfil standard o HD
       → attachTileTelemetry() → timeout 15 s → degraded
 → setTileProfile() → swap standard/HD sin reconstruir
```

La imagen `full` se carga después del placeholder y antes de los tiles. El mapa nunca espera
a la resolución máxima para mostrarse.

### 7.3 Carga progresiva

| Etapa | Recurso | Tamaño típico | Objetivo |
|---|---|---|---|
| 1 | Placeholder `w_512,q_25` WebP | ~8 KB | Primera pintura inmediata |
| 2 | Imagen `medium` / `full` | cientos de KB | Legibilidad sin tiles |
| 3 | Tiles XYZ | por nivel | Nitidez al hacer zoom |

El placeholder usa `q_25` en la etapa final; antes se usó `q_30` (~10 KB). La diferencia no
cambia la arquitectura.

### 7.4 Tiles

- Esquema XYZ; `y=0` arriba.
- Tiles estándar de 512 px; perfil HD con 1024 px en niveles bajos y 512 px en altos.
- `MAP_TILE_MODES` define el modo por mapa: `initial-only`, `initial-cover` o `detail`.
- `makeTilesConfig` deriva `minZoom`/`maxZoom` del **techo de pantalla**:
  redondeo a 256 px y cálculo desde el tamaño real de la imagen.
- `config.zoomMax` sigue existiendo como **override manual opcional**; si se omite, manda el
  techo automático del tileset.
- El generador (`scripts/generate-tiles.mjs`) recorre el contenido, usa los GCP de las cuatro
  esquinas reales y las dimensiones reales, y desactiva `GDAL_PAM_ENABLED` para no dejar
  `aux.xml`.
- Tiles con `Cache-Control: immutable` y Service Worker cache-first.

### 7.5 Entrega adaptativa y baja conectividad

`connectionStore` clasifica la conexión (`online`, `offline`, `slow`) y expone el perfil de
tiles. `useAutoLowPower` activa el modo de bajo consumo; `usePrefetchAdjacent` y
`TilePrefetcher` precargan mapas vecinos y niveles z6–z8 en tiempo ocioso.

Comportamiento:

- Caché adaptativo: **110–400 tiles** según memoria y conexión.
- `refreshExpiredTiles: false`: no se revalidan tiles ya descargados.
- Preload de la ruta de mapa a los **1.5 s**.
- Banner offline y banner degradado. El segundo aparece solo en conexión lenta, tras **15 s**
  y si hay peticiones activas (`nRequested > 0`).
- `tilesStatus`: `idle | loading | ready | degraded`.
- `MAX_PARALLEL_IMAGE_REQUESTS`: 4 normal, 2 en bajo consumo.
- En estado degradado se usa una imagen de rescate aunque `useImageBase` sea `false`.
- Modo sin tiles para demos o hosting sin pirámide.

### 7.6 Diagnóstico

Con `?log=trace` se activan:

- `canvas-dimensions`: tamaño real del canvas y del contenedor.
- `style-dump`: fuentes y capas del estilo.
- Telemetría por tile: `tile:request`, `tile:loaded`, `tile:duplicate`, `tile:aborted`.
- Listener de errores de MapLibre.

`MapLogger` separa `debug/info` (solo desarrollo) de `warn/error` (siempre).

---

## 8. Estado global

| Store | Responsabilidad |
|---|---|
| `mapStore` | mapa activo, `mapBuilt`, `loading`, `error`, estado de tiles |
| `chapterStore` | capítulo activo, territorio activo, mapas del capítulo |
| `layerStore` | capas visibles, opacidades, categorías, grupos, calibración; persiste en `localStorage` |
| `modalStore` | modal activo |
| `mapUIStore` | basemap, opacidad de imagen, perfil de tiles, bajo consumo |
| `connectionStore` | online/offline, conexión lenta, perfil recomendado |
| `uiStore` | estado de shell (sidebar, panel activo) |

La orquestación entre stores se hace con `getState()`: por ejemplo, cambiar de capítulo
actualiza el mapa activo y aplica los valores por defecto de capas.

**Decisión de diseño:** separar `modalStore` y `mapUIStore` de `uiStore` (2026-08-31) evita
re-render de componentes que solo dependen de una parte del estado.

---

## 9. Sistema de modales

```
content/modals/*.ts
   → MODALS: Record<string, Modal>
   → getModalById(id)
   → modalStore.openModal(modal)
   → ModalRenderer
   → ModalShell (portal, overlay, header, scroll, a11y)
   → BlockRenderer
```

Variantes de tamaño: `xs`, `small`, `medium`, `large`, `xl`, `full`. `large` absorbe `xxxl`
en la etapa full-bleed.

Bloques: `paragraph`, `heading`, `list`, `quote`, `image`, `carousel`, `columns`, `meta`,
`link`.

Capacidades añadidas en 2026:

- Full-bleed sin header (`perfil-cuenca`, datos y árbol).
- `CarouselFondo` inmersivo.
- `PanViewport` para explorar imágenes con pan en móvil.
- Margen derecho configurable por modal.
- Resaltador por renglón con color tematizable.
- `ModalTheme` inyecta variables CSS por modal: colores, tamaños, `bodyMaxWidth`, `columnGap`,
  `blockSpacing`.
- `meta` opcional en fichas técnicas.
- Scroll en todo el modal, no solo en el cuerpo.

---

## 10. POI y capas

### 10.1 POI

`PoiManager` añade capas MapLibre:

- `pulse`: círculo animado (2200 ms, escala 1.9, opacidad 0.55).
- `circle`: base del marcador.
- `number` / `icon` / `arrow` / `audio`: variante visual.
- Escala por zoom: 80 % en `minZoom`, 100 % en `maxZoom`.
- Tooltip HTML en hover.

Al hacer clic: si el POI tiene `modalId`, abre el modal del sistema; si no, abre `PoiModal`.

### 10.2 Capas

Tres tipos:

| Tipo | Qué es | Ejemplo |
|---|---|---|
| `raster-pgw` | imagen + PGW | composites de ecosistemas |
| `raster-tiles` | tiles XYZ | capas temáticas |
| `geojson` | FeatureCollection con paint | subcuencas, ríos, límites |

`LayerManager` sincroniza alta, baja, visibilidad, opacidad y orden. `LayerMenu` muestra un
árbol anidado por grupos, con ojos de visibilidad y un modo de calibración por capa. Los siete
mosaicos gigantes entran apagados para no cargar el mapa inicial.

Los GeoJSON se cargan como archivos estáticos. Las «gemelas invisibles» de hover amplían el
área de captura de ríos y rellenos sin cambiar su apariencia.

### 10.3 Encuadres

`EncuadresManager` renderiza marcos clickeables que navegan entre mapas. Desde 2026-09-30 las
etiquetas son capas `symbol`, lo que elimina la deriva al hacer zoom. Los tramos del capítulo 3
abren modales full-bleed.

---

## 11. Rendimiento y restricciones de audiencia

El diseño no es «lo último», es «lo que funciona en una sala comunal»:

- PC de gama baja (Celeron/A4), 2–4 GB de RAM, GPU integrada.
- Conexión rural 3G, intermitente.
- Monitor A4 y navegador de escritorio.

Consecuencias arquitectónicas:

1. Nada de WebGL pesado ni shaders propios; MapLibre estándar.
2. Placeholder inmediato y carga por etapas.
3. Tiles con techo de pantalla: no se genera lo que no se ve.
4. Caché agresivo e inmutable.
5. Perfil de tiles conmutable sin reconstruir.
6. Modo de bajo consumo y banners explícitos.
7. Límite de texturas a 4096 px.
8. CSS con cadena de altura explícita (`min-height: 0`) en lugar de `height: 100%`.

---

## 12. Build y despliegue

- `pnpm build` ejecuta `tsc -b && vite build`.
- El sitio se sirve estático. `DEPLOY.md` documenta WordPress y Vercel.
- La base de despliegue puede ser `/atlas/`; los assets se resuelven con esa base.
- Los tiles requieren headers de caché larga. Un hosting que devuelva `index.html` para tiles
  inexistentes rompe la carga; el modo sin tiles evita esa dependencia.
- El Service Worker se registra en producción o con `VITE_ENABLE_SW=true`.

---

## 13. Deudas y límites conocidos

1. **Documentación previa desactualizada.** `ARCHITECTURE.md` (raíz) menciona `map.ts`; el
   código usa `index.ts` por mapa.
2. **Sin tags de versión.** No hay releases formales; la cronología usa etapas documentales.
3. **Cobertura de tests desigual.** Hay tests de bounds, constrain, calibración, tiles y
   regresión de opacidad; no hay suite end-to-end.
4. **Tiles parciales.** No todos los mapas tienen pirámide completa; el fallback de Cloudinary
   cubre ese hueco.
5. **Bitácora original truncada.** `docs/BITACORA.md` termina el 2026-09-06; el tramo
   posterior depende de git.
6. **Contenido pendiente heredado.** Persisten tareas editoriales del prototipo (capas
   truncadas, desfases de cuencas, indicadores de punto de vista).
7. **Ramas divergentes.** `master`, `backup-main-pre-rebase` y
   `origin/feat/modales-y-titulos` no están integradas en `main`.
