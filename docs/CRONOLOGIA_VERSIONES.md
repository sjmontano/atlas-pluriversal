# Cronología y versiones — Atlas Pluriversal

> **Corte:** 2026-10-19. El repositorio actual (`sjmontano/atlas-pluriversal`) no tiene tags.
> Las «versiones» de esta cronología son **eras documentales**, no etiquetas de git.
> La numeración `1.5.0` pertenece al prototipo previo.

---

## 1. Vista de conjunto

| Era | Periodo | Nombre de trabajo | Motor / stack | Estado |
|---|---|---|---|---|
| E1 | 2024 – 2025-08 | Prototipo Atlas (v1) | React + Leaflet | Reemplazado |
| E2 | 2025-08 – 2025-12 | Atlas 1.5.0 (Fase 2) | React + Leaflet + CSS Modules | Última versión del prototipo |
| E3 | 2026-02 – 2026-07 | `atlas_3.0` | React + TypeScript + MapLibre GL | Referencia técnica; no modificado |
| E4 | 2026-05 – 2026-08 | `atlas_frontend_v17` | React (JSX) + MapLibre GL | Fuente funcional de contenido; no modificado |
| E5 | 2026-08-06 – hoy | `atlas/` (reconstrucción) | React 19 + TS strict + Vite 8 + MapLibre GL 6 | Activo |

Los proyectos `atlas_backend` (API REST con MongoDB + Cloudinary) y las copias de `v17` se
auditaron en 2026 y se declararon **no necesarios para el runtime**: el Atlas se sirve como
sitio estático.

---

## 2. E1 — Prototipo inicial (2024 – 2025)

- Primer montaje de la cartografía narrativa con **Leaflet**.
- Mapas como imágenes y capas; navegación por capítulos en construcción.
- La documentación de esta etapa (`PROYECTO_ATLAS_DOCUMENTACION_COMPLETA.md`, 902 líneas)
  describe el marco académico: Universidad Mayor de Colombia, Valle Alto del Río Cauca,
  13 secciones (descripción, objetivos, metodología, equipo, tecnologías, funcionalidades,
  estructura, desarrollo, cronología, aspectos técnicos, impacto, trabajo futuro, créditos).
- No hay repositorio git local de esta etapa en el workspace. El detalle diario no existe;
  se documenta por periodo.

---

## 3. E2 — Atlas 1.5.0 / Fase 2 (2025-08 – 2025-12)

`ATLAS_ESTADO_ACTUAL_DESARROLLO.md` (agosto de 2025) reporta:

| Área | Avance |
|---|---|
| Mapas Leaflet | 100 % |
| Carrusel de perfil y talleres | 100 % |
| Navegación | 95 % |
| Modales | 100 % |
| Avance global | 75 % (Fase 2) |

Hitos documentados:

- **2025-08** — Estado de desarrollo de la Fase 2: mapas, carruseles, modales y navegación.
- **2025-12-22** — Corrección de tooltips de topónimos: se ajusta el `z-index` del popup de
  MapLibre (`10000`) al entrar en el elemento y se limpia al salir, en
  `src/components/MapController/agregarToponimos.jsx` (registrado en
  `Gestion_Proyecto/Soluciones_y_Bugs.md`).

Pendientes heredados de esta etapa (`Lista_de_Tareas.md`, 27 líneas, 21+ ítems):
capas truncadas («Cali se seca»), flecha redundante, desfase del mosaico de cuencas frente al
GeoJSON, correspondencia entre números y textos de cuencas, capa «Transformaciones sin
información», indicador de punto de vista, flechas de perfiles del capítulo 1, título del
último perfil del capítulo 1 y convenciones del panel de capas.

---

## 4. E3 — `atlas_3.0` (2026-02 – 2026-07)

Reescritura en TypeScript, orientada a resolver georreferenciación, bounds y *constrain*.
Registro en `MEMORIA_TECNICA.md`, `TAREAS.md` y la bitácora de 34 interacciones.

