import { useEffect, useRef } from 'react'
import { useConnectionStore } from '@stores/connectionStore.ts'
import { useMapUIStore } from '@stores/mapUIStore.ts'

/** Activa lowPower cuando la conexión se degrada y lo libera cuando mejora.
 *  No pisa el lowPower inicial por hardware débil ni el toggle manual:
 *  solo gestiona el tramo que encendió por conexión. */
export function useAutoLowPower() {
  const isSlow = useConnectionStore((s) => s.isSlow)
  const isConstrained = useConnectionStore((s) => s.isConstrained)
  const setLowPowerMode = useMapUIStore((s) => s.setLowPowerMode)
  const autoOnRef = useRef(false)

  useEffect(() => {
    if (isSlow || isConstrained) {
      autoOnRef.current = true
      setLowPowerMode(true)
    } else if (autoOnRef.current) {
      autoOnRef.current = false
      setLowPowerMode(false)
    }
  }, [isSlow, isConstrained, setLowPowerMode])
}
