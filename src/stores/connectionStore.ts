import { create } from 'zustand'
import type { TileDeliveryProfile } from '../types/content'

interface ConnectionInfo {
  effectiveType?: string
  rtt: number
  downlink: number
  isSlow: boolean
  saveData: boolean
  isConstrained: boolean
  tileProfile: TileDeliveryProfile
}

export interface ConnectionStoreState extends ConnectionInfo {
  isOnline: boolean
  init: () => void
}

// `navigator.connection` no forma parte de los tipos DOM estándar.
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string
    rtt?: number
    downlink?: number
    saveData?: boolean
    addEventListener?: (type: string, listener: () => void) => void
  }
}

const getConnection = (): NavigatorWithConnection['connection'] =>
  (navigator as NavigatorWithConnection).connection

const getConnectionInfo = (): Partial<ConnectionInfo> => {
  if (typeof navigator === 'undefined') return {}
  const conn = getConnection()
  const saveData = conn?.saveData === true
  const isSlow = conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g'
  const isConstrained = saveData || isSlow || conn?.effectiveType === '3g'
  return {
    effectiveType: conn?.effectiveType ?? undefined,
    rtt: conn?.rtt ?? 0,
    downlink: conn?.downlink ?? 0,
    isSlow,
    saveData,
    isConstrained,
    tileProfile: isConstrained ? 'standard' : 'hd',
  }
}

export const useConnectionStore = create<ConnectionStoreState>()((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  ...(getConnectionInfo() as ConnectionInfo),

  init() {
    if (typeof window === 'undefined') return

    const onOnline = () => set({ isOnline: true, ...getConnectionInfo() })
    const onOffline = () => set({ isOnline: false, isConstrained: true, tileProfile: 'standard' })
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const conn = getConnection()
    if (conn?.addEventListener) {
      conn.addEventListener('change', () => {
        set(getConnectionInfo())
      })
    }

    set(getConnectionInfo())
  },
}))
