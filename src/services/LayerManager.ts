import { LAYER_CALIBRATIONS } from '@content/calibration/layers'
import { LAYER_STYLES } from '@content/theme'
import type * as maplibregl from 'maplibre-gl'
import type { ExpressionSpecification } from 'maplibre-gl'
import type { GeojsonLayer, Layer, RasterPgwLayer } from '../types/layer.ts'
import { processBounds, type ImageCoordinates, type PGWData } from './BoundsCalculator'
import { logger } from './MapLogger'
import { hideMapTooltip, layerTooltipHtml, moveMapTooltip, showMapTooltip } from './PoiManager'

const CATEGORY = 'LayerManager'
const SOURCE_PREFIX = 'atlas-layer-'
const POIS_LAYER_ID = 'atlas-pois-layer'

interface StoreSnapshot {
  visibleLayers: Set<string>
  opacities: Record<string, number>
}

function sourceId(layerId: string): string {
  return `${SOURCE_PREFIX}${layerId}`
}

/** Id de source de una capa de contenido (lo usa el panel dev). */
export const layerSourceId = (layerId: string): string => sourceId(layerId)

/* ── Área de hover para geometrías (ríos y rellenos) ───────────────────
   Las líneas finas (2px) son difíciles de hoverear en vista lejana, y los
   rellenos apagados no tienen geometría que hoverear. Cada capa lleva una
   gemela INVISIBLE (`opacity: 0`, misma source) que solo sirve al hit-test
   del hover. En líneas su ancho escala con el zoom: gruesa de lejos →
   casi la visible de cerca. `round` extiende el área en uniones y
   extremos. Solo existe si el mapa opta-in (hitArea). */
const HIT_SUFFIX = '-hit'

function hitLayerId(layerId: string): string {
  return `${sourceId(layerId)}${HIT_SUFFIX}`
}

/** Ancho del área de hover en px de pantalla: 18px a zoom ≤2 → 4px a zoom ≥10. */
const HIT_WIDTH = [
  'interpolate',
  ['linear'],
  ['zoom'],
  2, 38,
  10, 4,
] as ExpressionSpecification

function addHitLayer(map: maplibregl.Map, layer: GeojsonLayer): void {
  const hid = hitLayerId(layer.id)
  if (map.getLayer(hid)) return
  const paint = layer.geometry === 'fill'
    ? { 'fill-color': '#000000', 'fill-opacity': 0 }
    : {
      'line-color': '#000000',
      'line-opacity': 0,
      'line-width': HIT_WIDTH,
    }
  const layout: Record<string, unknown> = {
    /* Siempre visible: es invisible al ojo y su único fin es el
     * hit-test del hover. Así el tooltip sobrevive aunque la capa
     * padre esté apagada (ej. Bredunco sin menú de capas). */
    visibility: 'visible',
  }
  if (layer.geometry === 'line') {
    layout['line-cap'] = 'round'
    layout['line-join'] = 'round'
  }
  map.addLayer(
    {
      id: hid,
      type: layer.geometry,
      source: sourceId(layer.id),
      paint,
      layout,
    } as maplibregl.AddLayerObject,
    sourceId(layer.id),
  )
}

/** Capas con gemela de hover: GeoJSON de área o línea, salvo opt-out
 *  (`tooltip: false`). */
function wantHit(layer: Layer, hitArea: boolean | undefined): boolean {
  return hitArea === true &&
    layer.tooltip !== false &&
    layer.type === 'geojson' &&
    ((layer as GeojsonLayer).geometry === 'line' || (layer as GeojsonLayer).geometry === 'fill')
}

/** Propiedad de opacidad válida según el tipo/geometría de la capa.
 *  Usar 'raster-opacity' en una capa line/fill/symbol lanza dentro de
 *  MapLibre y desmonta el mapa (pantalla azul al togglear). */
function opacityPaintProp(
  layer: Layer,
): 'fill-opacity' | 'line-opacity' | 'circle-opacity' | 'icon-opacity' | 'raster-opacity' {
  if (layer.type === 'geojson') {
    switch ((layer as GeojsonLayer).geometry) {
      case 'fill': return 'fill-opacity'
      case 'line': return 'line-opacity'
      case 'circle': return 'circle-opacity'
      case 'symbol': return 'icon-opacity'
    }
  }
  return 'raster-opacity'
}

