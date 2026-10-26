/**
 * 🎛 SOURCE TOGGLES — Aislamiento de fuentes para calibrar
 * ========================================================
 * El atlas superpone DOS imágenes de la misma cartografía:
 *
 *   1. La imagen base (ImageSource `atlas-base-image-layer`): arranca con
 *      la referencia LOCAL (`/assets/maps/previews/…`, generada del
 *      original, calibrada) y el runtime la sustituye por una variante de
 *      CLOUDINARY (low/base/medium/high) según el zoom.
 *   2. Los tiles XYZ locales (`atlas-tiles-layer`), generados del PNG
 *      original — siempre en el marco de la referencia.
 *
 * OJO: Cloudinary NO es una capa aparte, comparte la capa base. Por eso
 * "solo Cloudinary" se logra eligiendo la FUENTE de esa capa, no apagando
 * la base entera (eso apagaría también Cloudinary).
 *
 * Las variantes de Cloudinary están DESCALIBRADAS (origen aparte), así
 * que al calibrar se superponen con la referencia y no se lee nada. Estos
 * controles aíslan una u otra:
 *
 *   - Referencia local → solo la imagen local calibrada.
 *   - Cloudinary (nivel) → solo esa imagen de Cloudinary (tiles fuera).
 *   - Auto → piramidal por zoom (producción).
 *   - Tiles ON/OFF → apaga/enciende los XYZ.
 *   - Base ON/OFF → apaga/enciende la capa de imagen base entera.
 *
 * Cada nivel Cloudinary se valida con un HEAD real: si el 404, se marca.
 */

import { useEffect, useState } from 'react'
import { useMapUIStore, type BackgroundSource } from '@stores/mapUIStore'
import { BASE_TRANSFORMS, pickBaseSource, type BaseLevel } from '@utils/baseZoom'
import { getMapContent } from '@content'
import styles from './SourceToggles.module.css'

const LEVELS: BaseLevel[] = ['low', 'base', 'medium', 'high']

/** Comprueba si una URL existe (HEAD). Devuelve null si no se puede saber. */
async function probe(url: string): Promise<boolean | null> {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' })
    return res.ok
  } catch {
    return null
  }
}

export function SourceToggles({ mapId, compact = false }: { mapId?: string; compact?: boolean }) {
  const baseImageVisible = useMapUIStore((s) => s.baseImageVisible)
  const tilesVisible = useMapUIStore((s) => s.tilesVisible)
  const backgroundSource = useMapUIStore((s) => s.backgroundSource)
  const activeOpacity = useMapUIStore((s) => s.activeOpacity)
  const imageOpacity = useMapUIStore((s) => s.imageOpacity)
  const tilesOpacity = useMapUIStore((s) => s.tilesOpacity)
  const toggleBaseImage = useMapUIStore((s) => s.toggleBaseImage)
  const toggleTiles = useMapUIStore((s) => s.toggleTiles)
  const setBackgroundSource = useMapUIStore((s) => s.setBackgroundSource)
  const setActiveSource = useMapUIStore((s) => s.setActiveSource)
  const setActiveOpacity = useMapUIStore((s) => s.setActiveOpacity)

  /* Disponibilidad real de cada nivel Cloudinary del mapa activo. */
  const [avail, setAvail] = useState<Record<string, boolean | null>>({})
  useEffect(() => {
    if (mapId === undefined) return
    const entry = getMapContent(mapId)
    if (!entry) return
    const source = pickBaseSource(entry.images)
    /* Sin Cloudinary (URL local o ausente) los transforms no aplican. */
    if (typeof source !== 'string' || !source.includes('/upload/')) {
      setAvail({})
      return
    }
    let cancelled = false
    void Promise.all(
      LEVELS.map(async (level) => {
        const url = source.replace('/upload/', `/upload/${BASE_TRANSFORMS[level]}/`)
        return [level, await probe(url)] as const
      }),
    ).then((entries) => {
      if (!cancelled) setAvail(Object.fromEntries(entries))
    })
    return () => { cancelled = true }
  }, [mapId, backgroundSource])

  const isLevel = (s: BackgroundSource): s is BaseLevel =>
    s !== 'auto' && s !== 'local'

  /** Al elegir un nivel Cloudinary se apagan los tiles: se ve SOLO esa
   *  imagen. Al volver a auto/local, los tiles regresan. */
  const choose = (source: BackgroundSource): void => {
    setBackgroundSource(source)
    if (isLevel(source)) {
      if (tilesVisible) toggleTiles()
      setActiveSource('image')
    } else {
      if (!tilesVisible) toggleTiles()
      setActiveSource('image')
    }
  }

  /** Togglear Tiles hace que la opacidad activa pase a ellos. */
  const chooseTiles = (): void => {
    toggleTiles()
    setActiveSource('tiles')
  }

  const mark = (level: BaseLevel): string => {
    const state = avail[level]
    if (state === undefined) return ''
    if (state === null) return ' ?'
    return state ? ' ✓' : ' ✗'
  }

  const opacityValue = activeOpacity === 'image' ? imageOpacity : tilesOpacity
  const opacityLabel =
    activeOpacity === 'image'
      ? isLevel(backgroundSource)
        ? `Opacidad imagen (Cloudinary ${backgroundSource})`
        : 'Opacidad imagen base'
      : 'Opacidad tiles'

  return (
    <div className={`${styles.wrap}${compact ? ' ' + styles.compact : ''}`} role="group" aria-label="Aislamiento de fuentes de imagen">
      <button
        type="button"
        className={`${styles.btn}${baseImageVisible ? ' ' + styles.on : ''}`}
        onClick={() => {
          toggleBaseImage()
          setActiveSource('image')
        }}
        aria-pressed={baseImageVisible}
        title="Capa de imagen base (referencia local o Cloudinary)"
      >
        🖼 Base {baseImageVisible ? 'ON' : 'OFF'}
      </button>

      <button
        type="button"
        className={`${styles.btn}${tilesVisible ? ' ' + styles.on : ''}${activeOpacity === 'tiles' ? ' ' + styles.active : ''}`}
        onClick={chooseTiles}
        aria-pressed={tilesVisible}
        title="Tiles XYZ locales (generados del original) — activa su opacidad"
      >
        🧩 Tiles {tilesVisible ? 'ON' : 'OFF'}
      </button>

      <select
        className={`${styles.select}${isLevel(backgroundSource) ? ' ' + styles.cloud : ''}`}
        value={backgroundSource}
        onChange={(e) => choose(e.target.value as BackgroundSource)}
        title="Fuente de la imagen base"
        aria-label="Fuente de la imagen base"
      >
        <option value="auto">Fondo: auto (zoom)</option>
        <option value="local">Fondo: referencia local</option>
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            Fondo: Cloudinary {l}{mark(l)}
          </option>
        ))}
      </select>

      <label className={styles.opacity}>
        <span className={styles.opacityLabel}>{opacityLabel}</span>
        <input
          type="range"
          className={styles.opacitySlider}
          min={0}
          max={1}
          step={0.05}
          value={opacityValue}
          onChange={(e) => setActiveOpacity(parseFloat(e.target.value))}
          aria-label={opacityLabel}
        />
        <span className={styles.opacityValue}>{Math.round(opacityValue * 100)}%</span>
      </label>
    </div>
  )
}
