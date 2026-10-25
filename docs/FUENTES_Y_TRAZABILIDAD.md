# Fuentes y trazabilidad — Atlas Pluriversal

> **Corte:** 2026-10-19. Este documento explica **de dónde sale cada afirmación** de la
> documentación, qué se pudo verificar y qué queda como vacío.
>
> Regla: si no hay evidencia, se escribe **«sin registro»**. No se completan fechas ni
> intenciones por inferencia.

---

## 1. Jerarquía de fuentes

Cuando dos fuentes discrepan, manda la de arriba:

| Prioridad | Fuente | Qué prueba |
|---|---|---|
| 1 | Código actual + `package.json` + git | Qué existe y cuándo se commiteó. |
| 2 | Documentos técnicos fechados de 2026 | Qué se decidió y por qué. |
| 3 | `docs/BITACORA.md` | Qué se hizo, en orden, hasta 2026-09-06. |
| 4 | `atlas-preview` (repo antiguo) | Estado del prototipo Leaflet y su stack. |
| 5 | `atlas-old` (documentos 2024–2025) | Contexto, visión y gestión inicial. |

**No se usa** una fuente de menor prioridad para contradecir a una mayor. Si el código
contradice un documento, se registra la divergencia y se corrige el documento.

---

## 2. Fuentes primarias

### 2.1 Repositorio actual

- Ruta: `D:\Proyectos\Atlas\atlas-pluriversal\atlas-pluriversal-main`
- Remoto: `https://github.com/sjmontano/atlas-pluriversal`
- Rama principal: `main`
- Tip al corte: `bcaf692` (2026-10-19)
- Rango: 2026-08-06 → 2026-10-19
- Commits: **238** en `--all`, **228** en `main`
- Tags: **ninguno**

Ramas observadas:

| Rama | Tip |
|---|---|
| `main` | `bcaf692` |
| `master` | `8dbb727` |
| `backup-main-pre-rebase` | `ed843dc` |
| `origin/feat/modales-y-titulos` | `e4716be` |

### 2.2 Repositorio antiguo

- Ruta: `C:\Users\Sanse\AppData\Local\Temp\opencode\atlas-preview`
- Remoto: `https://github.com/sjmontano/atlas-preview`
- Commits: **1** (`9b4d127`, 2026-08-26)
- Stack: React 18.3, Vite 6, Leaflet 1.9, react-leaflet 4, MapLibre GL 6.6,
  mapbox-gl 3.10, proj4, react-map-gl 8, react-tsparticles.
- Versión declarada: 1.5.0.

### 2.3 Documentos 2024–2025

- Ruta: `D:\Proyectos\Atlas\atlas-pluriversal\atlas-old`
- Sin `.git`.
- Documentos principales:
  - `PROYECTO_ATLAS_DOCUMENTACION_COMPLETA.md`
  - `ATLAS_ESTADO_ACTUAL_DESARROLLO.md`
  - `Gestion_Proyecto/` (cronograma, riesgos, entregables)

Se usan para contexto y visión, no para fechas exactas de commits.

### 2.4 Documentos del repositorio actual

| Documento | Aporte | Vigencia |
|---|---|---|
| `docs/BITACORA.md` | Historia detallada hasta 2026-09-06 | Alta hasta su corte |
| `docs/MEMORIA_TECNICA.md` | Estado de los tres repositorios | Alta |
| `docs/MANUAL_TECNICO.md` | Operación y estructura | Alta |
| `docs/TAREAS.md` | Deuda y tareas del prototipo | Alta como registro histórico |
| `docs/PLAN_ATLAS.md` | Plan de fases | Media (algunas fases no se ejecutaron) |
| `docs/GLOSARIO.md` | Vocabulario | Alta |
| `docs/GLOSARIO_MAPAS.md` | Vocabulario de mapas | Alta |
| `docs/MODALES.md` | Inventario de modales | Alta |
| `docs/FACETA_2_TILES_PLAN.md` | Plan de tiles y CDN | Alta como plan |
| `docs/GUIA_GENERAR_TILES_LOCALES.md` | Generación de tiles | Alta |
| `docs/ARCHITECTURE.md` (raíz) | Arquitectura previa | **Parcialmente desactualizado** |
| `README.md` (raíz) | Stack y estructura | Alta |
| `DEPLOY.md` (raíz) | Despliegue | Alta |
| `docs/superpowers/plans/` | Planes fechados | Alta como intención |
| `docs/superpowers/specs/` | Especificaciones aprobadas | Alta como decisión |

### 2.5 Planes y especificaciones fechados

