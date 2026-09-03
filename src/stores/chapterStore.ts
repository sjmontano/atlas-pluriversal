import { create } from 'zustand'
import { getChapterMapIds } from '@data/chapters/chapters.ts'
import { useMapStore } from './mapStore.ts'

export interface ChapterStoreState {
  /** null = ningún capítulo seleccionado (ej. /intro: todos los tabs navegables). */
  activeChapter: number | null
  activeTerritory: string | null
  chapterMaps: string[]
  goToChapter: (chapter: number) => void
  /** Limpia la selección (volver a /intro). */
  clearChapter: () => void
  goToTerritory: (territory: string) => void
}

export const useChapterStore = create<ChapterStoreState>()((set) => ({
  activeChapter: null,
  activeTerritory: null,
  chapterMaps: [],

  goToChapter: (chapter) => {
    const maps = getChapterMapIds(chapter)
    set({ activeChapter: chapter, activeTerritory: null, chapterMaps: maps })

    if (maps.length > 0) {
      useMapStore.getState().setActiveMap(maps[0]!)
    }
  },

  clearChapter: () => set({ activeChapter: null, activeTerritory: null, chapterMaps: [] }),

  goToTerritory: (territory) => set({ activeTerritory: territory }),
}))
