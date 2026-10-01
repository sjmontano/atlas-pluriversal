import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { RefObject } from 'react'
import type { MapController } from '@services/MapRenderer'
import { getMapContent } from '@content'
import {
  pgwToState,
  stateToPGW,
  shiftOrigin,
  scaleParam,
  clampCalibration,
  type CalibrationState,
} from '@services/MapCalibration'
import { saveCalibration } from '@services/SaveCalibration'
import { updateLayerPGW } from '@services/LayerManager'
import {
  shiftFeatureCollection,
  shiftLngLat,
} from '@services/shiftGeoJSON'
import {
  encuadrePolygonSourceId,
  encuadreLabelSourceId,
} from '@services/EncuadresManager'
import { POIS_SOURCE_ID, poiToFeature } from '@services/PoiManager'
import { processBounds } from '@services/BoundsCalculator'
import { useLayerStore } from '@stores/layerStore'
import type { Layer } from '../../../types/layer.ts'
import type { Encuadre } from '../../../types/content.ts'
import type { Poi } from '../../../types/poi.ts'
import type { BoundsResult } from '@services/BoundsCalculator'
import styles from './CalibrationPanel.module.css'

import { DEV_TOOLS } from '@config'

const ENABLE_DEV_TOOLS = DEV_TOOLS

interface Props {
  mapId: string
  controllerRef: RefObject<MapController | null>
  onRebuild?: () => void
  onClose?: () => void
}

type FieldKey = 'd' | 'b' | 'c' | 'f' | 'width' | 'height'

type CalibrationTarget =
  | { kind: 'map' }
  | { kind: 'layers'; layerIds: string[] }
  | { kind: 'encuadres' }
  | { kind: 'pois' }

/** Paso de flechas en px de pantalla (fino 1px). Válido con cualquier bearing. */
const ENC_PX_STEP = 5
const ENC_PX_STEP_FINE = 1

interface EncuadreOriginal {
  polygon: { type: 'FeatureCollection'; features: Array<{ geometry: unknown }> } | null
  label: [number, number]
  file: string | null
}

/** Source GeoJSON viva (setData) sin acoplar tipos de maplibre. */
function liveGeoJSONSource(map: unknown, id: string): { setData: (data: unknown) => void } | undefined {
  try {
    const src = (map as { getSource?: (sid: string) => unknown }).getSource?.(id) as
      | { setData?: unknown }
      | undefined
    if (src !== null && src !== undefined && typeof src.setData === 'function') {
      return src as { setData: (data: unknown) => void }
    }
  } catch { /* noop */ }
  return undefined
}

const PCT_STEPS = [0.0001, 0.001, 0.01, 0.1]
const DEG_STEP_DEFAULT = 0.0005
const PX_STEP = 1
const PX_STEP_QUICK = 10
const DEFAULT_VIEWPORT_MARGIN = 0

/**
 * Rango mínimo del "Margen viewport" en %. Negativo encoge el
 * viewportMaxBounds hacia dentro de la imagen (recorte del pan).
 * |factor| < 0.5 garantiza que el box no se invierta (spans positivos).
 */
const VIEWPORT_MARGIN_MIN_PCT = -50

function computeReadout(pgw: readonly [number, number, number, number, number, number], width: number, height: number) {
  const { coordinates, bounds } = processBounds(pgw, width, height)
  return { coordinates, bounds }
}

function seedState(mapId: string, state?: CalibrationState): CalibrationState {
  if (state) return clampCalibration(state)
  const entry = getMapContent(mapId)
  if (!entry) throw new Error(`Mapa no encontrado: ${mapId}`)
  return pgwToState(entry.geo.pgw, entry.geo.width, entry.geo.height)
}

function fmtNum(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '—'
  return value.toFixed(decimals)
}

function fmtExp(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return value.toExponential(6)
}

