/**
 * 🌊 SUBCUENCA MANAGER — resalta la cuenca del POI en hover
 * ==========================================================
 * Port de la interacción v17 (agregarToponimos.jsx: mouseenter → muestra la
 * imagen de la subcuenca, mouseleave → la oculta). Cada subcuenca es una
 * image-source + capa raster oculta (`visibility: none`); el hover solo
 * conmuta visibilidad, igual que v17 (sin transiciones bruscas de paint).
 *
 * Vive fuera de LayerManager a propósito (como EncuadresManager): son capas
 * de énfasis, no del menú; así ningún sync del store las pisa.
 */

import type * as maplibregl from 'maplibre-gl'
import { processBounds } from './BoundsCalculator'
import type { PGWData } from './BoundsCalculator'
import {
  WATER_PGW,
  WATER_W,
  WATER_H,
} from '@content/chapter-1/mosaicos-del-agua/layers'
import type { SubcuencaDef } from '../types/content.ts'

const PREFIX = 'atlas-subcuenca'
const MODAL_PREFIX = 'cap1-cuenca-'

const layerIdOf = (slug: string): string => `${PREFIX}-${slug}`
const sourceIdOf = (slug: string): string => `${PREFIX}-src-${slug}`

/** Ids estables para que el panel dev opere sobre las mismas sources. */
export const subcuencaSourceId = (slug: string): string => sourceIdOf(slug)
export const subcuencaLayerId = (slug: string): string => layerIdOf(slug)

/** Footprint efectivo (propio o heredado de agua). Lo usa también el panel. */
export function subcuencaGeo(def: SubcuencaDef): { pgw: PGWData; width: number; height: number } {
  return {
    pgw: def.pgw ?? WATER_PGW,
    width: def.width ?? WATER_W,
    height: def.height ?? WATER_H,
  }
}
export function subcuencaSlugOfModal(modalId: string | undefined): string | null {
  if (!modalId || !modalId.startsWith(MODAL_PREFIX)) return null
  const slug = modalId.slice(MODAL_PREFIX.length)
  return slug === '' ? null : slug
}

interface Tracked {
  layers: string[]
  sources: string[]
  current: string | null
}

const trackedByMap = new WeakMap<maplibregl.Map, Tracked>()

export function addSubcuencas(map: maplibregl.Map, defs: SubcuencaDef[]): void {
  removeSubcuencas(map)
  const t: Tracked = { layers: [], sources: [], current: null }
  trackedByMap.set(map, t)
  for (const def of defs) {
    const sid = sourceIdOf(def.slug)
    const lid = layerIdOf(def.slug)
    const g = subcuencaGeo(def)
    let coordinates: ReturnType<typeof processBounds>['coordinates']
    try {
      coordinates = processBounds(g.pgw, g.width, g.height).coordinates
    } catch {
      continue
    }
    try {
      map.addSource(sid, { type: 'image', url: def.image, coordinates })
      map.addLayer({
        id: lid,
        type: 'raster',
        source: sid,
        layout: { visibility: 'none' },
      })
      t.sources.push(sid)
      t.layers.push(lid)
    } catch { /* imagen ausente: esa cuenca no resalta */ }
  }
}

/** Muestra la subcuenca (oculta la anterior). null = ninguna. */
export function highlightSubcuenca(map: maplibregl.Map, slug: string | null): void {
  const t = trackedByMap.get(map)
  if (!t || t.current === slug) return
  try {
    if (t.current !== null && map.getLayer(layerIdOf(t.current))) {
      map.setLayoutProperty(layerIdOf(t.current), 'visibility', 'none')
    }
    if (slug !== null && map.getLayer(layerIdOf(slug))) {
      map.setLayoutProperty(layerIdOf(slug), 'visibility', 'visible')
    }
  } catch { /* noop */ }
  t.current = slug
}

export function removeSubcuencas(map: maplibregl.Map): void {
  const t = trackedByMap.get(map)
  if (t === undefined) return
  for (const id of t.layers) {
    try { if (map.getLayer(id)) map.removeLayer(id) } catch { /* noop */ }
  }
  for (const id of t.sources) {
    try { if (map.getSource(id)) map.removeSource(id) } catch { /* noop */ }
  }
  trackedByMap.delete(map)
}
