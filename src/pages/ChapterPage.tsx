/**
 * 🗺️ CHAPTER PAGE — Visor público de un mapa dentro del shell
 * ============================================================
 * Rutas `/capitulo-N/:slug` y `/capitulo-N/:slug/:childSlug`. Lee la config UI desde
 * `map.ui` (map.ts) con fallback a CHAPTERS. Sincroniza
 * params ↔ stores (deep-linkable, atrás/adelante).
 *
 * `ChapterEntry` resuelve `/capitulo-N` → primer mapa del capítulo.
 * Los `Legacy*` redirigen los enlaces anteriores (`/capitulo/2/chapter2-valle`).
 */

import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AtlasMap } from '@components/map/AtlasMap.tsx'
import { buildRailFromSidebar } from '@components/shell/toolRailItems.ts'
import { ShellLayout } from '@components/shell/ShellLayout'
import { getMapContent, resolveMapUI } from '@content'
import { chapterPath, getChapter, mapIdFromSlug, parentRoute, routeForMap } from '@data/chapters/chapters.ts'
import { useChapterStore } from '@stores/chapterStore'
import { useMapStore } from '@stores/mapStore'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './ChapterPage.module.css'

export function ChapterEntry({ chapterId }: { chapterId: number }) {
  const first = getChapter(chapterId)?.maps[0]?.mapId
  const route = first !== undefined ? routeForMap(first) : null
  return <Navigate to={route ?? '/'} replace />
}

export function LegacyChapterRedirect() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const chapter = getChapter(Number(chapterId))
  return <Navigate to={chapter !== null ? chapterPath(chapter.id) : '/intro'} replace />
}

export function LegacyMapRedirect() {
  const { chapterId, mapId } = useParams<{ chapterId: string; mapId: string }>()
  const n = Number(chapterId)
  /* Acepta el id interno y el nombre nuevo: /capitulo/2/chapter2-valle y /capitulo/2/valle */
  const route = routeForMap(mapId ?? '') ?? routeForMap(mapIdFromSlug(n, mapId ?? '') ?? '')
  return <Navigate to={route ?? (getChapter(n) !== null ? chapterPath(n) : '/intro')} replace />
}

export function ChapterPage({ chapterId }: { chapterId: number }) {
  const { slug, childSlug } = useParams<{ slug: string; childSlug: string }>()
  const mapId = mapIdFromSlug(chapterId, slug ?? '', childSlug) ?? undefined
  const chapter = getChapter(chapterId)
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

  useDocumentTitle(ui?.title ?? mapRef?.title)

  const railItems = useMemo(
    () => (ui !== null ? buildRailFromSidebar(ui.sidebar) : []),
    [ui],
  )

  if (chapter === null || mapRef === undefined) {
    return (
      <div className={styles.missing}>
        <p>Mapa no encontrado: {chapterPath(chapterId)}/{[slug, childSlug].filter(Boolean).join('/')}</p>
        <Link className={styles.missingLink} to="/">← Volver al inicio</Link>
      </div>
    )
  }

  const isFirstMap = chapter.maps[0]?.mapId === mapRef.mapId
  const backTo = parentRoute(mapRef.mapId) ?? (isFirstMap ? '/intro' : chapterPath(chapter.id))

  return (
    <ShellLayout
      title={ui?.title ?? mapRef.title}
      backTo={backTo}
      numeral={isFirstMap ? chapter.roman : undefined}
      railItems={railItems}
      minimap={ui?.minimap ?? mapRef.minimap ?? 'cuenca'}
      showNorth={ui?.homeNav ?? true}
      showHome={ui?.homeNav ?? true}
      showChapters={ui?.chapterTabs ?? true}
      /* Auto-hide solo en mapas de contenido: las intros conservan el menú fijo */
      chaptersAutoHide={!isFirstMap}
      chaptersAutoHideKey={mapRef.mapId}
    >
      <AtlasMap key={mapRef.mapId} mapId={mapRef.mapId} />
    </ShellLayout>
  )
}
