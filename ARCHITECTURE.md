# Atlas Pluriversal — Arquitectura Técnica

## Stack
React 19 · TypeScript (strict) · Vite 8 · MapLibre GL 6 · Zustand 5 · React Router 7

---

## 1. Estructura del proyecto

```
atlas/
├── public/assets/           # Estáticos (SVGs, WebP, tiles, geojson)
│   ├── geojson/             # 20 archivos .json (subcuencas, ríos, nodos)
│   ├── legends/             # 50 SVGs de leyenda de mapas
│   ├── maps/                # Imágenes de mapas + tiles + previews + capas
│   │   ├── cap{1-4}/        # PNGs fuente de cada mapa
│   │   ├── capas/           # Overlay PNGs por tema (ecosistemas, mosaicos, etc.)
│   │   ├── previews/        # Thumbnails WebP de navegación
│   │   └── tiles/           # 15,408 archivos .webp (pirámide XYZ)
│   ├── modal/inicio/        # Íconos del modal (fondo, línea, salir, presentación)
│   ├── pois/                # Photos de organizaciones/fincas + markers
│   └── ui/                  # Íconos de UI (sidebar, header, tooltips, minimaps, etc.)
├── src/
│   ├── components/          # Componentes React
│   │   ├── modal/           # Sistema de modales
│   │   │   ├── shell/       # ModalShell, ModalRenderer, Scrollbar, ScrollIndicators
│   │   │   ├── layouts/     # BlockRenderer, InicioLayout, blocks.module.css
│   │   │   └── primitives/  # Glyph, IconButton
│   │   ├── shell/           # Layout principal del mapa
│   │   │   ├── ShellLayout.tsx
│   │   │   ├── ToolRail.tsx (sidebar izquierdo)
│   │   │   ├── ChapterTabs.tsx (tabs inferiores)
│   │   │   ├── MiniMap.tsx (minimapa superior derecho)
│   │   │   ├── SectionHeader.tsx (título + flecha regreso)
│   │   │   └── assets.ts (rutas de minimaps, íconos)
│   │   ├── inicio/          # HomePanel (página de inicio)
│   │   └── map/             # AtlasMap (contenedor MapLibre)
│   ├── content/             # 📦 Contenido estático (el corazón del atlas)
│   │   ├── index.ts         # Registry global — import.meta.glob de todos los map.ts
│   │   ├── intro/           # Mapa intro + modals
│   │   ├── inicio/          # POIs del home + markers
│   │   ├── chapter-{1-4}/   # Contenido por capítulo
│   │   ├── modals/          # Registro de modales (index.ts + por sección)
│   │   ├── calibration/     # Calibración PGW de mapas
│   │   └── theme/           # Temas: poi, layers, swatches
│   ├── data/                # Datos derivados
│   │   ├── chapters.ts      # Definición de capítulos + sus mapas
│   │   └── tiles.ts         # Configuración de tiles por mapa
│   ├── services/            # Lógica de negocio
│   │   ├── MapRenderer.ts   # Motor de renderizado de mapas
│   │   ├── LayerManager.ts  # Gestión de capas overlay
│   │   ├── PoiManager.ts    # Gestión de POIs con animaciones
│   │   ├── EncuadresManager.ts # Marcos navegables entre mapas
│   │   ├── BasemapManager.ts   # Basemap calle/satélite
│   │   └── BoundsCalculator.ts # PGW → coordenadas geográficas
│   ├── stores/              # Estado global (Zustand)
│   ├── hooks/               # Hooks (useMap, useAutoLowPower, etc.)
│   ├── types/               # Definiciones TypeScript
│   └── pages/               # Páginas de ruta
└── scripts/                 # Build tooling (generate-tiles, fetch-geojson)
```

---

## 2. Sistema de mapas

### 2.1 Flujo de datos

```
src/content/<chapter>/<map-name>/map.ts
    ↓ (import.meta.glob en content/index.ts)
Map<string, MapContent>  — registry global
    ↓ getMapContent(mapId)
MapContent + calibración PGW
    ↓ resolveMapUI(map)
UI props (título, sidebar, minimapa)
    ↓
ChapterPage → ShellLayout + AtlasMap
```

