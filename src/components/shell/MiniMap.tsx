/**
 * 🗺️ MINI MAP — Minimapa de ubicación (esquina superior derecha)
 * ===============================================================
 * Réplica del `.bienvenidosMapa-image-mini` de v17: círculo fijo que
 * crece con `:hover`. La variante (cuenca/valle/sur) viene del dato
 * (`ChapterMapRef.minimap`, default 'cuenca').
 */

import type { MiniMapKey } from '../../types/chapter.ts'
import { SHELL_ASSETS } from './assets'
import styles from './MiniMap.module.css'

export interface MiniMapProps {
  variant?: MiniMapKey
}

const LABELS: Record<MiniMapKey, string> = {
  cuenca: 'Cuenca del río Cauca',
  valle: 'Valle alto del río Cauca',
  sur: 'Sur del valle alto',
}

export function MiniMap({ variant = 'cuenca' }: MiniMapProps) {
  return (
    <div className={styles.mini}>
      <img
        className={styles.img}
        src={SHELL_ASSETS.minimap[variant]}
        alt={`Ubicación: ${LABELS[variant]}`}
      />
    </div>
  )
}
