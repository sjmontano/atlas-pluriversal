import { useEffect, useState } from 'react'
import type * as maplibregl from 'maplibre-gl'
import styles from './ZoomBadge.module.css'

interface ZoomBadgeProps {
  map: maplibregl.Map | null
}

export function ZoomBadge({ map }: ZoomBadgeProps) {
  const [zoom, setZoom] = useState<number | null>(null)

  useEffect(() => {
    if (!map) return
    const update = () => setZoom(map.getZoom())
    update()
    map.on('zoom', update)
    map.on('moveend', update)
    return () => {
      map.off('zoom', update)
      map.off('moveend', update)
    }
  }, [map])

  if (zoom === null) return null

  const coveringZoom = Math.round(zoom)

  return (
    <div className={styles.badge} aria-label="Zoom actual">
      <span className={styles.zoom}>zoom={zoom.toFixed(2)}</span>
      <span className={styles.tile}>z{coveringZoom}</span>
    </div>
  )
}