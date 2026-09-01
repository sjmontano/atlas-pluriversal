/**
 * 📖 TWO COLUMN BODY — Cuerpo a dos columnas (60/40)
 * =================================================
 * - Columna izquierda (60%): texto principal (ModalBlock[])
 * - Columna derecha (40%): nota al pie / info adicional (ModalBlock[])
 * - Responsive: una columna en móvil
 * - Semántico: <aside> para nota pie
 */

import type { ModalBlock } from '../../../types/modal.ts'
import { BlockRenderer } from '../layouts/BlockRenderer'
import styles from './TwoColumnBody.module.css'

export interface TwoColumnBodyProps {
  /** Contenido principal (columna 60%) */
  main: ModalBlock[];
  /** Nota al pie / info adicional (columna 40%) */
  aside?: ModalBlock[];
  /** Clase CSS adicional para el contenedor */
  className?: string;
}

export function TwoColumnBody({ main, aside, className }: TwoColumnBodyProps) {
  if (!aside || aside.length === 0) {
    return (
      <div className={`${styles.wrapper} ${className || ''}`}>
        <div className={styles.main}><BlockRenderer blocks={main} /></div>
      </div>
    )
  }

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <div className={styles.grid}>
        <div className={styles.main}><BlockRenderer blocks={main} /></div>
        <aside className={styles.aside}><BlockRenderer blocks={aside} /></aside>
      </div>
    </div>
  )
}