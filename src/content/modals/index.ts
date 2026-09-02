/**
 * 📇 REGISTRO DE MODALES — contenido del sistema de modales
 * ==========================================================
 * MAESTRO de los modales del Atlas. Agrega los modales por sección
 * en un solo registro tipado: id → Modal.
 *
 * - `MODALS`          : id → Modal
 * - Los triggers abren el modal vía `uiStore.openModal(modal)`.
 *
 * ⚠️ Convención del proyecto: los DATOS viven en `content/` (este módulo),
 * los motores (components/modal) solo conocen interfaces y no se tocan
 * al agregar contenido. El contenido se agrega AQUÍ sin tocar componentes.
 *
 * Estructura por secciones:
 * - `intro/modals.ts` : modales del mapa intro (presentación, en construcción)
 * - `inicio.ts`       : los 16 POIs de la home (fullImage)
 * - este archivo      : demo y legales (modales estándar)
 */

import type { Modal } from '../../types/modal.ts'
import { INICIO_MODALS, CREDITOS_MODAL } from './inicio.ts'
import { CHAPTER1_MODALS } from './chapter-1.ts'
import { INTRO_MODALS } from '../intro/modals.ts'

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
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Metadatos de la edición digital del Atlas Pluriversal del Río Cauca.',
    },
    {
      type: 'meta',
      id: 'm1',
      data: {
        Proyecto: 'Atlas Pluriversal del Río Cauca',
        Versión: '2.0',
        Formato: 'Aplicación web (React + MapLibre GL)',
        Licencia: 'CC BY-NC-ND 4.0',
        'Mapa base': 'Cuenca alta del río Cauca',
        Año: '2026',
      },
    },
    {
      type: 'link',
      id: 'l1',
      href: 'https://drive.google.com/...',
      label: 'Ver documento completo',
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
const ALL_MODALS: Modal[] = [
  ...INTRO_MODALS,
  ...INICIO_MODALS,
  CREDITOS_MODAL,
  ...CHAPTER1_MODALS,
  GALERIA_EJEMPLO,
  FICHA_TECNICA,
]

export const MODALS: Record<string, Modal> = Object.fromEntries(
  ALL_MODALS.map((modal) => [modal.id, modal]),
)

/* ─── Helpers ──────────────────────────────────────────────────────────── */

export const getModalById = (id: string): Modal | null => MODALS[id] ?? null

export const listModalsBySection = (section: string): Modal[] =>
  Object.values(MODALS).filter((m) => m.section === section)
