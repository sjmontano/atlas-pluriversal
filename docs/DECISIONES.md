# Decisiones de arquitectura — Atlas Pluriversal

> Registro tipo ADR. Cada decisión incluye contexto, alternativa descartada, consecuencia y
> evidencia. Las fechas son las del repositorio o de la bitácora; cuando la decisión se
> consolidó en varios commits, se indica el hito principal.
>
> Estado: **aceptada** salvo indicación contraria.

---

## ADR-001 — Reconstruir la aplicación, reutilizar el contenido

- **Fecha:** 2026-08-06
- **Contexto:** existían `atlas_backend`, `atlas_3.0` y `atlas_frontend_v17`. El prototipo
  Leaflet había llegado a 1.5.0 con deuda de georreferenciación y rendimiento.
- **Alternativa descartada:** parchear el prototipo o migrar el código de 3.0.
- **Decisión:** crear una aplicación nueva y migrar **datos, textos, imágenes, audios y
  assets**; no migrar implementaciones rotas.
- **Consecuencia:** arranque limpio y control del stack; a cambio, se reescriben shell,
  modales, capas y calibración.
- **Evidencia:** `d303d7d` y los siete commits del 2026-08-06; `TAREAS.md` (TAREA 1).

---

## ADR-002 — MapLibre GL en lugar de Leaflet

- **Fecha:** 2026-04 / 2026-08
- **Contexto:** el prototipo usaba Leaflet; los mapas son imágenes grandes que deben escalar y
  rotar sin perder alineación.
- **Alternativa descartada:** seguir con Leaflet y capas de imagen.
- **Decisión:** MapLibre GL 6 con fuentes `image`, `raster` y `geojson`.
- **Consecuencia:** render WebGL, rotación de viewport, tiles XYZ y control fino de capas.
  Exige hardware con WebGL y un worker correctamente servido.
- **Evidencia:** `package.json`; `INVESTIGACION_ROTACION_TILES_MAPLIBRE.md`; README.

---

## ADR-003 — PGW rotado original + `bearing: -90`

- **Fecha:** 2026-02-21 → 2026-06-26
- **Contexto:** había tres variantes de PGW (`current`, `transformed`, `v17`) y la conversión
  producía errores. `v17` guardaba PGW ya convertido a formato estándar.
- **Alternativas descartadas:**
  1. Convertir el PGW en runtime.
  2. Rotar físicamente las imágenes con GDAL.
- **Decisión:** conservar el PGW rotado original (`A=0`, `E=0`, `B≠0`, `D≠0`) y dejar que
  MapLibre enderece la imagen con `bearing: -90`.
- **Consecuencia:** una sola fuente de verdad, sin GDAL en runtime y con alineación directa
  contra los tiles. El panel de calibración debe preservar los seis coeficientes.
- **Evidencia:** `TAREAS.md` (TAREA 3); `GLOSARIO.md`; `BoundsCalculator.ts`.

---

## ADR-004 — `setTransformConstrain` en lugar de `setMaxBounds`

- **Fecha:** 2026-04-15
- **Contexto:** con `bearing: -90` los ejes visuales se intercambian. `setMaxBounds` clampea
  longitud contra el ancho y latitud contra el alto, de forma axis-aligned.
- **Alternativas descartadas:** `viewportMaxBounds` con zoom; `maplibre-xy`; bucle
  `move` + `setCenter`.
- **Decisión:** `setTransformConstrain` bearing-aware, con minZoom calculado y clamp de centro
  antes de cada render.
- **Consecuencia:** el mapa no se sale del territorio ni muestra huecos; el cálculo debe
  mantenerse probado.
- **Evidencia:** interacciones 15–17 de la bitácora de 3.0; `TransformConstrain.ts`;
  `TAREAS.md` (TAREA 3.3).

---

## ADR-005 — Carga progresiva en tres etapas

