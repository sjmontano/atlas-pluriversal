import { describe, expect, it } from 'vitest'
import { cld, defineMap, group, legendas, rasterFrame, sb } from '@content/kit'

const geo = { pgw: [0, 1e-6, 1e-6, 0, -76.5, 3.2] as const, width: 7015, height: 12472 }
const base = cld('v1/geoImages/base.png')
const full = cld('v2/geoImages/full.webp')

/** El snapshot de contenido compara JSON: el orden de las claves es parte del contrato. */
const json = (value: unknown): string => JSON.stringify(value)

describe('cld', () => {
  it('antepone la base de Cloudinary', () => {
    expect(base).toBe('https://res.cloudinary.com/dvluvxfvn/image/upload/v1/geoImages/base.png')
  })
})

describe('defineMap', () => {
  const sidebar = [sb.presentacion('x')]

  it('aplica los defaults de configuración', () => {
    const m = defineMap({ id: 'x', title: 'T', minimap: 'sur', sidebar, geo, base, full, zoomMax: 20 })
    expect(m.config.initialBearing).toBe(-90)
    expect(m.config.zoomMax).toBe(20)
    expect(m.config.dragPan).toBe(true)
    expect(m.images.placeholder).toContain('/upload/w_512,q_25,f_webp/')
  })

  it('respeta bearing 0 y sin full', () => {
    const b = defineMap({ id: 'sin-tiles', title: 'T', geo, base, bearing: 0 })
    expect(b.config.initialBearing).toBe(0)
    expect(b.tiles).toBeNull()
  })

  it('emite los extras en el orden escrito', () => {
    const m = defineMap({ id: 'x', title: 'T', geo, base, pois: [], legends: [] })
    expect(Object.keys(m).slice(-2)).toEqual(['pois', 'legends'])
  })

  it('ui extra va antes de sidebar y config respeta la posición de dragPan', () => {
    const m = defineMap({
      id: 'x',
      title: 'T',
      minimap: 'sur',
      sidebar,
      ui: { layerMenu: false },
      geo,
      base,
      config: { viewportMarginH: -0.03, dragPan: false },
    })
    expect(Object.keys(m.ui ?? {})).toEqual(['title', 'minimap', 'layerMenu', 'sidebar'])
    expect(Object.keys(m.config)).toEqual([
      'initialBearing',
      'useTransformConstrain',
      'zoomMax',
      'viewportMaxBounds',
      'viewportMarginH',
      'dragPan',
      'scrollZoom',
    ])
    expect(m.config.dragPan).toBe(false)
  })

  it('tiles declarados llegan al contenido', () => {
    const m = defineMap({ id: 'sin-lista', title: 'T', geo, base, tiles: { mode: 'detail', source: 'cap4/a.png' } })
    expect(m.tiles?.mode).toBe('detail')
    expect(m.tiles?.source).toBe('/assets-raw/maps/cap4/a.png')
    expect(m.tiles?.urlTemplate).toContain('/sin-lista/')
  })

})

describe('sb', () => {
  it.each([
    [sb.presentacion('t'), "{\"id\":\"presentacion\",\"type\":\"modal\",\"icon\":\"presentation\",\"label\":\"Presentación\",\"frame\":\"1\",\"target\":\"t\"}"],
    [sb.ficha('FichasCap4/A b.pdf'), "{\"id\":\"ficha-tecnica\",\"type\":\"link\",\"icon\":\"fichatecnica\",\"label\":\"Ficha técnica\",\"frame\":\"3\",\"href\":\"/pdf/FichasTecnicas/FichasCap4/A b.pdf\"}"],
    [sb.descarga('MapasCap4/A.pdf'), "{\"id\":\"descargar\",\"type\":\"link\",\"icon\":\"download\",\"label\":\"Descargar\",\"frame\":\"3\",\"href\":\"/pdf/Descargables/MapasCap4/A.pdf\"}"],
    [sb.sintesis('chapter4-problematicas'), "{\"id\":\"sintesis\",\"type\":\"goto\",\"icon\":\"sintesis\",\"label\":\"Síntesis\",\"frame\":\"2\",\"to\":\"/capitulo-4/bosque-comestible/problematicas\"}"],
    [sb.modal('perfil', 't'), "{\"id\":\"perfil\",\"type\":\"modal\",\"icon\":\"perfil\",\"label\":\"Perfil\",\"frame\":\"1\",\"target\":\"t\"}"],
    [sb.modal('mapa-arbol', 't'), "{\"id\":\"mapa-arbol\",\"type\":\"modal\",\"icon\":\"mapa-arbol\",\"label\":\"Mapa de árbol\",\"frame\":\"1\",\"target\":\"t\"}"],
    [sb.modal('galeria', 't'), "{\"id\":\"galeria\",\"type\":\"modal\",\"icon\":\"gallery\",\"label\":\"Galería de imágenes\",\"frame\":\"2\",\"target\":\"t\"}"],
    [sb.modal('datos', 't'), "{\"id\":\"datos\",\"type\":\"modal\",\"icon\":\"datos\",\"label\":\"Datos\",\"frame\":\"3\",\"target\":\"t\"}"],
    [sb.link('datos', 'https://x'), "{\"id\":\"datos\",\"type\":\"link\",\"icon\":\"datos\",\"label\":\"Datos\",\"frame\":\"3\",\"href\":\"https://x\"}"],
    [sb.modal({ id: 'a', icon: 'b', label: 'C', frame: '4' }, 't'), "{\"id\":\"a\",\"type\":\"modal\",\"icon\":\"b\",\"label\":\"C\",\"frame\":\"4\",\"target\":\"t\"}"],
  ])('%#: literal exacto', (item, expected) => {
    expect(json(item)).toBe(expected)
  })
})

