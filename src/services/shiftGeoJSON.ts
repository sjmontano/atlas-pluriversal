/**
 * ↔️ SHIFT GEOJSON — desplazar geometrías por un delta [dlng, dlat]
 * =================================================================
 * Los polígonos/líneas de encuadre son coordenadas verdaderas (CRS84): si se
 * ven corridos respecto al relieve ya calibrado, se mueven aquí (NO el PGW,
 * que movería también la imagen y rompería la calibración).
 *
 * Funciones puras (no mutan la entrada): el panel las usa para previsualizar
 * en vivo con `setData` y para generar el comando de `shift-geojson.mjs`.
 */

export interface GeoJSONShift {
  dlng: number
  dlat: number
}

const round6 = (n: number): number => Math.round(n * 1e6) / 1e6

type MutablePosition = number[]

function shiftCoords(coords: unknown, dlng: number, dlat: number): void {
  if (Array.isArray(coords) && typeof coords[0] === 'number') {
    const pos = coords as MutablePosition
    const lng = pos[0]
    if (typeof lng !== 'number') return
    pos[0] = round6(lng + dlng)
    if (typeof pos[1] === 'number') pos[1] = round6(pos[1] + dlat)
    return
  }
  if (Array.isArray(coords)) {
    for (const c of coords) shiftCoords(c, dlng, dlat)
  }
}

function shiftGeometry<T>(geometry: T, dlng: number, dlat: number): T {
  if (
    geometry !== null &&
    typeof geometry === 'object' &&
    'coordinates' in geometry &&
    Array.isArray((geometry as { coordinates: unknown }).coordinates)
  ) {
    shiftCoords((geometry as { coordinates: unknown }).coordinates, dlng, dlat)
  }
  return geometry
}

export interface ShiftableFeatureCollection {
  type: 'FeatureCollection'
  features: Array<{ geometry: unknown }>
  [key: string]: unknown
}

/** Clona y desplaza todas las geometrías. Geometrías nulas se conservan. */
export function shiftFeatureCollection<T extends ShiftableFeatureCollection>(
  data: T,
  dlng: number,
  dlat: number,
): T {
  const clone = structuredClone(data)
  for (const feature of clone.features) {
    if (feature.geometry !== null && feature.geometry !== undefined) {
      shiftGeometry(feature.geometry, dlng, dlat)
    }
  }
  return clone
}

/** Centroide (centro del bbox) de un FeatureCollection, para escalar
 *  alrededor de un punto estable. */
export function collectionCentroid(data: ShiftableFeatureCollection): [number, number] {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  const walk = (coords: unknown): void => {
    if (Array.isArray(coords) && typeof coords[0] === 'number') {
      const [lng, lat] = coords as number[]
      if (typeof lng === 'number' && typeof lat === 'number') {
        if (lng < x0) x0 = lng
        if (lng > x1) x1 = lng
        if (lat < y0) y0 = lat
        if (lat > y1) y1 = lat
      }
      return
    }
    if (Array.isArray(coords)) {
      for (const c of coords) walk(c)
    }
  }
  for (const feature of data.features) {
    const geometry = feature.geometry as { coordinates?: unknown } | null | undefined
    if (geometry !== null && geometry !== undefined && geometry.coordinates !== undefined) {
      walk(geometry.coordinates)
    }
  }
  if (!Number.isFinite(x0)) return [0, 0]
  return [round6((x0 + x1) / 2), round6((y0 + y1) / 2)]
}

function scaleCoords(coords: unknown, cx: number, cy: number, sx: number, sy: number): void {
  if (Array.isArray(coords) && typeof coords[0] === 'number') {
    const pos = coords as MutablePosition
    if (typeof pos[0] === 'number') pos[0] = round6(cx + (pos[0] - cx) * sx)
    if (typeof pos[1] === 'number') pos[1] = round6(cy + (pos[1] - cy) * sy)
    return
  }
  if (Array.isArray(coords)) {
    for (const c of coords) scaleCoords(c, cx, cy, sx, sy)
  }
}

/** Clona y escala todas las geometrías alrededor de su centroide
 *  (sx = ancho/E-W, sy = alto/N-S; 1 = original). Para calibrar el tamaño
 *  de capas vectoriales en el panel dev (análogo al Tamaño % raster). */
export function scaleFeatureCollection<T extends ShiftableFeatureCollection>(
  data: T,
  sx: number,
  sy: number,
): T {
  const clone = structuredClone(data)
  const [cx, cy] = collectionCentroid(data)
  for (const feature of clone.features) {
    const geometry = feature.geometry as { coordinates?: unknown } | null | undefined
    if (geometry !== null && geometry !== undefined && geometry.coordinates !== undefined) {
      scaleCoords(geometry.coordinates, cx, cy, sx, sy)
    }
  }
  return clone
}

/** Desplaza un punto [lng, lat] (p. ej. labelCoords de encuadres). */
export function shiftLngLat(
  coord: readonly [number, number],
  dlng: number,
  dlat: number,
): [number, number] {
  return [round6(coord[0] + dlng), round6(coord[1] + dlat)]
}
