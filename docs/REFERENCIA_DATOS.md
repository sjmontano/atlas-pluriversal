# Referencia de datos — Atlas Pluriversal

> **Corte:** 2026-10-19. Diccionario de los datos que consume la aplicación y del inventario
> de mapas. Los tipos canónicos viven en `src/types/`; este documento los explica en lenguaje
> operativo.
>
> Convención: los nombres de campo son exactos; los valores entre `<>` son marcadores.

---

## 1. Inventario de capítulos y mapas

`CHAPTERS` (`src/data/chapters/chapters.ts`) es la fuente de verdad de la navegación.
**30 mapas de contenido + 1 mapa de introducción = 31 mapas.**

### Capítulo I — 6 mapas

| # | `mapId` | Título | Minimapa |
|---|---|---|---|
| 1 | `chapter1-encuadres` | Encuadres Territoriales | `cuenca` (default) |
| 2 | `chapter1-ecosistemas` | Ecosistemas | `valle` |
| 3 | `chapter1-formas-paisaje` | Formas del Paisaje | `cuenca` |
| 4 | `chapter1-bredunco` | Bredunco | `cuenca` |
| 5 | `chapter1-mosaicos-del-agua` | Mosaicos del Agua | `sur` |
| 6 | `chapter1-un-rio-cauca` | Un Río Cauca, Muchos Mundos | `cuenca` |

### Capítulo II — 7 mapas

| # | `mapId` | Título | Minimapa |
|---|---|---|---|
| 1 | `chapter2-valle` | Valle del Cauca | `cuenca` |
| 2 | `chapter2-suarez` | Suárez | `cuenca` |
| 3 | `chapter2-cali` | Oriente de Cali | `cuenca` |
| 4 | `chapter2-villa-rica` | Villa Rica | `cuenca` |
| 5 | `chapter2-m-oriente-cali` | Oriente de Cali (M) | `cuenca` |
| 6 | `chapter2-m-villa-rica` | Villa Rica (M) | `cuenca` |
| 7 | `chapter2-m-suarez` | Suárez (M) | `cuenca` |

Territorios declarados: `valle`, `suarez`, `cali`, `villa-rica`.

### Capítulo III — 6 mapas

| # | `mapId` | Título | Minimapa |
|---|---|---|---|
| 1 | `chapter3-introduccion` | Introducción Capítulo 3 | `cuenca` |
| 2 | `chapter3-monocultivo` | Monocultivo de Caña | `cuenca` |
| 3 | `chapter3-encharcaron` | Nos Encharcaron el Río | `cuenca` |
| 4 | `chapter3-cali-deseca` | Cali se Deseca | `cuenca` |
| 5 | `chapter3-humedales` | Humedales del Cauca | `cuenca` |
| 6 | `chapter3-arcilla` | Arcilla y Territorio | `cuenca` |

### Capítulo IV — 11 mapas

| # | `mapId` | Título | Minimapa |
|---|---|---|---|
| 1 | `chapter4-introduccion` | Introducción Capítulo 4 | `cuenca` |
| 2 | `chapter4-asoyoge` | Asoyoge | `cuenca` |
| 3 | `chapter4-el-buhido` | El Buhído | `cuenca` |
| 4 | `chapter4-bosque-comestible` | Bosque Comestible | `cuenca` |
| 5 | `chapter4-los-bajios` | Los Bajíos | `cuenca` |
| 6 | `chapter4-el-paso` | El Paso | `cuenca` |
| 7 | `chapter4-las-mercedes` | Las Mercedes | `cuenca` |
| 8 | `chapter4-la-virginia` | La Virginia | `cuenca` |
| 9 | `chapter4-centro-agropecuario` | Centro Agropecuario | `cuenca` |
| 10 | `chapter4-la-caicedo` | La Caicedo | `cuenca` |
| 11 | `chapter4-problematicas` | Problemáticas Ambientales | `cuenca` |

La introducción no está en `CHAPTERS`: vive en `src/content/intro/` y se sirve en `/intro`.
Su contenido sigue el mismo contrato `MapContent`.

### Convenciones de identificadores

- Mapas de contenido: `chapter<1-4>-<slug>`.
- Versiones de síntesis: sufijo `-m-` (`chapter2-m-oriente-cali`).
- Modales: id estable en `src/content/modals/`; se referencian por `modalId`.
- Capas: id único por mapa; el `slug` coincide con el archivo cuando aplica.
- Assets: kebab-case, sin espacios ni mayúsculas.

---

## 2. Tipos de contenido

### 2.1 `Chapter`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `number` | 1–4; define la ruta `/capitulo/:n`. |
| `roman` | `string` | Numeral para las pestañas. |
| `title` | `string` | Título completo. |
| `description` | `string` | Subtítulo. |
| `maps` | `ChapterMapRef[]` | Orden narrativo. |
| `territories` | `string[]?` | Solo capítulo II. |
| `hoverImage` | `string?` | Imagen de hover de la pestaña. |

