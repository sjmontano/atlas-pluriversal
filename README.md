# Un Río Cauca, Muchos Mundos — Atlas Pluriversal

Cartografía digital viva del Valle Alto del Río Cauca: 4 capítulos, 31 mapas y las voces de un territorio que se cuenta desde el agua. Memorias georreferenciadas que entrelazan saberes comunitarios, dinámicas socioambientales y datos espaciales.

## Stack

| Capa | Tecnología |
|------|-----------|
| Motor de mapas | [MapLibre GL JS](https://maplibre.org) 6.x — bearing −90, `setTransformConstrain` |
| Frontend | React 19 + TypeScript strict + Vite |
| Estado | Zustand 5 |
| Routing | React Router 7 |
| Animaciones | Framer Motion |
| Tests | Vitest + jsdom + @testing-library |
| Linter | oxlint |

## Georreferenciación

Los 31 mapas están calibrados con **world files (PGW) en formato rotado original** (A=0, E=0, B≠0, D≠0). La rotación la maneja MapLibre nativamente con `bearing: −90`, sin conversión de coordenadas en runtime ni rotación física de imágenes. El clamping del viewport usa `setTransformConstrain` (bearing-aware), nunca `setMaxBounds`.

- PGW data: módulos de contenido en `src/content/chapter-*/<mapa>/index.ts` (fuente de verdad por mapa), con overrides de calibración en `src/content/calibration/map.ts` y `src/content/calibration/layers.ts`
- Cálculo de bounds: `src/services/BoundsCalculator.ts` — fórmula afín con half-pixel correction
- Constrain: `src/services/TransformConstrain.ts` — minZoom bearing-aware + clamp de centro
- Renderer: `src/services/MapRenderer.ts` — ImageSource + pipeline georreferenciado

## Estructura

```
src/
├── content/       módulos de contenido por mapa (geo, imágenes, tiles, capas, POIs, config)
├── data/          jerarquía de capítulos (chapters) y config de tiles
├── services/      BoundsCalculator, MapRenderer, TransformConstrain, BasemapManager, LayerManager, PoiManager
├── stores/        mapStore, chapterStore, layerStore, uiStore, connectionStore
├── hooks/         useMap.ts, useTilePrefetch, usePrefetchAdjacent, useAutoLowPower
├── components/    map/ (AtlasMap, LayerMenu, MapControls, PoiModal, OfflineBanner), calibration/ (CalibrationPanel)
└── pages/         DevMenu, TestMapPage
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (Vite) |
| `pnpm build` | TypeScript + build de producción |
| `pnpm preview` | Previsualizar build |
| `pnpm lint` | Lint con oxlint |
| `pnpm test` | Tests con Vitest |
| `pnpm test:watch` | Tests en modo watch |
| `pnpm typecheck` | Verificar tipos TypeScript |

## Licencia

El código fuente está bajo licencia MIT. El contenido académico y artístico (mapas, textos, ilustraciones, audio, íconos) pertenece a sus autores y al equipo del Atlas Pluriversal — su uso requiere autorización.
