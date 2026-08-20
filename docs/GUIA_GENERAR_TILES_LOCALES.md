# Generar Tiles Locales

## Comando

Desde `atlas/`:

```powershell
npx tsx --tsconfig tsconfig.app.json scripts/generate-tiles.mjs --force
```

Para un solo mapa:

```powershell
npx tsx --tsconfig tsconfig.app.json scripts/generate-tiles.mjs chapter1-formas-paisaje --force
```

## Fuentes

Las fuentes están declaradas explícitamente en `src/data/tiles.ts` y viven bajo:

```text
public/assets/maps/{intro,cap1,cap2,cap3,cap4}/
```

El generador no usa `images.full` como fallback. Si un mapa no tiene `tiles.source`,
se omite y muestra un error de configuración en vez de descargar Cloudinary.

`images.full` ya no forma parte de la carga normal cuando hay tiles. El preview
local es la capa base y el tile profile seleccionado aporta la nitidez. `full`
solo queda disponible si un mapa activa explícitamente `config.loadFullImage`.

## Resolución y perfiles

Todos los sources usan `tileSize: 512` lógico en MapLibre. Cada ejecución genera
dos perfiles desde el mismo PNG maestro:

```text
public/assets/maps/tiles/mapas-standard/{mapId}/...
public/assets/maps/tiles/mapas-hd/{mapId}/...
public/assets/maps/previews/{mapId}.webp
```

- `standard`: 512x512 físicos en todos los niveles. Es el perfil para 2G/3G,
  `saveData`, offline y equipos limitados.
- `hd`: 1024x1024 físicos en los dos primeros niveles visibles; el resto
  (z8+ en adelante) es 512x512. Es el punto medio entre nitidez y peso para
  Wi-Fi/4G estable.
- `preview`: 1024 px de ancho máximo, WebP calidad 55, usado debajo de los
  tiles para que aparezca un mapa inmediatamente.

La URL conserva el grid lógico `{z}/{x}/{y}`. La app selecciona automáticamente
`standard` o `hd` usando `effectiveType`, `saveData`, estado offline, CPU y memoria.

La resolución física se configura en `tilePixelSizeByProfile`. El script no modifica
el PGW ni los bounds.

### Resolución por mapa

La pirámide HD es **global y uniforme para todos los mapas**: los dos primeros
niveles visibles en 1024 y el resto en 512 (z8+ en adelante).

```ts
tilePixelSizeByProfile: {
  standard: {},
  hd: {
    [range.minZoom]: 1024,
    [range.minZoom + 1]: 1024,
  },
}
```

La clave es el nivel `z`; el valor son los píxeles físicos del WebP servido como
tile lógico de 512. No se usa una pirámide 2048→1024→512: 1024 duplica una sola
vez y evita multiplicar peso sin información adicional.

El pipeline usa resampling `near`/`nearest` para conservar bordes exactos. No usa
`lanczos` ni interpolación `linear`, porque ambos suavizan los límites de estos
mapas.

### zoomMax por mapa (manual)

Cada mapa define en su `config` (en el index del mapa) hasta qué z se generan
tiles:

```ts
const config = {
  initialBearing: -90,
  useTransformConstrain: true,
  zoomMax: 9, // hasta este z se generan tiles; ajústalo manualmente
  // ...
}
```

- Si se omite `zoomMax`, se usa el techo automático de detalle del tileset
  (`computeTileRange`, referencia 1920px).
- La **cámara siempre puede hacer zoom más allá** del último z generado
  (overzoom): MapLibre reutiliza los tiles del último nivel escalados, sin pedir
  tiles inexistentes. El techo de la vista es fijo (22 = nativo de MapLibre).

## Orientación

Cada source usa `sourceRotate: 'auto'`. El generador compara la relación de aspecto
real del PNG con `geo.width / geo.height`:

- Si coincide, no rota.
- Si coincide con la relación invertida, rota CCW antes de aplicar los GCPs.

Esto permite conservar los PGW actuales aunque los originales estén girados.

## Salida

```text
public/assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp
```

Los tiles llevan la versión `local-standard-hd-v4-nearest-pyramid` en la URL runtime y los
directorios separan los perfiles para invalidar generaciones anteriores con
`immutable` sin mezclar calidades.

## Regenerar tras cambiar la pirámide o `zoomMax`

Al modificar `tilePixelSizeByProfile` (p. ej. subir un nivel a 1024) o bajar
`zoomMax` de un mapa, hay que regenerar sus tiles:

```powershell
npx tsx --tsconfig tsconfig.app.json scripts/generate-tiles.mjs chapter1-formas-paisaje --force
```

La versión `v4` invalida las URLs antiguas (los tiles llevan `?v=` en runtime), así
que no hace falta purgar caché manualmente.
