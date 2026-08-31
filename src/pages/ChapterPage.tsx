/**
 * 🗺️ CHAPTER PAGE — Visor público de un mapa dentro del shell
 * ============================================================
 * Ruta `/capitulo/:chapterId/:mapId`. Lee la config UI desde
 * `map.ui` (map.ts) con fallback a CHAPTERS. Sincroniza
 * params ↔ stores (deep-linkable, atrás/adelante).
 *
 * `ChapterEntry` resuelve `/capitulo/:n` → primer mapa del capítulo.
 */

import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AtlasMap } from '@components/map/AtlasMap.tsx'
import { buildRailFromSidebar } from '@components/shell/toolRailItems.ts'
import { ShellLayout } from '@components/shell/ShellLayout'
import { getMapContent, resolveMapUI } from '@content'
import { getChapter } from '@data/chapters/chapters.ts'
import { useChapterStore } from '@stores/chapterStore'
import { useMapStore } from '@stores/mapStore'
import styles from './ChapterPage.module.css'

export function ChapterEntry() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const chapter = getChapter(Number(chapterId))
  const first = chapter?.maps[0]?.mapId
  if (chapter === null || first === undefined) return <Navigate to="/dev" replace />
  return <Navigate to={`/capitulo/${chapter.id}/${first}`} replace />
}

export function ChapterPage() {
  const { chapterId, mapId } = useParams<{ chapterId: string; mapId: string }>()
  const n = Number(chapterId)
  const chapter = getChapter(n)
  const mapRef = chapter?.maps.find((m) => m.mapId === mapId)

  /* Sincronía URL ↔ stores */
  useEffect(() => {
    if (chapter === null || mapRef === undefined || mapId === undefined) return
    if (useChapterStore.getState().activeChapter !== chapter.id) {
      useChapterStore.getState().goToChapter(chapter.id)
    }
    if (useMapStore.getState().activeMapId !== mapId) {
      useMapStore.getState().setActiveMap(mapId)
    }
  }, [chapter, mapRef, mapId])

  /* Resolver UI desde map.ts (con fallback a defaults) */
  const mapContent = useMemo(
    () => (mapId !== undefined ? getMapContent(mapId) : null),
    [mapId],
  )
  const ui = useMemo(
    () => (mapContent !== null ? resolveMapUI(mapContent) : null),
    [mapContent],
  )

  const railItems = useMemo(
    () => (ui !== null ? buildRailFromSidebar(ui.sidebar) : []),
    [ui],
  )

  if (chapter === null || mapRef === undefined) {
    return (
      <div className={styles.missing}>
        <p>Capítulo o mapa no encontrado: {String(chapterId)} / {String(mapId)}</p>
        <Link className={styles.missingLink} to="/dev">← Volver al menú</Link>
      </div>
    )
  }

  const isFirstMap = chapter.maps[0]?.mapId === mapRef.mapId
  const backTo = isFirstMap ? '/' : `/capitulo/${chapter.id}`

  return (
    <ShellLayout
      title={ui?.title ?? mapRef.title}
      backTo={backTo}
      railItems={railItems}
      minimap={ui?.minimap ?? mapRef.minimap ?? 'cuenca'}
      showNorth={ui?.northIndicator ?? true}
      showHome={ui?.homeNav ?? true}
    >
      <AtlasMap key={mapRef.mapId} mapId={mapRef.mapId} />
    </ShellLayout>
  )
}
