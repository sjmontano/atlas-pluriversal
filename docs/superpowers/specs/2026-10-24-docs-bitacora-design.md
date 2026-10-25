# Diseño — Documentación consolidada y bitácora completa

**Fecha:** 2026-10-24
**Estado:** Aprobado por el usuario
**Alcance:** `atlas-pluriversal-main/docs/`

## Objetivo

Consolidar en un set documental nuevo toda la historia, arquitectura y operación del proyecto Atlas Pluriversal, con una bitácora día a día trazable a commits y documentos. Los documentos originales se conservan intactos.

## Fuentes

| Fuente | Uso |
|---|---|
| Repo `sjmontano/atlas-pluriversal` (238 commits, 2026-08-06 → 2026-10-19) | Bitácora de la era actual, decisiones y evolución del código |
| Repo `sjmontano/atlas-preview` (1 commit, 2026-08-26) | Snapshot de la versión 1.5.0 y diseño del motor local |
| `docs/` actual (13 docs + 7 planes + 7 specs) | Arquitectura, tareas, decisiones y bitácora previa |
| `atlas-old/` (docs 2024-2025, gestión, bugs dic-2025) | Antecedentes y cronología temprana |
| `.superpowers/sdd/` | Evidencia de ejecución de planes (ago-sep 2026) |
| Código actual (`src/`, `scripts/`, configs) | Verificación de arquitectura vigente |

## Entregables

1. `docs/README.md` — índice maestro y estado documental.
2. `docs/BITACORA_COMPLETA.md` — cronología día a día en tres partes (2024-2025, era 3.0/v17/preview, repo actual) más anexos.
3. `docs/CRONOLOGIA_VERSIONES.md` — generaciones del producto y herencia entre versiones.
4. `docs/ARQUITECTURA.md` — arquitectura vigente y flujos.
5. `docs/GUIA_TECNICA.md` — instalación, scripts, datos, tiles, calibración, pruebas y despliegue.
6. `docs/FUNCIONAL.md` — capacidades y estructura de contenido.
7. `docs/DECISIONES.md` — registro de decisiones con fecha y evidencia.
8. `docs/REFERENCIA_DATOS.md` — inventario de mapas, assets y perfiles.
9. `docs/FUENTES_Y_TRAZABILIDAD.md` — fuentes, cobertura, vacíos y confianza.

## Reglas editoriales

- No inventar fechas, causas ni contenido.
- Cada día de bitácora cita commits (`hash`) o documentos (`archivo:línea`).
- Día sin evidencia se marca como «sin registro», no se rellena.
- Fechas se reproducen tal como están registradas.
- Los documentos originales no se modifican ni se borran.
- Los enlaces internos deben resolverse dentro del repo.

## Estructura de la bitácora

- **Parte I — Antecedentes (2024-2025):** conceptualización, versión 1.5.0, carrusel, correcciones dic-2025.
- **Parte II — Era atlas_3.0, v17 y preview (2026-02 → 2026-08-05):** rotación, PGW, migración, calibración, tiles.
- **Parte III — Repo actual (2026-08-06 → 2026-10-19):** por día, con commits, cambios y resultado.
- **Anexos:** tabla completa de commits, índice temático, huecos.

## Verificación

- Contrastar cada fecha con `git log --date=short`.
- Validar enlaces relativos entre documentos.
- Revisar que no existan marcadores TBD/TODO.
