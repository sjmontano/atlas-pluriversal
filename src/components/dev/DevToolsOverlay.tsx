import { useState, useEffect, useCallback } from 'react'
import type { RefObject } from 'react'
import type { MapController } from '@services/MapRenderer'
import { DevTools } from './DevTools'
import styles from './DevToolsOverlay.module.css'

interface Props {
  mapId: string
  controllerRef?: RefObject<MapController | null>
}

export function DevToolsOverlay({ mapId, controllerRef }: Props) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(0)
  const [tileZoom, setTileZoom] = useState(0)
  const [cursor, setCursor] = useState<{ lng: number; lat: number } | null>(null)

  /* El controller se crea async en useMap: reintentar hasta tener el mapa
     y suscribir zoom/mousemove. Se re-suscribe al cambiar de mapa. */
  useEffect(() => {
    let off: (() => void) | null = null
    const timer = window.setInterval(() => {
      if (off !== null) return
      const map = controllerRef?.current?.map ?? null
      if (!map) return

      const onZoom = () => {
        const z = map.getZoom()
        setZoom(Math.round(z * 100) / 100)
        setTileZoom(Math.floor(z))
      }

      const onMove = (e: { lngLat?: { lng: number; lat: number } }) => {
        if (e.lngLat) {
          setCursor({ lng: Math.round(e.lngLat.lng * 10000) / 10000, lat: Math.round(e.lngLat.lat * 10000) / 10000 })
        }
      }

      onZoom()

      map.on('zoom', onZoom)
      map.on('mousemove', onMove)
      off = () => {
        map.off('zoom', onZoom)
        map.off('mousemove', onMove)
      }
      window.clearInterval(timer)
    }, 250)
    return () => {
      window.clearInterval(timer)
      off?.()
    }
  }, [controllerRef, mapId])

  const handleToggle = useCallback(() => setOpen((o) => !o), [])

  return (
    <>
      <div className={styles.infoBar} role="status" aria-label="Zoom y cursor">
        <span className={styles.infoItem}>
          <span className={styles.infoLabel}>Zoom</span>
          <span className={styles.infoValue}>{zoom.toFixed(2)}</span>
        </span>
        <span className={styles.infoItem}>
          <span className={styles.infoLabel}>Z</span>
          <span className={styles.infoValue}>{tileZoom}</span>
        </span>
        {cursor && (
          <span className={styles.infoItem}>
            <span className={styles.infoLabel}>Cursor</span>
            <span className={styles.infoValue}>{cursor.lng}, {cursor.lat}</span>
          </span>
        )}
      </div>

      <button
        className={styles.toggleBtn}
        onClick={handleToggle}
        aria-label={open ? 'Cerrar DevTools' : 'Abrir DevTools'}
        title={open ? 'Cerrar DevTools' : 'Abrir DevTools'}
      >
        {open ? '✕' : '🔧'}
      </button>

      {open && (
        <div className={styles.panel}>
          <DevTools mapId={mapId} controllerRef={controllerRef} />
        </div>
      )}
    </>
  )
}