### 2.2 `ChapterMapRef`

| Campo | Tipo | Uso |
|---|---|---|
| `mapId` | `string` | Clave del registry. |
| `title` | `string` | Título visible. |
| `minimap` | `'cuenca' \| 'valle' \| 'sur' \| 'suarez' \| 'villa-rica' \| 'cali'`? | Variante de minimapa; default `cuenca`. |

### 2.3 `MapContent`

| Campo | Tipo | Obligatorio | Uso |
|---|---|---|---|
| `mapId` | `string` | Sí | Debe coincidir con la carpeta y con `CHAPTERS`. |
| `ui` | `MapUI` | No | Título, minimapa, norte, home, sidebar, tooltips, menú. |
| `geo` | `MapGeoEntry` | Sí | PGW + dimensiones. |
| `images` | `MapImageUrls` | Sí | `base`, `full?`, `placeholder`. |
| `config` | `MapConfig` | Sí | Cámara, interacción y zoom. |
| `tiles` | `MapTilesConfig \| null` | No | Pirámide XYZ. |
| `layers` | `Layer[]` | No | Capas raster o GeoJSON. |
| `groups` | `LayerGroup[]` | No | Árbol del menú de capas. |
| `legends` | `LegendItem[]` | No | Leyendas. |
| `pois` | `Poi[]` | No | Puntos de interés. |
| `menuTitle` | `string` | No | Título del menú de capas. |
| `encuadres` | `Encuadre[]` | No | Marcos navegables. |
| `oceanLabels` | `OceanLabel[]` | No | Etiquetas de océano. |
| `subcuencas` | `SubcuencaDef[]` | No | Subcuencas con hover propio. |

### 2.4 `MapGeoEntry`

| Campo | Tipo | Uso |
|---|---|---|
| `pgw` | `PGWData` | Seis coeficientes en orden `[A, D, B, E, C, F]`. |
| `width` | `number` | Ancho en píxeles. |
| `height` | `number` | Alto en píxeles. |

### 2.5 `PGWData`

Orden exacto: **`[A, D, B, E, C, F]`**.

```
lng = A·col + B·row + C
lat = D·col + E·row + F
```

- Atlas rotado: `A = 0`, `E = 0`, `B ≠ 0`, `D ≠ 0`.
- `C` y `F` corresponden al **centro** del píxel `(0,0)`.
- El render aplica corrección de medio píxel.
- Los signos importan y se conservan.

### 2.6 `MapImageUrls`

| Campo | Tipo | Uso |
|---|---|---|
| `base` | `string` | Imagen principal. |
| `full` | `string?` | Imagen completa opcional. |
| `placeholder` | `string` | Primera pintura (`w_512,q_25` en el pipeline actual). |

### 2.7 `MapConfig`

| Campo | Tipo | Default | Uso |
|---|---|---|---|
| `initialBearing` | `number` | — | `-90` para PGW rotado; `-30` en `chapter4-problematicas`. |
| `useTransformConstrain` | `boolean` | — | Activa el clamp bearing-aware. |
| `viewportMaxBounds` | `null \| {west,south,east,north}` | — | Bound explícito; no usar `setMaxBounds`. |
| `viewportMargin` | `number?` | `0.5` | Margen por lado. |
| `viewportMarginH` | `number?` | — | Override horizontal. |
| `viewportMarginV` | `number?` | — | Override vertical. |
| `dragPan` | `boolean` | — | Arrastre. |
| `scrollZoom` | `boolean` | — | Zoom con rueda. |
| `zoomMax` | `number?` | techo automático | Override manual del máximo de tiles. |
| `useImageBase` | `boolean?` | — | Omite la imagen y usa solo XYZ. |
| `loadFullImage` | `boolean?` | — | Carga la imagen full como respaldo/debug. |

### 2.8 `MapTilesConfig`

| Campo | Tipo | Uso |
|---|---|---|
| `urlTemplate` | `string` | Plantilla XYZ base. |
| `urlTemplateStandard` | `string?` | Plantilla standard. |
| `urlTemplateHd` | `string?` | Plantilla HD. |
| `tileSize` | `number` | Tamaño lógico (512/1024). |
| `minZoom` / `maxZoom` | `number` | Rango derivado del techo. |
| `fadeDuration` | `number?` | Transición. |
| `source` | `string?` | Fuente local para el generador. |
| `preview` | `string?` | Preview bajo los tiles. |
| `sourceRotate` | `'auto' \| 'cw' \| 'ccw'?` | Rotación física de la fuente. |
| `tilePixelSizeByZoom` | `Record<number, number>?` | Resolución física por nivel. |
| `tilePixelSizeByProfile` | `Partial<Record<'standard'\|'hd', Record<number, number>>>?` | Resolución por perfil y nivel. |

