/**
 * 🗂️ LAYER MENU — Menú de capas estilo v17 (botón derecho + ojos)
 * ===============================================================
 * Botón gemelo del Home a la derecha (`icono-capas.webp` + etiqueta en
 * hover). El panel abre SOLO con click (pinned). El contenido es un árbol
 * genérico (`layerTree.ts`): título opcional, grupos/subgrupos numerados y
 * capas sueltas top-level — port de v17 `layerMenu.jsx`.
 *
 * Toggle en cascada: macro apaga todo lo de adentro, subgrupo lo suyo.
 * Datos intactos: lee `menuTitle/layers/groups` del `map.ts` y muta
 * `layerStore` (el `LayerManager` sincroniza MapLibre).
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLayerStore } from '@stores/layerStore'
import { getMapContent } from '@content'
import { Glyph } from '../modal/primitives/Glyph'
import type { Layer, LegendItem } from '../../types/layer.ts'
import { buildLayerTree, isCollapsible, triState, type GroupNode, type TreeNode, type TriState } from './layerTree'
import styles from './LayerMenu.module.css'

interface Props {
  mapId: string
  /** Desplaza el conjunto debajo de una topbar (solo /test). Default: false. */
  offsetTop?: boolean
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

/** Chevron v17 (^ expandido / v colapsado). */
function Chevron({ expanded, label }: { expanded: boolean; label: string }) {
  return (
    <span className={`${styles.chev} ${expanded ? styles.chevOpen : ''}`} aria-hidden="true">
      <Glyph name="arrow-up" size={20} />
      <span className={styles.chevLabel}>{label}</span>
    </span>
  )
}

