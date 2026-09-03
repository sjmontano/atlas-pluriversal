import { useState, useCallback, useMemo } from 'react'
import type { RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMapUIStore } from '@stores/mapUIStore'
import { useMapStore } from '@stores/mapStore'
import { DevLayerMenu } from './DevLayerMenu'
import { CalibrationPanel } from './calibration/CalibrationPanel'
import { getAllMaps } from '@data/chapters/chapters'
import type { BasemapStyle } from '@services/BasemapManager'
import type { MapController } from '@services/MapRenderer'
import styles from './DevTools.module.css'

interface Props {
  mapId: string
  controllerRef?: RefObject<MapController | null>
}

export function DevTools({ mapId, controllerRef }: Props) {
  const navigate = useNavigate()
  const { basemapVisible, basemapStyle, imageOpacity, toggleBasemap, setBasemapStyle, setImageOpacity } = useMapUIStore()
  const { activeMapId, setActiveMap } = useMapStore()

  const allMaps = useMemo(() => getAllMaps().map(m => m.mapId), [])

  const [activeTab, setActiveTab] = useState<'layers' | 'calibration' | 'basemap' | 'maps'>('layers')
  const [collapsed, setCollapsed] = useState(false)

  const handleMapChange = useCallback((newMapId: string) => {
    setActiveMap(newMapId)
    navigate(`/test/${newMapId}`)
  }, [setActiveMap, navigate])

  const tabs = [
    { id: 'layers', label: 'Capas', icon: '🗂' },
    { id: 'calibration', label: 'Calibrar', icon: '🔧' },
    { id: 'basemap', label: 'Basemap', icon: '🌐' },
    { id: 'maps', label: 'Mapas', icon: '🗺️' },
  ] as const

  return (
    <div className={styles.devTools} role="region" aria-label="Herramientas de desarrollo">
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'layers' && <DevLayerMenu mapId={mapId} />}
        {activeTab === 'calibration' && controllerRef && (
          <CalibrationPanel mapId={mapId} controllerRef={controllerRef} />
        )}
        {activeTab === 'basemap' && (
          <BasemapDevControls
            visible={basemapVisible}
            style={basemapStyle}
            opacity={imageOpacity}
            onVisibleChange={toggleBasemap}
            onStyleChange={setBasemapStyle}
            onOpacityChange={setImageOpacity}
          />
        )}
        {activeTab === 'maps' && (
          <MapSelectorDev
            currentMapId={activeMapId}
            maps={allMaps}
            onChange={handleMapChange}
          />
        )}
      </div>

      <button
        className={`${styles.collapseBtn} ${collapsed ? styles.collapsed : ''}`}
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expandir herramientas' : 'Colapsar herramientas'}
        title={collapsed ? 'Expandir' : 'Colapsar'}
      >
        {collapsed ? '▶' : '▼'}
      </button>
    </div>
  )
}

interface BasemapDevControlsProps {
  visible: boolean
  style: BasemapStyle
  opacity: number
  onVisibleChange: () => void
  onStyleChange: (s: BasemapStyle) => void
  onOpacityChange: (o: number) => void
}

function BasemapDevControls({ visible, style, opacity, onVisibleChange, onStyleChange, onOpacityChange }: BasemapDevControlsProps) {
  const stylesList = ['light', 'streets', 'satellite'] as const

  return (
    <div className={styles.basemapPanel}>
      <div className={styles.section}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={visible}
            onChange={onVisibleChange}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider} />
          <span className={styles.toggleText}>Basemap visible</span>
        </label>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Estilo</div>
        <div className={styles.styleButtons}>
          {stylesList.map((s) => (
            <button
              key={s}
              className={`${styles.styleBtn} ${style === s ? styles.active : ''}`}
              onClick={() => onStyleChange(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Opacidad imagen base: {Math.round(opacity * 100)}%</div>
        <input
          type="range"
          className={styles.opacitySlider}
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}

interface MapSelectorDevProps {
  currentMapId: string
  maps: string[]
  onChange: (mapId: string) => void
}

function MapSelectorDev({ currentMapId, maps, onChange }: MapSelectorDevProps) {
  return (
    <div className={styles.mapSelector}>
      <div className={styles.sectionTitle}>Mapa activo: {currentMapId}</div>
      <div className={styles.mapList}>
        {maps.map((mapId) => (
          <button
            key={mapId}
            className={`${styles.mapItem} ${currentMapId === mapId ? styles.active : ''}`}
            onClick={() => onChange(mapId)}
          >
            {mapId}
          </button>
        ))}
      </div>
    </div>
  )
}