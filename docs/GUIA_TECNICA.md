# Guía técnica — Atlas Pluriversal

> **Corte:** 2026-10-19. Comandos y rutas verificados contra `package.json` y el árbol actual.
> Para el «por qué» de cada pieza, ver [ARQUITECTURA.md](ARQUITECTURA.md).

---

## 1. Requisitos

- **Node.js** compatible con Vite 8 (una versión LTS reciente).
- **pnpm** (el repositorio usa `pnpm-lock.yaml` y `pnpm-workspace.yaml`).
- Navegador con WebGL 2.
- Para regenerar tiles: acceso a las imágenes fuente y a las utilidades del proyecto.

---

## 2. Puesta en marcha

```bash
pnpm install
pnpm dev
```

Vite sirve la aplicación en el puerto que indique la consola. La ruta principal es `/`; el
visor de mapas es `/capitulo/:n/:mapId`.

### Variables de entorno

| Variable | Efecto |
|---|---|
| `VITE_DEV_TOOLS=true` | Habilita el panel de calibración y los controles de desarrollo. |
| `VITE_ENABLE_SW=true` | Registra el Service Worker también en desarrollo. En producción se registra por defecto. |

No hay backend ni base de datos. Todo lo que la aplicación necesita está en `public/` y en los
módulos de `src/content/`.

---

## 3. Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo con HMR. |
| `pnpm build` | `tsc -b && vite build`; genera `dist/`. |
| `pnpm preview` | Sirve el build de producción localmente. |
| `pnpm typecheck` | Verifica TypeScript sin emitir. |
| `pnpm lint` | Ejecuta `oxlint`. |
| `pnpm test` | Ejecuta Vitest una vez. |
| `pnpm test:watch` | Vitest en modo watch. |
| `pnpm tiles` | Ejecuta `tsx scripts/generate-tiles.mjs`. |
| `pnpm sync:maplibre` | Copia el worker de MapLibre a `public/vendor/maplibre/`. |

Antes de cerrar un cambio: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.

---

## 4. Dónde tocar cada cosa

| Necesidad | Archivo / carpeta |
|---|---|
| Añadir o quitar un mapa del capítulo | `src/data/chapters/chapters.ts` |
| Cambiar título, sidebar o minimapa | `src/content/chapter-*/<mapa>/index.ts` (`ui`) |
| Cambiar PGW o dimensiones | módulo del mapa + `src/content/calibration/` |
| Cambiar imagen o placeholder | `images` del módulo del mapa |
| Cambiar capas | `layers`, `groups`, `legends` del módulo del mapa |
| Cambiar POI | `pois` del módulo del mapa |
| Cambiar encuadres | `encuadres` del módulo del mapa |
| Cambiar textos de modal | `src/content/modals/` |
| Cambiar tema visual | `src/content/theme/`, `src/styles/tokens.css` |
| Cambiar comportamiento de tiles | `src/data/tiles.ts`, `src/utils/tileZoom.ts` |
| Cambiar render | `src/services/MapRenderer.ts` |
| Cambiar bounds o constrain | `src/services/BoundsCalculator.ts`, `TransformConstrain.ts` |
| Cambiar estado global | `src/stores/` |
| Cambiar rutas | `src/App.tsx` |

---

## 5. Calibración de mapas

La calibración solo está disponible en desarrollo.

1. Arranca con herramientas de desarrollo:

   ```bash
   # PowerShell
   $env:VITE_DEV_TOOLS="true"; pnpm dev
   ```

2. Abre `/test/<mapId>` o el mapa real y activa el panel de calibración.
3. Ajusta:
   - **D/B**: escala por porcentaje (paso grueso y fino).
   - **C/F**: desplazamiento en grados.
   - **width/height**: dimensiones en píxeles y slider de tamaño porcentual.
   - **Arrastrar**: mueve el origen de la imagen o de la capa.
4. Revisa la lectura viva: coordenadas NW/SE, spans, aspecto y píxeles por grado.
5. Pulsa **Copiar** para obtener el PGW, o **Aplicar** para persistirlo.

**Qué hace «Aplicar»:** envía `POST /__calibration/save` al plugin de Vite, que reescribe la
entrada correspondiente en el archivo de calibración y reconstruye el mapa. Es un middleware
**solo de desarrollo**; no existe en el build de producción.

