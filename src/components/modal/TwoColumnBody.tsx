/**
 * 📖 TWO COLUMN BODY — Cuerpo a dos columnas (60/40)
 * =================================================
 * - Columna izquierda (60%): texto principal
 * - Columna derecha (40%): nota al pie / info adicional
 * - Responsive: una columna en móvil
 * - Semántico: <aside> para nota pie
 */

import React from 'react';
import styles from './TwoColumnBody.module.css';

export interface TwoColumnBodyProps {
  /** Contenido principal (columna 60%) - puede ser string o JSX */
  main: React.ReactNode;
  /** Nota al pie / info adicional (columna 40%) - puede ser string o JSX */
  aside?: React.ReactNode;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}

export function TwoColumnBody({ main, aside, className }: TwoColumnBodyProps) {
  if (!aside) {
    // Si no hay aside, renderizar solo el contenido principal a ancho completo
    return (
      <div className={`${styles.wrapper} ${className || ''}`}>
        <div className={styles.main}>{main}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <div className={styles.grid}>
        <div className={styles.main}>{main}</div>
        <aside className={styles.aside}>{aside}</aside>
      </div>
    </div>
  );
}