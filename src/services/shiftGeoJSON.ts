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

/** Desplaza un punto [lng, lat] (p. ej. labelCoords de encuadres). */
export function shiftLngLat(
  coord: readonly [number, number],
  dlng: number,
  dlat: number,
): [number, number] {
  return [round6(coord[0] + dlng), round6(coord[1] + dlat)]
}
