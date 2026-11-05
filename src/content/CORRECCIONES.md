# Correcciones de los mapas

Guía para aplicar lo que piden los revisores. Cada mapa es un solo archivo.

**Estado de la migración:** capítulo 4 hecho. En los capítulos 1, 2 y 3 y en `intro`, el
`map.ts` todavía reparte su contenido en `legends.ts`, `layers.ts`, `groups.ts`, `pois.ts`,
etc., junto a él en la misma carpeta, y sus tiles se declaran en `src/data/tiles.ts`.

## Qué archivo tocar

La URL dice cuál es el mapa: `/capitulo/N/chapterN-<slug>` corresponde a
`src/content/chapter-N/<slug>/map.ts`.

| Piden cambiar | Dónde |
| --- | --- |
| Título, etiqueta, leyenda, grupo, orden, color de una capa o leyenda | `map.ts` del mapa |
| Imagen, punto de interés (POI), botones de la barra lateral | `map.ts` del mapa |
| Texto de una ventana modal | `src/content/modals/chapter-N.ts` |
| Colores compartidos | `src/content/theme/` (`swatches.ts`, `poi.ts`, `layers.ts`) |
| Alineación del menú de capas | `src/components/map/LayerMenu.module.css` |

Los `id` no se corrigen aunque tengan erratas: otros archivos y enlaces dependen de ellos.

## Las 3 fuentes de imagen de cada mapa

Todo mapa conserva los tres sistemas. Ninguno reemplaza a otro: son respaldo entre sí.

| Sistema | Qué es | Dónde se declara |
| --- | --- | --- |
| Cloudinary | 4 niveles: `low`, `base`, `medium`, `high` (`BASE_TRANSFORMS`, `src/utils/baseZoom.ts`) | `base` y `full` en `map.ts`, con `cld('v123/geoImages/abc.png')` |
| Base local | `public/assets/maps/previews/<mapId>.webp`, la primera imagen que se ve | No se declara: la ruta sale del `mapId` y el generador crea el archivo |
| Tiles | `public/assets/maps/tiles/mapas-{standard,hd}/<mapId>/` (no están en git) | `tiles: { mode, source }` en `map.ts`; `source` es relativo a `assets-raw/maps/` |

Los niveles se calculan desde `full` si difiere de `base`; si no, desde `base`. El
`placeholder` (nivel `low`) se deriva de `base`.

Cómo cambiar la imagen de un mapa:

- **Cloudinary:** subir la imagen y cambiar `base` y `full` en `map.ts`.
- **Tiles y base local:** reemplazar el archivo en `assets-raw/maps/`, o apuntar `tiles.source`
  a uno nuevo. Luego ejecutar `npm run tiles -- <mapId> --force`, que regenera ambos.
  `npm run tiles -- <mapId> --dry-run` revisa la fuente sin escribir nada.
- **Base local sola:** reemplazar el `.webp` de `previews/` con el mismo nombre.

Una imagen nueva debe cubrir el mismo encuadre que `geo` en las tres fuentes. Si cambia el
encuadre, hay que actualizar `geo`, y revisar si el mapa tiene ajuste en
`src/content/calibration/`.

## Después de corregir

```sh
npx tsc -b --noEmit
npx vitest run tests/content
```

Mientras dure la migración, `contentSnapshot` falla ante cualquier cambio de contenido. Si el
cambio es intencional, revisar el diff y aceptarlo con
`npx vitest run tests/content/contentSnapshot.test.ts -u`.

Cambiar `tiles.mode` exige cambiarlo también en `MAP_TILE_MODES` (`src/data/tiles.ts`), que
aún lee `MapRenderer`. Si no coinciden, `defineMap` lanza un error.
