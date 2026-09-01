import { useMapUIStore } from '@stores/mapUIStore'
import type { BasemapStyle } from '@services/BasemapManager'
import styles from './MapControls.module.css'

const BASEMAP_OPTIONS: { value: BasemapStyle; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'streets', label: 'Streets', icon: '🗺️' },
  { value: 'satellite', label: 'Satellite', icon: '🛰️' },
]

export function MapControls({ hasImageBase = true }: { hasImageBase?: boolean }) {
  const basemapVisible = useMapUIStore((s) => s.basemapVisible)
  const basemapStyle = useMapUIStore((s) => s.basemapStyle)
  const imageOpacity = useMapUIStore((s) => s.imageOpacity)
  const tilesVisible = useMapUIStore((s) => s.tilesVisible)
  const toggleBasemap = useMapUIStore((s) => s.toggleBasemap)
  const setBasemapStyle = useMapUIStore((s) => s.setBasemapStyle)
  const setImageOpacity = useMapUIStore((s) => s.setImageOpacity)
  const toggleTiles = useMapUIStore((s) => s.toggleTiles)

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Mapa base (dev)">
      <div className={styles.row}>
        <button
          className={`${styles.toggleBtn} ${basemapVisible ? styles.active : ''}`}
          onClick={toggleBasemap}
          title={basemapVisible ? 'Ocultar mapa base' : 'Mostrar mapa base'}
        >
          <span className={styles.toggleIcon}>🌐</span>
          <span className={styles.toggleLabel}>{BASEMAP_OPTIONS.find((o) => o.value === basemapStyle)?.icon}</span>
        </button>

        <div className={styles.divider} />

        {BASEMAP_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.styleBtn} ${basemapStyle === opt.value ? styles.active : ''} ${!basemapVisible ? styles.disabled : ''}`}
            onClick={() => setBasemapStyle(opt.value)}
            disabled={!basemapVisible}
            title={opt.label}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {hasImageBase && (
        <div className={styles.row}>
          <label className={styles.sliderLabel}>Imagen</label>
          <input
            type="range"
            className={styles.slider}
            min="0"
            max="1"
            step="0.05"
            value={imageOpacity}
            onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
            title={`Opacidad de imagen: ${Math.round(imageOpacity * 100)}%`}
          />
          <span className={styles.sliderValue}>{Math.round(imageOpacity * 100)}%</span>
        </div>
      )}

      <div className={styles.row}>
        <button
          className={`${styles.toggleBtn} ${tilesVisible ? styles.active : ''}`}
          onClick={toggleTiles}
          title={tilesVisible ? 'Ocultar tiles' : 'Mostrar tiles'}
        >
          <span className={styles.toggleIcon}>🧩</span>
          <span className={styles.toggleLabel}>Tiles {tilesVisible ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  )
}
