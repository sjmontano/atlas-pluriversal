/**
 * 🏔️ MODALES DE INICIO — los 16 POIs de la home como modales
 * ============================================================
 * Mapeo de `content/inicio/pois.ts` al contrato `Modal` del sistema:
 * todos usan el layout `inicio` (large · imagen de fondo 100%, gota +
 * título + decorador repetido). El agregado maestro vive en `index.ts`.
 */

import type { Modal } from '../../types/modal.ts'
import { POIS } from '../inicio/pois.ts'

export const INICIO_MODALS: Modal[] = POIS.map((poi) => ({
  id: poi.id,
  section: 'inicio',
  variant: 'xl',
  layout: 'inicio',
  title: poi.title,
  icon: 'marker',
  image: poi.image,
  texto: poi.texto,
  body: [],
  actions: [{ label: 'Cerrar', variant: 'ghost' }],

  trigger: {
    type: 'poi',
    icon: 'marker',
    mapId: 'intro',
    label: poi.title,
  },
}))

/* ── MEDIUM · layout text · créditos del proyecto ────────────────────────
   Consolidación de los modales 19–21 de v17 (modalsData) en un solo
   registro data-driven. Trigger: botón "Créditos" del panel de la home. */
export const CREDITOS_MODAL: Modal = {
  id: 'creditos',
  section: 'inicio',
  variant: 'medium',
  layout: 'text',
  title: 'Créditos',
  highlight: 'Atlas Pluriversal del Río Cauca',
  icon: 'credits',
  body: [
    {
      type: 'heading',
      id: 'h1',
      level: 2,
      text: 'Colaboratorio de Cartografías críticas y codiseño territorial',
    },
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Concepción del atlas, producción cartográfica y textual con las comunidades de la cuenca alta del río Cauca.',
    },
    {
      type: 'heading',
      id: 'h2',
      level: 2,
      text: 'Diseño gráfico y web',
    },
    {
      type: 'paragraph',
      id: 'p2',
      text: 'Colaboratorio de diseño — Universidad del Cauca.',
    },
    {
      type: 'paragraph',
      id: 'p3',
      text: 'Contenido bajo licencia CC BY-NC-ND 4.0.',
    },
  ],
  actions: [{ label: 'Cerrar', variant: 'ghost' }],
  trigger: {
    type: 'button',
    icon: 'credits',
    frame: '4',
    label: 'Créditos',
  },
}
