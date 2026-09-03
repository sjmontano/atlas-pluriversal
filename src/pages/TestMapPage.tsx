/**
 * 🧪 TEST MAP PAGE — visor simple de desarrollo (/test/:mapId)
 * ============================================================
 * A propósito SIN el ShellLayout completo: mapa a pantalla completa +
 * topbar mínima + paginación + DevToolsOverlay. La UI completa vive
 * solo en las rutas de producción (/capitulo/:n/:mapId, /intro).
 */

import { useParams, Link } from 'react-router-dom'
import { useRef, useEffect, useMemo } from 'react'
import { getAllMaps } from '@data/chapters/chapters.ts'
import { AtlasMap } from '@components/map/AtlasMap.tsx'
import { DevToolsOverlay } from '@components/dev/DevToolsOverlay'
import { useMapStore } from '@stores/mapStore'
import type { MapController } from '@services/MapRenderer'
import styles from './TestMapPage.module.css'

export function TestMapPage() {
  const { mapId } = useParams<{ mapId: string }>()
  const allMaps = useMemo(() => getAllMaps(), [])
  const currentIndex = allMaps.findIndex((m) => m.mapId === mapId)
  const currentMap = allMaps[currentIndex]
  const prevMap = currentIndex > 0 ? allMaps[currentIndex - 1] : null
  const nextMap = currentIndex < allMaps.length - 1 ? allMaps[currentIndex + 1] : null

  const controllerRef = useRef<MapController | null>(null)

  useEffect(() => {
    if (mapId !== undefined && useMapStore.getState().activeMapId !== mapId) {
      useMapStore.getState().setActiveMap(mapId)
    }
  }, [mapId])

  if (!currentMap) {
    return (
      <div className={styles.missing}>
        <p>Mapa no encontrado: {mapId}</p>
        <Link to="/dev" className={styles.backLink}>← Volver al menú</Link>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <AtlasMap
        key={currentMap.mapId}
        mapId={currentMap.mapId}
        controllerRef={controllerRef}
      />
      <DevToolsOverlay
        mapId={currentMap.mapId}
        controllerRef={controllerRef}
      />

      <div className={styles.topbar}>
        <Link to="/dev" className={styles.backLink}>← /dev</Link>
        <span className={styles.topTitle}>{currentMap.title}</span>
        <span className={styles.counter}>
          {currentIndex + 1} / {allMaps.length}
        </span>
      </div>

      <nav className={styles.pagination}>
        {prevMap ? (
          <Link to={`/test/${prevMap.mapId}`} className={styles.navBtn}>
            ← {prevMap.title}
          </Link>
        ) : (
          <span />
        )}
        {nextMap ? (
          <Link to={`/test/${nextMap.mapId}`} className={styles.navBtn}>
            {nextMap.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