Modos (`MAP_TILE_MODES`): `initial-only`, `initial-cover`, `detail`.

---

## 3. Capas

### 3.1 `LayerBase`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `string` | Único en el mapa. |
| `name` | `string` | Visible en el menú. |
| `category` | `'rivers' \| 'ecosystems' \| 'boundaries' \| 'nodes' \| 'conflicts' \| 'other'` | Agrupación semántica. |
| `group` | `string?` | Grupo del menú. |
| `visibleByDefault` | `boolean?` | Estado inicial. |
| `opacity` | `number?` | Opacidad inicial. |
| `order` | `number` | Orden de render. |
| `hideInMenu` | `boolean?` | Se renderiza pero no aparece. |
| `modalId` | `string?` | Clic abre modal. |
| `tooltip` | `boolean?` | Hover con nombre. |
| `legend` | `{swatch?, icon?, description?, longText?}?` | Leyenda asociada. |

### 3.2 Variantes

| Tipo | Campos propios |
|---|---|
| `raster-pgw` | `image`, `pgw`, `width`, `height` |
| `raster-tiles` | `urlTemplate`, `tileSize`, `minZoom`, `maxZoom`, `fadeDuration?` |
| `geojson` | `url`, `geometry` (`fill`/`line`/`symbol`/`circle`), `paint` |

### 3.3 `LayerGroup`

`id`, `name`, `parent?`, `order`, `expandedByDefault?`, `header?`, `eye?`, `collapsible?`,
`numbered?`.

`header: false` renderiza filas planas; `eye: false` deja el título estático;
`numbered: false` evita prefijos numéricos.

### 3.4 `LegendItem`

`id`, `name`, `swatch?`, `icon?`, `bare?`, `group?`, `order`, `description?`, `longText?`,
`iconSize?` (`normal`/`large`).

---

## 4. POI

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `string` | Único. |
| `numero` | `number?` | Número visible. |
| `name` | `string` | Nombre y tooltip. |
| `coords` | `[lng, lat]` | Posición. |
| `capa` | `string?` | Capa asociada. |
| `popup` | `{title, body?, image?, audio?}` | Contenido ligero. |
| `angle` | `number?` | Rotación de la flecha. |
| `icon` | `string?` | Ícono. |
| `size` | `'normal' \| 'large'?` | Tamaño. |
| `modalId` | `string?` | Abre modal; tiene prioridad sobre popup. |
| `targetMapId` | `string?` | Navega a otro mapa si no hay modal. |
| `variant` | `'number' \| 'icon' \| 'arrow' \| 'audio'?` | Variante visual. |
| `arrowColor` | `string?` | Color de flecha; default `#03103a`. |
| `clickable` | `boolean?` | `false` deja solo tooltip. |

Prioridad de clic: `modalId` → `targetMapId` → popup ligero.

---

## 5. Encuadres y etiquetas

### 5.1 `Encuadre`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `string` | Único. |
| `name` | `string` | Texto de la etiqueta. |
| `targetMapId` | `string?` | Navegación. |
| `modalId` | `string?` | Abre modal; prioridad sobre `targetMapId`. |
| `labelCoords` | `[lng, lat]` | Posición de la etiqueta. |
| `url` | `string?` | GeoJSON del polígono. |
| `color` | `string?` | Color; default `#5577af`. |
| `labelMaxWidth` | `number?` | Ancho máximo del texto. |
| `labelRotate` | `number?` | Rotación CSS; default 0. |
| `tooltip` | `string?` | Texto de hover; default `name`. |
| `kind` | `'polygon' \| 'line'?` | Geometría; `line` para franjas. |

### 5.2 `OceanLabel`

`id`, `name`, `coords`. Etiqueta estática no interactiva.

### 5.3 `SubcuencaDef`

`slug`, `image`, `pgw?`, `width?`, `height?`. Sin PGW hereda el footprint de agua.

---

## 6. Modales