| Fecha | Archivo |
|---|---|
| 2026-08-10 | `2026-08-10-layer-system-design.md` |
| 2026-08-15 | `2026-08-15-content-reorganization-design.md` |
| 2026-08-17 | `2026-08-17-assets-reorganization-design.md` |
| 2026-08-17 | `2026-08-17-tiles-techo-pantalla-design.md` |
| 2026-08-19 | `2026-08-19-limpieza.md` |
| 2026-08-20 | `2026-08-20-adaptive-map-delivery-design.md` |
| 2026-09-28 | `2026-09-28-modal-content-margin-design.md` |
| 2026-09-29 | `2026-09-29-perfil-cuenca-fullbleed-design.md` |
| 2026-10-07 | `2026-10-07-fallback-cloudinary-zoom-design.md` |
| 2026-10-24 | `2026-10-24-docs-bitacora-design.md` |

Otros planes sin fecha exacta en el nombre se citan por su contenido, no por fecha.

### 2.6 Evidencia visual (2026-10-24)

Carpeta [`evidencias/`](evidencias/), con 17 capturas fechadas:

- **GitHub:** repositorio actual (232 commits en `main`), historial reciente y espejo
  `atlas-preview`.
- **Vercel:** lista de 12 despliegues de producción (7 → 24 de octubre), detalle del despliegue
  de documentación (`9a2a3e8`, Ready, 15s), detalle de «error video» (`7981867`, Ready, 23s) y
  del merge fallido (`34fea4c`, Error, `Command "pnpm run build" exited with 2`).
- **Sitio publicado:** portada, introducción, entradas de capítulos 1 y 4, un mapa del capítulo
  4, un modal de presentación, entramados, créditos y una vista móvil.

**Límites:** la retención de despliegues de Vercel borró el historial anterior al 7 de octubre,
así que las capturas no cubren agosto ni septiembre. Los sellos relativos («24m ago», «5d ago»)
dependen del momento de captura. La evidencia visual corrobora estado; la actividad se sigue
reconstruyendo desde `git log`.

---

## 3. Método de reconstrucción

1. **Inventario** de documentos, planes, especificaciones y código.
2. **Lectura** de la documentación actual y de la bitácora.
3. **Git** como fuente canónica de actividad:
   - `git log --all --date=short --pretty=format:...`
   - conteo por día y por mes;
   - revisión de ramas y tips;
   - revisión de commits de fusión y de stash.
4. **Clonación** del repositorio antiguo para verificar stack y estado.
5. **Cruce** de fechas de documentos con fechas de commit.
6. **Marcado de vacíos** cuando no hay evidencia.

### 3.1 Conteos verificados

| Periodo | Commits |
|---|---|
| 2026-08 | 83 |
| 2026-09 | 107 |
| 2026-10 (hasta 10-19) | 48 |
| **Total `--all`** | **238** |
| **Total `main`** | **228** |

Días con más actividad: 2026-09-30 (30), 2026-09-02 (15), 2026-08-11 (14), 2026-09-28 (13),
2026-08-17 (12), 2026-09-03 (12), 2026-10-04 (11).

Días sin commits dentro del rango: 2026-08-07, 08-08, 08-13, 08-18, 08-22, 08-24, 08-25,
08-26, 08-29, 08-30; 2026-09-08, 09-11 a 09-25, 09-27; 2026-10-06, 10-08 a 10-13, 10-15 a
10-18.

Estos días se documentan como **«sin registro de commits»**, no como inactividad.

---

## 4. Qué respalda cada bloque documental

| Documento | Base principal | Confianza |
|---|---|---|
| `README.md` (docs) | Inventario real de `docs/` | Alta |
| `CRONOLOGIA_VERSIONES.md` | Git + bitácora + documentos antiguos | Alta en hitos; media en primeras fases |
| `BITACORA_COMPLETA.md` | Bitácora hasta 09-06; git desde 09-07 | Alta en actividad; media en intención |
| `ARQUITECTURA.md` | Código actual y tipos | Alta |
| `GUIA_TECNICA.md` | `package.json`, scripts, código, `DEPLOY.md` | Alta |
| `FUNCIONAL.md` | `CHAPTERS`, modales, POI, docs de producto | Alta en funciones; media en estado editorial |
| `DECISIONES.md` | Specs, planes, bitácora, commits | Alta en decisiones registradas; media en fechas tempranas |
| `REFERENCIA_DATOS.md` | `src/types/`, `chapters.ts`, assets | Alta |
| `FUENTES_Y_TRAZABILIDAD.md` | Este mismo proceso | Alta |

---

## 5. Divergencias detectadas

### 5.1 `ARCHITECTURE.md` raíz vs código

- El documento raíz describe un módulo `map.ts`.
- El código actual usa `src/content/chapter-*/<mapa>/index.ts` y el registry
  `src/content/index.ts`.
- **Resolución:** prevalece el código. `ARQUITECTURA.md` documenta la estructura real. La
  divergencia queda aquí registrada.

### 5.2 `BITACORA.md` vs git

- La bitácora termina el **2026-09-06**.
- Git registra actividad hasta el **2026-10-19**.
- **Resolución:** el tramo 09-07 → 10-19 se reconstruyó desde commits y specs fechados. No se
  inventaron relatos de reunión.

### 5.3 Conteo de commits

