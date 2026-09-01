import { useEffect } from 'react'
import { useConnectionStore } from '@stores/connectionStore.ts'
import { useMapUIStore } from '@stores/mapUIStore.ts'

export function useAutoLowPower() {
  const isSlow = useConnectionStore((s) => s.isSlow)
  const setLowPowerMode = useMapUIStore((s) => s.setLowPowerMode)

  useEffect(() => {
    if (isSlow) {
      setLowPowerMode(true)
    }
  }, [isSlow, setLowPowerMode])
}