### 6.1 `Modal`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `string` | Clave del registro. |
| `section` | `string` | `inicio`, `intro`, `capitulo-1`, `legales`… |
| `variant` | `'xs' \| 'small' \| 'medium' \| 'large' \| 'xl' \| 'full'` | Tamaño. |
| `title` | `string` | Título y `aria-label`. |
| `highlight` | `string?` | Énfasis del título. |
| `icon` | `string` | Glyph del header. |
| `iconImage` | `string?` | Imagen en el badge. |
| `image` | `string?` | Fondo full-bleed. |
| `fullImage` | `boolean?` | Activa fondo + scrim. |
| `hideHeader` | `boolean?` | Solo imagen y X. |
| `fullBleed` | `boolean?` | Carrusel inmersivo. |
| `panMobile` | `boolean?` | Pan táctil de la imagen. |
| `closeLeft` | `boolean?` | X a la izquierda. |
| `theme` | `ModalTheme?` | Variables CSS. |
| `body` | `ModalBlock[]` | Contenido. |
| `showScrollIndicators` | `boolean?` | Flecha y fade. |
| `actions` | `ModalAction[]?` | Footer legacy. |
| `meta` | `Record<string,string>?` | Deprecated; usar bloque `meta`. |
| `trigger` | `ModalTrigger` | Cómo se abre. |

### 6.2 Bloques

`paragraph`, `heading`, `list`, `quote`, `image`, `carousel`, `columns`, `meta`, `link`.

Cada bloque lleva `id`. `image` acepta `width` (`small`/`medium`/`full`); `columns` acepta
`main` y `aside`; `link` usa `href` y `label`.

### 6.3 `ModalTheme`

`titleColor`, `textColor`, `bgColor`, `size`, `bgFit` (`cover`/`contain`/`initial`),
`noScrim`, `bodyMaxWidth`, `iconSize`, `fontSize`, `lineHeight`, `bodyTextColor`,
`blockSpacing`, `columnGap`, `contentMarginRight`.

### 6.4 `ModalTrigger`

`type` (`button`/`marker`/`poi`), `icon`, `frame?`, `label?`, `mapId?`, `position?`, `href?`,
`gotoMapId?`.

---

## 7. Tiles y assets

### 7.1 Rutas

```
public/assets/maps/cap{1-4}/       imágenes y capas por capítulo
public/assets/maps/capas/          capas temáticas compartidas
public/assets/maps/previews/       previews ligeros
public/assets/maps/tiles/          pirámide XYZ .webp
public/assets/geojson/             ríos, subcuencas, nodos, conflictos
public/assets/legends/             SVG de leyenda
public/assets/modal/               imágenes de modales
public/assets/pois/                íconos de POI
public/assets/ui/                  shell, pestañas, fondos
public/vendor/maplibre/            worker
```

### 7.2 Nombres

- Kebab-case.
- Sin espacios, tildes ni mayúsculas.
- El tile conserva la ruta de la imagen: `<carpeta>/<mapa>/{z}/{x}/{y}.webp`.
- Un cambio de imagen invalida la caché: usa nueva ruta o versión.

### 7.3 Alineación

Los tiles se generan desde la **misma imagen y el mismo PGW** que la capa base. Si la imagen
se recorta, rota o reescala antes de generar, los tiles se desalinean.

---

## 8. Calibración

`src/content/calibration/` contiene los overrides de mapas y capas. Cada entrada conserva:

- `pgw`: seis coeficientes.
- `width`, `height`: píxeles.
- target: mapa o capa.

El panel de desarrollo escribe con `POST /__calibration/save` y el plugin de Vite reescribe la
entrada. En producción no existe.

Reglas:

- No normalizar un PGW rotado.
- No forzar `A=0`/`E=0` en mapas con rotación real.
- Conservar signos.
- Calibrar capa contra mapa, no al revés.

---

## 9. Estado persistido

`layerStore` persiste en `localStorage`: visibilidad, opacidades, categorías, grupos y
calibración de capas. Los demás stores son efímeros.

Consecuencia: un usuario que vuelve conserva sus capas; si se renombra una capa, el estado
viejo puede apuntar a un id inexistente. El código debe ignorar ids desconocidos.

---

## 10. Cómo añadir un mapa

1. Crear `src/content/chapter-<n>/<slug>/index.ts`.
2. Definir `mapId`, `ui`, `geo`, `images`, `config` y, si aplica, `tiles`, `layers`, `pois`,
   `encuadres`.
3. Añadir el `ChapterMapRef` en `CHAPTERS`, en la posición narrativa correcta.
4. Colocar assets en `public/assets/maps/cap<n>/<slug>/`.
5. Calibrar en `/test/<mapId>` y aplicar.
6. Generar tiles si el mapa lo requiere (`pnpm tiles`).
7. Verificar tipos, tests y build.
8. Registrar el hito en [BITACORA_COMPLETA.md](BITACORA_COMPLETA.md).

Checklist mínima:

- [ ] `mapId` coincide en carpeta, módulo y `CHAPTERS`.
- [ ] PGW rotado, con signos correctos.
- [ ] `width`/`height` reales.
- [ ] Placeholder existente.
- [ ] Tiles alineados o fallback configurado.
- [ ] Capas con `id` único.
- [ ] POI con `modalId` o `popup` válido.
- [ ] Ruta profunda probada.
- [ ] Móvil probado.
