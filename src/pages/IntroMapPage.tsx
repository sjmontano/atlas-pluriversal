/**
 * 🗺️ INTRO MAP PAGE — El mapa de inicio ("/intro")
 * =================================================
 * Equivalente al view Bienvenidos de v17: el mapa `intro` con el chrome
 * completo y su rail propio (Presentación · Recursos · Tejidos para el
 * atlas, según los iconos de Bienvenidos de v17).
 */

import { useMemo } from 'react'
import { AtlasMap } from '@components/map/AtlasMap.tsx'
import { ShellLayout } from '@components/shell/ShellLayout'
import type { ToolRailItem } from '@components/shell/ToolRail'

const RAIL_ITEMS: ToolRailItem[] = [
  {
    id: 'intro-presentacion',
    icon: 'presentation',
    label: 'Presentación',
    frame: '1',
    action: { kind: 'modal', modalId: 'cuenca-cauca' },
  },
  {
    id: 'intro-recursos',
    icon: 'gallery',
    label: 'Recursos',
    frame: '2',
    action: {
      kind: 'link',
      href: 'https://drive.google.com/file/d/1AEAngJNFZ7GfjTYXwGPhhS2bbJGz9XCq/view?usp=sharing',
    },
  },
  {
    id: 'intro-tejidos',
    icon: 'credits',
    label: 'Tejidos para el atlas',
    frame: '4',
    action: { kind: 'modal', modalId: 'en-construccion' },
  },
]

export function IntroMapPage() {
  const railItems = useMemo(() => RAIL_ITEMS, [])

  return (
    <ShellLayout
      title="Iniciamos nuestro recorrido"
      backTo="/"
      railItems={railItems}
      minimap="cuenca"
    >
      <AtlasMap key="intro" mapId="intro" />
    </ShellLayout>
  )
}
