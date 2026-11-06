import { describe, expect, it } from 'vitest'
import {
  CHAPTERS,
  chapterPath,
  getAllMaps,
  mapIdFromSlug,
  mapSlug,
  parentRoute,
  routeForMap,
} from '@data/chapters/chapters'

describe('rutas públicas de los mapas', () => {
  it('quitan el prefijo redundante del capítulo', () => {
    expect(routeForMap('chapter2-valle')).toBe('/capitulo-2/valle')
    expect(routeForMap('chapter1-mosaicos-del-agua')).toBe('/capitulo-1/mosaicos-del-agua')
  })

  it('anidan los mapas hijos bajo su mapa padre', () => {
    expect(routeForMap('chapter2-m-suarez')).toBe('/capitulo-2/suarez/sintesis')
    expect(routeForMap('chapter2-m-villa-rica')).toBe('/capitulo-2/villa-rica/sintesis')
    expect(routeForMap('chapter2-m-oriente-cali')).toBe('/capitulo-2/cali/sintesis')
    expect(routeForMap('chapter4-problematicas')).toBe('/capitulo-4/bosque-comestible/problematicas')
  })

  it('el regreso de un mapa hijo apunta a su padre', () => {
    expect(parentRoute('chapter2-m-suarez')).toBe('/capitulo-2/suarez')
    expect(parentRoute('chapter4-problematicas')).toBe('/capitulo-4/bosque-comestible')
    expect(parentRoute('chapter2-suarez')).toBeNull()
  })

  it('cada padre existe en el mismo capítulo y no es a su vez hijo', () => {
    for (const chapter of CHAPTERS) {
      for (const { parent } of chapter.maps) {
        if (parent === undefined) continue
        const ref = chapter.maps.find((m) => m.mapId === parent)
        expect(ref, `padre inexistente: ${parent}`).toBeDefined()
        expect(ref?.parent).toBeUndefined()
      }
    }
  })

  it('devuelven null para un mapa que no existe', () => {
    expect(routeForMap('no-existe')).toBeNull()
  })

  it('el capítulo se arma con guion', () => {
    expect(chapterPath(3)).toBe('/capitulo-3')
  })

  it('cada ruta es única y vuelve a su id interno', () => {
    const routes = getAllMaps().map((m) => routeForMap(m.mapId))
    expect(new Set(routes).size).toBe(routes.length)
    for (const chapter of CHAPTERS) {
      for (const { mapId, parent } of chapter.maps) {
        const found =
          parent === undefined
            ? mapIdFromSlug(chapter.id, mapSlug(mapId))
            : mapIdFromSlug(chapter.id, mapSlug(parent), mapSlug(mapId))
        expect(found).toBe(mapId)
      }
    }
  })

  it('un mapa hijo no resuelve fuera de su padre', () => {
    expect(mapIdFromSlug(2, 'sintesis')).toBeNull()
    expect(mapIdFromSlug(4, 'problematicas')).toBeNull()
    expect(mapIdFromSlug(2, 'valle', 'sintesis')).toBeNull()
  })

  it('ninguna ruta repite chapter ni usa mayúsculas', () => {
    for (const { mapId } of getAllMaps()) {
      expect(routeForMap(mapId)).toMatch(/^\/capitulo-\d(\/[a-z0-9-]+){1,2}$/)
      expect(routeForMap(mapId)).not.toContain('chapter')
    }
  })

  it('un nombre de otro capítulo no resuelve', () => {
    expect(mapIdFromSlug(1, 'valle')).toBeNull()
  })
})
