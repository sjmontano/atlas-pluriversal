import { useMemo, useState, useCallback } from 'react'
import { useLayerStore } from '@stores/layerStore'
import { getMapContent } from '@content'
import type { Layer, LegendItem } from '../../types/layer'
import styles from './DevLayerMenu.module.css'

interface Props {
  mapId: string
}

function groupTriState(groupId: string, layers: Layer[], visibleLayers: Set<string>): boolean | 'indeterminate' {
  const groupLayers = layers.filter((l) => l.group === groupId)
  if (groupLayers.length === 0) return false
  const visibleCount = groupLayers.filter((l) => visibleLayers.has(l.id)).length
  if (visibleCount === 0) return false
  if (visibleCount === groupLayers.length) return true
  return 'indeterminate'
}

function groupLegends(legends: LegendItem[]): Array<[string | null, LegendItem[]]> {
  const orderedGroups: string[] = []
  const byGroup = new Map<string, LegendItem[]>()
  const ungrouped: LegendItem[] = []

  for (const item of legends) {
    if (!item.group) {
      ungrouped.push(item)
      continue
    }
    if (!byGroup.has(item.group)) {
      byGroup.set(item.group, [])
      orderedGroups.push(item.group)
    }
    byGroup.get(item.group)!.push(item)
  }

  const result: Array<[string | null, LegendItem[]]> = []
  for (const group of orderedGroups) {
    result.push([group, byGroup.get(group)!])
  }
  if (ungrouped.length > 0) result.push([null, ungrouped])
  return result
}

