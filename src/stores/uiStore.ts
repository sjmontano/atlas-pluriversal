import { create } from 'zustand'
import type { BasemapStyle } from '@services/BasemapManager.ts'
import type { Modal } from '../types/modal'
import { useConnectionStore } from './connectionStore.ts'

export interface UIStoreState {
  activeModal: Modal | null
  sidebarOpen: boolean
  activePanel: string | null

  basemapVisible: boolean
  basemapStyle: BasemapStyle
  imageOpacity: number
  tilesVisible: boolean

  lowPowerMode: boolean

  openModal: (modal: Modal) => void
  closeModal: () => void
  toggleSidebar: () => void
  setActivePanel: (panel: string | null) => void

  toggleBasemap: () => void
  setBasemapStyle: (style: BasemapStyle) => void
  setImageOpacity: (opacity: number) => void
  toggleTiles: () => void
  toggleLowPowerMode: () => void
  setLowPowerMode: (on: boolean) => void
}

const isLowPowerDevice =
  typeof navigator !== 'undefined' &&
  (navigator.hardwareConcurrency != null ? navigator.hardwareConcurrency <= 4 : false)

export const useUIStore = create<UIStoreState>()((set) => ({
  activeModal: null,
  sidebarOpen: false,
  activePanel: null,

  basemapVisible: false,
  basemapStyle: 'light',
  imageOpacity: 1,
  tilesVisible: true,

  lowPowerMode: isLowPowerDevice || useConnectionStore.getState().isSlow,

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActivePanel: (panel) => set({ activePanel: panel }),

  toggleBasemap: () => set((s) => ({ basemapVisible: !s.basemapVisible })),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
  toggleTiles: () => set((s) => ({ tilesVisible: !s.tilesVisible })),
  toggleLowPowerMode: () => set((s) => ({ lowPowerMode: !s.lowPowerMode })),
  setLowPowerMode: (on) => set({ lowPowerMode: on }),
}))
