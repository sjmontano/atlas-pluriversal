import { readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getMapContent } from '@content/index'
import { ALL_MODALS, getModalById } from '@content/modals/index'
import { CHAPTERS } from '@data/chapters/chapters'
import { MAP_TILE_MODES } from '@data/tiles'

/**
 * Integridad del contenido: un error de digitación en un id o una ruta no
 * rompe el build, solo deja una capa suelta o un icono vacío en pantalla.
 * Esta prueba los nombra antes de que los vea un revisor.
 */

/** Defectos conocidos a la espera de que el equipo entregue el archivo. */
const CONOCIDOS = new Set([
  'chapter3-encharcaron: icono /assets/legends/cap3/construccion.svg',
  'chapter3-encharcaron: icono /assets/legends/cap3/represas.svg',
  'modales: asset /assets/maps/cap2/sintesisCali.webp',
])

const PUBLIC = join(process.cwd(), 'public')
const listados = new Map<string, string[]>()

function listar(dir: string): string[] {
  if (!listados.has(dir)) {
    try {
      listados.set(dir, readdirSync(dir))
    } catch {
      listados.set(dir, [])
    }
  }
  return listados.get(dir)!
}

/** Respeta mayúsculas: Windows no las distingue, pero un hosting Linux sí. */
function existeExacto(ruta: string): boolean {
  if (ruta === PUBLIC) return true
  const padre = dirname(ruta)
  return existeExacto(padre) && listar(padre).includes(basename(ruta))
}

/** Las URL remotas no se revisan y public/pdf no se versiona. */
function assetFalta(url: string | undefined): boolean {
  if (!url || !url.startsWith('/') || url.startsWith('/pdf/')) return false
  return !existeExacto(join(PUBLIC, decodeURI(url.split('?')[0]!)))
}

function revisarMapa(id: string, ids: Set<string>): string[] {
  const c = getMapContent(id)
  if (!c) return [`${id}: sin contenido`]
  const out: string[] = []
  const grupos = new Set((c.groups ?? []).map((g) => g.id))
  const modal = (origen: string, m: string | undefined): void => {
    if (m && !getModalById(m)) out.push(`${id}: ${origen} apunta al modal ${m}`)
  }
  const destino = (origen: string, m: string | undefined): void => {
    if (m && !ids.has(m)) out.push(`${id}: ${origen} apunta al mapa ${m}`)
  }
  const asset = (tipo: string, url: string | undefined): void => {
    if (assetFalta(url)) out.push(`${id}: ${tipo} ${url}`)
  }
  const unico = (tipo: string, valores: string[]): void => {
    const repetidos = valores.filter((v, i) => valores.indexOf(v) !== i)
    for (const v of new Set(repetidos)) out.push(`${id}: ${tipo} repetido ${v}`)
  }

  if (!MAP_TILE_MODES[id]) out.push(`${id}: sin modo de tiles`)
  unico('grupo', (c.groups ?? []).map((g) => g.id))
  unico('capa', (c.layers ?? []).map((l) => l.id))
  unico('leyenda', (c.legends ?? []).map((l) => l.id))

  for (const g of c.groups ?? []) {
    if (g.parent && !grupos.has(g.parent)) out.push(`${id}: grupo ${g.id} sin padre ${g.parent}`)
  }
  for (const l of c.layers ?? []) {
    if (l.group && !grupos.has(l.group)) out.push(`${id}: capa ${l.id} sin grupo ${l.group}`)
    modal(`capa ${l.id}`, l.modalId)
    asset('icono', l.legend?.icon)
    if (l.type === 'raster-pgw') asset('imagen', l.image)
    if (l.type === 'geojson') asset('geojson', l.url)
  }
  for (const l of c.legends ?? []) asset('icono', l.icon)
  for (const s of c.ui?.sidebar ?? []) {
    if (s.type === 'modal') modal(`sidebar ${s.id}`, s.target ?? '(vacío)')
  }
  for (const p of c.pois ?? []) {
    modal(`POI ${p.id}`, p.modalId)
    destino(`POI ${p.id}`, p.targetMapId)
    asset('icono de POI', p.icon)
    asset('imagen de POI', p.popup?.image)
    asset('audio de POI', p.popup?.audio)
  }
  for (const e of c.encuadres ?? []) {
    modal(`encuadre ${e.id}`, e.modalId)
    destino(`encuadre ${e.id}`, e.targetMapId)
  }
  return out
}

function assetsDeModales(): string[] {
  const out = new Set<string>()
  const recorrer = (v: unknown): void => {
    if (typeof v === 'string') {
      if (/^\/(assets|data)\//.test(v) && assetFalta(v)) out.add(`modales: asset ${v}`)
    } else if (Array.isArray(v)) v.forEach(recorrer)
    else if (v && typeof v === 'object') Object.values(v).forEach(recorrer)
  }
  recorrer(ALL_MODALS)
  return [...out]
}

describe('integridad del contenido', () => {
  const ids = ['intro', ...CHAPTERS.flatMap((c) => c.maps.map((m) => m.mapId))]
  const conjunto = new Set(ids)

  it.each(ids)('%s tiene referencias y assets válidos', (id) => {
    expect(revisarMapa(id, conjunto).filter((e) => !CONOCIDOS.has(e))).toEqual([])
  })

  it('los modales apuntan a assets que existen', () => {
    expect(assetsDeModales().filter((e) => !CONOCIDOS.has(e))).toEqual([])
  })

  it('cada modo de tiles corresponde a un mapa', () => {
    expect(Object.keys(MAP_TILE_MODES).filter((m) => !conjunto.has(m))).toEqual([])
  })

  it('la lista de defectos conocidos sigue vigente', () => {
    const actuales = new Set([...ids.flatMap((id) => revisarMapa(id, conjunto)), ...assetsDeModales()])
    expect([...CONOCIDOS].filter((e) => !actuales.has(e))).toEqual([])
  })
})
