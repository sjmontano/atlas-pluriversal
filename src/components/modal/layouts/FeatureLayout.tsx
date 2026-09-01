/**
 * ✨ FEATURE LAYOUT — Modal completo (bienvenida / home)
 * ======================================================
 * Layout 'feature' — modal con todas las características:
 * - Header: icono + título + highlight + decorador (linea.svg repeat-x)
 * - Carrusel opcional (id=1 en v17)
 * - Imagen + caption opcional
 * - Body dos columnas (60/40) con nota al pie
 * - Footer opcional: "Ver documento completo"
 * - Scroll indicators: flecha bounce + fade bottom
 * - Tamaño gigante (90vw × 90vh)
 *
 * Props esperados en Modal:
 * - carouselImages: CarouselImage[] (para carrusel tipo bienvenida)
 * - twoColumnBody: { main, aside } (cuerpo dos columnas)
 * - imageWithCaption: { src, alt, caption, maxWidth }
 * - fullDocLink: string (href para "Ver documento completo")
 * - showScrollIndicators: boolean
 * - fullDocLink: string
 */

import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { useModalStore } from '../../../stores/modalStore.ts';
import type { Modal } from '../../../types/modal.ts';
import { Carousel } from '../Carousel';
import { ScrollIndicators } from '../ScrollIndicators';
import { TwoColumnBody } from '../TwoColumnBody';
import { ImageWithCaption } from '../ImageWithCaption';
import { FullDocLink } from '../FullDocLink';
import { Glyph } from '../Glyph';
import styles from './FeatureLayout.module.css';

const DECORATOR_URL = '/assets/modal/feature/linea.svg';
const SALIR_URL = '/assets/modal/feature/salir.svg';
const ICON_BG_URL = '/assets/modal/feature/fondoIcon1.svg';

export function FeatureLayout({ modal }: { modal: Modal }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <div className={styles.feature} style={modal.theme as CSSProperties}>
      {/* Scrim sutil para legibilidad */}
      <div className={styles.scrim} aria-hidden="true" />

      {/* Header fijo: icono + título + decorador + close */}
      <header className={styles.header}>
        <div className={styles.headerGroup}>
          {/* Icono con fondo (estilo v17) */}
          <span className={styles.iconBadge}>
            <img
              className={styles.iconBg}
              src={ICON_BG_URL}
              alt=""
              aria-hidden="true"
            />
            <span className={styles.iconGlyph}>
              {modal.iconImage ? (
                <img src={modal.iconImage} alt="" width={20} height={20} aria-hidden="true" />
              ) : (
                <Glyph name={modal.icon ?? 'presentation'} size={20} />
              )}
            </span>
          </span>

          <div className={styles.titleColumn} ref={titleRef}>
            {modal.highlight && (
              <p className={styles.highlight}>{modal.highlight}</p>
            )}
            <h2 className={styles.title}>{modal.title}</h2>
            <span
              className={styles.decor}
              style={{ backgroundImage: `url(${DECORATOR_URL})` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <button
          type="button"
          className={styles.close}
          onClick={closeModal}
          aria-label="Cerrar modal"
        >
          <img src={SALIR_URL} alt="" aria-hidden="true" />
        </button>
      </header>

      {/* Contenido scrollable */}
      <div className={styles.scrollWrapper} ref={scrollRef} onScroll={() => {}}>
        <div className={styles.content}>
          {/* Carrusel (solo para modal bienvenida / id específico) */}
          {modal.carouselImages && modal.carouselImages.length > 0 && (
            <div className={styles.carouselWrapper}>
              <Carousel
                images={modal.carouselImages}
                autoPlay={true}
                autoPlayInterval={6000}
                pauseOnHover={true}
                showIndicators={true}
                showArrows={true}
                height="50vh"
              />
            </div>
          )}

          {/* Imagen + caption opcional */}
          {modal.imageWithCaption && (
            <div className={styles.imageCaptionWrapper}>
              <ImageWithCaption
                src={modal.imageWithCaption.src}
                alt={modal.imageWithCaption.alt}
                caption={modal.imageWithCaption.caption}
                maxWidth={modal.imageWithCaption.maxWidth}
              />
            </div>
          )}

          {/* Cuerpo dos columnas (60/40) */}
          {modal.twoColumnBody && (
            <TwoColumnBody
              main={modal.twoColumnBody.main}
              aside={modal.twoColumnBody.aside}
            />
          )}

          {/* Contenido fallback: texto simple si no hay twoColumnBody */}
          {!modal.twoColumnBody && modal.texto && (
            <div className={styles.simpleBody}>{modal.texto}</div>
          )}

          {/* Link "Ver documento completo" */}
          {modal.fullDocLink && (
            <div className={styles.fullDocWrapper}>
              <FullDocLink href={modal.fullDocLink} />
            </div>
          )}
        </div>

        {/* Scroll indicators (flecha bounce + fade bottom) */}
        <ScrollIndicators
          scrollRef={scrollRef}
          showArrow={true}
          showFade={true}
        />
      </div>
    </div>
  );
}