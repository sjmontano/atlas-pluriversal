/**
 * Atlas Pluriversal — Service Worker
 *
 * Estrategia cache-first para los tiles XYZ y previews del atlas. En la primera
 * visita se cachean; en visitas posteriores o sin conexión se sirven desde
 * cache instantáneamente (ver FACETA_2_TILES_PLAN.md §3.2).
 *
 * Mantenimiento del cache:
 *   - Cada bump de TILESET_VERSION (URLs `?v=`) deja huérfanas las generaciones
 *     anteriores: al detectar un cambio de versión se podan las entradas viejas.
 *   - Tope de entradas (MAX_CACHE_ENTRIES) para no crecer sin límite en equipos
 *     rurales; al excederlo se eliminan las entradas más antiguas.
 */

const CACHE_NAME = 'atlas-map-assets-v3'
const TILE_PREFIXES = [
  '/assets/maps/tiles/mapas-standard/',
  '/assets/maps/tiles/mapas-hd/',
  '/assets/maps/previews/',
]
const MAX_CACHE_ENTRIES = 5000

// Versión del tileset extraída de la URL (?v=...). Las previews no llevan ?v=.
const tileVersion = (url) => new URL(url).searchParams.get('v') || ''

async function pruneStaleVersions(cache, currentV) {
  const keys = await cache.keys()
  const stale = keys.filter((req) => {
    const v = tileVersion(req.url)
    return v && v !== currentV
  })
  await Promise.all(stale.map((req) => cache.delete(req)))
}

async function pruneToSize(cache, maxEntries) {
  const keys = await cache.keys()
  if (keys.length <= maxEntries) return
  // keys() devuelve las entradas en orden de inserción: eliminar las más antiguas.
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((req) => cache.delete(req)))
}

self.addEventListener('install', () => {
  // Skip waiting para activar inmediatamente (nueva versión reemplaza a la anterior)
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Limpiar caches viejos
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  )
  // Tomar control de todos los clientes sin esperar recarga
  self.clients.claim()
})

// Contadores en memoria para no escanear el cache en cada tile.
let lastTileVersion = ''
let putsSincePrune = 0

async function cacheTile(request, response) {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)

  // Podar generaciones viejas cuando cambia la versión del tileset.
  const v = tileVersion(request.url)
  if (v && v !== lastTileVersion) {
    lastTileVersion = v
    await pruneStaleVersions(cache, v)
  }

  // Tope de tamaño: revisar cada 25 inserciones para no escanear en cada tile.
  putsSincePrune++
  if (putsSincePrune >= 25) {
    putsSincePrune = 0
    await pruneToSize(cache, MAX_CACHE_ENTRIES)
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Solo interceptar tiles y previews del atlas
  if (!url.pathname.endsWith('.webp')) return
  if (!TILE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Cache hit → servir de cache (instantáneo en visitas repetidas)
      if (cached) return cached

      // Cache miss → fetch de red y guardar en cache para la próxima
      return fetch(event.request).then((response) => {
        if (!response.ok || response.status !== 200) return response

        const cloned = response.clone()
        cacheTile(event.request, cloned)
        return response
      })
    }),
  )
})