| Fecha | Hito |
|---|---|
| 2026-02-21 | Investigación de rotación sincronizada entre imagen base y tiles de MapLibre (`INVESTIGACION_ROTACION_TILES_MAPLIBRE.md`). |
| 2026-04-13 | Interacciones 1–14: georreferenciación, bounds en runtime y validación cuantitativa. |
| 2026-04-14 | Interacciones 15–16: `viewportMaxBounds` con zoom; el *clamp* bearing-aware se descarta. |
| 2026-04-15 | Interacción 17: se elige `setTransformConstrain` para el *clamping*. |
| 2026-05-16 | Interacciones 18–26: migración de `v17` hacia 3.0 (PGW, bounds, `transformConstrain`, zoom). |
| 2026-06-26 | Interacciones 27–30: dimensiones reales de Cloudinary y calibración definitiva del capítulo 1. |
| 2026-07-03 | Interacciones 31–33: PGW de subcapas raster, popup y calibración de `unRioCauca`. |
| 2026-07-15 | Interacción 34: conversión masiva de PGW de capítulos 2–4; 31 mapas configurados. |
| 2026-07-30 | Investigación profunda de rotación en los tres proyectos. |

Hallazgos que condicionaron la era siguiente:

- La fórmula de conversión de PGW de 3.0 producía georreferenciación incorrecta en variantes
  `intro-pgw-current / transformed / v17`.
- `bredunco` tenía el valor `F` sin corregir.
- Había código duplicado (`components/` vs `ui/`) y entry points duplicados.
- 3.0 conserva la lógica de `createBearingAwareConstrain()` que luego se porta al proyecto
  actual.

---

## 5. E4 — `atlas_frontend_v17` (referencia funcional)

- Aplicación funcional completa; **sí tiene código fuente** (`src/`), corrección registrada en
  `TAREAS.md` (TAREA 4).
- Aporta textos de modales, galerías, reproductor de audio, íconos del capítulo 4, capas SVG,
  menús del capítulo 2 y el sistema visual.
- Usa PGW en formato **estándar convertido** (A≠0, E≠0, B=0, D=0), a diferencia del formato
  rotado original que adopta el proyecto actual.
- En 2026-08-26 se publica un espejo en `sjmontano/atlas-preview` (un solo commit,
  `9b4d127`). Es el repositorio histórico consultado para esta documentación; no es la fuente
  de verdad del runtime actual.

---

## 6. E5 — Reconstrucción `atlas/` (2026-08-04 → 2026-10-19)

**238 commits** en total (`git rev-list --count --all`), **228** en `main`. Distribución:
83 en agosto, 107 en septiembre, 48 en octubre.

| Fecha | Versión de trabajo | Hito |
|---|---|---|
| 2026-08-04 | — | Rotación −30° en `chapter4-problematicas`; panel compatible con PGW rotado; fix de URLs 404 de `chapter2-m-villa-rica`. |
| 2026-08-05 | — | Fix de `chapter2-m-suarez`; organización de originales por capítulo; piloto de tiles XYZ del capítulo 1; plan de faceta 2. Diagnóstico de doble build por StrictMode; z12, Service Worker y `lowPowerMode`. |
| 2026-08-06 | **0.1.0 — base** | Commit inicial `d303d7d`: configuración, servicios de georreferenciación, 31 mapas con PGW, stores Zustand, componentes de mapa, páginas de test, assets y documentación. |
| 2026-08-09 | 0.2.0 — rural | Mapa funcional en condiciones rurales: worker de MapLibre v6, fix de altura, baja conectividad, caché adaptativo, prefetch z6–z8, banner degradado. |
| 2026-08-10 | 0.3.0 — capas | Sistema de capas: `LayerManager`, `LayerMenu`, `PoiManager`, calibración multicapa y persistencia dev. |
| 2026-08-11 | 0.3.x | Calibración de composites de ecosistemas, capas de agua y capas interactivas del capítulo 1. |
| 2026-08-12 – 08-14 | 0.4.0 — contenido | POI de Bredunco, 33 POI de Formas del Paisaje, POI y capas de los nodos del capítulo 2. |
| 2026-08-15 | 0.5.0 — TS | Migración completa de `src/` a TypeScript puro; reorganización de contenido por capítulo; tema central. |
| 2026-08-16 | 0.5.x | Márgenes de viewport por eje, constrain de ecosistemas, correcciones del capítulo 4. |
| 2026-08-17 | 0.6.0 — tiles | Generador con techo de pantalla, soporte local/AVIF, sin `aux.xml`; `makeTilesConfig` para 31 mapas; reorganización de assets por función. |
| 2026-08-19 – 08-20 | 0.7.0 — adaptativo | Detección única de conexión lenta, prefetch sin doble adaptación, pirámide HD ligera, swap de perfil sin reconstruir, caché SW con poda. |
| 2026-08-21 – 08-23 | 0.8.0 — modales/home | Sistema de modales full-bleed; reconstrucción de la home con POI, mapa intro y panel de control. |
| 2026-08-27 | 0.9.0 — capítulo 1 | Capítulo 1 completo: shell, modales, encuadres, capas y correcciones. |
| 2026-08-31 | 0.9.x | `presentacion.ts` pura; separación de `uiStore` en `modalStore` y `mapUIStore`; UI de mapas centralizada. |
| 2026-09-02 – 09-05 | 1.0.0 — modales v17 | Sistema de modales por bloques, carrusel, scroll, toolbar con íconos oficiales y contenido de v17; inventario `MODALES.md`. |
| 2026-09-06 | 1.1.0 — páginas | Réplica de Entramados y Créditos; menú de capas estilo v17; responsive móvil. |
| 2026-09-07 – 09-10 | 1.1.x | Responsividad; fichas del capítulo 4; assets WebP de encuadres; modo sin tiles; troubleshooting de deploy. |
| 2026-09-26 – 09-30 | 1.2.0 — acabado | Home embellecida; full-bleed sin header; tooltips unificados; etiquetas de encuadre como `symbol`; basemap vectorial OpenFreeMap Positron; menús anidados; modales de capítulos 2 y 3. |
| 2026-10-01 – 10-05 | 1.3.0 — audio y créditos | Etiquetas de océano; subcuencas en `MapContent`; hover de ríos; POI de audio y reproductor flotante en capítulo 3; términos y condiciones; créditos; modal de perfil con `object-fit`. |
| 2026-10-07 | 1.4.0 — fallback | Fallback Cloudinary base/medium/high por zoom cuando no hay tiles; orden de etiquetas de markers en la home. |
| 2026-10-14 | 1.4.x | Imagen de créditos centrada; imagen de la home «Curva». |
| 2026-10-19 | **1.5.0-rc** | Aislamiento por fuente de imagen y opacidad dinámica en el panel de calibración; límite de texturas raster y base a 4096 px; retorno a `/intro`; flechas de carrusel y tooltip de créditos; PDF y correcciones de tipeo. |

