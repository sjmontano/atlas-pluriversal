/**
 * 🎠 CAROUSEL — Carrusel genérico reutilizable
 * ============================================
 * - Auto-play configurable + pausa en hover
 * - Indicadores de puntos + botones prev/next
 * - Navegación por teclado (← →)
 * - Accesible (ARIA labels, focus visible)
 */

import { useEffect, useRef, useState } from 'react';
import styles from './Carousel.module.css';

export interface CarouselImage {
  src: string;
  alt: string;
  description?: string;
}

export interface CarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
  height?: string;
  onImageChange?: (index: number) => void;
}

export function Carousel({
  images,
  autoPlay = true,
  autoPlayInterval = 6000,
  pauseOnHover = true,
  showIndicators = true,
  showArrows = true,
  height = '50vh',
  onImageChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | ReturnType<typeof setInterval>>(null);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        if (onImageChange) onImageChange(next);
        return next;
      });
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => {
        const next = (prev - 1 + images.length) % images.length;
        if (onImageChange) onImageChange(next);
        return next;
      });
    }
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    onImageChange?.(index);
  };

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextImage();
      }
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, images.length, isPaused, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
    };

    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  // Reset on images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de imágenes"
    >
      {showArrows && (
        <button
          className={`${styles.btn} ${styles.prev}`}
          onClick={prevImage}
          aria-label="Imagen anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div className={styles.trackContainer} style={{ height }}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              className={styles.image}
              src={img.src}
              alt={img.alt}
              style={{ height }}
            />
          ))}
        </div>

        {showIndicators && (
          <div className={styles.indicators} aria-label="Indicadores de carrusel">
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => goToImage(index)}
                aria-label={`Ir a imagen ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}

      </div>

      {showArrows && (
        <button
          className={`${styles.btn} ${styles.next}`}
          onClick={nextImage}
          aria-label="Siguiente imagen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}