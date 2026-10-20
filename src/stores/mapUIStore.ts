import { create } from 'zustand'
import type { BasemapStyle } from '@services/BasemapManager.ts'
import type { BaseLevel } from '@utils/baseZoom.ts'
import { useConnectionStore } from './connectionStore.ts'

export interface MapUIStoreState {
  basemapVisible: boolean
  basemapStyle: BasemapStyle
  imageOpacity: number
  tilesVisible: boolean
  lowPowerMode: boolean
  /** Muestra la capa de imagen base (ImageSource). Dev: aislar fuentes. */
  baseImageVisible: boolean
  /** Permite el swap de la base a Cloudinary. false = deja la imagen local
   *  de referencia (calibrada) sin tocar. Solo dev. */
  cloudinaryEnabled: boolean
  /** Fija un nivel Cloudinary concreto; null = automático por zoom. Solo dev. */
  baseLevelPin: BaseLevel | null

  toggleBasemap: () => void
  setBasemapStyle: (style: BasemapStyle) => void
  setImageOpacity: (opacity: number) => void
  toggleTiles: () => void
  toggleLowPowerMode: () => void
  setLowPowerMode: (on: boolean) => void
  toggleBaseImage: () => void
  toggleCloudinary: () => void
  setBaseLevelPin: (level: BaseLevel | null) => void
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
  baseImageVisible: true,
  cloudinaryEnabled: true,
  baseLevelPin: null,

  toggleBasemap: () => set((s) => ({ basemapVisible: !s.basemapVisible })),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
  toggleTiles: () => set((s) => ({ tilesVisible: !s.tilesVisible })),
  toggleLowPowerMode: () => set((s) => ({ lowPowerMode: !s.lowPowerMode })),
  setLowPowerMode: (on) => set({ lowPowerMode: on }),
  toggleBaseImage: () => set((s) => ({ baseImageVisible: !s.baseImageVisible })),
  toggleCloudinary: () => set((s) => ({ cloudinaryEnabled: !s.cloudinaryEnabled })),
  setBaseLevelPin: (level) => set({ baseLevelPin: level }),
}))
