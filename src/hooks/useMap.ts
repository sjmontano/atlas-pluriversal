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
 * StrictMode (solo dev): React monta→desmonta→remonta el effect. Con
 * un contador de generación (`buildGen`) la primera build se descarta
 * automáticamente sin afectar al estado visible.
 */

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type * as maplibregl from 'maplibre-gl'
import { getMapContent } from '@content'
import { buildGeoreferencedMap, type MapController } from '@services/MapRenderer'
import { logger } from '@services/MapLogger'
import { useMapStore } from '@stores/mapStore'
import { useUIStore } from '@stores/uiStore'
import { useConnectionStore } from '@stores/connectionStore'

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
  const lowPowerMode = useUIStore((s) => s.lowPowerMode)
  const tileProfile = useConnectionStore((s) => s.tileProfile)

  // ── contador de generación (resuelve el doble-build de StrictMode) ────────
  // En StrictMode dev el effect se ejecuta 2 veces seguidas (montar→desmontar→
  // remontar). Cada ejecución incrementa buildGen; el .then solo aplica
  // el resultado si el número de generación coincide con el último en curso.
  const buildGenRef = useRef(0)

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

    const buildGen = ++buildGenRef.current
    let destroy: (() => void) | null = null

    setLoading(true)
    setError(null)

    logger.debug(CATEGORY, 'effect:build-start', { mapId, buildGen })

    buildGeoreferencedMap(container, mapId, entry, { lowPowerMode, tileProfile })
      .then((result) => {
        // ¿Sigue siendo esta la build más reciente?
        if (buildGen !== buildGenRef.current) {
          logger.trace(CATEGORY, 'effect:build-descartado', { mapId, buildGen })
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
        logger.debug(CATEGORY, 'effect:build-ok', { mapId, buildGen })
      })
      .catch((err: unknown) => {
        if (buildGen !== buildGenRef.current) {
          logger.trace(CATEGORY, 'effect:build-abortado', { mapId, buildGen })
          return
        }
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        setStoreError(msg)
        setLoading(false)
        logger.error(CATEGORY, `Error construyendo mapa: ${mapId}`, err)
      })

    return () => {
      destroy?.()
      mapRef.current = null
      if (controllerRef) {
        controllerRef.current = null
      }
      setMapBuilt(false)
      logger.debug(CATEGORY, 'effect:cleanup', { mapId })
    }
    // containerRef es estable (ref de React); mapId + lowPowerMode disparan rebuild.
    // tileProfile NO va aquí: su cambio se aplica en vivo (effect de swap abajo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId, lowPowerMode])

  // ── swap de perfil sin reconstruir ─────────────────────────────────────────
  // tileProfile cambia (standard ↔ hd) al cambiar la conexión. En lugar de
  // reconstruir el mapa (costoso), se reemplaza el source de tiles en vivo
  // vía MapController.setTileProfile. El mapa se construye con el perfil
  // inicial (primer render); este effect solo aplica los cambios posteriores.
  useEffect(() => {
    if (!mapBuilt) return
    const controller = controllerRef?.current
    if (!controller) return
    logger.debug(CATEGORY, 'effect:profile-swap', { tileProfile })
    controller.setTileProfile(tileProfile)
  }, [tileProfile, mapBuilt, controllerRef])

  return { mapRef, error }
}
