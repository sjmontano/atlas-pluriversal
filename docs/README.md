# Documentación — Atlas Pluriversal

> **Un Río Cauca, Muchos Mundos.** Cartografía digital viva del Valle Alto del Río Cauca.
>
> Este directorio reúne la documentación canónica del proyecto: historia, arquitectura,
> operación, funcionalidad, decisiones y trazabilidad de fuentes.
>
> **Corte documental:** 2026-10-19 · **Repositorio:** `sjmontano/atlas-pluriversal` · **Rama:** `main`

---

## 1. Qué es este conjunto

El Atlas es una aplicación web estática de cartografía narrativa. Presenta **4 capítulos**,
**30 mapas de contenido** más el mapa de introducción (**31 mapas** en total), con imágenes
georreferenciadas, capas temáticas, puntos de interés (POI), modales de contenido, audio y
navegación entre territorios.

El proyecto nació de un prototipo previo (Leaflet, 2024–2025), pasó por una reescritura
TypeScript (`atlas_3.0`) y una aplicación funcional (`atlas_frontend_v17`), y en **agosto de
2026** se reconstruyó como aplicación React 19 + MapLibre GL 6. Este conjunto documenta ese
recorrido completo y el estado actual.

---

## 2. Mapa de documentos

| Documento | Qué responde | Cuándo leerlo |
|---|---|---|
| [BITACORA_COMPLETA.md](BITACORA_COMPLETA.md) | Historia día por día, 2024 → 2026-10-19 | Para reconstruir por qué algo es como es |
| [CRONOLOGIA_VERSIONES.md](CRONOLOGIA_VERSIONES.md) | Eras, versiones y hitos del producto | Para ubicar una etapa o comparar versiones |
| [ARQUITECTURA.md](ARQUITECTURA.md) | Cómo está construido el sistema actual | Antes de tocar mapa, capas, tiles o estado |
| [GUIA_TECNICA.md](GUIA_TECNICA.md) | Instalar, ejecutar, calibrar, generar tiles, desplegar | Para trabajar en el repositorio |
| [FUNCIONAL.md](FUNCIONAL.md) | Qué hace la aplicación y cómo se usa | Para producto, contenidos, QA y diseño |
| [DECISIONES.md](DECISIONES.md) | Decisiones técnicas con contexto y consecuencias | Antes de proponer un cambio estructural |
| [REFERENCIA_DATOS.md](REFERENCIA_DATOS.md) | Mapas, rutas, capas, modales, POI, stores, scripts | Como hoja de consulta rápida |
| [FUENTES_Y_TRAZABILIDAD.md](FUENTES_Y_TRAZABILIDAD.md) | De dónde sale cada afirmación y qué falta | Para auditar o continuar la documentación |

### Documentos históricos conservados

Estos archivos ya existían y **no fueron reemplazados**. Se mantienen como fuente primaria y
registro de trabajo:

- `BITACORA.md` — bitácora técnica hasta 2026-09-06.
- `MEMORIA_TECNICA.md` — auditoría de `atlas_backend`, `atlas_3.0` y `v17`; investigación de
  georreferenciación y stack.
- `MANUAL_TECNICO.md` — manual técnico previo.
- `PLAN_ATLAS.md` — plan de implementación por fases.
- `TAREAS.md` — historial técnico de tareas 0–11.
- `GLOSARIO.md`, `GLOSARIO_MAPAS.md` — vocabulario técnico y de mapas.
- `MODALES.md`, `FACETA_2_TILES_PLAN.md`, `GUIDE.md`, `GUIA_GENERAR_TILES_LOCALES.md`,
  `reunion290926730.md`.
- `superpowers/plans/` y `superpowers/specs/` — planes y especificaciones por fecha.

En la raíz del repositorio se conservan además `README.md`, `ARCHITECTURE.md` y `DEPLOY.md`.
El nuevo conjunto **no los duplica**: los cita y, cuando hay divergencia, la señala en
[FUENTES_Y_TRAZABILIDAD.md](FUENTES_Y_TRAZABILIDAD.md).

---

## 3. Rutas de lectura

**Si llegas nuevo al proyecto**
1. Este README.
2. [FUNCIONAL.md](FUNCIONAL.md) — qué se ve y qué se puede hacer.
3. [ARQUITECTURA.md](ARQUITECTURA.md) — cómo está armado.
4. [GUIA_TECNICA.md](GUIA_TECNICA.md) — cómo levantarlo.

**Si vas a cambiar el mapa o la georreferenciación**
1. [ARQUITECTURA.md](ARQUITECTURA.md), secciones 3–6.
2. [DECISIONES.md](DECISIONES.md), ADR-003 a ADR-008.
3. [GUIA_TECNICA.md](GUIA_TECNICA.md), calibración y tiles.

**Si vas a tocar contenido o diseño**
1. [FUNCIONAL.md](FUNCIONAL.md).
2. [REFERENCIA_DATOS.md](REFERENCIA_DATOS.md) — capítulos, rutas, bloques de modal.
3. [DECISIONES.md](DECISIONES.md), ADR-011 y ADR-012.

**Si necesitas auditar la historia**
1. [BITACORA_COMPLETA.md](BITACORA_COMPLETA.md).
2. [CRONOLOGIA_VERSIONES.md](CRONOLOGIA_VERSIONES.md).
3. [FUENTES_Y_TRAZABILIDAD.md](FUENTES_Y_TRAZABILIDAD.md).

---

## 4. Jerarquía de fuentes

Cuando dos documentos discrepan, se aplica este orden:

1. **Código y git del repositorio actual** (`src/`, `scripts/`, `package.json`, `git log`).
2. **Documentos fechados del repositorio actual** (`docs/superpowers/plans`, `docs/superpowers/specs`).
3. **`docs/BITACORA.md`** y documentos técnicos del repositorio actual.
4. **Repositorio histórico `atlas-preview`** (espejo del prototipo).
5. **Documentos de `atlas-old`** (2024–2025), usados solo para contexto de esa etapa.

Las fechas se reproducen tal como fueron registradas. Un día sin evidencia se marca
**«sin registro»**; no se infiere actividad.

---

## 5. Estado y mantenimiento

- El repositorio actual no usa tags de versión. Las cifras de versión del prototipo
  (`1.5.0`) son documentales, no etiquetas de git.
- `docs/BITACORA.md` termina el **2026-09-06**. Desde **2026-09-07** hasta **2026-10-19** la
  historia se reconstruyó a partir de los commits del repositorio (238 en total).
- `ARCHITECTURE.md` (raíz) describe `map.ts`; el código actual usa
  `src/content/chapter-*/<mapa>/index.ts`. Ver la nota de reconciliación en
  [FUENTES_Y_TRAZABILIDAD.md](FUENTES_Y_TRAZABILIDAD.md).
- Para actualizar este conjunto: añadir la entrada diaria en `BITACORA_COMPLETA.md`, ajustar
  `REFERENCIA_DATOS.md` si cambian mapas o rutas, y registrar cualquier decisión nueva en
  `DECISIONES.md`.

---

## 6. Licencia

Según el `README.md` de la raíz, el código fuente está bajo licencia MIT. El repositorio no
incluye un archivo `LICENSE`; la declaración del README es la referencia disponible. El
contenido académico y artístico (mapas, textos, ilustraciones, audio, íconos) pertenece a sus
autores y al equipo del Atlas Pluriversal; su uso requiere autorización.