export function LayerMenu({ mapId, offsetTop = false }: Props) {
  const content = useMemo(() => getMapContent(mapId), [mapId])
  const layers = content?.layers ?? null
  const groups = content?.groups ?? null
  const legends = content?.legends ?? null
  const menuTitle = content?.menuTitle
  const store = useLayerStore()
  const { visibleLayers, expandedGroups } = store
  const toggleLayer = store.toggleLayer
  const setLayerGroupVisible = store.setLayerGroupVisible
  const toggleGroupExpanded = store.toggleGroupExpanded

  const tree = useMemo(() => {
    const inMenu = (layers ?? []).filter((l) => l.hideInMenu !== true)
    return buildLayerTree(groups ?? [], inMenu, legends ?? [])
  }, [groups, layers, legends])

  /** Click abre/cierra el panel; el hover solo previsualiza. */
  const [pinned, setPinned] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  /* Click fuera o Escape cierran el panel. */
  useEffect(() => {
    if (!pinned) return
    const onPointerDown = (e: PointerEvent): void => {
      if (wrapRef.current !== null && !wrapRef.current.contains(e.target as Node)) {
        setPinned(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setPinned(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [pinned])

  const hasLayers = tree.roots.length > 0
  const hasLegends = tree.freeLegends.length > 0

  if (!hasLayers && !hasLegends) return null

  const legendGroups = tree.freeLegends

  const isExpanded = (node: GroupNode): boolean =>
    expandedGroups[node.group.id] ?? node.group.expandedByDefault ?? true

  const toggleGroup = (node: GroupNode): void => {
    const state = triState(visibleLayers, node.layerIds)
    setLayerGroupVisible(node.group.id, state !== true, node.layerIds)
  }

  const renderNode = (node: TreeNode): ReactNode => {
    if (node.kind === 'layer') {
      return (
        <LayerRow
          key={node.layer.id}
          layer={node.layer}
          number={node.number}
          visible={visibleLayers.has(node.layer.id)}
          onToggle={() => toggleLayer(node.layer.id)}
        />
      )
    }
    const expanded = isExpanded(node)
    const collapsible = node.group.collapsible ?? isCollapsible(node)
    const showHeader = node.group.header !== false
    const showEye = node.group.eye !== false
    const showNumber = showHeader && node.group.numbered !== false && node.number !== ''
    const state: TriState = triState(visibleLayers, node.layerIds)
    const eye = showEye ? (
      <EyeButton
        on={state === true}
        mixed={state === 'mixed'}
        label={state === true ? `Ocultar ${node.group.name}` : `Mostrar ${node.group.name}`}
        onToggle={() => toggleGroup(node)}
      />
    ) : null
    /* Fila de nombre de capa única: si el grupo tiene una sola capa directa,
       el ojo del grupo ya la alterna y la fila sobra (v17 1970/un-rio-cauca).
       Con varias capas se muestran para alternar individual. */
    const directLayers = node.children.filter((c) => c.kind === 'layer')
    const showLayerRows = directLayers.length !== 1 || !showEye
    /* Grupo plano v17 (sin encabezado): un ojo que alterna sus capas +
       filas estáticas. Los subgrupos siempre se renderizan. */
    if (!showHeader) {
      return (
        <div key={node.group.id} className={`${styles.group} ${styles.flat}`}>
          <div className={styles.flatRow}>
            {eye}
            <div className={styles.flatChildren}>
              {showLayerRows &&
                directLayers.map((child) => renderNode(child))}
              {node.children.map((child) =>
                child.kind === 'group' ? renderNode(child) : null,
              )}
              {node.legends.map((item) => (
                <StaticRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )
    }
    const open = !collapsible || expanded
    return (
      <div key={node.group.id} className={`${styles.group} ${node.depth === 0 ? styles.macro : styles.sub}`}>
        <div className={styles.groupHeader}>
          {collapsible && (
            <button
              type="button"
              className={styles.chevBtn}
              onClick={() => toggleGroupExpanded(node.group.id)}
              aria-expanded={expanded}
              aria-label={expanded ? `Colapsar ${node.group.name}` : `Expandir ${node.group.name}`}
              title={expanded ? 'Colapsar' : 'Expandir'}
            >
              <Chevron expanded={expanded} label={expanded ? 'Colapsar' : 'Expandir'} />
            </button>
          )}
          {eye}
          <span
            className={styles.groupName}
            title={node.group.name}
            onClick={() => collapsible && toggleGroupExpanded(node.group.id)}
          >
            {showNumber ? `${node.number}. ${node.group.name}` : node.group.name}
          </span>
        </div>

        {open && (
          <div className={styles.groupChildren}>
            {showLayerRows &&
              node.children.map((child) =>
                child.kind === 'layer' ? renderNode(child) : null,
              )}
            {node.children.map((child) =>
              child.kind === 'group' ? renderNode(child) : null,
            )}
            {node.legends.map((item) => (
              <StaticRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={styles.guideLine} aria-hidden="true">
        <img src="/assets/ui/layers/indice-capas-menu.svg" alt="" draggable={false} />
      </div>
      <div ref={wrapRef} className={`${styles.wrap}${offsetTop ? ` ${styles.offsetTop}` : ''}${pinned ? ` ${styles.pinned}` : ''}`}>
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
          {menuTitle !== undefined && <h2 className={styles.menuTitle}>{menuTitle}</h2>}

          {hasLayers && tree.roots.map((node) => renderNode(node))}

          {hasLegends && (
            <div className={styles.legendSection}>
              {legendGroups.map(([groupName, items], i) => (
                <div key={`${groupName ?? '__ungrouped__'}-${i}`} className={styles.legendGroup}>
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

/** Fila estática v17 anidada en grupos: con insignia por defecto, icono
 *  plano si `bare` (un-rio-cauca). Sin ojo: el ojo del grupo alterna. */
function StaticRow({ item }: { item: LegendItem }) {
  const icon = item.icon ? (
    item.bare === true ? (
      <img src={item.icon} alt="" className={styles.staticIcon} />
    ) : (
      <span className={styles.legendIcon}>
        <img src={item.icon} alt="" className={styles.legendIconImg} />
      </span>
    )
  ) : (
    <span className={styles.swatch} style={{ backgroundColor: item.swatch }} />
  )
  return (
    <div className={styles.staticRow}>
      {icon}
      <span className={styles.staticName} title={item.description}>
        {item.name}
      </span>
    </div>
  )
}

function LayerRow({
  layer,
  number,
  visible,
  onToggle,
}: {
  layer: Layer
  number: string | null
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
      {layer.legend?.icon ? (
        <span className={styles.legendIcon}>
          <img src={layer.legend.icon} alt="" className={styles.legendIconImg} />
        </span>
      ) : (
        layer.legend?.swatch && (
          <span className={styles.swatch} style={{ backgroundColor: layer.legend.swatch }} />
        )
      )}
      <span className={styles.layerName} title={layer.legend?.description}>
        {number !== null ? `${number}. ${layer.name}` : layer.name}
      </span>
    </div>
  )
}