### Reglas de calibración

- No conviertas un PGW rotado (`A=0`, `E=0`, `B≠0`, `D≠0`) a formato estándar. La rotación la
  maneja MapLibre con `bearing: -90`.
- En mapas con rotación real (`A≠0`, `E≠0`), no fuerces `A=0`/`E=0`: `processBounds` lo
  interpretaría como retrato y desharía la rotación.
- Los coeficientes negativos son válidos. El clamp conserva el signo.
- Si el polígono degenera, el renderer no aplica `setCoordinates`; evita el crash de zoom 35
  de MapLibre.
- Calibra primero el mapa base y después cada capa contra él.

---

## 6. Tiles

### 6.1 Generar

```bash
pnpm tiles
```

El generador (`scripts/generate-tiles.mjs`) recorre los módulos de contenido, toma el PGW y las
dimensiones reales, calcula el rango de zoom con el **techo de pantalla** y escribe la pirámide
en `public/assets/maps/tiles/`.

Procedimiento detallado y consideraciones de GDAL: `docs/GUIA_GENERAR_TILES_LOCALES.md` y
`docs/FACETA_2_TILES_PLAN.md`.

### 6.2 Modos

| Modo | Uso |
|---|---|
| `initial-only` | Un solo nivel; mapas pequeños o fincas. |
| `initial-cover` | Un nivel que cubre el viewport. |
| `detail` | Pirámide completa con zoom progresivo. |

`MAP_TILE_MODES` centraliza la decisión para los 31 mapas. `makeTilesConfig` deriva
`minZoom`/`maxZoom`; `config.zoomMax` solo actúa como override manual cuando se necesita.

### 6.3 Reglas

- Redondeo del techo a 256 px.
- No generes niveles que la pantalla nunca alcanza.
- No dejes `aux.xml`: el generador usa `GDAL_PAM_ENABLED=NO`.
- Los tiles son inmutables: si cambia la imagen, cambia la ruta o invalida la caché.
- Verifica alineación contra la imagen base antes de publicar.

### 6.4 Sin tiles

Si el mapa no tiene pirámide, el runtime usa el fallback de Cloudinary
`base/medium/high` por zoom. Para demos o hosting limitado existe el modo sin tiles
(`setTileProfile` respeta ese modo y no vuelve a agregar la fuente).

---

## 7. Despliegue

El Atlas es un sitio estático. `DEPLOY.md` contiene las instrucciones específicas para
WordPress y Vercel; aquí va el mínimo común.

### 7.1 Build

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

Sube el contenido de `dist/`.

### 7.2 Base de publicación

Si el sitio vive en `https://dominio/atlas/`, configura la base de Vite en consecuencia y
publica `dist/` en esa carpeta. Los assets y las rutas deben resolverse con la misma base.

### 7.3 Headers

| Recurso | Header recomendado |
|---|---|
| Tiles (`.webp`) | `Cache-Control: public, max-age=31536000, immutable` |
| Assets con hash | `Cache-Control: public, max-age=31536000, immutable` |
| `index.html` | `Cache-Control: no-cache` |
| Service Worker | `Cache-Control: no-cache` |

### 7.4 Reglas de reescritura

- La SPA necesita fallback a `index.html` para rutas como `/capitulo/2/valle`.
- **No** apliques ese fallback a `/assets/maps/tiles/*`, `/assets/*.webp` ni archivos con
  extensión. Si un tile falta y el servidor devuelve `index.html` con `200`, el navegador
  intenta decodificar HTML como imagen y falla en silencio.
- Sirve `.webp` con `Content-Type: image/webp`.

### 7.5 Verificación post-deploy

1. Abre `/` y comprueba que la home carga.
2. Abre un capítulo y navega entre mapas.
3. Haz zoom hasta el máximo: los tiles deben verse nítidos y sin desplazamiento.
4. Revisa la pestaña Network: ningún tile debe devolver `text/html`.
5. Desconecta la red: debe aparecer el banner offline, no una pantalla azul.
6. En conexión lenta simulada: debe aparecer el estado degradado y una imagen de rescate.

---

## 8. Diagnóstico y problemas frecuentes

