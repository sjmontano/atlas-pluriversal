# DEPLOY — Atlas Pluriversal

Guía anti-sorpresas. Leer completa antes de subir nada.

## 1. WordPress final (`https://www.unriocauca.com/atlas/`)

### Pre-requisitos en cPanel (manual, una sola vez)
1. **Limpiar `/public_html/atlas/`** actual (respaldo fuera de `public_html` primero).
2. **Forzar HTTPS** en Dominios (evita mixed-content con Cloudinary/tiles).
3. En el `.htaccess` de la **raíz** (`/public_html/.htaccess`), FUERA de los
   marcadores `# BEGIN/END WordPress`, agregar:
   ```apache
   # ATLAS: assets absolutos servidos desde /atlas/
   RewriteCond %{REQUEST_URI} ^/assets/
   RewriteCond %{DOCUMENT_ROOT}/atlas%{REQUEST_URI} -f
   RewriteRule ^assets/(.*)$ /atlas/assets/$1 [L]
   ```
   Sin esto, las 68 URLs `/assets/...` del código devuelven 404 (el build
   con `base` solo reescribe los bundles, no los strings de contenido).
   Verificado: `unriocauca.com/assets/` hoy da 404 (sin colisión).

### Build + subida (cada deploy)
```bash
VITE_ATLAS_BASE=/atlas/ pnpm build   # en PowerShell: $env:VITE_ATLAS_BASE="/atlas/"; pnpm build
```
- Subir el **contenido de `dist/`** (NO la carpeta) a `/public_html/atlas/` por
  **ZIP + descomprimir en File Manager** (10.600 archivos uno a uno es inviable;
  no hay FTP creado).
- `dist/.htaccess` ya viaja incluido (SPA fallback + caché immutable de tiles).
- `VITE_DEV_TOOLS` queda en `false` (prod). `VITE_TILES_ENABLED` sin definir
  (= true, con tiles). `pnpm build` local sin vars = raíz `/`, no afecta dev.

### Checklist post-deploy
- [ ] `/atlas/` carga (topbar, mapa, modales).
- [ ] Deep-link `/atlas/capitulo/1/chapter1-encuadres` resuelve (rewrite OK).
- [ ] Red: tiles `200` con `cache-hit` en segunda visita; `index.html` sin caché larga.
- [ ] `VITE_DEV_TOOLS` apagado (sin botón 🔧 ni rutas `/dev/*` más allá del menú).

## 2. Demo temporal en Vercel (sin tiles locales)

Los tiles (525 MB) no viajan en git y Vercel no admite 10.272 archivos por
deployment — por eso la demo usa `VITE_TILES_ENABLED=false` (base Cloudinary
w_2048 + previews + capas locales; sin spinner de 15s).

### Pasos
1. Importar `sjmontano/atlas-pluriversal` en Vercel (preset Vite).
2. Variables de entorno:
   - `VITE_DEV_TOOLS=false`
   - `VITE_TILES_ENABLED=false`
   - `VITE_ATLAS_BASE` **sin definir** (Vercel = dominio raíz).
3. Deploy. Rutas funcionan por `vercel.json` (rewrites → `/index.html`).

### Qué muestra y qué no
- ✅ UI completa, modales, capas, geojson, calibración, navegación.
- ❌ Nitidez de tiles en zoom profundo (veredicto honesto: "prueba funcional",
  la calidad final vive en WP con tiles locales).

## 3. Pesos de referencia (2026-09-04)

| Artefacto | Peso | Va a git | Va a WP | Va a Vercel |
|---|---|---|---|---|
| Repo (código + assets trackeados) | ~85 MB | ✅ | n/a | ✅ |
| `tiles/{mapas-hd,mapas-standard}` | 525 MB / 10.272 files | ❌ | ✅ | ❌ |
| PNGs fuente (`assets-raw/`) | ~700 MB | ❌ | ❌ | ❌ |
| PNGs runtime (3) + previews + capas + geojson | ~15 MB | ✅ | ✅ | ✅ |
| `dist/` WP (`/atlas/`) | ~655 MB / ~10.5k files | n/a | ✅ | n/a |

## 4. Troubleshooting demo Vercel (caso real 2026-09-09)

**Síntoma**: mapa en negro/blanco con etiquetas, consola con
`Could not load image ... SVGs are not supported` ×N en tiles.
**Causa**: los tiles pedidos devuelven `index.html` (`content-type: text/html`,
`content-disposition: filename="index.html"`) — el rewrite SPA captura las
URLs porque **los tiles no están desplegados** (gitignored) y/o falta
`VITE_TILES_ENABLED=false` en el dashboard.
**Fix**: poner las 2 env vars y **redeployar** (cambiar vars sin redeploy no
aplica). Verificar en red: ningún request a `/assets/maps/tiles/*`.

## 5. Límites conocidos (no re-descubrir)
- GitHub repo < 5 GB recomendado; push HTTPS frágil pasando ~500 MB.
- Vercel: ~10k archivos/deployment y sin GDAL (no regenerar tiles ahí).
- Shared hosting: 250k inodes, 50 GB (hoy 17% y 21% con el Atlas incluido).
- `nunca` commitear `tiles/`, `assets-raw/`, `dist/` (gitignored a propósito).
