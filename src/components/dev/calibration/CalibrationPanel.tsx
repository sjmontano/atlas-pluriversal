import { useState } from 'react'
import type { RefObject } from 'react'
import type { MapController } from '@services/MapRenderer'
import { getMapContent } from '@content'
import { useLayerStore } from '@stores/layerStore'
import styles from './CalibrationPanel.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

interface Props {
  mapId: string
  controllerRef?: RefObject<MapController | null>
}

export function CalibrationPanel({ mapId, controllerRef }: Props) {
  const [collapsed, setCollapsed] = useState(true)
  const { visibleLayers } = useLayerStore()
  
  const onLayerIds = (getMapContent(mapId)?.layers ?? [])
    .filter((l) => visibleLayers.has(l.id))
    .map((l) => l.id)

  if (!controllerRef) return null

  return (
    <div className={styles.panel} role="region" aria-label="Calibración PGW">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Calibración</span>
        {ENABLE_DEV_TOOLS && getMapContent(mapId)?.layers && (
          <div className={styles.overridesSection}>
            <button className={`${styles.headerBtn} active`}>🗺 Mapa base</button>
            <button className={styles.headerBtn}>📐 Capas: {onLayerIds.length}</button>
          </div>
        )}
        <div className={styles.headerActions}>
          <button className={styles.headerBtn} onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? '▶' : '▼'}
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className={styles.body}>
          <div className={styles.readout}>
            <div className={styles.readoutTitle}>Panel de calibración simplificado</div>
            <div className={styles.readoutRow}>
              <span>Conectar controllerRef para funcionalidad completa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}