> **Nota:** las etiquetas `0.1.0` … `1.5.0-rc` son nombres de etapa usados en este documento
> para ordenar la cronología. No existen como tags en el repositorio.

---

## 7. Comparación de versiones

| Dimensión | Prototipo 1.5.0 | `atlas_3.0` | `v17` | Actual |
|---|---|---|---|---|
| Motor de mapas | Leaflet | MapLibre GL | MapLibre GL | MapLibre GL 6 |
| Lenguaje | JavaScript | TypeScript | JavaScript/JSX | TypeScript strict |
| Georreferenciación | Imágenes/capas Leaflet | PGW convertido | PGW estándar convertido | PGW rotado original + `bearing: -90` |
| Constrain | — | `setTransformConstrain` | — | `setTransformConstrain` bearing-aware |
| Contenido | Carpetas del prototipo | Parcial | Completo | Migrado a módulos por capítulo |
| Backend | — | — | API histórica | Ninguno (estático) |
| Tiles | — | Piloto | — | Pirámide XYZ con techo de pantalla |
| Estado | — | — | Context/props | Zustand 5 |
| Tests | — | Parciales | — | Vitest |

---

## 8. Hitos que cambiaron el rumbo

1. **2026-02-21** — Se investiga la rotación sincronizada imagen/tiles. De ahí sale la
   decisión de rotar el viewport, no las imágenes.
2. **2026-04-15** — Se descarta `setMaxBounds` y se adopta `setTransformConstrain`.
3. **2026-06-26** — Se obtienen las dimensiones reales de Cloudinary y se cierra la
   calibración del capítulo 1.
4. **2026-07-15** — Los 31 mapas quedan configurados con PGW.
5. **2026-08-06** — Se crea el repositorio actual y se reconstruye la aplicación desde cero,
   reutilizando datos y contenido, no el código del prototipo.
6. **2026-08-09** — El objetivo de rendimiento se redefine por el usuario real: sala comunal,
   PC de gama baja y 3G rural.
7. **2026-08-17** — El generador de tiles adopta el «techo de pantalla» y abandona zooms
   arbitrarios.
8. **2026-09-09** — Se añade un modo sin tiles para demos y despliegues ligeros.
9. **2026-09-30** — El basemap claro migra de CARTO raster a OpenFreeMap vector Positron.
10. **2026-10-07** — Fallback de imágenes Cloudinary por zoom para mapas sin tiles.
