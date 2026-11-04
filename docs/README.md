# Documentación — Atlas Pluriversal

> **Un Río Cauca, Muchos Mundos.** Cartografía digital viva del Valle Alto del Río Cauca.
>
> Este directorio reúne solo lo que se necesita para trabajar en el producto. La historia, los
> planes y las evidencias viven fuera del repositorio, en `../docs-trabajo/`.

---

## 1. Qué es el Atlas

El Atlas es una aplicación web estática de cartografía narrativa. Presenta **4 capítulos**,
**30 mapas de contenido** más el mapa de introducción (**31 mapas** en total), con imágenes
georreferenciadas, capas temáticas, puntos de interés (POI), modales de contenido, audio y
navegación entre territorios. Está construido con React 19 y MapLibre GL 6.

---

## 2. Mapa de documentos

| Documento | Qué responde | Cuándo leerlo |
|---|---|---|
| [ARQUITECTURA.md](ARQUITECTURA.md) | Cómo está construido el sistema actual | Antes de tocar mapa, capas, tiles o estado |
| [GUIA_TECNICA.md](GUIA_TECNICA.md) | Instalar, ejecutar, calibrar, generar tiles, desplegar | Para trabajar en el repositorio |
| [GUIA_GENERAR_TILES_LOCALES.md](GUIA_GENERAR_TILES_LOCALES.md) | Generar los tiles paso a paso | Al cambiar la imagen de un mapa |
| [FUNCIONAL.md](FUNCIONAL.md) | Qué hace la aplicación y cómo se usa | Para producto, contenidos, QA y diseño |
| [DECISIONES.md](DECISIONES.md) | Decisiones técnicas con contexto y consecuencias | Antes de proponer un cambio estructural |
| [REFERENCIA_DATOS.md](REFERENCIA_DATOS.md) | Mapas, rutas, capas, modales, POI, stores, scripts | Como hoja de consulta rápida |
| [MODALES.md](MODALES.md) | Sistema de modales | Al crear o cambiar un modal |
| [GLOSARIO.md](GLOSARIO.md), [GLOSARIO_MAPAS.md](GLOSARIO_MAPAS.md) | Vocabulario técnico y de mapas | Como consulta |
| [BITACORA.md](BITACORA.md) | Registro técnico de cambios | Para entender por qué se hizo algo |

En la raíz del repositorio están además `README.md`, `ARCHITECTURE.md` y `DEPLOY.md`.

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

---

## 4. Fuera del repositorio

`../docs-trabajo/` conserva la bitácora completa, la cronología de versiones, la trazabilidad
de fuentes, las evidencias, los planes y especificaciones fechados, la memoria técnica y las
notas de reunión. Cuando un documento de aquí discrepe del código, manda el código.

---

## 5. Licencia

Según el `README.md` de la raíz, el código fuente está bajo licencia MIT. El repositorio no
incluye un archivo `LICENSE`; la declaración del README es la referencia disponible. El
contenido académico y artístico (mapas, textos, ilustraciones, audio, íconos) pertenece a sus
autores y al equipo del Atlas Pluriversal; su uso requiere autorización.