describe('rasterFrame', () => {
  const capa = rasterFrame({ ...geo, group: 'g', iconDir: '/assets/legends/cap3' })

  it('reproduce las claves y defaults de rasterLayer', () => {
    const l = capa({ id: 'a', name: 'A', image: 'i.webp', swatch: '#111', icon: 'a.svg', order: 10 })
    expect(json(l)).toBe(
      json({
        id: 'a',
        name: 'A',
        category: 'other',
        type: 'raster-pgw',
        image: 'i.webp',
        pgw: geo.pgw,
        width: geo.width,
        height: geo.height,
        opacity: 0.8,
        visibleByDefault: false,
        order: 10,
        group: 'g',
        legend: { swatch: '#111', description: 'A', icon: '/assets/legends/cap3/a.svg' },
      }),
    )
  })

  it('la fila manda sobre el encuadre y category es configurable', () => {
    const l = rasterFrame({ ...geo, category: 'rivers' })({
      id: 'a',
      name: 'A',
      image: 'i',
      order: 1,
      group: 'h',
      opacity: 1,
      visibleByDefault: true,
    })
    expect(l).toMatchObject({ category: 'rivers', group: 'h', opacity: 1, visibleByDefault: true })
    expect(l.legend).toEqual({ description: 'A' })
  })

  it('un icono absoluto ignora iconDir', () => {
    const l = capa({ id: 'a', name: 'A', image: 'i', order: 1, icon: '/otro/a.svg' })
    expect(l.legend?.icon).toBe('/otro/a.svg')
  })
})

describe('legendas', () => {
  it('compone id, icono y orden de 10 en 10', () => {
    const items = legendas('p-leyenda', '/dir', 'G', 10, [
      ['01-a', 'A', 'a.svg'],
      ['02-b', 'B', 'b.svg'],
    ])
    expect(json(items)).toBe(
      json([
        { id: 'p-leyenda-01-a', name: 'A', icon: '/dir/a.svg', order: 10, group: 'G' },
        { id: 'p-leyenda-02-b', name: 'B', icon: '/dir/b.svg', order: 20, group: 'G' },
      ]),
    )
  })

  it('sin grupo omite la clave y con prefix vacío usa el id tal cual', () => {
    expect(json(legendas('', '/dir', undefined, 5, [['x', 'X', 'x.svg']]))).toBe(
      json([{ id: 'x', name: 'X', icon: '/dir/x.svg', order: 5 }]),
    )
  })

  it('la fila objeto puede fijar order, group, icono absoluto y extras', () => {
    const [a, b] = legendas('p', '/dir', 'G', 10, [
      { id: 'a', name: 'A', icon: '/abs/a.svg', group: 'H', iconSize: 'large' },
      { id: 'b', name: 'B', order: 99 },
    ])
    expect(json(a)).toBe(
      json({ id: 'p-a', name: 'A', icon: '/abs/a.svg', order: 10, group: 'H', iconSize: 'large' }),
    )
    expect(json(b)).toBe(json({ id: 'p-b', name: 'B', order: 99, group: 'G' }))
  })
})

describe('group', () => {
  it('emite parent antes de order y las opciones al final', () => {
    expect(json(group('a', 'A', 1))).toBe(json({ id: 'a', name: 'A', order: 1 }))
    expect(json(group('a.1', 'A1', 2, { parent: 'a' }))).toBe(json({ id: 'a.1', name: 'A1', parent: 'a', order: 2 }))
    expect(json(group('b', 'B', 3, { numbered: false, collapsible: false }))).toBe(
      json({ id: 'b', name: 'B', order: 3, numbered: false, collapsible: false }),
    )
  })
})
