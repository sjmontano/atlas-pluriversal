/**
 * KIT DE MAPAS — todo lo que un `<mapa>/map.ts` necesita para ser un solo archivo.
 * Datos planos, sin dependencias de runtime. Guía de correcciones: CORRECCIONES.md.
 *
 * El orden de las claves importa: tests/content/contentSnapshot.test.ts compara
 * el JSON byte a byte. No reordenar ningún literal de este archivo.
 * Sin abstracciones para mapas atípicos (encuadres, humedales): esos usan literales.
 */

import { MAP_TILE_MODES, makeTilesConfig } from '@data/tiles'
import type { TileZoomMode } from '@utils/tileZoom'
import type { MapConfig, MapContent, MapGeoEntry, MapUI, MapUISidebarItem } from '../types/content.ts'
import type { LayerBase, LayerCategory, LayerGroup, LegendItem, RasterPgwLayer } from '../types/layer.ts'

const CLOUDINARY_UPLOAD = 'https://res.cloudinary.com/dvluvxfvn/image/upload'

/** URL completa de Cloudinary a partir de `v123/geoImages/abc.png`. */
export const cld = (path: string): string => `${CLOUDINARY_UPLOAD}/${path}`

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

export interface DefineMapOptions extends Pick<
  MapContent,
  'menuTitle' | 'layers' | 'groups' | 'legends' | 'pois' | 'encuadres' | 'subcuencas' | 'oceanLabels'
> {
  id: string
  title: string
  minimap?: MapUI['minimap']
  sidebar?: MapUISidebarItem[]
  /** Otras opciones de `ui` (layerTooltips, layerMenu, northIndicator, homeNav). */
  ui?: Omit<MapUI, 'title' | 'minimap' | 'sidebar'>
  geo: MapGeoEntry
  base: string
  full?: string
  zoomMax?: number
  /** Default: -90. Mapas atípicos: problematicas -30, bosque-comestible 0. */
  bearing?: number
  /** `source` es relativo a assets-raw/maps/. Si se omite, usa las listas de data/tiles.ts. */
  tiles?: { mode: TileZoomMode; source: string }
  /** Reemplaza o añade a la configuración base (márgenes, dragPan…). */
  config?: Partial<Omit<MapConfig, 'initialBearing' | 'zoomMax'>>
}

/** Las capas, grupos, leyendas, etc. se emiten en el orden en que se escriben. */
export function defineMap(opts: DefineMapOptions): MapContent {
  const { id, title, minimap, sidebar, ui, geo, base, full, zoomMax, bearing, tiles, config, ...extras } = opts
  // MapRenderer aún lee el modo de MAP_TILE_MODES: dos valores distintos darían
  // un tileset generado con un rango y servido con otro.
  const listed = MAP_TILE_MODES[id]
  if (tiles && listed && listed !== tiles.mode) {
    throw new Error(`${id}: tiles.mode '${tiles.mode}' difiere de MAP_TILE_MODES ('${listed}')`)
  }
  const initialBearing = bearing ?? -90
  const { dragPan = true, scrollZoom = true, ...configRest } = config ?? {}
  return {
    mapId: id,
    ui: { title, minimap, ...ui, sidebar },
    geo,
    images: { base, full, placeholder: ph(base) },
    config: {
      initialBearing,
      useTransformConstrain: true,
      zoomMax,
      viewportMaxBounds: null,
      ...configRest,
      dragPan,
      scrollZoom,
    },
    tiles: makeTilesConfig(
      id,
      geo,
      initialBearing,
      zoomMax,
      tiles && { mode: tiles.mode, source: `/assets-raw/maps/${tiles.source}` },
    ),
    ...extras,
  }
}

/* ─── Sidebar ─────────────────────────────────────────────────────────── */

type SidebarLook = Pick<MapUISidebarItem, 'id' | 'icon' | 'label' | 'frame'>

const LOOKS = {
  perfil: { id: 'perfil', icon: 'perfil', label: 'Perfil', frame: '1' },
  'perfil-cuenca': { id: 'perfil-cuenca', icon: 'perfil', label: 'Perfil cuenca', frame: '1' },
  'mapa-arbol': { id: 'mapa-arbol', icon: 'mapa-arbol', label: 'Mapa de árbol', frame: '1' },
  galeria: { id: 'galeria', icon: 'gallery', label: 'Galería de imágenes', frame: '2' },
  datos: { id: 'datos', icon: 'datos', label: 'Datos', frame: '3' },
} as const satisfies Record<string, SidebarLook>

const look = (l: keyof typeof LOOKS | SidebarLook): SidebarLook => (typeof l === 'string' ? LOOKS[l] : l)