- **Fecha:** 2026-08-06 / 2026-08-09
- **Contexto:** la imagen completa tarda en 3G y el usuario puede abandonar antes de ver algo.
- **Alternativa descartada:** esperar la imagen full antes de mostrar el mapa.
- **Decisión:** placeholder `w_512,q_25` (~8 KB) → imagen media/full → tiles XYZ.
- **Consecuencia:** primera pintura casi inmediata y mejora perceptual. Exige controlar el
  doble fade y no duplicar peticiones.
- **Evidencia:** `707ec14`, `84759f6`; `MapRenderer.ts`; `GLOSARIO.md` §3.

---

## ADR-006 — Techo de pantalla para el zoom de tiles

- **Fecha:** 2026-08-17
- **Contexto:** se generaban niveles que la pantalla nunca alcanzaba; el `maxZoom` manual
  producía sobre-generación y *over-zoom*.
- **Alternativa descartada:** fijar `minZoom`/`maxZoom` por mapa a mano.
- **Decisión:** derivar el rango del tamaño real de la imagen y del techo de pantalla,
  redondeando a 256 px.
- **Consecuencia:** menos tiles, menos peso y mejor nitidez. El dato de zoom deja de ser una
  decisión editorial.
- **Evidencia:** `70823f7`, `26bccf1`, `882f685`, `57ebe19`, `f74890d`;
  `docs/superpowers/specs/2026-08-17-tiles-techo-pantalla-design.md`.

---

## ADR-007 — Perfiles standard/HD con cambio en caliente

- **Fecha:** 2026-08-20
- **Contexto:** reconstruir el mapa para pasar de standard a HD costaba segundos y perdía
  cámara.
- **Alternativa descartada:** un solo perfil fijo.
- **Decisión:** dos perfiles y `setTileProfile()` que intercambia la fuente sin reconstruir.
- **Consecuencia:** adaptación a red y hardware en vivo; más complejidad en el ciclo de vida de
  fuentes.
- **Evidencia:** `6d0458b`, `c2ec9f1`, `b90e658`; `src/data/tiles.ts`.

---

## ADR-008 — Worker de MapLibre vendorizado

- **Fecha:** 2026-08-09
- **Contexto:** con Vite y MapLibre v6, `?worker&url` rompía el canal del worker en desarrollo.
- **Alternativa descartada:** confiar en el worker del paquete y en la resolución del bundler.
- **Decisión:** copiar el worker a `public/vendor/maplibre/`, registrarlo con `setWorkerUrl` en
  `main.tsx` y sincronizarlo con `pnpm sync:maplibre`.
- **Consecuencia:** arranque reproducible en dev y producción; hay que resincronizar al subir
  MapLibre.
- **Evidencia:** `8a2122e`; `package.json`; `public/vendor/maplibre/`.

---

## ADR-009 — Sin backend; contenido estático

- **Fecha:** 2026-08
- **Contexto:** `atlas_backend` tenía credenciales expuestas, una ruta rota y documentaba
  funciones inexistentes. El Atlas no necesita escritura ni autenticación.
- **Alternativa descartada:** mantener la API y MongoDB.
- **Decisión:** sitio estático; contenido en módulos TypeScript y assets en `public/`.
- **Consecuencia:** despliegue simple, bajo costo y menos superficie de ataque. La edición de
  contenido se hace en el repositorio.
- **Evidencia:** `MEMORIA_TECNICA.md`; `TAREAS.md` (TAREA 0).

---

## ADR-010 — Contenido por capítulo y fábrica `makeMap`

- **Fecha:** 2026-08-15 / 2026-09-03
- **Contexto:** los datos estaban dispersos y 26 mapas repetían la misma estructura.
- **Alternativa descartada:** archivos globales gigantes (`geo.js`, `configs.js`,
  `mapData.ts`).
- **Decisión:** un módulo `index.ts` por mapa, registro con `import.meta.glob`, fábricas
  `makeMap` y `makeTilesConfig`.
- **Consecuencia:** cohesión por mapa y validación de tipos; facilita calibrar y borrar un mapa
  sin tocar los demás.