export function DevLayerMenu({ mapId }: Props) {
  const content = useMemo(() => getMapContent(mapId), [mapId])
  const layers = content?.layers ?? null
  const groups = content?.groups ?? null
  const legends = content?.legends ?? null
  const store = useLayerStore()
  const { visibleLayers, opacities, expandedGroups } = store
  const toggleLayer = store.toggleLayer
  const setLayerOpacity = store.setLayerOpacity
  const setLayerGroupVisible = store.setLayerGroupVisible
  const toggleGroupExpanded = store.toggleGroupExpanded

  const [collapsed, setCollapsed] = useState(false)

  const hasLayers = layers !== null && layers.length > 0
  const hasLegends = legends !== null && legends.length > 0

  const handleGroupToggle = useCallback(
    (groupId: string, groupLayers: Layer[]) => {
      const state = groupTriState(groupId, groupLayers, visibleLayers)
      setLayerGroupVisible(groupId, state !== true, groupLayers.map((l) => l.id))
    },
    [visibleLayers, setLayerGroupVisible],
  )

  if (!hasLayers && !hasLegends) return null

  const legendGroups = hasLegends ? groupLegends(legends!) : []

  const allVisible = hasLayers ? layers!.every((l) => visibleLayers.has(l.id)) : true
  const noneVisible = hasLayers ? layers!.every((l) => !visibleLayers.has(l.id)) : true
  const masterTriState = allVisible ? true : noneVisible ? false : 'indeterminate'

  return (
    <div className={styles.panel} role="region" aria-label="Capas de desarrollo">
      <div className={styles.header}>
        <span className={styles.headerTitle}>🗂 Capas (Dev)</span>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expandir panel' : 'Colapsar panel'}
          aria-label={collapsed ? 'Expandir' : 'Colapsar'}
        >
          {collapsed ? '▶' : '▼'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.body}>
          {hasLayers && (
            <>
              <label className={styles.masterRow}>
                <input
                  type="checkbox"
                  checked={allVisible}
                  ref={(el) => {
                    if (el) el.indeterminate = masterTriState === 'indeterminate'
                  }}
                  onChange={() => {
                    setLayerGroupVisible('__all__', !allVisible, layers!.map((l) => l.id))
                  }}
                  className={styles.masterCheckbox}
                />
                <span>Todas las capas</span>
              </label>

              {groups?.map((group) => {
                const groupLayers = layers!.filter((l) => l.group === group.id)
                if (groupLayers.length === 0) return null
                const isExpanded = expandedGroups[group.id] !== false
                const tri = groupTriState(group.id, layers!, visibleLayers)

                return (
                  <div key={group.id} className={styles.group}>
                    <div className={styles.groupHeader}>
                      <input
                        type="checkbox"
                        checked={tri === true}
                        ref={(el) => {
                          if (el) el.indeterminate = tri === 'indeterminate'
                        }}
                        onChange={() => handleGroupToggle(group.id, groupLayers)}
                        className={styles.groupCheckbox}
                      />
                      <span
                        className={styles.groupName}
                        onClick={() => toggleGroupExpanded(group.id)}
                      >
                        {group.name} ({groupLayers.length})
                      </span>
                      <span
                        className={`${styles.groupArrow} ${isExpanded ? styles.expanded : ''}`}
                        onClick={() => toggleGroupExpanded(group.id)}
                      >
                        ▶
                      </span>
                    </div>

{isExpanded &&
                        groupLayers.map((layer) => (
                          <DevLayerRow
                            key={layer.id}
                            layer={layer}
                            visible={visibleLayers.has(layer.id)}
                            opacity={opacities[layer.id] ?? layer.opacity ?? 1}
                            onToggle={() => toggleLayer(layer.id)}
                            onOpacityChange={(v) => setLayerOpacity(layer.id, v)}
                          />
                        ))}
                  </div>
                )
              })}

              {layers!
                .filter((l) => !l.group)
                .map((layer) => (
                  <DevLayerRow
                    key={layer.id}
                    layer={layer}
                    visible={visibleLayers.has(layer.id)}
                    opacity={opacities[layer.id] ?? layer.opacity ?? 1}
                    onToggle={() => toggleLayer(layer.id)}
                    onOpacityChange={(v) => setLayerOpacity(layer.id, v)}
                  />
                ))}
            </>
          )}

          {hasLegends && (
            <div className={styles.legendSection}>
              <div className={styles.legendSectionTitle}>Leyenda</div>
              {legendGroups.map(([groupName, items]) => (
                <div key={groupName ?? '__ungrouped__'} className={styles.legendGroup}>
                  {groupName && <div className={styles.legendGroupName}>{groupName}</div>}
                  {items.map((item) => (
                    <LegendRow key={item.id} item={item} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface DevLayerRowProps {
  layer: Layer
  visible: boolean
  opacity: number
  onToggle: () => void
  onOpacityChange: (v: number) => void
}

function DevLayerRow({
  layer,
  visible,
  opacity,
  onToggle,
  onOpacityChange,
}: DevLayerRowProps) {
  return (
    <div
      className={`${styles.layerRow} ${visible ? styles.layerVisible : styles.layerHidden}`}
    >
      <label className={styles.eyeWrapper}>
        <input
          type="checkbox"
          checked={visible}
          onChange={onToggle}
          className={styles.eyeCheckbox}
          aria-label={layer.name}
        />
        <span className={`${styles.eyeIcon} ${visible ? styles.eyeOpen : styles.eyeClosed}`}>
          {visible ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </span>
      </label>
      {layer.legend?.swatch && (
        <span className={styles.swatch} style={{ backgroundColor: layer.legend.swatch }} />
      )}
      <span className={styles.layerName} title={layer.legend?.description}>
        {layer.name}
      </span>
      {visible && (
        <input
          type="range"
          className={styles.opacitySlider}
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Opacidad de ${layer.name}`}
        />
      )}
    </div>
  )
}

function LegendRow({ item }: { item: LegendItem }) {
  return (
    <div className={styles.legendRow}>
      {item.icon ? (
        <span className={styles.legendIcon}>
          <img src={item.icon} alt="" className={styles.legendIconImg} />
        </span>
      ) : (
        <span className={styles.swatch} style={{ backgroundColor: item.swatch }} />
      )}
      <span className={styles.legendName} title={item.description}>
        {item.name}
      </span>
      {item.longText && (
        <span className={styles.infoIcon} tabIndex={0} aria-label={item.name}>
          ⓘ
          <span className={styles.tooltip}>{item.longText}</span>
        </span>
      )}
    </div>
  )
}