const modal = (l: keyof typeof LOOKS | SidebarLook, target: string): MapUISidebarItem => {
  const { id, icon, label, frame } = look(l)
  return { id, type: 'modal', icon, label, frame, target }
}

const link = (l: keyof typeof LOOKS | SidebarLook, href: string): MapUISidebarItem => {
  const { id, icon, label, frame } = look(l)
  return { id, type: 'link', icon, label, frame, href }
}

export const sb = {
  presentacion: (target: string) =>
    modal({ id: 'presentacion', icon: 'presentation', label: 'Presentación', frame: '1' }, target),
  /** `path` relativo a /pdf/FichasTecnicas/, p. ej. 'FichasCap4/Finca El Paso.pdf'. */
  ficha: (path: string) =>
    link({ id: 'ficha-tecnica', icon: 'fichatecnica', label: 'Ficha técnica', frame: '3' }, `/pdf/FichasTecnicas/${path}`),
  /** `path` relativo a /pdf/Descargables/, p. ej. 'MapasCap4/Humedales problematicas.pdf'. */
  descarga: (path: string) =>
    link({ id: 'descargar', icon: 'download', label: 'Descargar', frame: '3' }, `/pdf/Descargables/${path}`),
  sintesis: (to: string): MapUISidebarItem => ({
    id: 'sintesis',
    type: 'goto',
    icon: 'sintesis',
    label: 'Síntesis',
    frame: '2',
    to,
  }),
  /** Preset ('perfil', 'mapa-arbol', 'galeria', 'datos', 'perfil-cuenca') o `{ id, icon, label, frame }`. */
  modal,
  /** Igual que `modal`, con `href` tal cual (sin prefijo). */
  link,
}

/* ─── Capas ───────────────────────────────────────────────────────────── */

export interface RasterRow extends Pick<LayerBase, 'id' | 'name' | 'order' | 'group' | 'opacity' | 'visibleByDefault'> {
  image: string
  swatch?: string
  /** Archivo dentro de `iconDir`, o ruta absoluta si empieza por '/'. */
  icon?: string
}

/** Fija el encuadre común y devuelve la función que crea cada capa del mapa. */
export function rasterFrame(frame: {
  pgw: MapGeoEntry['pgw']
  width: number
  height: number
  group?: string
  iconDir?: string
  /** Default: 'other'. */
  category?: LayerCategory
}): (row: RasterRow) => RasterPgwLayer {
  const { pgw, width, height, iconDir, category = 'other' } = frame
  return ({ id, name, order, group, opacity, visibleByDefault, image, swatch, icon }) => ({
    id,
    name,
    category,
    type: 'raster-pgw',
    image,
    pgw,
    width,
    height,
    opacity: opacity ?? 0.8,
    visibleByDefault: visibleByDefault ?? false,
    order,
    group: group ?? frame.group,
    legend: {
      swatch,
      description: name,
      ...(icon === undefined ? {} : { icon: iconPath(iconDir, icon) }),
    },
  })
}

/* ─── Leyendas y grupos ───────────────────────────────────────────────── */

export type LegendRow =
  | readonly [id: string, name: string, icon: string]
  | (Omit<LegendItem, 'order' | 'icon'> & { icon?: string; order?: number })

const iconPath = (dir: string | undefined, icon: string): string =>
  icon.startsWith('/') || !dir ? icon : `${dir}/${icon}`

/**
 * Filas de leyenda. id final: `${prefix}-${fila.id}` (prefix '' = id tal cual).
 * El orden avanza de 10 en 10 desde `startOrder`; `order` y `group` de una fila
 * mandan sobre el cálculo. Un `icon` que empieza por '/' ignora `iconDir`.
 */
export function legendas(
  prefix: string,
  iconDir: string,
  group: string | undefined,
  startOrder: number,
  rows: readonly LegendRow[],
): LegendItem[] {
  return rows.map((row, i) => {
    const r = 'id' in row ? row : { id: row[0], name: row[1], icon: row[2] }
    const { id, name, icon, order, group: rowGroup, ...extra } = r as Exclude<LegendRow, readonly unknown[]>
    const finalGroup = rowGroup ?? group
    return {
      id: prefix ? `${prefix}-${id}` : id,
      name,
      ...(icon === undefined ? {} : { icon: iconPath(iconDir, icon) }),
      order: order ?? startOrder + i * 10,
      ...(finalGroup === undefined ? {} : { group: finalGroup }),
      ...extra,
    }
  })
}

/** `parent` se emite antes de `order`, como en los literales de groups.ts. */
export function group(
  id: string,
  name: string,
  order: number,
  opts: Omit<LayerGroup, 'id' | 'name' | 'order'> = {},
): LayerGroup {
  const { parent, ...rest } = opts
  return { id, name, ...(parent === undefined ? {} : { parent }), order, ...rest }
}
