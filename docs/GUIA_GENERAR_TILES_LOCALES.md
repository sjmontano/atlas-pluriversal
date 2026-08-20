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
- `hd`: 1024x1024 físicos solo en el primer nivel visible; los siguientes son
  512x512. Es el punto medio entre nitidez y peso para Wi-Fi/4G estable.
- `preview`: 1024 px de ancho máximo, WebP calidad 55, usado debajo de los
  tiles para que aparezca un mapa inmediatamente.

La URL conserva el grid lógico `{z}/{x}/{y}`. La app selecciona automáticamente
`standard` o `hd` usando `effectiveType`, `saveData`, estado offline, CPU y memoria.

La resolución física se configura en `tilePixelSizeByProfile`. El script no modifica
el PGW ni los bounds.

### Resolución por mapa

Cada mapa puede definir sus píxeles físicos por perfil en `src/data/tiles.ts`:

```ts
tilePixelSizeByProfile: {
  standard: {},
  hd: { [range.minZoom]: 1024 },
}
```

La clave es el nivel `z`; el valor son los píxeles físicos del WebP servido como
tile lógico de 512. No se usa una pirámide 2048→1024→512 por defecto: el primer
nivel HD duplica una sola vez y evita multiplicar peso sin información adicional.

Excepción experimental actual para `chapter1-un-rio-cauca`:

```ts
hd: { 6: 2048, 7: 1024, 8: 512 }
```

El `6` coincide con su primer nivel visible (`range.minZoom`).

El pipeline usa resampling `near`/`nearest` para conservar bordes exactos. No usa
`lanczos` ni interpolación `linear`, porque ambos suavizan los límites de estos
mapas.

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

Los tiles llevan la versión `local-standard-hd-v3-nearest-pyramid` en la URL runtime y los
directorios separan los perfiles para invalidar generaciones anteriores con
`immutable` sin mezclar calidades.
