# MODALES — Inventario por capítulo

> Dónde vive la información de cada modal, qué forma tiene y cómo se cablea
> al toolbar. Fuente de verdad: `src/content/modals/`.

## Mapa de archivos

| Archivo | Contenido |
|---|---|
| `src/content/modals/chapter-1.ts` | 6 presentaciones + proyecto + perfil cuenca + 11 cuencas + 4 voces |
| `src/content/modals/chapter-2.ts` | intro + 3 síntesis + 15 fichas AT + 3 galerías |
| `src/content/modals/chapter-3.ts` | intro + 5 presentaciones |
| `src/content/modals/chapter-4.ts` | intro + 10 presentaciones + 14 diagramas |
| `src/content/modals/inicio.ts` | `creditos` + 16 fichas de POIs del home |
| `src/content/intro/modals.ts` | `presentacion`, `cuenca-cauca`, `en-construccion` |
| `src/content/modals/index.ts` | Registro maestro `MODALS` (id → Modal) + `ficha-tecnica`, `galeria-ejemplo` |
| `src/content/modals/_helpers.ts` | Fábricas: `presentacion()`, `fichaPerfil()`, `paragraphs()` |
| `src/content/modals/cap1-textos.generated.ts` | Textos C1 extraídos de v17 (generado, NO editar) |

## Capítulo 1 — `chapter-1.ts`

| Id | Rol | Forma | Trigger |
|---|---|---|---|
| `cap1-presentacion-encuadres/bredunco/formas-paisaje/ecosistemas/mosaicos-del-agua/un-rio-cauca` (×6, vía `presentacion(1,…)`, textos `CAP1_TEXTOS` 2–7) | presentación por mapa | `paragraph ×2–3 + link?`, `large`, icon `presentation` | botón → `chapter1-<mapa>` |
| `cap1-atlas-proyecto` | presentación del proyecto | `paragraph ×2 + quote`, `large` | botón → `intro` |
| `cap1-perfil-cuenca` | perfil de la cuenca | `carousel` 3 SVG (`assets/ui/perfil/`), `large`, icon `perfil` | botón → `chapter1-encuadres` |
| `cap1-cuenca-*` (×11, textos 8–18) | cuenca Tejidos del Agua | `paragraph ×1–2`, `medium`, icon `marker` + `iconImage` cuenca-N | poi (click en capa `chapter1-mosaicos-del-agua`) |
| `cap1-voz-*` (×4, textos 23–26) | tramo Voz del río | `paragraph ×1–2`, `medium`, icon `fichatecnica` | poi (click en tramo, mapa `chapter1-bredunco`) |

Ficha/descargar C1 son **links Drive del sidebar** por diseño v17, no modales.

## Capítulo 2 — `chapter-2.ts`

| Id | Rol | Forma | Trigger |
|---|---|---|---|
| `cap2-intro` | intro | `paragraph ×2`, `large` | botón → `chapter2-valle` |
| `cap2-sintesis-cali/villa-rica/suarez` (×3) | síntesis territorial | `paragraph`, `large` | botón → `chapter2-m-*` |
| `cap2-at-*` (×15, vía `fichaPerfil()`) | ficha de AT | `image` cabecera + `paragraph ×4` (localización, incidencia, influencia, descripción) + `heading/list` problemáticas y acciones, `large`, icon `marker` | marker → `chapter2-suarez/villa-rica/cali` |
| `cap2-galeria-suarez/villa-rica/cali` (×3, vía `galeria()`) | galería zonal | `carousel` 6 fotos + descripciones (`assets/modal/chapter-2/galeria/`), `large`, icon `gallery` | botón → `chapter2-*` |

## Capítulo 3 — `chapter-3.ts`

| Id | Rol | Forma | Trigger |
|---|---|---|---|
| `cap3-intro` | intro | `paragraph ×2`, `large` | botón → `chapter3-introduccion` |
| `cap3-presentacion-monocultivo/encharcaron/cali-deseca/humedales/arcilla` (×5, vía `presentacion(3,…)`, literales) | presentación por mapa | `paragraph`, `large` | botón → `chapter3-<mapa>` |

## Capítulo 4 — `chapter-4.ts`