export function CalibrationPanel({ mapId, controllerRef, onRebuild, onClose }: Props) {
  const originalRef = useRef<CalibrationState | null>(null)
  const [state, setState] = useState<CalibrationState | null>(null)
  const [readout, setReadout] = useState<Pick<BoundsResult, 'coordinates' | 'bounds'> | null>(null)
  const [dirty, setDirty] = useState<Record<FieldKey, boolean>>({ d: false, b: false, c: false, f: false, width: false, height: false })
  const [collapsed, setCollapsed] = useState(true)
  const [moveMode, setMoveMode] = useState(false)
  const [target, setTarget] = useState<CalibrationTarget>({ kind: 'map' })
  const [activeLayerIdx, setActiveLayerIdx] = useState(0)
  const { visibleLayers } = useLayerStore()
  const layerStatesRef = useRef<Map<string, { current: CalibrationState; original: CalibrationState }>>(new Map())
  const [saveError, setSaveError] = useState<string | null>(null)

  const stepPctRef = useRef(PCT_STEPS[1])
  const [stepPctIdx, setStepPctIdx] = useState(1)

  /* ── Target encuadres: offsets en GEO (estables ante zoom), aplicados en
   * vivo al polígono y a la etiqueta a la vez para que nunca se despeguen.
   * Las flechas trabajan en PX de pantalla convertidos por frame: válidas
   * con cualquier bearing (con -90° la X visual es latitud). */
  const [encIdx, setEncIdx] = useState(0)
  const [encFine, setEncFine] = useState(false)
  /* Bulk: flechas y drag aplican el mismo delta a TODA la lista (p. ej.
   * recorregir la tanda completa de GeoJSON de una vez). */
  const [encBulk, setEncBulk] = useState(false)
  const [, setEncTick] = useState(0)
  const encOffsetsRef = useRef(new Map<string, { dlng: number; dlat: number }>())
  const encOriginalsRef = useRef(new Map<string, EncuadreOriginal>())

  /* ── Target POIs: mismo patrón que encuadres (offsets GEO + bulk).
   * Los originales son los coords del content (sin fetch). Al mover se
   * reconstruye la source atlas-pois-source: círculos, pulso e iconos se
   * mueven juntos por construcción. OJO dev: el hit-test de tooltips de
   * PoiManager usa los coords originales, así que durante la calibración
   * el hover/click del POI responde en su posición vieja; al pegar los
   * coords en el pois.ts y recargar, todo vuelve a coincidir. */
  const [poiIdx, setPoiIdx] = useState(0)
  const [poiFine, setPoiFine] = useState(false)
  const [poiBulk, setPoiBulk] = useState(false)
  const poiOffsetsRef = useRef(new Map<string, { dlng: number; dlat: number }>())

  /** Convierte un desplazamiento en px de pantalla a delta geo al zoom
   *  actual (válido con cualquier bearing). Null si el mapa no responde. */
  const pxDeltaToGeo = (dxPx: number, dyPx: number): { dlng: number; dlat: number } | null => {
    const map = controllerRef.current?.map
    if (!map) return null
    try {
      const center = map.getCenter()
      const p = map.project(center)
      const g = map.unproject([p.x + dxPx, p.y + dyPx])
      return { dlng: g.lng - center.lng, dlat: g.lat - center.lat }
    } catch {
      return null
    }
  }

  /* Antes del efecto de drag (TDZ): reconstruye la source de POIs con offsets. */
  const rebuildPoiSource = useCallback(() => {
    const map = controllerRef.current?.map
    if (!map) return
    const list = getMapContent(mapId)?.pois ?? []
    try {
      const features = list.map((poi) => {
        const feature = poiToFeature(poi)
        const off = poiOffsetsRef.current.get(poi.id)
        if (off) {
          const [lng, lat] = shiftLngLat(poi.coords, off.dlng, off.dlat)
          feature.geometry.coordinates = [lng, lat]
        }
        return feature
      })
      liveGeoJSONSource(map, POIS_SOURCE_ID)?.setData({ type: 'FeatureCollection', features })
    } catch { /* source aún no lista */ }
  }, [controllerRef, mapId])

  const addPoiOffset = useCallback((poi: Poi, dLng: number, dLat: number) => {
    const cur = poiOffsetsRef.current.get(poi.id) ?? { dlng: 0, dlat: 0 }
    poiOffsetsRef.current.set(poi.id, { dlng: cur.dlng + dLng, dlat: cur.dlat + dLat })
    rebuildPoiSource()
    setEncTick((t) => t + 1)
  }, [rebuildPoiSource])

  /* Declarados antes del efecto de drag (TDZ): aplican el offset en vivo. */
  const applyEncShift = useCallback((enc: Encuadre, off: { dlng: number; dlat: number }) => {
    const map = controllerRef.current?.map
    if (!map) return
    const orig = encOriginalsRef.current.get(enc.id)
    if (!orig) return
    try {
      if (orig.polygon !== null) {
        liveGeoJSONSource(map, encuadrePolygonSourceId(enc.id))?.setData(
          shiftFeatureCollection(orig.polygon, off.dlng, off.dlat),
        )
      }
      const [lng, lat] = shiftLngLat(orig.label, off.dlng, off.dlat)
      liveGeoJSONSource(map, encuadreLabelSourceId(enc.id))?.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: [lng, lat] },
          },
        ],
      })
    } catch { /* source aún no lista */ }
  }, [controllerRef])

  const addEncOffset = useCallback((enc: Encuadre, dLng: number, dLat: number) => {
    const cur = encOffsetsRef.current.get(enc.id) ?? { dlng: 0, dlat: 0 }
    const next = { dlng: cur.dlng + dLng, dlat: cur.dlat + dLat }
    encOffsetsRef.current.set(enc.id, next)
    applyEncShift(enc, next)
    setEncTick((t) => t + 1)
  }, [applyEncShift])

  const viewportMarginsOriginalRef = useRef({ h: DEFAULT_VIEWPORT_MARGIN, v: DEFAULT_VIEWPORT_MARGIN })
  const [viewportMarginH, setViewportMarginH] = useState(DEFAULT_VIEWPORT_MARGIN)
  const [viewportMarginV, setViewportMarginV] = useState(DEFAULT_VIEWPORT_MARGIN)
  const isEcosistemas = mapId === 'chapter1-ecosistemas'

  const onLayerIds = useMemo(
    () => (getMapContent(mapId)?.layers ?? []).filter((l) => visibleLayers.has(l.id)).map((l) => l.id),
    [mapId, visibleLayers],
  )

  /* Solo las capas raster-pgw tienen PGW calibrable (geojson/tiles no). */
  function calibratableIds(ids: string[]): string[] {
    const allLayers = getMapContent(mapId)?.layers ?? []
    return ids.filter((id) => {
      const layer: Layer | undefined = allLayers.find((l) => l.id === id)
      return layer !== undefined && layer.type === 'raster-pgw'
    })
  }

  useEffect(() => {
    if (onLayerIds.length > 0 && target.kind !== 'layers') {
      const layerIds = calibratableIds([...onLayerIds])
      if (layerIds.length === 0) return
      setTarget({ kind: 'layers', layerIds })
      initLayerStates(layerIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyAndUpdate = useCallback((newState: CalibrationState) => {
    setState(newState)
    if (target.kind === 'layers' && target.layerIds.length > 0) {
      const map = controllerRef.current?.map
      if (map) {
          const activeId = target.layerIds[activeLayerIdx]
        if (activeId) {
          const entry = layerStatesRef.current.get(activeId)
          if (entry) entry.current = newState
        }
        for (const layerId of target.layerIds) {
          const entry = layerStatesRef.current.get(layerId)
          if (!entry) continue
          updateLayerPGW(map, layerId, stateToPGW(entry.current), entry.current.width, entry.current.height)
        }
      }
      const activeId2 = target.layerIds[activeLayerIdx]
      if (activeId2) {
        const activeEntry = layerStatesRef.current.get(activeId2)
        if (activeEntry) {
          const r = computeReadout(stateToPGW(activeEntry.current), activeEntry.current.width, activeEntry.current.height)
          setReadout(r)
        }
        const orig = layerStatesRef.current.get(activeId2)
        setDirty({
          d: orig ? orig.original.d !== newState.d : false,
          b: orig ? orig.original.b !== newState.b : false,
          c: orig ? orig.original.c !== newState.c : false,
          f: orig ? orig.original.f !== newState.f : false,
          width: orig ? orig.original.width !== newState.width : false,
          height: orig ? orig.original.height !== newState.height : false,
        })
      }
      return
    }
    const controller = controllerRef.current
    if (!controller) return
    const pgw = stateToPGW(newState)
    try {
      const result = controller.updateBounds(pgw, newState.width, newState.height)
      setReadout({ coordinates: result.coordinates, bounds: result.bounds })
    } catch {
      // bounds inválidos durante calibración — no hacer nada
    }
    const orig = originalRef.current
    setDirty({
      d: orig ? orig.d !== newState.d : false,
      b: orig ? orig.b !== newState.b : false,
      c: orig ? orig.c !== newState.c : false,
      f: orig ? orig.f !== newState.f : false,
      width: orig ? orig.width !== newState.width : false,
      height: orig ? orig.height !== newState.height : false,
    })
  }, [controllerRef, target, activeLayerIdx])

  useEffect(() => {
    const s = seedState(mapId)
    originalRef.current = s
    setState(s)
    setDirty({ d: false, b: false, c: false, f: false, width: false, height: false })
    setMoveMode(false)
    const config = getMapContent(mapId)?.config
    const margin = config?.viewportMargin ?? DEFAULT_VIEWPORT_MARGIN
    const h = config?.viewportMarginH ?? margin
    const v = config?.viewportMarginV ?? margin
    viewportMarginsOriginalRef.current = { h, v }
    setViewportMarginH(h)
    setViewportMarginV(v)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId])

  useEffect(() => {
    if (!state || target.kind === 'layers') return
    try {
      const pgw = stateToPGW(state)
      const result = controllerRef.current?.updateBounds(pgw, state.width, state.height)
      if (result) {
        setReadout({ coordinates: result.coordinates, bounds: result.bounds })
      }
    } catch {
      // ignore
    }
  }, [state, controllerRef, target.kind])

  // --- drag handlers ---
  const dragRef = useRef<{
    pointerId: number
    startGeo: { lng: number; lat: number }
  } | null>(null)

  useEffect(() => {
    if (!controllerRef) return
    const controller = controllerRef.current
    if (!controller || !moveMode) return

    const map = controller.map
    const canvas = map.getCanvas()
    const container = map.getContainer()

    function getCanvasOffset(e: PointerEvent): { x: number; y: number } {
      const rect = container.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function onPointerDown(e: PointerEvent) {
      if (dragRef.current) return
      const { x, y } = getCanvasOffset(e)
      const geo = map.unproject([x, y])
      dragRef.current = { pointerId: e.pointerId, startGeo: { lng: geo.lng, lat: geo.lat } }
      canvas.setPointerCapture(e.pointerId)
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return
      const { x, y } = getCanvasOffset(e)
      const geo = map.unproject([x, y])
      const dLng = geo.lng - dragRef.current.startGeo.lng
      const dLat = geo.lat - dragRef.current.startGeo.lat

      if (target.kind === 'pois') {
        const list = getMapContent(mapId)?.pois ?? []
        const one = list[poiIdx]
        const targets = poiBulk ? list : one === undefined ? [] : [one]
        for (const p of targets) addPoiOffset(p, dLng, dLat)
        dragRef.current.startGeo = { lng: geo.lng, lat: geo.lat }
        return
      }

      if (target.kind === 'encuadres') {
        const list = getMapContent(mapId)?.encuadres ?? []
        const one = list[encIdx]
        const targets = encBulk ? list : one === undefined ? [] : [one]
        for (const enc of targets) addEncOffset(enc, dLng, dLat)
        dragRef.current.startGeo = { lng: geo.lng, lat: geo.lat }
        return
      }

      if (target.kind === 'layers' && target.layerIds.length > 0) {
        const activeId = target.layerIds[activeLayerIdx]
        if (!activeId) return
        const activeEntry = layerStatesRef.current.get(activeId)
        if (!activeEntry) return
        for (const layerId of target.layerIds) {
          const entry = layerStatesRef.current.get(layerId)
          if (!entry) continue
          const pgw = stateToPGW(entry.current)
          const shifted = shiftOrigin(pgw, -dLng, -dLat)
          entry.current = clampCalibration(pgwToState(shifted, entry.current.width, entry.current.height))
        }
        applyAndUpdate(activeEntry.current)
        dragRef.current.startGeo = { lng: geo.lng, lat: geo.lat }
        return
      }

      setState((prev) => {
        if (!prev) return prev
        const pgw = stateToPGW(prev)
        const shifted = shiftOrigin(pgw, -dLng, -dLat)
        const next = clampCalibration(pgwToState(shifted, prev.width, prev.height))
        const controllerNow = controllerRef.current
        if (controllerNow) {
          const result = controllerNow.updateBounds(stateToPGW(next), next.width, next.height)
          setReadout({ coordinates: result.coordinates, bounds: result.bounds })
        }
        const orig = originalRef.current
        setDirty({
          d: orig ? orig.d !== next.d : false,
          b: orig ? orig.b !== next.b : false,
          c: orig ? orig.c !== next.c : false,
          f: orig ? orig.f !== next.f : false,
          width: orig ? orig.width !== next.width : false,
          height: orig ? orig.height !== next.height : false,
        })
        return next
      })

      dragRef.current.startGeo = { lng: geo.lng, lat: geo.lat }
    }

    function onPointerUp(e: PointerEvent) {
      if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return
      dragRef.current = null
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.style.cursor = 'move'
    map.dragPan.disable()

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.style.cursor = ''
      try { map.dragPan.enable() } catch { /* noop */ }
      dragRef.current = null
    }
  }, [moveMode, controllerRef, target, activeLayerIdx, encIdx, encBulk, poiIdx, poiBulk, mapId, addEncOffset, addPoiOffset])

  const nudge = useCallback((key: FieldKey, sign: 1 | -1, fine: boolean) => {
    setState((prev) => {
      if (!prev) return prev
      let next: CalibrationState
      if (key === 'd' || key === 'b') {
        const pgw = stateToPGW(prev)
        const pct = stepPctRef.current!
        const factor = fine ? (1 + sign * pct * 0.1) : (1 + sign * pct)
        const scaled = (key === 'd')
          ? scaleParam(pgw, 'd', factor)
          : scaleParam(pgw, 'b', factor)
        next = clampCalibration(pgwToState(scaled, prev.width, prev.height))
      } else if (key === 'c' || key === 'f') {
        const step = fine ? DEG_STEP_DEFAULT * 0.2 : DEG_STEP_DEFAULT
        next = clampCalibration({ ...prev, [key]: prev[key] + sign * step })
      } else {
        const step = fine ? PX_STEP : PX_STEP_QUICK
        next = clampCalibration({ ...prev, [key]: Math.round(prev[key] + sign * step) })
      }

      if (target.kind === 'layers' && target.layerIds.length > 0) {
        for (const layerId of target.layerIds) {
          const entry = layerStatesRef.current.get(layerId)
          if (!entry) continue
          let entryNext: CalibrationState
          if (key === 'd' || key === 'b') {
            const ePgw = stateToPGW(entry.current)
            const pct = stepPctRef.current!
            const factor = fine ? (1 + sign * pct * 0.1) : (1 + sign * pct)
            const scaled = (key === 'd')
              ? scaleParam(ePgw, 'd', factor)
              : scaleParam(ePgw, 'b', factor)
            entryNext = clampCalibration(pgwToState(scaled, entry.current.width, entry.current.height))
          } else if (key === 'c' || key === 'f') {
            const step = fine ? DEG_STEP_DEFAULT * 0.2 : DEG_STEP_DEFAULT
            entryNext = clampCalibration({ ...entry.current, [key]: entry.current[key] + sign * step })
          } else {
            const step = fine ? PX_STEP : PX_STEP_QUICK
            entryNext = clampCalibration({ ...entry.current, [key]: Math.round(entry.current[key] + sign * step) })
          }
          entry.current = entryNext
        }
        applyAndUpdate(next)
        return next
      }

      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate, target])

  const setFieldExact = useCallback((key: FieldKey, value: number) => {
    setState((prev) => {
      if (!prev) return prev
      const next = clampCalibration({ ...prev, [key]: value })
      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate])

  const onViewportMarginChange = useCallback((pct: number) => {
    const margin = pct / 100
    setViewportMarginH(margin)
    setViewportMarginV(margin)
    controllerRef.current?.updateViewportMargins(margin, margin)
  }, [controllerRef])

  const onViewportMarginsChange = useCallback((axis: 'H' | 'V', pct: number) => {
    const margin = pct / 100
    if (axis === 'H') {
      setViewportMarginH(margin)
      controllerRef.current?.updateViewportMargins(margin, viewportMarginV)
    } else {
      setViewportMarginV(margin)
      controllerRef.current?.updateViewportMargins(viewportMarginH, margin)
    }
  }, [controllerRef, viewportMarginH, viewportMarginV])

  const onSizeScale = useCallback((pct: number) => {    if (target.kind === 'layers' && target.layerIds.length > 0) {
      setState((prev) => {
        if (!prev) return prev
        for (const layerId of target.layerIds) {
          const entry = layerStatesRef.current.get(layerId)
          if (!entry) continue
          const orig = entry.original
          entry.current = clampCalibration({
            ...entry.current,
            width: Math.round(orig.width * (pct / 100)),
            height: Math.round(orig.height * (pct / 100)),
          })
        }
        const activeId = target.layerIds[activeLayerIdx]
        if (!activeId) return prev
        const activeEntry = layerStatesRef.current.get(activeId)
        if (!activeEntry) return prev
        applyAndUpdate(activeEntry.current)
        return activeEntry.current
      })
      return
    }
    const orig = originalRef.current
    if (!orig) return
    setState((prev) => {
      if (!prev) return prev
      const next = clampCalibration({
        ...prev,
        width: Math.round(orig.width * (pct / 100)),
        height: Math.round(orig.height * (pct / 100)),
      })
      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate, target, activeLayerIdx])

  const reset = useCallback(() => {
    const origMargins = viewportMarginsOriginalRef.current
    setViewportMarginH(origMargins.h)
    setViewportMarginV(origMargins.v)
    controllerRef.current?.updateViewportMargins(origMargins.h, origMargins.v)
    if (target.kind === 'layers' && target.layerIds.length > 0) {
      for (const layerId of target.layerIds) {
        const entry = layerStatesRef.current.get(layerId)
        if (entry) {
          entry.current = clampCalibration(entry.original)
        }
      }
      const activeId = target.layerIds[activeLayerIdx]
      if (!activeId) return
      const activeEntry = layerStatesRef.current.get(activeId)
      if (activeEntry) {
        setState(clampCalibration(activeEntry.original))
        originalRef.current = activeEntry.original
        const map = controllerRef.current?.map
        if (map) {
          for (const layerId of target.layerIds) {
            const e = layerStatesRef.current.get(layerId)
            if (e) updateLayerPGW(map, layerId, stateToPGW(e.current), e.current.width, e.current.height)
          }
        }
      }
      return
    }
    const orig = originalRef.current
    if (orig) {
      setState(clampCalibration(orig))
    }
  }, [target, activeLayerIdx, controllerRef])

  const copyPGW = useCallback(() => {
    if (!state) return
    const hasChange = dirty.c || dirty.f || dirty.d || dirty.b || dirty.width || dirty.height
    const suffix = hasChange
      ? '  // ← calibrado'
      : ''
    const snippet = `pgw: [${state.a}, ${state.d}, ${state.b}, ${state.e}, ${state.c}, ${state.f}],${suffix}\nwidth: ${state.width},\nheight: ${state.height},`
    navigator.clipboard.writeText(snippet).catch(() => { /* noop */ })
  }, [state, dirty])

  const apply = useCallback(async () => {
    if (!state) return
    setSaveError(null)
    try {
      if (target.kind === 'layers' && target.layerIds.length > 0) {
        const entries = target.layerIds
          .map((id) => {
            const entry = layerStatesRef.current.get(id)
            if (!entry) return null
            return { id, pgw: stateToPGW(entry.current), width: entry.current.width, height: entry.current.height }
          })
          .filter((e): e is NonNullable<typeof e> => e !== null)
        await saveCalibration({ mapId, target: 'layers', layerIds: target.layerIds, entries })
        for (const [, entry] of layerStatesRef.current) {
          entry.original = entry.current
        }
      } else {
        const origMargins = viewportMarginsOriginalRef.current
        const marginsChanged = viewportMarginH !== origMargins.h || viewportMarginV !== origMargins.v
        await saveCalibration({
          mapId,
          pgw: stateToPGW(state),
          width: state.width,
          height: state.height,
          ...(isEcosistemas
            ? {
                viewportMarginH: viewportMarginH !== origMargins.h ? viewportMarginH : undefined,
                viewportMarginV: viewportMarginV !== origMargins.v ? viewportMarginV : undefined,
              }
            : {
                viewportMargin: marginsChanged ? viewportMarginH : undefined,
              }),
        })
        originalRef.current = state
        viewportMarginsOriginalRef.current = { h: viewportMarginH, v: viewportMarginV }
      }
      setDirty({ d: false, b: false, c: false, f: false, width: false, height: false })
      onRebuild?.()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    }
  }, [state, mapId, onRebuild, target, viewportMarginH, viewportMarginV, isEcosistemas])

  function selectLayer(idx: number) {
    if (target.kind !== 'layers' || target.layerIds.length === 0) return
    const newIdx = idx < 0 ? target.layerIds.length - 1 : idx >= target.layerIds.length ? 0 : idx
    setActiveLayerIdx(newIdx)
    const activeId = target.layerIds[newIdx]
    if (!activeId) return
    const entry = layerStatesRef.current.get(activeId)
    if (entry) {
      setState(clampCalibration(entry.current))
      originalRef.current = entry.original
      const r = computeReadout(stateToPGW(entry.current), entry.current.width, entry.current.height)
      setReadout(r)
    }
  }

  function initLayerStates(layerIds: string[]) {
    const allLayers = getMapContent(mapId)?.layers ?? []
    const map = layerStatesRef.current
    map.clear()
    for (const id of layerIds) {
      const layer: Layer | undefined = allLayers.find((l) => l.id === id)
      if (layer !== undefined && layer.type === 'raster-pgw') {
        const cs = pgwToState(layer.pgw, layer.width, layer.height)
        map.set(id, { current: cs, original: cs })
      }
    }
    setActiveLayerIdx(0)
    const firstId = layerIds[0]
    if (firstId) {
      const first = map.get(firstId)
      if (first) {
        setState(clampCalibration(first.current))
        originalRef.current = first.original
        const r = computeReadout(stateToPGW(first.current), first.current.width, first.current.height)
        setReadout(r)
      }
    }
  }

  const encList: Encuadre[] = getMapContent(mapId)?.encuadres ?? []

  /* Foto de originales al entrar al target (polígono fresco + labelCoords). */
  useEffect(() => {
    if (target.kind !== 'encuadres') return
    let cancelled = false
    void (async () => {
      const list = getMapContent(mapId)?.encuadres ?? []
      for (const enc of list) {
        if (encOriginalsRef.current.has(enc.id)) continue
        let polygon: EncuadreOriginal['polygon'] = null
        if (enc.url !== undefined) {
          try {
            const res = await fetch(enc.url)
            if (res.ok) {
              const data = (await res.json()) as {
                type?: unknown
                features?: unknown
              }
              if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
                polygon = data as EncuadreOriginal['polygon']
              }
            }
          } catch { /* sin polígono: solo se mueve la etiqueta */ }
        }
        if (cancelled) return
        encOriginalsRef.current.set(enc.id, {
          polygon,
          label: [enc.labelCoords[0], enc.labelCoords[1]],
          file: enc.url !== undefined ? enc.url.replace(/^\//, '') : null,
        })
      }
      if (!cancelled) {
        setEncIdx(0)
        setEncTick((t) => t + 1)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [mapId, target.kind])

  /* applyEncShift/addEncOffset viven arriba (antes del efecto de drag). */

  const nudgeEnc = useCallback((dirX: -1 | 0 | 1, dirY: -1 | 0 | 1) => {
    const list = getMapContent(mapId)?.encuadres ?? []
    const one = list[encIdx]
    const targets = encBulk ? list : one === undefined ? [] : [one]
    if (targets.length === 0) return
    const step = encFine ? ENC_PX_STEP_FINE : ENC_PX_STEP
    const delta = pxDeltaToGeo(dirX * step, dirY * step)
    if (!delta) return
    for (const enc of targets) addEncOffset(enc, delta.dlng, delta.dlat)
  }, [controllerRef, mapId, encIdx, encFine, encBulk, addEncOffset, pxDeltaToGeo])

  function selectEncuadre(idx: number) {
    if (encList.length === 0) return
    setEncIdx(idx < 0 ? encList.length - 1 : idx >= encList.length ? 0 : idx)
  }

  const encReset = useCallback(() => {
    const list = getMapContent(mapId)?.encuadres ?? []
    for (const enc of list) {
      const zero = { dlng: 0, dlat: 0 }
      encOffsetsRef.current.set(enc.id, zero)
      applyEncShift(enc, zero)
    }
    setEncTick((t) => t + 1)
  }, [mapId, applyEncShift])

  const copyEnc = useCallback(() => {
    const list = getMapContent(mapId)?.encuadres ?? []
    const r6 = (n: number): number => Math.round(n * 1e6) / 1e6
    const lines: string[] = []
    for (const enc of list) {
      const off = encOffsetsRef.current.get(enc.id)
      if (!off || (off.dlng === 0 && off.dlat === 0)) continue
      const orig = encOriginalsRef.current.get(enc.id)
      if (orig?.file) {
        lines.push(`node scripts/shift-geojson.mjs --lng ${r6(off.dlng)} --lat ${r6(off.dlat)} ${orig.file}`)
      }
      const [lng, lat] = shiftLngLat(
        orig ? orig.label : ([enc.labelCoords[0], enc.labelCoords[1]] as [number, number]),
        off.dlng,
        off.dlat,
      )
      lines.push(`labelCoords: [${r6(lng)}, ${r6(lat)}],  // ${enc.id} (su encuadres/map.ts)`)
    }
    if (lines.length === 0) return
    try {
      void navigator.clipboard.writeText(lines.join('\n')).catch(() => { /* noop */ })
    } catch { /* portapapeles no disponible */ }
  }, [mapId])

  const poiList: Poi[] = getMapContent(mapId)?.pois ?? []

  const nudgePoi = useCallback((dirX: -1 | 0 | 1, dirY: -1 | 0 | 1) => {
    const list = getMapContent(mapId)?.pois ?? []
    const one = list[poiIdx]
    const targets = poiBulk ? list : one === undefined ? [] : [one]
    if (targets.length === 0) return
    const step = poiFine ? ENC_PX_STEP_FINE : ENC_PX_STEP
    const delta = pxDeltaToGeo(dirX * step, dirY * step)
    if (!delta) return
    for (const poi of targets) addPoiOffset(poi, delta.dlng, delta.dlat)
  }, [mapId, poiIdx, poiFine, poiBulk, addPoiOffset, pxDeltaToGeo])

  function selectPoi(idx: number) {
    if (poiList.length === 0) return
    setPoiIdx(idx < 0 ? poiList.length - 1 : idx >= poiList.length ? 0 : idx)
  }

  const poiReset = useCallback(() => {
    poiOffsetsRef.current.clear()
    rebuildPoiSource()
    setEncTick((t) => t + 1)
  }, [rebuildPoiSource])

  const copyPoi = useCallback(() => {
    const list = getMapContent(mapId)?.pois ?? []
    const r6 = (n: number): number => Math.round(n * 1e6) / 1e6
    const lines: string[] = [`// ${mapId} — pegar coords en su pois.ts:`]
    let dirty = false
    for (const poi of list) {
      const off = poiOffsetsRef.current.get(poi.id)
      if (!off || (off.dlng === 0 && off.dlat === 0)) continue
      dirty = true
      const [lng, lat] = shiftLngLat(poi.coords, off.dlng, off.dlat)
      lines.push(`coords: [${r6(lng)}, ${r6(lat)}],  // ${poi.id}`)
    }
    if (!dirty) return
    try {
      void navigator.clipboard.writeText(lines.join('\n')).catch(() => { /* noop */ })
    } catch { /* portapapeles no disponible */ }
  }, [mapId])

  const convertF = state ? state.f + state.b * state.height : 0
  const sizePct = (() => {
    if (target.kind === 'layers' && target.layerIds.length > 0) {
      const activeId = target.layerIds[activeLayerIdx]
      if (!activeId) return 100
      const entry = layerStatesRef.current.get(activeId)
      if (!entry || entry.original.width <= 0) return 100
      return Math.round((entry.current.width / entry.original.width) * 100)
    }
    const orig = originalRef.current
    if (!state || !orig || orig.width <= 0) return 100
    return Math.round((state.width / orig.width) * 100)
  })()
  const activeLayerName = target.kind === 'layers' && target.layerIds.length > 0
    ? getMapContent(mapId)?.layers?.find((l) => l.id === (target.layerIds[activeLayerIdx] ?? ''))?.name ?? target.layerIds[activeLayerIdx] ?? ''
    : null

  if (!state) return null

  return (
    <div className={styles.panel} role="region" aria-label="Calibración PGW">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Calibración</span>
        {ENABLE_DEV_TOOLS && getMapContent(mapId)?.layers && (
          <div className={styles.overridesSection}>
            <button
              className={`${styles.headerBtn} ${target.kind === 'map' ? styles.targetActive : ''}`}
              onClick={() => {
                setTarget({ kind: 'map' })
                const s = seedState(mapId)
                originalRef.current = s
                setState(s)
                const pgw = stateToPGW(s)
                const result = controllerRef.current?.updateBounds(pgw, s.width, s.height)
                if (result) setReadout({ coordinates: result.coordinates, bounds: result.bounds })
              }}
            >
              🗺 Mapa base
            </button>
            <button
              className={`${styles.headerBtn} ${target.kind === 'layers' ? styles.targetActive : ''}`}
              onClick={() => {
                const layerIds = calibratableIds([...onLayerIds])
                if (layerIds.length === 0) return
                setTarget({ kind: 'layers', layerIds })
                initLayerStates(layerIds)
              }}
            >
              📐 Capas: {onLayerIds.length}
            </button>
          </div>
        )}
          {ENABLE_DEV_TOOLS && encList.length > 0 && (
            <div className={styles.overridesSection}>
              <button
                className={`${styles.headerBtn} ${target.kind === 'encuadres' ? styles.targetActive : ''}`}
                onClick={() => {
                  setTarget({ kind: 'encuadres' })
                  setEncIdx(0)
                }}
              >
                ⬚ Encuadres: {encList.length}
              </button>
            </div>
          )}
          {ENABLE_DEV_TOOLS && poiList.length > 0 && (
            <div className={styles.overridesSection}>
              <button
                className={`${styles.headerBtn} ${target.kind === 'pois' ? styles.targetActive : ''}`}
                onClick={() => {
                  setTarget({ kind: 'pois' })
                  setPoiIdx(0)
                }}
              >
                📍 POIs: {poiList.length}
              </button>
            </div>
          )}
        {target.kind === 'layers' && target.layerIds.length > 0 && (
          <div className={styles.overridesSection}>
            <button className={styles.headerBtn} onClick={() => selectLayer(activeLayerIdx - 1)} title="Capa anterior">◀</button>
            <span className={styles.layerNavLabel}>
              {activeLayerIdx + 1}/{target.layerIds.length} {activeLayerName}
            </span>
            <button className={styles.headerBtn} onClick={() => selectLayer(activeLayerIdx + 1)} title="Capa siguiente">▶</button>
          </div>
        )}
        <div className={styles.headerActions}>
          <button
            className={styles.headerBtn}
            onClick={() => setMoveMode((m) => !m)}
            title={moveMode ? 'Soltar modo mover' : 'Modo mover: arrastrar imagen'}
          >
            {moveMode ? '✦ Soltar' : '↕ Mover'}
          </button>
          <button
            className={styles.headerBtn}
            title="Reset a valores originales de geo.js"
            onClick={() => {
              if (target.kind === 'encuadres') encReset()
              else if (target.kind === 'pois') poiReset()
              else reset()
            }}
          >
            ↺ Reset
          </button>
          <button
            className={styles.headerBtn}
            title={target.kind === 'encuadres'
              ? 'Los encuadres se persisten con Copiar (comando + labelCoords)'
              : 'Guardar valores en geo.js y reconstruir mapa'}
            onClick={() => {
              if (target.kind === 'encuadres') {
                setSaveError('Encuadres: usa 📋 Copiar y corre el comando en terminal + pega labelCoords (no vive en geo.js).')
              } else if (target.kind === 'pois') {
                setSaveError('POIs: usa 📋 Copiar y pega coords en su pois.ts (no vive en geo.js).')
              } else {
                void apply()
              }
            }}
          >
            ⟳ Aplicar
          </button>
          <button
            className={styles.headerBtn}
            title="Copiar a portapapeles (formato geo.js)"
            onClick={() => {
              if (target.kind === 'encuadres') copyEnc()
              else if (target.kind === 'pois') copyPoi()
              else copyPGW()
            }}
          >
            📋 Copiar
          </button>
          {onClose && (
            <button
              className={styles.collapseBtn}
              title="Cerrar panel de calibración"
              onClick={onClose}
            >
              ✕
            </button>
          )}
          <button
            className={styles.collapseBtn}
            title={collapsed ? 'Mostrar panel' : 'Ocultar panel'}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '▶' : '▼'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className={styles.body}>
          {saveError && (
            <div className={styles.error}>{saveError}</div>
          )}
          {target.kind === 'encuadres' ? (
            <>
              <div className={styles.overridesSection}>
                <button className={styles.headerBtn} onClick={() => selectEncuadre(encIdx - 1)} title="Encuadre anterior">◀</button>
                <span className={styles.layerNavLabel}>
                  {encBulk
                    ? `Todas (${encList.length})`
                    : encList.length === 0 ? '—' : `${encIdx + 1}/${encList.length} ${encList[encIdx]?.name ?? ''}`}
                </span>
                <button className={styles.headerBtn} onClick={() => selectEncuadre(encIdx + 1)} title="Encuadre siguiente">▶</button>
                <button
                  className={`${styles.headerBtn} ${encBulk ? styles.targetActive : ''}`}
                  title="Mover todas a la vez"
                  onClick={() => setEncBulk((b) => !b)}
                >
                  {encBulk ? 'Todas ✓' : 'Una'}
                </button>
              </div>
              <div className={styles.paramRow}>
                <label className={styles.paramLabel}>Mover (px pantalla)</label>
                <div className={styles.stepper}>
                  <button className={styles.stepBtn} title="izquierda" onClick={() => nudgeEnc(-1, 0)}>←</button>
                  <button className={styles.stepBtn} title="arriba" onClick={() => nudgeEnc(0, -1)}>↑</button>
                  <button className={styles.stepBtn} title="abajo" onClick={() => nudgeEnc(0, 1)}>↓</button>
                  <button className={styles.stepBtn} title="derecha" onClick={() => nudgeEnc(1, 0)}>→</button>
                  <button
                    className={styles.headerBtn}
                    title="paso fino 1px / normal 5px"
                    onClick={() => setEncFine((f) => !f)}
                  >
                    {encFine ? '1px ✓' : '5px'}
                  </button>
                </div>
              </div>
              <div className={styles.readout}>
                <div className={styles.readoutTitle}>Offset encuadre (vivo)</div>
                <div className={styles.readoutRow}>
                  <span>Δ lng:</span>
                  <span>{fmtNum(encOffsetsRef.current.get(encList[encIdx]?.id ?? '')?.dlng ?? 0, 6)}°</span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Δ lat:</span>
                  <span>{fmtNum(encOffsetsRef.current.get(encList[encIdx]?.id ?? '')?.dlat ?? 0, 6)}°</span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Archivo:</span>
                  <span>{encOriginalsRef.current.get(encList[encIdx]?.id ?? '')?.file ?? '—'}</span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Nota:</span>
                  <span>la etiqueta se mueve junto al polígono</span>
                </div>
              </div>
              <div className={styles.separator} />
            </>
          ) : target.kind === 'pois' ? (
            <>
              <div className={styles.overridesSection}>
                <button className={styles.headerBtn} onClick={() => selectPoi(poiIdx - 1)} title="POI anterior">◀</button>
                <span className={styles.layerNavLabel}>
                  {poiBulk
                    ? `Todos (${poiList.length})`
                    : poiList.length === 0 ? '—' : `${poiIdx + 1}/${poiList.length} ${poiList[poiIdx]?.name ?? ''}`}
                </span>
                <button className={styles.headerBtn} onClick={() => selectPoi(poiIdx + 1)} title="POI siguiente">▶</button>
                <button
                  className={`${styles.headerBtn} ${poiBulk ? styles.targetActive : ''}`}
                  title="Mover todos a la vez"
                  onClick={() => setPoiBulk((b) => !b)}
                >
                  {poiBulk ? 'Todos ✓' : 'Uno'}
                </button>
              </div>
              <div className={styles.paramRow}>
                <label className={styles.paramLabel}>Mover (px pantalla)</label>
                <div className={styles.stepper}>
                  <button className={styles.stepBtn} title="izquierda" onClick={() => nudgePoi(-1, 0)}>←</button>
                  <button className={styles.stepBtn} title="arriba" onClick={() => nudgePoi(0, -1)}>↑</button>
                  <button className={styles.stepBtn} title="abajo" onClick={() => nudgePoi(0, 1)}>↓</button>
                  <button className={styles.stepBtn} title="derecha" onClick={() => nudgePoi(1, 0)}>→</button>
                  <button
                    className={styles.headerBtn}
                    title="paso fino 1px / normal 5px"
                    onClick={() => setPoiFine((f) => !f)}
                  >
                    {poiFine ? '1px ✓' : '5px'}
                  </button>
                </div>
              </div>
              <div className={styles.readout}>
                <div className={styles.readoutTitle}>Offset POI (vivo)</div>
                <div className={styles.readoutRow}>
                  <span>Δ lng:</span>
                  <span>{fmtNum(poiOffsetsRef.current.get(poiList[poiIdx]?.id ?? '')?.dlng ?? 0, 6)}°</span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Δ lat:</span>
                  <span>{fmtNum(poiOffsetsRef.current.get(poiList[poiIdx]?.id ?? '')?.dlat ?? 0, 6)}°</span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Nota:</span>
                  <span>el tooltip responde en la posición original hasta recargar</span>
                </div>
              </div>
              <div className={styles.separator} />
            </>
          ) : (
            <>
          <div className={styles.paramRow}>
            <label className={styles.paramLabel}>step %</label>
            <select
              className={styles.stepSelect}
              value={stepPctIdx}
              onChange={(e) => {
                const idx = Number(e.target.value)
                setStepPctIdx(idx)
                stepPctRef.current = PCT_STEPS[idx]
              }}
            >
              {PCT_STEPS.map((s, i) => (
                <option key={i} value={i}>{(s * 100).toFixed(2)}%</option>
              ))}
            </select>
          </div>

          {([
            ['D (scale lat)', 'd', state.d, dirty.d, false] as const,
            ['B (scale lon)', 'b', state.b, dirty.b, false] as const,
          ]).map(([label, key, value, isDirty]) => (
            <StepperRow
              key={key}
              label={label}
              value={value}
              dirty={isDirty}
              isScale
              display={typeof value === 'number' ? fmtExp(value) : String(value)}
              onNudge={(s, fine) => nudge(key, s, fine)}
              onExact={(v) => setFieldExact(key, v)}
            />
          ))}

          {([
            ['C (lng)', 'c', state.c, dirty.c, true],
            ['F (lat)', 'f', state.f, dirty.f, true],
          ] as const).map(([label, key, value, isDirty]) => (
            <StepperRow
              key={key}
              label={label}
              value={value}
              dirty={isDirty}
              display={fmtNum(value, 8)}
              onNudge={(s, fine) => nudge(key, s, fine)}
              onExact={(v) => setFieldExact(key, v)}
            />
          ))}

          <div className={styles.separator} />

          {([
            ['width', 'width', state.width, dirty.width],
            ['height', 'height', state.height, dirty.height],
          ] as const).map(([label, key, value, isDirty]) => (
            <StepperRow
              key={key}
              label={label}
              value={value}
              dirty={isDirty}
              display={String(value)}
              onNudge={(s, fine) => nudge(key, s, fine)}
              onExact={(v) => setFieldExact(key, v)}
            />
          ))}

          <div className={styles.paramRow}>
            <label className={styles.paramLabel}>Tamaño %</label>
            <input
              className={styles.sizeSlider}
              type="range"
              min={5}
              max={500}
              step={1}
              value={sizePct}
              onChange={(e) => onSizeScale(Number(e.target.value))}
              title="Escalar width y height en porcentaje"
            />
            <input
              className={styles.sizePctInput}
              type="number"
              min={5}
              max={500}
              step={1}
              value={sizePct}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                if (Number.isFinite(v)) onSizeScale(v)
              }}
              title="Escribir porcentaje manualmente"
            />
            <span className={styles.displayValue}>%</span>
          </div>

          {isEcosistemas ? (
            <>
              <div className={styles.paramRow}>
                <label className={styles.paramLabel}>Escala H (izq/der) %</label>
                <input
                  className={styles.sizeSlider}
                  type="range"
                  min={VIEWPORT_MARGIN_MIN_PCT}
                  max={100}
                  step={1}
                  value={Math.round(viewportMarginH * 100)}
                  onChange={(e) => onViewportMarginsChange('H', Number(e.target.value))}
                  title="Margen horizontal del viewportMaxBounds (izq/der por igual). Negativo = recortar el pan dentro de la imagen."
                />
                <input
                  className={styles.sizePctInput}
                  type="number"
                  min={VIEWPORT_MARGIN_MIN_PCT}
                  max={100}
                  step={1}
                  value={Math.round(viewportMarginH * 100)}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    if (Number.isFinite(v)) onViewportMarginsChange('H', v)
                  }}
                  title="Escala horizontal (porcentaje)"
                />
                <span className={styles.displayValue}>%</span>
              </div>
              <div className={styles.paramRow}>
                <label className={styles.paramLabel}>Escala V (arriba/abajo) %</label>
                <input
                  className={styles.sizeSlider}
                  type="range"
                  min={VIEWPORT_MARGIN_MIN_PCT}
                  max={100}
                  step={1}
                  value={Math.round(viewportMarginV * 100)}
                  onChange={(e) => onViewportMarginsChange('V', Number(e.target.value))}
                  title="Margen vertical del viewportMaxBounds (arriba/abajo por igual). Negativo = recortar el pan dentro de la imagen."
                />
                <input
                  className={styles.sizePctInput}
                  type="number"
                  min={VIEWPORT_MARGIN_MIN_PCT}
                  max={100}
                  step={1}
                  value={Math.round(viewportMarginV * 100)}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    if (Number.isFinite(v)) onViewportMarginsChange('V', v)
                  }}
                  title="Escala vertical (porcentaje)"
                />
                <span className={styles.displayValue}>%</span>
              </div>
            </>
          ) : (
            <div className={styles.paramRow}>
              <label className={styles.paramLabel}>Margen viewport</label>
              <input
                className={styles.sizeSlider}
                type="range"
                min={VIEWPORT_MARGIN_MIN_PCT}
                max={100}
                step={1}
                value={Math.round(viewportMarginH * 100)}
                onChange={(e) => onViewportMarginChange(Number(e.target.value))}
                title="Margen del viewportMaxBounds alrededor de la imagen (por lado). Negativo = encoger el límite dentro de la imagen."
              />
              <input
                className={styles.sizePctInput}
                type="number"
                min={VIEWPORT_MARGIN_MIN_PCT}
                max={100}
                step={1}
                value={Math.round(viewportMarginH * 100)}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  if (Number.isFinite(v)) onViewportMarginChange(v)
                }}
                title="Escribir margen manualmente"
              />
              <span className={styles.displayValue}>%</span>
            </div>
          )}

          <div className={styles.separator} />

          <div className={styles.readout}>
            <div className={styles.readoutTitle}>Valores convertidos (vivo)</div>
            <div className={styles.readoutRow}>
              <span>F_std (F+B·H):</span>
              <span>{fmtNum(convertF, 8)}</span>
            </div>
            {readout && (
              <>
                <div className={styles.readoutRow}>
                  <span>NW:</span>
                  <span>
                    [{fmtNum(readout.coordinates[0][0], 6)}, {fmtNum(readout.coordinates[0][1], 6)}]
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>SE:</span>
                  <span>
                    [{fmtNum(readout.coordinates[2][0], 6)}, {fmtNum(readout.coordinates[2][1], 6)}]
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Span lon:</span>
                  <span>
                    {fmtNum(readout.bounds[2] - readout.bounds[0], 6)}°
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Span lat:</span>
                  <span>
                    {fmtNum(readout.bounds[3] - readout.bounds[1], 6)}°
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Aspect geo:</span>
                  <span>
                    {readout.bounds[2] - readout.bounds[0] > 0
                      ? fmtNum((readout.bounds[3] - readout.bounds[1]) / (readout.bounds[2] - readout.bounds[0]), 4)
                      : '—'}
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>px/° (lon, lat):</span>
                  <span>
                    {readout.bounds[2] - readout.bounds[0] > 0
                      ? `${fmtNum(state.width / (readout.bounds[2] - readout.bounds[0]), 1)}, ${fmtNum(state.height / (readout.bounds[3] - readout.bounds[1]), 1)}`
                      : '—'}
                  </span>
                </div>
              </>
            )}
          </div>
          </>)}
        </div>
      )}
    </div>
  )
}

// -- internal sub-component --
function StepperRow({
  label,
  value,
  dirty,
  display,
  isScale,
  onNudge,
  onExact,
}: {
  label: string
  value: number
  dirty: boolean
  display: string
  isScale?: boolean
  onNudge: (sign: 1 | -1, fine: boolean) => void
  onExact: (value: number) => void
}) {
  return (
    <div className={`${styles.paramRow} ${dirty ? styles.dirty : ''}`}>
      <label className={styles.paramLabel}>{label}</label>
      <div className={styles.stepper}>
        <button className={styles.stepBtn} onClick={() => onNudge(-1, true)} title={`-${isScale ? '0.001%' : 'fino'}`}>
          −−
        </button>
        <button className={styles.stepBtn} onClick={() => onNudge(-1, false)} title={`− ${isScale ? '%' : 'paso'}`}>
          −
        </button>
        <input
          className={styles.valueInput}
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            if (Number.isFinite(v)) onExact(v)
          }}
          step={isScale ? 'any' : 'any'}
        />
        <button className={styles.stepBtn} onClick={() => onNudge(1, false)} title={`+ ${isScale ? '%' : 'paso'}`}>
          +
        </button>
        <button className={styles.stepBtn} onClick={() => onNudge(1, true)} title={`+${isScale ? '0.001%' : 'fino'}`}>
          ++
        </button>
      </div>
      <span className={styles.displayValue}>{display}</span>
    </div>
  )
}