### 2.2 Estructura de un mapa (`map.ts`)

Cada mapa exporta un `MapContent`:

```typescript
{
  mapId: string                    // ID único (ej: 'chapter2-suarez')
  ui?: MapUI                       // Título, sidebar, minimapa, indicador norte
  geo: MapGeoEntry                 // PGW [A,D,B,E,C,F] + width/height
  images: MapImageUrls             // URL de imagen base/full/placeholder
  config: MapConfig                // bearing, dragPan, scrollZoom, zoomMax
  tiles?: MapTilesConfig | null    // Config de tiles XYZ
  layers?: Layer[]                 // Capas overlay
  groups?: LayerGroup[]            // Agrupación de capas para el menú
  legends?: LegendItem[]           // Items de leyenda
  pois?: Poi[]                     // Puntos de interés
  encuadres?: Encuadre[]           // Marcos navegables
}
```

### 2.3 Georeferenciación (PGW)

Cada mapa tiene un archivo **PGW (World File)** con 6 valores `[A, D, B, E, C, F]` que definen la transformación afín de píxeles a coordenadas geográficas. `BoundsCalculator` convierte esto a bounds/center para MapLibre.

### 2.4 Sistema de tiles

- **Tiles estándar**: 512px por tile, para conexiones lentas
- **Tiles HD**: 1024px (niveles bajos) + 512px (niveles altos)
- **Configuración**: `src/data/tiles.ts` define `TileZoomMode` por mapa:
  - `'initial-only'` — nivel único (fincas cap-4)
  - `'initial-cover'` — nivel único cubriendo viewport
  - `'detail'` — pirámide completa con zoom progresivo
- **Fuentes locales**: PNGs en `public/assets/maps/cap{1-4}/` como fuente offline

### 2.5 Capas overlay (`layers.ts`)

Tres tipos de capa:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `raster-pgw` | Imagen + PGW (georreferenciada) | Ecosistemas compuestos |
| `raster-tiles` | Tiles XYZ overlay | Capas temáticas |
| `geojson` | Datos GeoJSON con paint | Subcuencas, ríos, límites |

Las capas se agrupan en `groups.ts` para el menú de capas (`LayerMenu`).

### 2.6 Encuadres

Los encuadres son polígonos clickeables que navegan entre mapas. Se definen en `encuadres` de cada `map.ts` y se renderizan con `EncuadresManager`.

---

## 3. Sistema de modales

### 3.1 Flujo

```
content/modals/*.ts          → Definición de modales (Modal[])
content/modals/index.ts      → MODALS: Record<string, Modal>
    ↓ getModalById(id)
    ↓ modalStore.openModal(modal)
    ↓
ModalRenderer                → React to activeModal
    ↓
ModalShell                   → Portal, overlay, header, scroll, a11y
    ↓
BlockRenderer                → Renderiza bloques: paragraph, heading, carousel, columns, etc.
```

### 3.2 Estructura de un modal

```typescript
{
  id: string                   // ID único
  section: string              // 'intro' | 'inicio' | 'capitulo-1' | etc.
  variant: ModalVariant        // 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'full'
  title: string
  highlight?: string           // Texto destacado debajo del título
  icon: string                 // Glyph del header
  iconImage?: string           // Imagen del header (reemplaza glyph)
  fullImage?: boolean          // Fondo full-bleed + scrim
  theme?: ModalTheme           // Variables CSS (colores, tamaños)
  body: ModalBlock[]           // Bloques de contenido
  showScrollIndicators?: boolean
  trigger: ModalTrigger        // Cómo se abre (botón, marker, poi)
}
```

### 3.3 Bloques de contenido (`ModalBlock`)

| Tipo | Descripción |
|------|-------------|
| `paragraph` | Párrafo con `white-space: pre-line` |
| `heading` | Título de sección |
| `list` | Lista con viñetas |
| `quote` | Cita con borde lateral azul |
| `image` | Imagen con caption |
| `carousel` | Carrusel de imágenes con auto-play, dots, flechas |
| `columns` | Dos columnas (60/40 por defecto) |
| `meta` | Ficha técnica (tabla) |
| `link` | Botón enlazado (bordered button estilo v17) |

