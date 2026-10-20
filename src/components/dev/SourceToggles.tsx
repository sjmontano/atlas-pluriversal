/**
 * 🎛 SOURCE TOGGLES — Aislamiento de fuentes para calibrar
 * ========================================================
 * El atlas superpone DOS imágenes de la misma cartografía:
 *
 *   1. La imagen base (ImageSource `atlas-base-image-layer`): local de
 *      referencia (`/assets/maps/previews/…`, generada del original) o,
 *      por contingencia, una variante de Cloudinary (base/medium/high).
 *   2. Los tiles XYZ locales (`atlas-tiles-layer`), generados del PNG
 *      original — siempre en el mismo marco que la referencia.
 *
 * Las variantes de Cloudinary están DESCALIBRADAS (origen aparte), así
 * que al calibrar se superponen con la referencia y no se lee nada.
 * Estos controles aíslan una u otra:
 *
 *   - Base      → apaga/enciende la imagen base entera.
 *   - Tiles     → apaga/enciende los tiles XYZ.
 *   - Cloudinary→ desactiva el swap a Cloudinary (deja la referencia local).
 *   - Nivel     → fija un nivel Cloudinary concreto (base/medium/high)
 *                 en vez de que cambie con el zoom.
 */

import { useMapUIStore } from '@stores/mapUIStore'
import type { BaseLevel } from '@utils/baseZoom'
import styles from './SourceToggles.module.css'

const LEVELS: Array<{ value: BaseLevel; label: string }> = [
  { value: 'base', label: 'base' },
  { value: 'medium', label: 'medium' },
  { value: 'high', label: 'high' },
]

export function SourceToggles({ compact = false }: { compact?: boolean }) {
  const baseImageVisible = useMapUIStore((s) => s.baseImageVisible)
  const tilesVisible = useMapUIStore((s) => s.tilesVisible)
  const cloudinaryEnabled = useMapUIStore((s) => s.cloudinaryEnabled)
  const baseLevelPin = useMapUIStore((s) => s.baseLevelPin)
  const toggleBaseImage = useMapUIStore((s) => s.toggleBaseImage)
  const toggleTiles = useMapUIStore((s) => s.toggleTiles)
  const toggleCloudinary = useMapUIStore((s) => s.toggleCloudinary)
  const setBaseLevelPin = useMapUIStore((s) => s.setBaseLevelPin)

  return (
    <div className={`${styles.wrap}${compact ? ' ' + styles.compact : ''}`} role="group" aria-label="Aislamiento de fuentes de imagen">
      <button
        type="button"
        className={`${styles.btn}${baseImageVisible ? ' ' + styles.on : ''}`}
        onClick={toggleBaseImage}
        aria-pressed={baseImageVisible}
        title="Imagen base (referencia local o Cloudinary)"
      >
        🖼 Base {baseImageVisible ? 'ON' : 'OFF'}
      </button>

      <button
        type="button"
        className={`${styles.btn}${tilesVisible ? ' ' + styles.on : ''}`}
        onClick={toggleTiles}
        aria-pressed={tilesVisible}
        title="Tiles XYZ locales (generados del original)"
      >
        🧩 Tiles {tilesVisible ? 'ON' : 'OFF'}
      </button>

      <button
        type="button"
        className={`${styles.btn}${cloudinaryEnabled ? ' ' + styles.cloud : ''}`}
        onClick={toggleCloudinary}
        aria-pressed={cloudinaryEnabled}
        title="Cloudinary (descalibrado) — OFF deja solo la referencia local"
      >
        ☁ Cloudinary {cloudinaryEnabled ? 'ON' : 'OFF'}
      </button>

      <select
        className={styles.select}
        value={baseLevelPin ?? 'auto'}
        onChange={(e) => {
          const v = e.target.value
          setBaseLevelPin(v === 'auto' ? null : (v as BaseLevel))
        }}
        title="Nivel Cloudinary fijo (auto = cambia con el zoom)"
        aria-label="Nivel de la imagen Cloudinary"
      >
        <option value="auto">auto</option>
        {LEVELS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
