import { describe, expect, it } from 'vitest'
import { getMapContent, resolveMapUI } from '@content/index'
import { ALL_MODALS } from '@content/modals/index'
import { CHAPTERS } from '@data/chapters/chapters'
import { buildLayerTree } from '../../src/components/map/layerTree'

/**
 * Red de seguridad TEMPORAL para la migración del contenido a un solo map.ts
 * por mapa: lo que la app recibe de cada mapa debe seguir idéntico. Se retira
 * al terminar la migración. Un cambio de contenido intencional se acepta con
 * `vitest run -u` y se revisa el diff del snapshot.
 */
describe('contenido de los mapas', () => {
  it('no cambia durante la migración', async () => {
    const ids = ['intro', ...CHAPTERS.flatMap((c) => c.maps.map((m) => m.mapId))]
    const mapas = Object.fromEntries(
      ids.map((id) => {
        const content = getMapContent(id)
        const tree = content
          ? buildLayerTree(
              content.groups ?? [],
              (content.layers ?? []).filter((l) => l.hideInMenu !== true),
              content.legends ?? [],
            )
          : null
        return [id, { content, ui: content ? resolveMapUI(content) : null, tree }]
      }),
    )
    const estado = { mapas, modales: ALL_MODALS.map((m) => m.id) }
    await expect(JSON.stringify(estado, null, 1)).toMatchFileSnapshot(
      './__snapshots__/map-content.json',
    )
  }, 30_000)
})
