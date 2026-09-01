import { create } from 'zustand'
import type { BasemapStyle } from '@services/BasemapManager.ts'
import { useConnectionStore } from './connectionStore.ts'

export interface MapUIStoreState {
  basemapVisible: boolean
  basemapStyle: BasemapStyle
  imageOpacity: number
  tilesVisible: boolean
  lowPowerMode: boolean

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

export const useMapUIStore = create<MapUIStoreState>()((set) => ({
  basemapVisible: false,
  basemapStyle: 'light',
  imageOpacity: 1,
  tilesVisible: true,
  lowPowerMode: isLowPowerDevice || useConnectionStore.getState().isSlow,

  toggleBasemap: () => set((s) => ({ basemapVisible: !s.basemapVisible })),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
  toggleTiles: () => set((s) => ({ tilesVisible: !s.tilesVisible })),
  toggleLowPowerMode: () => set((s) => ({ lowPowerMode: !s.lowPowerMode })),
  setLowPowerMode: (on) => set({ lowPowerMode: on }),
}))
