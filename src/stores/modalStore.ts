import { create } from 'zustand'
import type { Modal } from '../types/modal'

export interface ModalStoreState {
  activeModal: Modal | null
  openModal: (modal: Modal) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStoreState>()((set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}))
