import { describe, expect, it } from 'vitest'
import {
  CHAPTERS,
  chapterPath,
  getAllMaps,
  mapIdFromSlug,
  mapSlug,
  routeForMap,
} from '@data/chapters/chapters'

describe('rutas públicas de los mapas', () => {
  it('quitan el prefijo redundante del capítulo', () => {
    expect(routeForMap('chapter2-valle')).toBe('/capitulo-2/valle')
    expect(routeForMap('chapter1-mosaicos-del-agua')).toBe('/capitulo-1/mosaicos-del-agua')
  })

  it('nombran en español los mapas de síntesis', () => {
    expect(routeForMap('chapter2-m-suarez')).toBe('/capitulo-2/sintesis-suarez')
  })

  it('devuelven null para un mapa que no existe', () => {
    expect(routeForMap('no-existe')).toBeNull()
  })

  it('el capítulo se arma con guion', () => {
    expect(chapterPath(3)).toBe('/capitulo-3')
  })

  it('cada nombre es único en su capítulo y vuelve a su id interno', () => {
    for (const chapter of CHAPTERS) {
      const slugs = chapter.maps.map((m) => mapSlug(m.mapId))
      expect(new Set(slugs).size).toBe(slugs.length)
      for (const { mapId } of chapter.maps) {
        expect(mapIdFromSlug(chapter.id, mapSlug(mapId))).toBe(mapId)
      }
    }
  })

  it('ninguna ruta repite chapter ni usa mayúsculas', () => {
    for (const { mapId } of getAllMaps()) {
      expect(routeForMap(mapId)).toMatch(/^\/capitulo-\d\/[a-z0-9-]+$/)
      expect(routeForMap(mapId)).not.toContain('chapter')
    }
  })

  it('un nombre de otro capítulo no resuelve', () => {
    expect(mapIdFromSlug(1, 'valle')).toBeNull()
  })
})