### 3.4 Tema del modal (`ModalTheme`)

Variables CSS inyectables por modal desde `content/modals.ts`:

```typescript
{
  titleColor, textColor, bgColor,
  size, bodyMaxWidth,
  iconSize, fontSize, lineHeight,
  blockSpacing, columnGap
}
```

---

## 4. Sistema de POIs

### 4.1 Flujo

```
content/<chapter>/<map>/pois.ts  → POIS: Poi[]
    ↓
AtlasMap → PoiManager.addPois()
    ↓
Capas MapLibre: pulse + circle + number/icon/arrow
    ↓ Click
Si poi.modalId → abre modal del sistema
Si no → abre PoiModal (popup ligero)
```

### 4.2 Variantes de POI

| Variante | Descripción |
|----------|-------------|
| `number` | Círculo con número |
| `icon` | Icono gota (marcador personalizado) |
| `arrow` | Flecha direccional con color personalizado |

### 4.3 Animación

- **Pulse**: círculo que pulsa (2200ms, scale 1.9, opacity 0.55)
- **Escala por zoom**: 80% en minZoom, 100% en maxZoom
- **Tooltip**: HTML personalizado en hover

---

## 5. UI Shell (Layout principal)

### 5.1 Composición

```
ShellLayout
├── SectionHeader      ← Título + flecha regreso (top-left)
├── ToolRail           ← Sidebar de íconos (left)
├── MiniMap            ← Minimapa circulante (top-right)
├── NorthIndicator     ← Brújula
├── HomeNav            ← Botones home/río
├── ChapterTabs        ← Tabs de capítulo I-IV (bottom)
└── children           ← AtlasMap (el mapa)
```

### 5.2 Construcción del sidebar

1. Cada `map.ts` define `ui.sidebar` con `MapUISidebarItem[]`
2. `buildRailFromSidebar()` convierte esto en `ToolRailItem[]`
3. Cada item tiene una `RailAction`: `modal` | `goto` | `link`

### 5.3 Páginas de ruta

| Ruta | Página |
|------|--------|
| `/` | InicioPage (home con 16 POIs) |
| `/intro` | IntroMapPage |
| `/capitulo/:n` | ChapterEntry (redirige al primer mapa) |
| `/capitulo/:n/:mapId` | ChapterPage (visor de mapa + shell) |

---

## 6. Estado global (Zustand)

| Store | Propósito |
|-------|-----------|
| `mapStore` | Mapa activo, estado de carga, tiles |
| `chapterStore` | Capítulo activo, territorio activo |
| `layerStore` | Capas visibles, opacidades (persiste en localStorage) |
| `modalStore` | Modal activo |
| `mapUIStore` | Basemap, opacidad de imagen, perfil de tiles, modo bajo consumo |
| `connectionStore` | Online/offline, tipo de conexión, perfil de tiles |

---

## 7. Pipeline de carga de tiles

```
useMap(mapId)
  → getMapContent(mapId)
  → buildGeoreferencedMap()
     → PGW → bounds → MapLibre (blank style)
     → addSource('atlas-base-image') → placeholder (carga instantánea)
     → addTilesLayer() → XYZ raster source
        → ensureTilesSource() → perfil standard o HD
        → attachTileTelemetry() → monitoreo, 15s timeout → modo degraded
  → setTileProfile() → hot swap entre standard/HD
```

---

## 8. Servicios clave

| Servicio | Archivo | Función |
|----------|---------|---------|
| MapRenderer | `services/MapRenderer.ts` | Construye mapas georreferenciados |
| LayerManager | `services/LayerManager.ts` | Add/remove/sync capas overlay |
| PoiManager | `services/PoiManager.ts` | POIs con animaciones pulsantes |
| EncuadresManager | `services/EncuadresManager.ts` | Marcos navegables |
| BasemapManager | `services/BasemapManager.ts` | Toggle calle/satélite |
| BoundsCalculator | `services/BoundsCalculator.ts` | PGW → coordenadas |
