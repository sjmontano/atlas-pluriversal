/**
 * 📇 REGISTRO DE MODALES — contenido del sistema de modales
 * ==========================================================
 * MAESTRO de los modales del Atlas. Agrega los modales por sección
 * en un solo registro tipado: id → Modal.
 *
 * - `MODALS`          : id → Modal
 * - Los triggers abren el modal vía `modalStore.openModal(modal)`.
 *
 * ⚠️ Convención del proyecto: los DATOS viven en `content/` (este módulo),
 * los motores (components/modal) solo conocen interfaces y no se tocan
 * al agregar contenido. El contenido se agrega AQUÍ sin tocar componentes.
 *
 * Estructura por secciones:
  * - `./intro.ts` : modales del mapa intro (presentación, en construcción)
 * - `inicio.ts`          : los 16 POIs de la home (fullImage)
 * - `chapter-{1,2,3,4}.ts` : modales por capítulo (ids `capN-…`)
 * - `legales.ts`           : términos y condiciones (id `terminos-condiciones`)
 * - este archivo         : demo y legales (modales estándar)
 *
 * Helpers compartidos (no duplicar): `./_helpers.ts` (`paragraphs`, `presentacion`).
 */

import type { Modal } from '../../types/modal.ts'
import { INTRO_MODALS } from './intro.ts'
import { CHAPTER1_MODALS } from './chapter-1.ts'
import { CHAPTER2_MODALS } from './chapter-2.ts'
import { CHAPTER3_MODALS } from './chapter-3.ts'
import { CHAPTER4_MODALS } from './chapter-4.ts'
import { CREDITOS_EQUIPOS_MODALS } from './creditos.ts'
import { CREDITOS_MODAL, INICIO_MODALS } from './inicio.ts'
import { TERMINOS_MODAL } from './legales.ts'

/* ── Galería de imágenes ──────────────────────────────────────────────── */
const GALERIA_EJEMPLO: Modal = {
  id: 'galeria-ejemplo',
  section: 'demo',
  variant: 'large',
  title: 'Galería de imágenes',
  highlight: 'Lugares de la cuenca',
  icon: 'gallery',
  body: [
    {
      type: 'carousel',
      id: 'galeria-carousel',
      images: [
        { src: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1754783246/geoImages/mzqg9y0oq4jurybekqwr.webp', alt: 'Foto 1' },
        { src: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1754784284/geoImages/bpdxtsmccgpmo7wknpzn.webp', alt: 'Foto 2' },
        { src: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1754784166/geoImages/xeg78osmzhq42p1q6rc6.webp', alt: 'Foto 3' },
      ],
    },
  ],
  trigger: {
    type: 'button',
    icon: 'gallery',
    frame: '2',
    label: 'Galería',
  },
}

/* ── Ficha técnica ────────────────────────────────────────────────────── */
const FICHA_TECNICA: Modal = {
  id: 'ficha-tecnica',
  section: 'legales',
  variant: 'small',
  title: 'Ficha técnica',
  highlight: 'Sobre el Atlas',
  icon: 'fichatecnica',
  theme: {
    contentMarginRight: 'calc(8vw)',
  },
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Este mapa se conforma de dos elementos: una imagen 3D construida a partir del Modelo de Elevación Nacional de Colombia adquirido por el IGAC y procesada en un modelo 3D en el software Qgis. Posteriormente fue redibujado con texturas y colores que contrastan los relieves y el agua de esta zona de la geografía de Colombia. El segundo elemento, son las ilustraciones y los textos de 15 lugares, que en las alturas de las cordilleras y la planicie, constituyen el territorio del sur del valle alto del río Cauca. Este fue un proceso creativo realizado con base en el conocimiento geográfico comunitario, institucional y académico de esta parte de la cuenca del río Cauca.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'fichatecnica',
    frame: '3',
    label: 'Ficha técnica',
    mapId: 'herramientas',
  },
}

const AYUDA: Modal = {
  id: 'ayuda',
  section: 'legales',
  variant: 'full',
  title: 'Ayuda',
  highlight: 'Sobre el Atlas',
  icon: 'info',
  hideHeader: true,
  fullBleed: true,
  bodyFullBleed: true,
  theme: {
    bgFit: 'cover',
    noScrim: true,
  },
  body: [
    {
      /* Con fullBleed este carrusel se renderiza con CarouselFondo. */
      type: 'carousel',
      id: 'ayuda-carousel',
      images: [
        { src: '/assets/modal/tutorial/Lamina-01.png', alt: 'Lamina-01.png' },
        { src: '/assets/modal/tutorial/Lamina-02.png', alt: 'Lamina-02.png' },
        { src: '/assets/modal/tutorial/Lamina-03.png', alt: 'Lamina-03.png' },
        { src: '/assets/modal/tutorial/Lamina-04.png', alt: 'Lamina-04.png' },
        { src: '/assets/modal/tutorial/Lamina-05.png', alt: 'Lamina-05.png' },
        { src: '/assets/modal/tutorial/Lamina-06.png', alt: 'Lamina-06.png' },
        { src: '/assets/modal/tutorial/Lamina-07.png', alt: 'Lamina-07.png' },
        { src: '/assets/modal/tutorial/Lamina-08.png', alt: 'Lamina-08.png' },
        { src: '/assets/modal/tutorial/Lamina-09.png', alt: 'Lamina-09.png' },
        { src: '/assets/modal/tutorial/Lamina-10.png', alt: 'Lamina-10.png' },
        { src: '/assets/modal/tutorial/Lamina-11.png', alt: 'Lamina-11.png' },
        { src: '/assets/modal/tutorial/Lamina-12.png', alt: 'Lamina-12.png' },
        { src: '/assets/modal/tutorial/Lamina-13.png', alt: 'Lamina-13.png' },
        { src: '/assets/modal/tutorial/Lamina-14.png', alt: 'Lamina-14.png' },
        { src: '/assets/modal/tutorial/Lamina-15.png', alt: 'Lamina-15.png' },
        { src: '/assets/modal/tutorial/Lamina-16.png', alt: 'Lamina-16.png' },
        { src: '/assets/modal/tutorial/Lamina-17.png', alt: 'Lamina-17.png' },
        { src: '/assets/modal/tutorial/Lamina-18.png', alt: 'Lamina-18.png' },
      ],
    },
  ],
  trigger: {
    type: 'button',
    icon: 'fichatecnica',
    frame: '3',
    label: 'Ficha técnica',
    mapId: 'herramientas',
  },
}

/* ── Agregado maestro ──────────────────────────────────────────────── */
/** Lista plana (exportada para el test de ids duplicados). */
export const ALL_MODALS: Modal[] = [
  ...INTRO_MODALS,
  ...INICIO_MODALS,
  CREDITOS_MODAL,
  ...CHAPTER1_MODALS,
  ...CHAPTER2_MODALS,
  ...CHAPTER3_MODALS,
  ...CHAPTER4_MODALS,
  TERMINOS_MODAL,
  ...CREDITOS_EQUIPOS_MODALS,
  GALERIA_EJEMPLO,
  FICHA_TECNICA,
  AYUDA,
]

export const MODALS: Record<string, Modal> = Object.fromEntries(
  ALL_MODALS.map((modal) => [modal.id, modal]),
)

/* ─── Helpers ──────────────────────────────────────────────────────────── */

export const getModalById = (id: string): Modal | null => MODALS[id] ?? null

export const listModalsBySection = (section: string): Modal[] =>
  Object.values(MODALS).filter((m) => m.section === section)
