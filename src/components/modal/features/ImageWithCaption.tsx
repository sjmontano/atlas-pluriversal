/**
 * 🖼️ IMAGE WITH CAPTION — Imagen + descripción
 * ============================================
 * - Imagen con caption opcional
 * - Responsive, max-width configurable
 * - Shadow sutil, hover scale
 */

import React from 'react';
import styles from './ImageWithCaption.module.css';

export interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  maxWidth?: string;
  className?: string;
}

export function ImageWithCaption({
  src,
  alt,
  caption,
  maxWidth = '45vw',
  className,
}: ImageWithCaptionProps) {
  return (
    <div
      className={`${styles.wrapper} ${className || ''}`}
      style={{ maxWidth } as React.CSSProperties}
    >
      <img
        className={styles.image}
        src={src}
        alt={alt}
      />
      {caption && (
        <p className={styles.caption}>{caption}</p>
      )}
    </div>
  );
}