function isDegenerate(coords: ImageCoordinates): boolean {
  let minX = Infinity; let minY = Infinity
  let maxX = -Infinity; let maxY = -Infinity
  for (const [lng, lat] of coords) {
    const x = (lng + 180) / 360
    const s = Math.sin((lat * Math.PI) / 180)
    const y = 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return Math.max(maxX - minX, maxY - minY) < 2 ** -25
}

function getBeforeId(map: maplibregl.Map, layerOrder: number, allLayers: Layer[]): string | undefined {
  const sorted = allLayers
    .filter((l) => l.order > layerOrder)
    .sort((a, b) => a.order - b.order)
  for (const l of sorted) {
    if (map.getLayer(sourceId(l.id))) return sourceId(l.id)
  }
  if (map.getLayer(POIS_LAYER_ID)) return POIS_LAYER_ID
  return undefined
}

export function addLayer(
  map: maplibregl.Map,
  layer: Layer,
  store: StoreSnapshot,
  allLayers?: Layer[],
  opts?: { hitArea?: boolean },
): void {
  const sid = sourceId(layer.id)

  if (map.getSource(sid)) return

  const calib = LAYER_CALIBRATIONS[layer.id]
  const pgw: PGWData = calib ? calib.pgw : (layer as RasterPgwLayer).pgw
  const width = calib ? calib.width : (layer as RasterPgwLayer).width
  const height = calib ? calib.height : (layer as RasterPgwLayer).height
  const visible = store.visibleLayers.has(layer.id)
  const opacity = store.opacities[layer.id] ?? layer.opacity ?? LAYER_STYLES[layer.category].defaultOpacity ?? 1

  if (layer.type === 'raster-pgw') {
    const { coordinates } = processBounds(pgw, width, height)
    if (isDegenerate(coordinates)) {
      logger.warn(CATEGORY, `Skipping degenerate layer: ${layer.id}`)
      return
    }

    map.addSource(sid, {
      type: 'image',
      url: layer.image,
      coordinates,
    })

    map.addLayer(
      {
        id: sid,
        type: 'raster',
        source: sid,
        paint: { 'raster-opacity': opacity, 'raster-fade-duration': 0 },
        layout: { visibility: visible ? 'visible' : 'none' },
      },
      allLayers ? getBeforeId(map, layer.order, allLayers) : undefined,
    )
  } else if (layer.type === 'geojson') {
    const geojson = layer as GeojsonLayer
    map.addSource(sid, {
      type: 'geojson',
      data: geojson.url,
    })

    map.addLayer(
      {
        id: sid,
        type: geojson.geometry,
        source: sid,
        paint: { ...geojson.paint },
        layout: { visibility: visible ? 'visible' : 'none' },
      } as maplibregl.AddLayerObject,
      allLayers ? getBeforeId(map, layer.order, allLayers) : undefined,
    )

    if (wantHit(layer, opts?.hitArea)) {
      try {
        addHitLayer(map, geojson)
      } catch { /* sin área de hover: la geometría visible sigue hovereable */ }
    }
  }

  logger.info(CATEGORY, `Layer added: ${layer.id}`)
}

export function removeLayer(map: maplibregl.Map, layerId: string): void {
  const sid = sourceId(layerId)
  const hid = hitLayerId(layerId)
  try {
    if (map.getLayer(hid)) map.removeLayer(hid)
  } catch { /* noop */ }
  try {
    if (map.getLayer(sid)) map.removeLayer(sid)
  } catch { /* noop */ }
  try {
    if (map.getSource(sid)) map.removeSource(sid)
  } catch { /* noop */ }
}

/* ── Click en capa → modal ───────────────────────────────────────────────
   Los listeners con scope de capa se resuelven en tiempo de evento: se
   pueden registrar aunque la capa aún no exista (se activan cuando la
   capa se vuelve visible). Registro deduplicado por mapa. */
const boundClicks = new WeakMap<maplibregl.Map, Set<string>>()

export function bindLayerClicks(
  map: maplibregl.Map,
  layers: Layer[],
  onModal: (modalId: string) => void,
): void {
  let bound = boundClicks.get(map)
  if (bound === undefined) {
    bound = new Set()
    boundClicks.set(map, bound)
  }

  for (const layer of layers) {
    if (layer.modalId === undefined || bound.has(layer.id)) continue
    const sid = sourceId(layer.id)
    const modalId = layer.modalId
    map.on('click', sid, (e) => {
      if (e.features !== undefined && e.features.length > 0) onModal(modalId)
    })
    map.on('mouseenter', sid, () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', sid, () => { map.getCanvas().style.cursor = '' })
    bound.add(layer.id)
  }
}

/* ── Hover en capa → etiqueta con el nombre ────────────────────────────
   Opt-in por mapa (`ui.layerTooltips`, ej. chapter1-bredunco): la misma
   etiqueta flotante que los POIs (PoiManager). Sale con el mouse encima
   de la geometría y se oculta al salir. Las líneas conservan el hover aun
   apagadas (gemela invisible); el resto requiere visibilidad.
   Registro deduplicado por mapa. */
const boundLayerTooltips = new WeakMap<maplibregl.Map, Set<string>>()

export function bindLayerTooltips(
  map: maplibregl.Map,
  layers: Layer[],
): void {
  let bound = boundLayerTooltips.get(map)
  if (bound === undefined) {
    bound = new Set()
    boundLayerTooltips.set(map, bound)
  }
  /* Se enlaza en orden ascendente: la capa de más arriba (mayor order,
   *  ej. nodos pequeños sobre ríos) registra su handler al final y su
   *  etiqueta gana cuando varias geometrías se solapan bajo el mouse.
   *  `tooltip: false` excluye la capa (ej. cuenca-rio-cauca en Bredunco). */
  const ordered = layers
    .filter((layer) => layer.tooltip !== false)
    .slice()
    .sort((a, b) => a.order - b.order)
  for (const layer of ordered) {
    if (bound.has(layer.id)) continue
    const sid = sourceId(layer.id)
    const html = layerTooltipHtml(layer.name)
    /* Líneas y rellenos: el área de hover vive en la gemela invisible;
     * se escucha también la visible por si la gemela aún no existe. */
    const targets = layer.type === 'geojson' &&
      ((layer as GeojsonLayer).geometry === 'line' || (layer as GeojsonLayer).geometry === 'fill')
      ? [hitLayerId(layer.id), sid]
      : [sid]
    for (const target of targets) {
      map.on('mousemove', target, (e) => {
        showMapTooltip(html)
        if (e.lngLat) moveMapTooltip(map, e.lngLat)
      })
      map.on('mouseleave', target, () => { hideMapTooltip() })
    }
    bound.add(layer.id)
  }
}

export function removeAll(map: maplibregl.Map): void {
  /* Las capas se van: ninguna etiqueta de hover debe quedar huérfana. */
  try { hideMapTooltip() } catch { /* noop */ }
  const style = map.getStyle()
  if (!style?.layers) return
  for (const l of style.layers) {
    if (l.id.startsWith(SOURCE_PREFIX)) {
      try { map.removeLayer(l.id) } catch { /* noop */ }
    }
  }
  if (style?.sources) {
    for (const id of Object.keys(style.sources)) {
      if (id.startsWith(SOURCE_PREFIX)) {
        try { map.removeSource(id) } catch { /* noop */ }
      }
    }
  }
}

export function updateLayerPGW(
  map: maplibregl.Map,
  layerId: string,
  pgw: PGWData,
  width: number,
  height: number,
): void {
  const sid = sourceId(layerId)
  const source = map.getSource(sid) as maplibregl.ImageSource | undefined
  if (!source) return
  const { coordinates } = processBounds(pgw, width, height)
  if (!isDegenerate(coordinates)) {
    source.setCoordinates(coordinates)
  }
}

export function sync(
  map: maplibregl.Map,
  _mapId: string,
  layers: Layer[],
  _groups: unknown,
  store: StoreSnapshot,
  opts?: { hitArea?: boolean },
): void {
  const currentIds = new Set<string>()
  const style = map.getStyle()
  if (style?.layers) {
    for (const l of style.layers) {
      /* Las gemelas de hover (-hit) no son capas de contenido: se gestionan
       * junto a su padre y no entran al diff. */
      if (l.id.startsWith(SOURCE_PREFIX) && !l.id.endsWith(HIT_SUFFIX)) {
        currentIds.add(l.id.slice(SOURCE_PREFIX.length))
      }
    }
  }

  const desiredIds = new Set(layers.map((l) => l.id))

  for (const id of currentIds) {
    if (!desiredIds.has(id)) {
      removeLayer(map, id)
    }
  }

  for (const layer of layers) {
    if (!currentIds.has(layer.id)) {
      /* Con hitArea las capas se agregan aunque estén apagadas: el padre
       * queda oculto pero su gemela de hover sí detecta el mouse. */
      if (layer.visibleByDefault || store.visibleLayers.has(layer.id) || wantHit(layer, opts?.hitArea)) {
        addLayer(map, layer, store, layers, opts)
      }
    } else {
      const sid = sourceId(layer.id)
      const visible = store.visibleLayers.has(layer.id)
      if (map.getLayer(sid)) {
        map.setLayoutProperty(sid, 'visibility', visible ? 'visible' : 'none')
      }
      if (wantHit(layer, opts?.hitArea)) {
        const hid = hitLayerId(layer.id)
        if (!map.getLayer(hid)) {
          try { addHitLayer(map, layer as GeojsonLayer) } catch { /* noop */ }
        } else {
          map.setLayoutProperty(hid, 'visibility', 'visible')
        }
      }
      const opacity = store.opacities[layer.id] ?? layer.opacity ?? LAYER_STYLES[layer.category].defaultOpacity ?? 1
      if (map.getLayer(sid)) {
        try {
          map.setPaintProperty(sid, opacityPaintProp(layer), opacity)
        } catch (e) {
          logger.warn(CATEGORY, `No se pudo aplicar opacidad a ${layer.id}`, e)
        }
      }
    }
  }
}