### 8.1 Niveles de log

Añade `?log=trace` a la URL. Se activan:

- dimensiones del canvas;
- volcado del estilo;
- telemetría de tiles (`request`, `loaded`, `duplicate`, `aborted`);
- errores de MapLibre.

En consola, `MapLogger` muestra `debug/info` solo en desarrollo.

### 8.2 Tabla de síntomas

| Síntoma | Causa probable | Qué revisar |
|---|---|---|
| Canvas azul `#03091e`, sin error | Doble build por `StrictMode` o cadena de altura rota | Contador `buildGen` en `useMap`; `.mapArea { min-height: 0 }`, `.wrapper { flex: 1; min-height: 0 }` |
| Error del worker de MapLibre | Worker no vendorizado o ruta incorrecta | `public/vendor/maplibre/`, `setWorkerUrl` en `main.tsx`, `pnpm sync:maplibre` |
| Mapa en blanco con contenedor de altura 0 | `height: 100%` en cadena sin `min-height: 0` | Inspecciona `.mapArea`, `.wrapper`, `ShellLayout` |
| Tiles no cargan y la consola muestra HTML | El servidor devuelve `index.html` para tiles faltantes | Regla de rewrite; existen los archivos en `dist/assets/maps/tiles` |
| Estado «degradado» permanente | Conexión lenta detectada o timeout de 15 s | `connectionStore`, `nRequested`, red; el banner solo aparece en `slow` |
| Crash `z=35` al calibrar | PGW degenerado o clamp que fuerza ceros | Coeficientes con signo, guard `isNonDegenerate` |
| `AbortError` en consola | Tiles en vuelo al destruir el mapa | Cleanup de basemap y handler global; no es fatal |
| Imagen corrida respecto al mapa | PGW o dimensiones desactualizados | Calibración del mapa y de la capa; comparar contra imagen base |
| Etiquetas de encuadre derivan al zoom | Etiquetas HTML en vez de `symbol` | Capas `symbol` y `labelMaxWidth` |
| Capa GeoJSON no se ve | Orden de capas o `beforeId` inexistente | `LayerManager`, `mapBuilt`, orden basemap/imagen/tiles |

### 8.3 Comprobaciones rápidas

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Si el fallo es visual, compara con `?log=trace` y revisa el estado de tiles en el store.

---

## 9. Convenciones de trabajo

- **Contenido en módulos por mapa**, no en archivos globales gigantes.
- **PGW rotado original** como fuente de verdad; sin conversión en runtime.
- **Nada de rotar imágenes** para «arreglar» la orientación.
- **Sin backend**: si algo requiere servidor, se resuelve con archivos estáticos o con el
  middleware de desarrollo.
- **Rendimiento primero**: cualquier cambio debe probarse con CPU/red limitadas.
- **No reconstruir el mapa** si basta con cambiar una fuente o un perfil.
- **No añadir dependencias** sin justificar que no hay una solución nativa.
- **Documentar la decisión** en [DECISIONES.md](DECISIONES.md) si cambia la arquitectura.

---

## 10. Flujo recomendado para un cambio

1. Lee [ARQUITECTURA.md](ARQUITECTURA.md) y la decisión relacionada en
   [DECISIONES.md](DECISIONES.md).
2. Localiza el módulo de contenido o el servicio.
3. Haz el cambio mínimo.
4. Verifica tipos, lint, tests y build.
5. Prueba en el navegador con `?log=trace`.
6. Si cambia una decisión estructural, actualiza la documentación.
7. Si cambia la historia, añade la entrada en [BITACORA_COMPLETA.md](BITACORA_COMPLETA.md).

---

## 11. Referencias internas

- `docs/DEPLOY.md` — despliegue detallado.
- `docs/GUIA_GENERAR_TILES_LOCALES.md` — generación local de tiles.
- `docs/FACETA_2_TILES_PLAN.md` — plan de tiles, caché, CDN y contingencias.
- `docs/MODALES.md` — inventario de modales.
- `docs/GLOSARIO.md` — vocabulario técnico.
- `docs/GLOSARIO_MAPAS.md` — vocabulario de mapas.
- `docs/superpowers/specs/` — especificaciones fechadas.