- `--all`: **238**.
- `main`: **228**.
- La diferencia son ramas no integradas y commits de respaldo.
- Al **2026-10-24** la UI de GitHub muestra **232** en `main`: 228 del corte + 3 del
  colaborador (video y merge) + 1 de documentación.
- **Resolución:** se usa 238 para «historia total» y 228 para «historia de la rama principal».
  El corte del 2026-10-19 no se recalcula; el estado posterior se documenta aparte.

### 5.4 Versiones y tags

- Los documentos hablan de `0.1.0`, `0.5.0`, `1.0.0`, `1.5.0-rc`.
- El repositorio **no tiene tags**.
- **Resolución:** se tratan como **etapas documentales**, no como releases de git.

### 5.5 Fechas de documentos

- Algunos documentos tienen fecha en el nombre; otros solo fecha interna; otros ninguna.
- Los `mtime` del sistema de archivos pueden reflejar copias, no creación.
- **Resolución:** se usa la fecha del nombre o del contenido; si no hay, **«sin registro»**.

### 5.6 `atlas_3.0` y `v17`

- `atlas_3.0` tenía una fórmula PGW incorrecta y el caso `bredunco` con la letra F sin
  corregir.
- `v17` era la fuente funcional de contenido.
- **Resolución:** se documenta como antecedente; no se reutiliza su geometría sin calibrar.

### 5.7 Modos de tiles por mapa

- `MAP_TILE_MODES` existe y el generador lo usa.
- No se verificó, mapa por mapa, el modo efectivo de los 31.
- **Resolución:** `REFERENCIA_DATOS.md` no asigna modo por mapa; solo documenta los modos
  disponibles. Asignarlos requeriría leer cada módulo.

### 5.8 Rotación de `chapter4-problematicas`

- La documentación registra rotación real (`A≠0`, `E≠0`) y un `bearing` de −30°.
- **Resolución:** se documenta como excepción; no se generaliza a los demás mapas.

---

## 6. Vacíos conocidos

| Vacío | Estado |
|---|---|
| Actividad 2024–2025 día por día | Solo contexto documental; sin commits. |
| Reuniones y decisiones no escritas | Sin registro. |
| Días sin commits | Sin registro; no equivalen a inactividad. |
| Ramas eliminadas | Sin registro. |
| Contenido exacto de stashes antiguos | Parcial; no se reconstruye. |
| Modo de tiles por mapa | No verificado en los 31. |
| Cobertura de tests por módulo | No cuantificada. |
| Estado de despliegue en producción al corte | No verificado en vivo. |
| Autoría individual de cada cambio | Git la registra, pero no se usa para atribuir intención. |

---

## 7. Cómo verificar una afirmación

### 7.1 Commits y fechas

```bash
git log --all --date=short --pretty=format:"%h%x09%ad%x09%s"
git rev-list --all --count
git rev-list main --count
git branch -a -v
git tag
```

En PowerShell 5.1, fija UTF-8 antes de leer la salida:

```powershell
[Console]::OutputEncoding = [Text.Encoding]::UTF8
```

### 7.2 Código y stack

```bash
git show <hash>:package.json
git show <hash>:src/data/chapters/chapters.ts
```

### 7.3 Documentos

- Fecha en el nombre → esa fecha.
- Fecha interna explícita → esa fecha.
- Solo `mtime` → **no** se usa como fecha de creación.

---

## 8. Cómo mantener esta documentación

1. **Cambio de código que altera arquitectura:** actualizar `ARQUITECTURA.md` y añadir o
   modificar un ADR en `DECISIONES.md`.
2. **Cambio de datos o tipos:** actualizar `REFERENCIA_DATOS.md`.
3. **Cambio de funcionalidad visible:** actualizar `FUNCIONAL.md`.
4. **Cambio de comando, build o deploy:** actualizar `GUIA_TECNICA.md`.
5. **Nuevo hito:** añadir entrada en `BITACORA_COMPLETA.md` con fecha y evidencia.
6. **Nueva fuente o divergencia:** actualizar este documento.
7. **Corte nuevo:** actualizar la línea «Corte» de todos los documentos y el tip de `main`.

### Regla de oro

> Documentar lo verificado. Si no se puede verificar, decirlo. Una ausencia honesta vale más
> que una fecha inventada.

---

## 9. Resumen de confianza

| Área | Confianza | Motivo |
|---|---|---|
| Inventario de mapas | **Alta** | `CHAPTERS` leído completo. |
| Stack y scripts | **Alta** | `package.json` y código. |
| Conteos de commits | **Alta** | Git. |
| Arquitectura actual | **Alta** | Tipos y servicios. |
| Decisiones de 2026 | **Alta/Media** | Specs y commits; algunas fechas son de consolidación. |
| Historia 2024–2025 | **Media** | Documentos, sin git. |
| Intención de reuniones | **Baja** | No hay actas. |
| Estado de producción | **Sin verificar** | No se auditó el sitio en vivo. |