| Id | Rol | Forma | Trigger |
|---|---|---|---|
| `cap4-intro` | intro | `paragraph`, `large` | botón → `chapter4-introduccion` |
| `cap4-presentacion-*` (×10, vía `presentacion(4,…)`, literales) | presentación por finca | `paragraph`, `large` | botón → `chapter4-<finca>` |
| `cap4-dato-introduccion` (vía `diagrama()`) | datos del capítulo | `image` (`dato-intro-cap4.png`), `large`, icon `datos` | botón → `chapter4-introduccion` |
| `cap4-perfil-asoyoge/el-buhido/el-paso/la-virginia/la-caicedo/centro-agropecuario` (×6, vía `diagrama()`) | perfil = corte de zonificación | `image` (`perfil-*.png`), `large`, icon `perfil` | botón → su finca |
| `cap4-arbol-el-buhido/los-bajios/el-paso/las-mercedes/la-virginia/centro-agropecuario/la-caicedo` (×7, vía `diagrama()`) | mapa de árbol = treemap de % por zona | `image` (`arbol-*.png`), `large`, icon `mapa-arbol` | botón → su finca |

Diagramas portados de v17 `iconsCap4/` → `public/assets/modal/chapter-4/`
(kebab-case). Solo existen donde la comunidad produjo el diagrama.

## Inicio / Intro / Legales

| Id | Archivo | Forma |
|---|---|---|
| 16 POIs del home | `inicio.ts` | `paragraph`, `xl` + `fullImage`, icon `marker`, trigger `poi` |
| `creditos` | `inicio.ts` | `heading/paragraph`, `medium`, icon `credits` |
| `presentacion` | `intro/modals.ts` | `carousel` + `columns`, `xl` |
| `cuenca-cauca` | `intro/modals.ts` | `paragraph + quote`, `large` |
| `en-construccion` | `intro/modals.ts` | `paragraph`, `xs` (aviso) |
| `ficha-tecnica` | `index.ts` | `paragraph + meta + link`, `small` (única con `meta`) |
| `galeria-ejemplo` | `index.ts` | `carousel`, demo sin `mapId` |

## Cableado sidebar → modal

Cada `map.ts` declara `ui.sidebar[]`; `buildRailFromSidebar()` lo convierte
en botones del `ToolRail`:

- `type: 'modal'` + `target: '<modal-id>'` → abre el modal (si el id no
  existe, el click no hace nada).
- `type: 'link'` + `href` → pestaña externa (fichas/descargas Drive, Sheets).
- `type: 'goto'` + `to: '/capitulo/<n>/<mapId>'` → navega (síntesis).

Orden canónico v17: Presentación → Ficha → Galería → Descargar →
Perfil → Árbol → Síntesis (solo los que existen por mapa).

## Iconos

Catálogo en `src/content/theme/icons.ts` (`IconName` → `svg?raw` de
`public/assets/ui/icons/`). `Glyph({name})` resuelve la referencia con
fallback a `info`. Nombres: `presentation, perfil (=levels v17),
fichatecnica (=metadata v17), download, gallery, datos, mapa-arbol,
sintesis, credits, marker, info, back, arrow-up`.

## Reglas para agregar contenido

1. Nuevo modal de capítulo → const en su `chapter-N.ts` (+ export en
   `CHAPTER{N}_MODALS`); reutilizar `presentacion()`, `fichaPerfil()`,
   `galeria()`, `diagrama()` antes de inventar otra forma.
2. Botón del toolbar → item en el `sidebar` del `map.ts` (nunca central).
3. Todo `target` debe existir en `MODALS` y todo `icon` en el catálogo:
   lo verifica `tests/content/sidebarIcons.test.tsx`.
4. Diagramas nuevos de C4: soltar el PNG en
   `public/assets/modal/chapter-4/` (kebab-case) + `diagrama()` + item.

## Gaps conocidos (contenido por producir)

- Perfil: `bosque-comestible`, `los-bajios`, `las-mercedes` (sin diagrama).
- Árbol: `asoyoge`, `bosque-comestible` (sin diagrama).
- C3/C4: presentaciones de 1 párrafo (literales cortos vs C1 rico).
