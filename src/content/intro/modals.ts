/**
 * 🎬 MODALES DEL MAPA INTRO — Presentación del Atlas
 * ====================================================
 * Modales que aparecen en el mapa intro (/intro).
 * Cada mapa puede tener su propio archivo de modals.ts.
 *
 * Configuración:
 *   - variant  → tamaño del modal (xs | small | medium | large | xl | full)
 *   - fullImage → imagen de fondo full-bleed + scrim automático
 *   - theme    → CSS variables (titleColor, bgColor, textColor)
 *   - body[]   → bloques apilables (paragraph, heading, quote, image, carousel, columns, meta, link)
 */

import type { Modal } from '../../types/modal.ts'

/* ── Assets ──────────────────────────────────────────────────────────────── */

const PRESENTACION_ICON = '/assets/modal/feature/presentation.svg'
const TALLER_1 = '/assets/img/talleres/taller-1.webp'
const TALLER_2 = '/assets/img/talleres/taller-2.webp'
const TALLER_3 = '/assets/img/talleres/taller-3.webp'

/* ── Presentación del Atlas ────────────────────────────────────────────────
 *  Modal de bienvenida con carrusel + columns + link.
 *  Para configurar: cambia textos, fotos oblocks aquí. */

export const PRESENTACION_MODAL: Modal = {
  id: 'presentacion',
  section: 'intro',
  variant: 'xl',

  title: 'Presentación del Atlas',
  highlight: 'El río pensado y sentido desde la cartografía y el dibujo',
  icon: 'presentation',
  iconImage: PRESENTACION_ICON,

  body: [
    /* Carrusel de fotos de talleres */
    {
      type: 'carousel',
      id: 'pres-carousel',
      images: [
        {
          src: TALLER_1,
          alt: 'Taller 1',
          description:
            'Foto 1: Taller La intuición espacial y las construcciones geográficas. Octubre 7 de 2023. Villa Rica, Cauca.',
        },
        {
          src: TALLER_2,
          alt: 'Taller 2',
          description:
            'Foto 2: Taller Cuando el cuerpo habla: descubriendo relatos territoriales. Enero 17 de 2024. Villa Rica, Cauca.',
        },
        {
          src: TALLER_3,
          alt: 'Taller 3',
          description:
            'Foto 3: Taller Mundos relacionales y codiseño territorial. Agosto 24 de 2024. Villa Rica.',
        },
      ],
    },

    /* Dos columnas: texto principal + cita al pie */
    {
      type: 'columns',
      id: 'pres-columns',
      main: [
        {
          type: 'paragraph',
          id: 'pres-p1',
          text: 'Este atlas surge de dos procesos solidarios desarrollados por el Tejido de transicionantes del valle alto del río Cauca entre el 2023 y 2024.',
        },
        {
          type: 'paragraph',
          id: 'pres-p2',
          text: 'El segundo es una juntanza formativa y creativa que tomó la forma de Colaboratorio de cartografías críticas y codiseño territorial.',
        },
        {
          type: 'paragraph',
          id: 'pres-p3',
          text: 'La organización de este atlas consta de cuatro partes que abordan aspectos bioculturales relevantes del sur del valle alto del río Cauca.',
        },
      ],
      aside: [
        {
          type: 'quote',
          id: 'pres-q1',
          text: 'Alternativas transformadoras son aquellas formas organizativas que procuran romper con los sistemas dominantes.',
          source: 'Diagnóstico de Paz Territorial Pluriversal, 2024: 6',
        },
      ],
    },

    /* Link al documento completo */
    {
      type: 'link',
      id: 'pres-link',
      href: 'https://docs.google.com/document/d/1b8t-bCbnQOOCKgBMKEWtUB0e9oru086TC7NiXr875RE/edit?usp=sharing',
      label: 'Ver documento completo',
    },
  ],

  showScrollIndicators: true,

  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentación',
    mapId: 'intro',
  },
}

/* ── Presentación del mapa (confines del sur) ────────────────────────────── */

export const CUENCA_CAUCA: Modal = {
  id: 'cuenca-cauca',
  section: 'intro',
  variant: 'large',
  title: 'Confines del sur del valle alto caucano',
  highlight: 'Presentación',
  icon: 'presentation',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Esta mapa se conforma de dos elementos: una imagen 3D construida a partir del Modelo de Elevación Nacional de Colombia adquirido por el IGAC y procesada en un modelo 3D en el software Qgis.',
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

/* ── En construcción (aviso) ─────────────────────────────────────────────── */

export const EN_CONSTRUCCION: Modal = {
  id: 'en-construccion',
  section: 'legales',
  variant: 'xs',
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

/* ── Todos los modales de este mapa ──────────────────────────────────────── */

export const INTRO_MODALS: Modal[] = [
  PRESENTACION_MODAL,
  CUENCA_CAUCA,
  EN_CONSTRUCCION,
]