- **Evidencia:** `25c7972`, `f1a743c`, `c16be5d`; `src/content/index.ts`.

---

## ADR-011 — Separar el estado por dominio

- **Fecha:** 2026-08-31
- **Contexto:** un `uiStore` único mezclaba modal, basemap, opacidad y perfil de tiles;
  provocaba re-render innecesario.
- **Alternativa descartada:** mantener un solo store de interfaz.
- **Decisión:** `modalStore`, `mapUIStore`, `uiStore`, más `mapStore`, `chapterStore`,
  `layerStore` y `connectionStore`.
- **Consecuencia:** suscripciones más finas y responsabilidades claras; exige orquestación
  explícita entre stores.
- **Evidencia:** `5a1cf32`; `src/stores/`.

---

## ADR-012 — Modales como bloques apilables

- **Fecha:** 2026-09-02
- **Contexto:** los modales de `v17` tenían layouts rígidos y estilos por caso.
- **Alternativa descartada:** replicar cada modal como componente ad hoc.
- **Decisión:** un `Modal` con `variant`, `theme` y `body: ModalBlock[]`; `BlockRenderer`
  interpreta párrafo, título, lista, cita, imagen, carrusel, columnas, ficha y enlace.
- **Consecuencia:** contenido declarativo y consistente; los casos especiales se resuelven con
  variantes y full-bleed, no con forks.
- **Evidencia:** `7058a4b`, `5104c3a`, `74fc7a9`; `docs/MODALES.md`.

---

## ADR-013 — Full-bleed y tema por modal

- **Fecha:** 2026-09-28
- **Contexto:** perfiles, fichas y diagramas necesitaban ocupar la pantalla sin el header
  estándar.
- **Alternativa descartada:** un modal «grande» único con excepciones CSS.
- **Decisión:** rama `fullBleed` en el renderer, `CarouselFondo`, `PanViewport`, margen derecho
  configurable y `ModalTheme` con variables CSS.
- **Consecuencia:** gran libertad visual sin duplicar el shell; requiere probar scroll y
  cierre en móvil.
- **Evidencia:** `273ca20`, `2d9600e`, `4d81085`, `5df115b`, `a61add5`.

---

## ADR-014 — Rendimiento rural como requisito, no como optimización

- **Fecha:** 2026-08-09 → 2026-09-04
- **Contexto:** el usuario real trabaja en sala comunal, con PC de gama baja y 3G.
- **Alternativa descartada:** optimizar después, priorizando efectos visuales.
- **Decisión:** placeholder inmediato, caché adaptativo (110–400 tiles), prefetch z6–z8 en
  ocioso, preload a 1.5 s, `lowPowerMode`, `MAX_PARALLEL_IMAGE_REQUESTS` 4/2, banners offline
  y degradado, `tilesStatus`.
- **Consecuencia:** la aplicación es usable en el contexto objetivo; algunas animaciones y
  calidades se sacrifican.
- **Evidencia:** `8a2122e`, `0f1d3fd`, `6fdbb97`, `e49092d`; `connectionStore`,
  `useAutoLowPower`.

---

## ADR-015 — Fallback Cloudinary por zoom sin tiles

- **Fecha:** 2026-10-07
- **Contexto:** no todos los mapas tienen pirámide completa; un mapa sin tiles quedaba en
  blanco.
- **Alternativa descartada:** exigir tiles para publicar un mapa.
- **Decisión:** servir `base/medium/high` según zoom cuando no hay tiles, con `base` como
  respaldo inmediato.
- **Consecuencia:** todos los mapas son presentables; la nitidez máxima depende de la imagen,
  no de la pirámide.
- **Evidencia:** `8c50250`; `docs/superpowers/specs/2026-10-07-fallback-cloudinary-zoom-design.md`.

---

## ADR-016 — Basemap vectorial OpenFreeMap Positron

