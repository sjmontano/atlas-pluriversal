/**
 * 🗺️ INTRO MAP PAGE — El mapa de inicio ("/intro")
 * =================================================
 * Equivalente al view Bienvenidos de v17: el mapa `intro` con el chrome
 * completo y su rail propio. Lee la config UI desde `intro/map.ts`.
 */

import { useEffect, useMemo } from 'react'
import { AtlasMap } from '@components/map/AtlasMap.tsx'
import { ShellLayout } from '@components/shell/ShellLayout'
import { buildRailFromSidebar } from '@components/shell/toolRailItems.ts'
import { getMapContent, resolveMapUI } from '@content'
import { useChapterStore } from '@stores/chapterStore'

export function IntroMapPage() {
  /* /intro no pertenece a ningún capítulo: ningún tab seleccionado,
     los 4 navegables. El cap. 1 arranca en encuadres. */
  useEffect(() => {
    useChapterStore.getState().clearChapter()
  }, [])

  const mapContent = useMemo(() => getMapContent('intro'), [])
  const ui = useMemo(() => (mapContent !== null ? resolveMapUI(mapContent) : null), [mapContent])
  const railItems = useMemo(() => (ui !== null ? buildRailFromSidebar(ui.sidebar) : []), [ui])

  return (
    <ShellLayout
      title={ui?.title ?? 'Iniciamos nuestro recorrido'}
      backTo="/"
      railItems={railItems}
      minimap={ui?.minimap ?? 'cuenca'}
    >
      <AtlasMap key="intro" mapId="intro" />
    </ShellLayout>
  )
}
