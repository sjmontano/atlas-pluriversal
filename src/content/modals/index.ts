/**
 * 📇 REGISTRO DE MODALES — contenido del sistema de modales
 * ==========================================================
 * MAESTRO de los modales del Atlas (3 tamaños, 6 layouts). Agrega los
 * modales por sección (cada sección en su propio archivo) en un solo
 * registro tipado: id → Modal (forma tipada en src/types/modal.ts).
 *
 * - `MODALS`          : id → Modal
 * - `MAP_MODAL_INDEX` : mapa → ids de modales indexados a ese mapa
 * - Los triggers abren el modal vía `uiStore.openModal(modal)`.
 *
 * ⚠️ Convención del proyecto: los DATOS viven en `content/` (este módulo),
 * los motores (components/modal) solo conocen interfaces y no se tocan
 * al agregar contenido. El contenido se agrega AQUÍ sin tocar componentes.
 *
 * Estructura por secciones:
 * - `inicio.ts`  : los 16 POIs de la home (layout `inicio`)
 * - este archivo : intro, demo y legales (modales estándar)
 */

import type { Modal } from '../../types/modal.ts'
import { INICIO_MODALS, CREDITOS_MODAL } from './inicio.ts'
import { CHAPTER1_MODALS, CHAPTER1_MODAL_INDEX } from './chapter-1.ts'

/* ── MEDIUM · layout text · intro del mapa ───────────────────────────────
   Trigger: botón "Presentación" (frame 1 + glyph presentation). */
const CUENCA_CAUCA: Modal = {
  id: 'cuenca-cauca',
  section: 'intro',
  variant: 'large',
  layout: 'text',
  title: 'Confines del sur del valle alto caucano',
  highlight: 'Presentación',
  icon: 'presentation',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Esta mapa se conforma de dos elementos: una imagen 3D construida a partir del Modelo de Elevación Nacional de Colombia adquirido por el IGAC y procesada en un modelo 3D en el software Qgis. Posteriormente fue redibujado con texturas y colores que contrastan los relieves y el agua de esta zona de la geografía de Colombia. El segundo elemento, son las ilustraciones y los textos de 15 lugares, que en las alturas de las cordilleras y la planicie, constituyen el territorio del sur del valle alto del río Cauca. Este fue un proceso creativo realizado con base en el conocimiento geográfico comunitario, institucional y académico de esta parte de la cuenca del río Cauca.',
    },
    {
      type: 'quote',
      id: 'q1',
      text: 'El territorio del sur del valle alto del río Cauca: cordilleras, planicie y agua en movimiento.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentación',
    mapId: 'intro',
  },
}

/* ── MEDIUM · layout gallery · carrusel ──────────────────────────────── */
const GALERIA_EJEMPLO: Modal = {
  id: 'galeria-ejemplo',
  section: 'demo',
  variant: 'large',
  layout: 'gallery',
  title: 'Galería de imágenes',
  highlight: 'Lugares de la cuenca',
  icon: 'gallery',
  gallery: [
    'https://res.cloudinary.com/dvluvxfvn/image/upload/v1754783246/geoImages/mzqg9y0oq4jurybekqwr.webp',
    'https://res.cloudinary.com/dvluvxfvn/image/upload/v1754784284/geoImages/bpdxtsmccgpmo7wknpzn.webp',
    'https://res.cloudinary.com/dvluvxfvn/image/upload/v1754784166/geoImages/xeg78osmzhq42p1q6rc6.webp',
  ],
  body: [],
  trigger: {
    type: 'button',
    icon: 'gallery',
    frame: '2',
    label: 'Galería',
  },
}

/* ── SMALL · layout datasheet · ficha técnica ────────────────────────── */
const FICHA_TECNICA: Modal = {
  id: 'ficha-tecnica',
  section: 'legales',
  variant: 'small',
  layout: 'datasheet',
  title: 'Ficha técnica',
  highlight: 'Sobre el Atlas',
  icon: 'fichatecnica',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Metadatos de la edición digital del Atlas Pluriversal del Río Cauca.',
    },
  ],
  meta: {
    Proyecto: 'Atlas Pluriversal del Río Cauca',
    Versión: '2.0',
    Formato: 'Aplicación web (React + MapLibre GL)',
    Licencia: 'CC BY-NC-ND 4.0',
    'Mapa base': 'Cuenca alta del río Cauca',
    Año: '2026',
  },
  trigger: {
    type: 'button',
    icon: 'fichatecnica',
    frame: '3',
    label: 'Ficha técnica',
    mapId: 'herramientas',
  },
}

/* ── SMALL · layout alert · aviso ────────────────────────────────────── */
const EN_CONSTRUCCION: Modal = {
  id: 'en-construccion',
  section: 'legales',
  variant: 'xl',
  layout: 'alert',
  title: 'En construcción',
  highlight: 'Aviso',
  icon: 'info',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Este contenido del Atlas estará disponible próximamente.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'info',
    frame: '3',
    label: 'Aviso',
  },
}

/* ── Agregado maestro: inicio + capítulos + estándar ─────────────────── */
const ALL_MODALS: Modal[] = [
  ...INICIO_MODALS,
  CREDITOS_MODAL,
  ...CHAPTER1_MODALS,
  CUENCA_CAUCA,
  GALERIA_EJEMPLO,
  FICHA_TECNICA,
  EN_CONSTRUCCION,
]

export const MODALS: Record<string, Modal> = Object.fromEntries(
  ALL_MODALS.map((modal) => [modal.id, modal]),
)

/* ── Índice mapa → modales ────────────────────────────────────────────────
   El intro indexa la presentación + los 16 POIs de la home (layout `inicio`).
   El capítulo 1 indexa presentaciones, fichas y perfil por mapa. */
export const MAP_MODAL_INDEX: Record<string, string[]> = {
  intro: [
    'cuenca-cauca',
    'cap1-atlas-proyecto',
    ...INICIO_MODALS.map((modal) => modal.id),
  ],
  herramientas: ['ficha-tecnica', 'en-construccion'],
  demo: ['galeria-ejemplo'],
  ...CHAPTER1_MODAL_INDEX,
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */

export const getModalById = (id: string): Modal | null => MODALS[id] ?? null

export const getModalsByMap = (mapId: string): Modal[] =>
  (MAP_MODAL_INDEX[mapId] ?? [])
    .map((id) => MODALS[id])
    .filter((m): m is Modal => m !== undefined)

export const listModalsBySection = (section: string): Modal[] =>
  Object.values(MODALS).filter((m) => m.section === section)

