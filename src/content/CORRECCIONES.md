# Correcciones de los mapas

Guía para aplicar lo que piden los revisores. Cada mapa es un solo archivo.

## Qué archivo tocar

La URL dice cuál es el mapa: `/capitulo-N/<slug>` corresponde a
`src/content/chapter-N/<slug>/map.ts`. Los mapas hijos cuelgan de su mapa padre:
`/capitulo-2/suarez/sintesis` está en `chapter-2/m-suarez/map.ts`, y
`/capitulo-4/bosque-comestible/problematicas` en `chapter-4/problematicas/map.ts`.
El padre se declara con `parent` en `src/data/chapters/chapters.ts`; de ahí salen la
URL y el botón de regreso.

| Piden cambiar | Dónde |
| --- | --- |
| Título, etiqueta, leyenda, grupo, orden, color de una capa o leyenda | `map.ts` del mapa |
| Imagen, punto de interés (POI), botones de la barra lateral | `map.ts` del mapa |
| Texto de una ventana modal | `src/content/modals/chapter-N.ts` |
| Imagen de una ventana modal | `public/assets/modal/chapter-N/`, y la ruta en `modals/chapter-N.ts` |
| Archivo del botón Descargar o de la ficha técnica | `sb.descarga('MapasCapN/archivo.png')` o `sb.ficha(...)` en `map.ts`; el archivo va en `public/pdf/`, que no se versiona |
| Colores compartidos | `src/content/theme/` (`swatches.ts`, `poi.ts`, `layers.ts`) |
| Alineación del menú de capas | `src/components/map/LayerMenu.module.css` |
| Ocultar las pestañas de capítulos en un mapa | `ui: { chapterTabs: false }` en su `map.ts` |

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

La prueba de integridad nombra grupos, modales y assets que no existan.