- **Fecha:** 2026-09-30
- **Contexto:** el basemap claro de CARTO era raster; el orden de capas y el peso complicaban
  el render en equipos modestos.
- **Alternativa descartada:** mantener CARTO raster.
- **Decisión:** migrar el basemap claro a OpenFreeMap vector Positron y corregir el ciclo de
  vida para que quede debajo de imagen y tiles.
- **Consecuencia:** menos peso y mejor escalado; depende de un proveedor externo de estilos y
  tiles vectoriales.
- **Evidencia:** `d2ac683`, `6f39c69`; `BasemapManager.ts`.

---

## ADR-017 — Assets organizados por función

- **Fecha:** 2026-08-17
- **Contexto:** los assets estaban mezclados por origen y con nombres inconsistentes.
- **Alternativa descartada:** mantener la estructura heredada de `v17`.
- **Decisión:** `assets/ui`, `assets/pois`, `assets/legends`, `assets/maps`, `assets/modal`,
  con kebab-case y referencias actualizadas.
- **Consecuencia:** navegabilidad y menos duplicados; exige mantener el naming.
- **Evidencia:** `896b76f`, `e311c1d`, `3f8a02c`, `70dbad3`.

---

## ADR-018 — Calibración dev-only con persistencia

- **Fecha:** 2026-08-10 / 2026-08-11
- **Contexto:** calibrar copiando valores a mano era lento y propenso a error.
- **Alternativa descartada:** editor externo + recarga manual.
- **Decisión:** panel en vivo con steppers, arrastre, lectura y guardado vía middleware de
  Vite (`POST /__calibration/save`), solo en desarrollo.
- **Consecuencia:** calibración rápida y persistida en el archivo; el middleware no viaja a
  producción.
- **Evidencia:** `TAREAS.md` (TAREAS 5–8, 10); `MapCalibration.ts`, `SaveCalibration.ts`,
  `vite.config.ts`.

---

## ADR-019 — Límite de texturas a 4096 px

- **Fecha:** 2026-10-19
- **Contexto:** GPU integradas de gama baja fallan o degradan con texturas muy grandes.
- **Alternativa descartada:** usar la resolución completa de la imagen como textura.
- **Decisión:** limitar texturas raster y base a 4096 px (`TextureLimiter`).
- **Consecuencia:** estabilidad en el hardware objetivo; se pierde detalle en imágenes
  enormes, compensado por tiles.
- **Evidencia:** `52729c9`; `src/services/TextureLimiter.ts`, `src/utils/textureLimit.ts`.

---

## ADR-020 — Etiquetas de encuadre como capas `symbol`

- **Fecha:** 2026-09-30
- **Contexto:** las etiquetas HTML de los encuadres derivaban respecto al mapa al hacer zoom.
- **Alternativa descartada:** reposicionar HTML en cada evento de cámara.
- **Decisión:** mover las etiquetas a capas `symbol` de MapLibre, con `labelMaxWidth`
  individual.
- **Consecuencia:** alineación estable y mejor rendimiento; el estilo se define en el estilo
  del mapa, no en CSS.
- **Evidencia:** `824489c`, `e38f7bf`.

---

## Decisiones descartadas que conviene recordar

| Idea | Por qué se descartó |
|---|---|
| Rotar imágenes con GDAL en build | Añadía dependencia, rompía alineación con tiles y duplicaba fuentes de verdad. |
| `setMaxBounds` | Ignora el bearing; clampea ejes equivocados. |
| `maplibre-xy` | Resuelve *underzoom*, no bounds por mapa. |
| Backend propio | No hay escritura ni autenticación; aumentaba costo y riesgo. |
| Zoom manual por mapa | Genera tiles innecesarios y *over-zoom*. |
| Reconstruir el mapa al cambiar perfil | Costoso y pierde cámara; se reemplaza por swap de fuente. |
| Etiquetas HTML para encuadres | Deriva al hacer zoom. |
| Un solo `uiStore` | Re-render excesivo y responsabilidades mezcladas. |
