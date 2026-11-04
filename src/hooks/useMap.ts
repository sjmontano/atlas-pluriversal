/**
 * 🪝 USE MAP
 * ===========
 *
 * Hook principal del visor. Orquesta el ciclo de vida del mapa:
 *
 *   datos (getMapContent) → buildGeoreferencedMap → mapBuilt
 *
 * Se ejecuta una vez por mapId. Al cambiar de mapa o desmontar,
 * destruye la instancia de MapLibre anterior.
 *
 * Cada ejecución del effect tiene su propio flag `cancelled`: una build que
 * resuelve después de su cleanup destruye su mapa y no toca el estado global.
 * Cubre el doble montaje de StrictMode y la navegación rápida, donde AtlasMap
 * lleva `key` por mapa y la instancia vieja queda desmontada con la build en
 * vuelo (el store es compartido: su setMapBuilt(true) anularía el de la nueva).
 */

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type * as maplibregl from 'maplibre-gl'
import { getMapContent } from '@content'
import { applyParallelRequests, buildGeoreferencedMap, type MapController } from '@services/MapRenderer'
import { logger } from '@services/MapLogger'
import { useMapStore } from '@stores/mapStore'
import { useMapUIStore } from '@stores/mapUIStore'
import { useConnectionStore } from '@stores/connectionStore'
import { TILES_ENABLED } from '@config'

const CATEGORY = 'useMap'

export interface UseMapOptions {
  mapId: string
  containerRef: RefObject<HTMLDivElement | null>
  controllerRef?: RefObject<MapController | null>
}

export interface UseMapResult {
  /** Instancia de MapLibre (ref, null hasta que el mapa esté listo) */
  mapRef: RefObject<maplibregl.Map | null>
  /** Error de inicialización, null si todo OK */
  error: string | null
}

export function useMap({ mapId, containerRef, controllerRef }: UseMapOptions): UseMapResult {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)

  const setMapBuilt = useMapStore((s) => s.setMapBuilt)
  const mapBuilt = useMapStore((s) => s.mapBuilt)
  const setLoading = useMapStore((s) => s.setLoading)
  const setStoreError = useMapStore((s) => s.setError)
  const lowPowerMode = useMapUIStore((s) => s.lowPowerMode)
  const tileProfile = useConnectionStore((s) => s.tileProfile)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const entry = getMapContent(mapId)
    if (!entry) {
      const msg = `Mapa no encontrado en los datos: ${mapId}`
      setError(msg)
      setStoreError(msg)
      logger.error(CATEGORY, msg)
      return
    }

    let cancelled = false
    let destroy: (() => void) | null = null

    setLoading(true)
    setError(null)

    logger.debug(CATEGORY, 'effect:build-start', { mapId })

    buildGeoreferencedMap(container, mapId, entry, { lowPowerMode, tileProfile, tilesEnabled: TILES_ENABLED })
      .then((result) => {
        if (cancelled) {
          logger.trace(CATEGORY, 'effect:build-descartado', { mapId })
          result.destroy()
          return
        }
        mapRef.current = result.map
        destroy = result.destroy
        if (controllerRef) {
          controllerRef.current = result.controller
        }
        setMapBuilt(true)
        setLoading(false)
        logger.debug(CATEGORY, 'effect:build-ok', { mapId })
      })
      .catch((err: unknown) => {
        if (cancelled) {
          logger.trace(CATEGORY, 'effect:build-abortado', { mapId })
          return
        }
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        setStoreError(msg)
        setLoading(false)
        logger.error(CATEGORY, `Error construyendo mapa: ${mapId}`, err)
      })

    return () => {
      cancelled = true
      destroy?.()
      mapRef.current = null
      if (controllerRef) {
        controllerRef.current = null
      }
      setMapBuilt(false)
      setLoading(false)
      logger.debug(CATEGORY, 'effect:cleanup', { mapId })
    }
    // containerRef es estable (ref de React); solo mapId dispara rebuild.
    // lowPowerMode y tileProfile se aplican en vivo (effect de abajo): un
    // rebuild en mitad de una conexión degradada = pantalla en negro + refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId])

  // ── swap de perfil/potencia sin reconstruir ────────────────────────────────
  // tileProfile cambia (standard ↔ hd) al cambiar la conexión. En lugar de
  // reconstruir el mapa (costoso), se reemplaza el source de tiles en vivo
  // vía MapController.setTileProfile. El mapa se construye con el perfil
  // inicial (primer render); este effect solo aplica los cambios posteriores.
  // lowPowerMode se aplica igual: paralelismo en vivo + pulse estático
  // (vía addPois en AtlasMap); sin reconstruir.
  useEffect(() => {
    if (!mapBuilt) return
    applyParallelRequests(lowPowerMode)
    const controller = controllerRef?.current
    if (!controller) return
    logger.debug(CATEGORY, 'effect:profile-swap', { tileProfile })
    controller.setTileProfile(tileProfile)
  }, [tileProfile, lowPowerMode, mapBuilt, controllerRef])

  return { mapRef, error }
}
