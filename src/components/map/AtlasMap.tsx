import { useEffect, useRef, useMemo, useState } from 'react'
import type { RefObject } from 'react'
import { useMap } from '@hooks/useMap'
import { useAutoLowPower } from '@hooks/useAutoLowPower'
import { usePrefetchAdjacent } from '@hooks/usePrefetchAdjacent'
import { useTilePrefetch } from '@hooks/useTilePrefetch'
import { useNavigate } from 'react-router-dom'
import { useMapStore } from '@stores/mapStore'
import { useModalStore } from '@stores/modalStore'
import { useMapUIStore } from '@stores/mapUIStore'
import { useConnectionStore } from '@stores/connectionStore'
import { useLayerStore } from '@stores/layerStore'
import { addBasemap, removeBasemap, setImageOpacity } from '@services/BasemapManager'
import {
  sync as syncLayers,
  removeAll as removeAllLayers,
  bindLayerClicks,
} from '@services/LayerManager'
import { addPois, removePois } from '@services/PoiManager'
import { addEncuadres, removeEncuadres } from '@services/EncuadresManager'
import { getMapContent } from '@content'
import { getModalById } from '@content/modals'
import { routeForMap } from '@data/chapters/chapters.ts'
import type { MapController } from '@services/MapRenderer'
import type { Poi } from '../../types/poi.ts'
import { LayerMenu } from './LayerMenu'
import { PoiModal } from './PoiModal'
import { CalibrationPanel } from '@components/dev/calibration/CalibrationPanel'
import { OfflineBanner } from './OfflineBanner'
import styles from './AtlasMap.module.css'

import { DEV_TOOLS } from '@config'

export interface AtlasMapProps {
  mapId: string
  controllerRef?: RefObject<MapController | null>
  /** Desplaza el menú de capas debajo de una topbar (solo /test). */
  layerMenuOffsetTop?: boolean
  /** Oculta el menú de capas del mapa (en /test vive en el panel Dev). */
  hideLayerMenu?: boolean
}

export function AtlasMap({ mapId, controllerRef, layerMenuOffsetTop = false, hideLayerMenu = false }: AtlasMapProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { mapRef, error } = useMap({ mapId, containerRef, controllerRef })
  const loading = useMapStore((s) => s.loading)
  const mapBuilt = useMapStore((s) => s.mapBuilt)
  const tilesStatus = useMapStore((s) => s.tilesStatus)
  const isSlow = useConnectionStore((s) => s.isSlow)
  const initConnection = useConnectionStore((s) => s.init)

  const basemapVisible = useMapUIStore((s) => s.basemapVisible)
  const basemapStyle = useMapUIStore((s) => s.basemapStyle)
  const imageOpacity = useMapUIStore((s) => s.imageOpacity)
  const tilesVisible = useMapUIStore((s) => s.tilesVisible)

  const { visibleLayers, opacities } = useLayerStore()

  const content = useMemo(() => getMapContent(mapId), [mapId])
  const layers = content?.layers ?? null
  const groups = content?.groups ?? null
  const legends = content?.legends ?? null
  const pois = content?.pois ?? null
  const encuadres = content?.encuadres ?? null
  const hasLayers = layers !== null && layers.length > 0
  const hasLegends = legends !== null && legends.length > 0
  const [activePoi, setActivePoi] = useState<Poi | null>(null)
  const [rebuildKey] = useState(1)
  const [calibrationOpen, setCalibrationOpen] = useState(false)

  const handlePoiClick = (poi: Poi) => {
    if (poi.modalId) {
      const modal = getModalById(poi.modalId)
      if (modal) {
        useModalStore.getState().openModal(modal)
        return
      }
    }
    setActivePoi(poi)
  }

  useAutoLowPower()
  usePrefetchAdjacent(mapId)
  useTilePrefetch(mapId)

  useEffect(() => {
    initConnection()
  }, [initConnection])

  useEffect(() => {
    useLayerStore.getState().resetAll(
      mapId,
      (content?.layers ?? []).filter((l) => l.visibleByDefault).map((l) => l.id),
    )
    const map = mapRef.current
    return () => {
      if (map) {
        removeAllLayers(map)
        removePois(map)
      }
    }
  }, [mapId, mapRef, content])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (basemapVisible) {
      addBasemap(map, basemapStyle)
    } else {
      removeBasemap(map)
    }
    return () => {
      removeBasemap(map)
    }
  }, [basemapVisible, basemapStyle, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    setImageOpacity(map, imageOpacity)
  }, [imageOpacity, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    try {
      if (map.getLayer('atlas-tiles-layer')) {
        map.setLayoutProperty('atlas-tiles-layer', 'visibility', tilesVisible ? 'visible' : 'none')
      }
    } catch { /* noop */ }
  }, [tilesVisible, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapBuilt || !layers) return
    syncLayers(map, mapId, layers, groups, { visibleLayers, opacities })
  }, [mapRef, mapId, layers, groups, visibleLayers, opacities, mapBuilt])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapBuilt || !pois) return
    addPois(map, mapId, pois, handlePoiClick)
  }, [mapRef, mapId, pois, mapBuilt])

  /* Click en capa → modal (cuencas Tejidos del Agua, Voz del río…) */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapBuilt || !layers) return
    bindLayerClicks(map, layers, (modalId) => {
      const modal = getModalById(modalId)
      if (modal) useModalStore.getState().openModal(modal)
    })
  }, [mapRef, mapBuilt, layers])

  /* Encuadres navegables (polígono + etiqueta → otro mapa, URL-first) */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapBuilt || !encuadres) return
    let cancelled = false
    void addEncuadres(map, encuadres, (targetMapId) => {
      if (cancelled) return
      const route = routeForMap(targetMapId)
      if (route !== null) navigate(route)
    })
    return () => {
      cancelled = true
      removeEncuadres(map)
    }
  }, [mapRef, mapBuilt, encuadres, navigate])

  return (
    <div className={styles.wrapper} key={`${mapId}-${rebuildKey}`}>
      <div ref={containerRef} className={styles.mapContainer} />
      <OfflineBanner />

      {!loading && tilesStatus === 'degraded' && isSlow && (
        <div className={styles.degradedBanner}>
          <span>Modo básico: el mapa es navegable sin alta resolución por conexión lenta.</span>
        </div>
      )}

      {!loading && !error && !hideLayerMenu && (hasLayers || hasLegends) && <LayerMenu mapId={mapId} onCalibrate={() => setCalibrationOpen(true)} offsetTop={layerMenuOffsetTop} />}

      {DEV_TOOLS && calibrationOpen && controllerRef && (
        <CalibrationPanel
          key={mapId}
          mapId={mapId}
          controllerRef={controllerRef}
        />
      )}

      {activePoi && (
        <PoiModal poi={activePoi} onClose={() => setActivePoi(null)} />
      )}

      {(loading || tilesStatus === 'loading') && (
        <div className={styles.overlay}>
          <div className={styles.spinner} aria-label="Cargando mapa" />
        </div>
      )}

      {error && (
        <div className={styles.overlay}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}
    </div>
  )
}
