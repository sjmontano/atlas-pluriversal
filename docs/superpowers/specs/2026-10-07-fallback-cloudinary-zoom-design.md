# Fallback Cloudinary por zoom (low/medium/high) — Design

Fecha: 2026-10-07
Estado: aprobado por usuario (opción A + high desde z7+ en ecosistemas como referencia)

## 1. Objetivo

Que el atlas no se vea feo mientras se reorganizan los PNG y no hay tiles:
una sola `ImageSource` base que sube de detalle con el zoom usando 3
transforms del mismo `base` de Cloudinary. Cuando los PNG originales estén
listos, los tiles XYZ entran encima sin cambiar este sistema (contingencia).

## 2. No-objetivos

- No portar las 4 capas simultáneas del old (4x VRAM).
- No añadir URLs `low/medium/high` por mapa. Se deriva todo de `images.base`.
- No tocar PGW, bounds, ni el generador `scripts/generate-tiles.mjs`.

## 3. Arquitectura

Un solo `ImageSource` (`atlas-base-image`) + helper de niveles + listener de
zoom con histeresis. Reutiliza `preloadImage` + `cloudinaryVariant` existentes
en `src/services/MapRenderer.ts`.

```
zoom (map.getZoom())
  -> resolveBaseLevel(zoom, minZoom, maxZoom) : 'base' | 'medium' | 'high'
  -> levelToTransform = { base: 'w_1600,q_auto,f_webp',
                          medium: 'w_2560,q_auto,f_webp',
                          high: 'q_auto,f_webp' (original sin límite) }
  -> fuente = pickBaseSource(images): full si existe y difiere del base
     (el base suele ser thumbnail ~564px sin detalle; el full es el original)
  -> cloudinaryVariant(fuente, transform)
  -> preloadImage(url).then -> source.updateImage({ url, coordinates })
```

Orden de capas (sin cambios): `background < base-image < tiles < vectores`.
Base con `raster-fade-duration: 0`, tiles con `300` (o `0` en lowPower).

## 4. Cálculo de umbrales por zoom

Fuente del rango, en orden:
1. `entry.tiles.minZoom / maxZoom` si existe (misma referencia que tiles).
2. Si no, `computeTileRange(geo, modo, 1920, 1080, bearing)` al vuelo.
3. Fallback: `constrainMinZoom` / `screenCeilingZoom`.

Regla general (mapas `detail`):

- `base`    : `zoom <= minZoom + 0.5`
- `medium` : `minZoom + 0.5 < zoom <= minZoom + 1.0`
- `high`   : `zoom > minZoom + 1.0`

Referencia usuario: `chapter1-ecosistemas (z8..z10 real según tileZoom.test)`
queda `z8-8.5 base / z8.5-9.0 medium / z9.0+ high`. El pedido `z7+ high` se
interpreta como "high temprano": con `minZoom=8` todo `z>=9` ya es high,
es decir, casi todo el zoom útil va en high salvo el encuadre inicial.

Guarda de aspecto: si la fuente a subir está rotada 90° respecto al geo
(PNG local apaisado con geo vertical — el generador la rota con
`sourceRotate`, el runtime no puede), se conserva el preview en vez de
deformar el mapa. Implementada en `matchesGeoAspect()`.
A más zoom, más detalle: el high cubre todo el overzoom hasta z22.

Casos especiales:
- `initial-only / initial-cover` (min==max): siempre `medium`, salvo
  `tilesEnabled===false` que usa `high` directo (demo sin tiles).
- URLs locales sin `/upload/`: `cloudinaryVariant` no-op → niveles idénticos,
  no se hace swap (guard `midUrl !== currentUrl` existente).
- `config.useImageBase===false`: no se monta base (respeta encuadres),
  salvo `needsPreviewFallback` (demo) que sí la monta.

Histeresis 0.5 ya incluida en los umbrales: no hay flapping al bordear.
No se usa `smoothStep`/opacidades cruzadas del old a propósito.

## 5. Preload y swap sin parpadeo

- Al entrar en `low`, precargar `medium`; al entrar en `medium`, precargar `high`.
- `updateImage` solo cuando `preloadImage` resuelve. Si falla, se queda en el
  nivel actual (nunca negro).
- Deduplicación existente `preloadPromises` / `preloadedImages` (StrictMode-safe).
- Throttle: listener `map.on('zoom')` + `requestAnimationFrame`, igual que el
  old (`BaseMapImage.jsx:283`), más `zoomend` para asentar nivel final.
- Limpieza en `destroy()` del `buildGeoreferencedMap` (quitar listener).

## 6. Cascada de contingencias (orden final)

1. `background #03091e` (siempre).
2. `preview local` o `placeholder w_512` (instantáneo, primer frame).
3. `low w_512` → `medium w_1600` → `high w_2048` por zoom (este spec).
4. Tiles XYZ `standard/hd` encima cuando existen y cargan.
5. Telemetría 15s existente: si `nRequested>0 && nLoaded===0` → `degraded`,
   la base escala a `high` y se queda usable.
6. `tilesEnabled===false` (Vercel demo): base en `high` directo, sin pedir tiles.
7. `loadFullImage===true`: mantiene comportamiento actual (debug/fallback).

Si hay tiles, la base puede quedarse en `medium` hasta z alto para ahorrar
ancho de banda; si fallan, sube sola a `high`. Sin PNGs ni tiles, el mapa
sigue navegable en `high` Cloudinary.

## 7. Cambios de código previstos (sin implementar aún)

- `src/services/MapRenderer.ts`: `resolveBaseLevel()`, `levelToTransform`,
  `attachBaseZoomFallback(map, mapId, entry, coordinates)` + wiring en
  `buildGeoreferencedMap` (sustituye/extends bloque `5b Base intermedia`).
- `src/utils/tileZoom.ts`: exportar helper `baseRangeForMap(entry, geo, bearing)`
  si se necesita fuera del renderer. Sin cambios de fórmula.
- `src/types/content.ts`: sin cambios (no se añaden `low/medium/high`).
- Tests: `resolveBaseLevel` puro (umbrales, histeresis, initial-only,
  sin tiles) + test de no-swap en URLs locales.

## 8. Criterios de aceptación

- Sin `tiles/`: navegar z6→z11 cambia `low→medium→high` sin negro ni pop
  visible; red muestra como máximo 3 imágenes base distintas por mapa.
- Con tiles caídos (offline/404): a los 15s `degraded` + base en `high`.
- `initial-only` no hace swap innecesario.
- URLs locales no disparan requests extra.
- Vercel `VITE_TILES_ENABLED=false` sigue sin pedir `/assets/maps/tiles/*`.
