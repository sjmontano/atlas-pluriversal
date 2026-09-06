/**
 * 🗂️ LAYER MENU — Menú de capas estilo v17 (botón derecho + ojos)
 * ===============================================================
 * Botón gemelo del Home a la derecha (`icono-capas.webp` + etiqueta en
 * hover). Hover despliega el panel (efímero CSS), click lo fija abierto.
 * On/off por capa con ojo abierto/cerrado (`show`/`hide`) en 3 niveles
 * (Todas, grupo, capa). Datos intactos: lee `layers/groups/legends` del
 * `map.ts` y muta `layerStore` (el `LayerManager` sincroniza MapLibre).
 */

import { useMemo, useState, useCallback } from 'react'
import { useLayerStore } from '@stores/layerStore'
import { getMapContent } from '@content'
import { Glyph } from '../modal/primitives/Glyph'
import type { Layer, LegendItem } from '../../types/layer.ts'
import styles from './LayerMenu.module.css'

interface Props {
  mapId: string
  /** Desplaza el conjunto debajo de una topbar (solo /test). Default: false. */
  offsetTop?: boolean
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

function EyeButton({
  on,
  mixed = false,
  label,
  onToggle,
}: {
  on: boolean
  mixed?: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className={`${styles.eye}${on ? ` ${styles.eyeOn}` : ''}${mixed ? ` ${styles.eyeMixed}` : ''}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={label}
      title={label}
    >
      <Glyph name={on || mixed ? 'show' : 'hide'} size={20} />
    </button>
  )
}

export function LayerMenu({ mapId, offsetTop = false }: Props) {
  const content = useMemo(() => getMapContent(mapId), [mapId])
  const layers = content?.layers ?? null
  const groups = content?.groups ?? null
  const legends = content?.legends ?? null
  const store = useLayerStore()
  const { visibleLayers, expandedGroups } = store
  const toggleLayer = store.toggleLayer
  const setLayerGroupVisible = store.setLayerGroupVisible
  const toggleGroupExpanded = store.toggleGroupExpanded

  /** Click fija el panel abierto; sin click el hover lo contrae. */
  const [pinned, setPinned] = useState(false)

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
    <>
      <div className={styles.guideLine} aria-hidden="true">
        <img src="/assets/ui/layers/indice-capas-menu.svg" alt="" draggable={false} />
      </div>
      <div className={`${styles.wrap}${offsetTop ? ` ${styles.offsetTop}` : ''}${pinned ? ` ${styles.pinned}` : ''}`}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setPinned((p) => !p)}
        aria-expanded={pinned}
        aria-label="Menú de capas"
        title="Menú de capas"
      >
        <img
          src="/assets/ui/layers/icono-capas.webp"
          alt=""
          className={styles.toggleIcon}
          draggable={false}
        />
        <span className={styles.toggleLabel}>Menú de capas</span>
      </button>

      <div
        className={styles.panel}
        role="region"
        aria-label="Capas"
        aria-hidden={!pinned}
        onClick={() => setPinned(true)}
      >
        <div className={styles.body}>
          {hasLayers && (
            <>
              <div className={styles.masterRow}>
                <EyeButton
                  on={masterTriState === true}
                  mixed={masterTriState === 'indeterminate'}
                  label={allVisible ? 'Ocultar todas las capas' : 'Mostrar todas las capas'}
                  onToggle={() => {
                    setLayerGroupVisible('__all__', !allVisible, layers!.map((l) => l.id))
                  }}
                />
                <span>Todas</span>
              </div>

              {groups?.map((group) => {
                const groupLayers = layers!.filter((l) => l.group === group.id)
                if (groupLayers.length === 0) return null
                const isExpanded = expandedGroups[group.id] !== false
                const tri = groupTriState(group.id, layers!, visibleLayers)

                return (
                  <div key={group.id} className={styles.group}>
                    <div className={styles.groupHeader}>
                      <EyeButton
                        on={tri === true}
                        mixed={tri === 'indeterminate'}
                        label={tri === true ? `Ocultar ${group.name}` : `Mostrar ${group.name}`}
                        onToggle={() => handleGroupToggle(group.id, groupLayers)}
                      />
                      <span
                        className={styles.groupName}
                        title={group.name}
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
                        <LayerRow
                          key={layer.id}
                          layer={layer}
                          visible={visibleLayers.has(layer.id)}
                          onToggle={() => toggleLayer(layer.id)}
                        />
                      ))}
                  </div>
                )
              })}

              {layers!
                .filter((l) => !l.group)
                .map((layer) => (
                  <LayerRow
                    key={layer.id}
                    layer={layer}
                    visible={visibleLayers.has(layer.id)}
                    onToggle={() => toggleLayer(layer.id)}
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
        </div>
      </div>
    </>
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

function LayerRow({
  layer,
  visible,
  onToggle,
}: {
  layer: Layer
  visible: boolean
  onToggle: () => void
}) {
  return (
    <div className={styles.layerRow}>
      <EyeButton
        on={visible}
        label={visible ? `Ocultar ${layer.name}` : `Mostrar ${layer.name}`}
        onToggle={onToggle}
      />
      {layer.legend?.swatch && (
        <span className={styles.swatch} style={{ backgroundColor: layer.legend.swatch }} />
      )}
      <span className={styles.layerName} title={layer.legend?.description}>
        {layer.name}
      </span>
    </div>
  )
}
