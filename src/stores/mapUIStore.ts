import { create } from 'zustand'
import type { BasemapStyle } from '@services/BasemapManager.ts'
import type { BaseLevel } from '@utils/baseZoom.ts'
import { useConnectionStore } from './connectionStore.ts'

/**
 * Qué imagen muestra la capa base (`atlas-base-image-layer`).
 * - `auto`   → piramidal por zoom (producción).
 * - `local`  → solo la referencia local calibrada (sin swap a Cloudinary).
 * - `low|base|medium|high` → UNA sola imagen de Cloudinary, fija.
 */
export type BackgroundSource = 'auto' | 'local' | BaseLevel

/**
 * Qué capa manda la opacidad. Se deriva de la fuente activa:
 * con Cloudinary/Reference la opacidad es de la imagen base; con 'tiles',
 * de los tiles.
 */
export type OpacityTarget = 'image' | 'tiles'

export interface MapUIStoreState {
  basemapVisible: boolean
  basemapStyle: BasemapStyle
  /** Opacidad de la imagen base (NO incluye tiles). */
  imageOpacity: number
  /** Opacidad de los tiles XYZ (independiente de la imagen base). */
  tilesOpacity: number
  /** Opacidad que edita el slider: la de la fuente activa. */
  activeOpacity: OpacityTarget
  tilesVisible: boolean
  lowPowerMode: boolean
  /** Muestra la capa de imagen base entera. Dev: aislar fuentes. */
  baseImageVisible: boolean
  /** Fuente de la imagen base (auto/local/nivel Cloudinary). */
  backgroundSource: BackgroundSource

  toggleBasemap: () => void
  setBasemapStyle: (style: BasemapStyle) => void
  setImageOpacity: (opacity: number) => void
  setTilesOpacity: (opacity: number) => void
  /** Fija la opacidad de la fuente activa (imagen o tiles). */
  setActiveOpacity: (opacity: number) => void
  /** Cambia la fuente activa: la opacidad pasa a esa capa. */
  setActiveSource: (target: OpacityTarget) => void
  toggleTiles: () => void
  toggleLowPowerMode: () => void
  setLowPowerMode: (on: boolean) => void
  toggleBaseImage: () => void
  setBackgroundSource: (source: BackgroundSource) => void
}

const isLowPowerDevice =
  typeof navigator !== 'undefined' &&
  (navigator.hardwareConcurrency != null ? navigator.hardwareConcurrency <= 4 : false)

export const useMapUIStore = create<MapUIStoreState>()((set) => ({
  basemapVisible: false,
  basemapStyle: 'light',
  imageOpacity: 1,
  tilesOpacity: 1,
  activeOpacity: 'image',
  tilesVisible: true,
  lowPowerMode: isLowPowerDevice || useConnectionStore.getState().isSlow,
  baseImageVisible: true,
  backgroundSource: 'auto',

  toggleBasemap: () => set((s) => ({ basemapVisible: !s.basemapVisible })),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
  setTilesOpacity: (opacity) => set({ tilesOpacity: opacity }),
  setActiveOpacity: (opacity) =>
    set((s) =>
      s.activeOpacity === 'image'
        ? { imageOpacity: opacity }
        : { tilesOpacity: opacity },
    ),
  setActiveSource: (target) => set({ activeOpacity: target }),
  toggleTiles: () => set((s) => ({ tilesVisible: !s.tilesVisible })),
  toggleLowPowerMode: () => set((s) => ({ lowPowerMode: !s.lowPowerMode })),
  setLowPowerMode: (on) => set({ lowPowerMode: on }),
  toggleBaseImage: () => set((s) => ({ baseImageVisible: !s.baseImageVisible })),
  setBackgroundSource: (source) => set({ backgroundSource: source }),
}))
