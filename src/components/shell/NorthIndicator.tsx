/**
 * 🧭 NORTH INDICATOR — Icono del norte (replicado de v17)
 * ========================================================
 * SVG a color extraído tal cual de los ChapterX.jsx de v17
 * (`public/assets/ui/icons/north-color.svg`), posicionado entre el
 * header y el minimapa.
 */

import { SHELL_ASSETS } from './assets'
import styles from './NorthIndicator.module.css'

export function NorthIndicator() {
  return (
    <div className={styles.north} aria-hidden="true">
      <img className={styles.img} src={SHELL_ASSETS.north.color} alt="" />
    </div>
  )
}
