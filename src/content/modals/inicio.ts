/**
 * 🏔️ MODALES DE INICIO — los 16 POIs de la home como modales
 * ============================================================
 * Mapeo de `content/inicio/pois.ts` al contrato `Modal` del sistema:
 * todos usan `fullImage: true` (imagen de fondo 100% + scrim).
 * El agregado maestro vive en `index.ts`.
 */

import type { Modal } from '../../types/modal.ts'
import { POIS } from '../inicio/pois.ts'

export const INICIO_MODALS: Modal[] = POIS.map((poi) => ({
  id: poi.id,
  section: 'inicio',
  variant: 'xl',
  fullImage: true,
  title: poi.title,
  icon: 'marker',
  image: poi.image,
  body: poi.texto
    ? [{ type: 'paragraph', id: `${poi.id}-p1`, text: poi.texto }]
    : [],

  trigger: {
    type: 'poi',
    icon: 'marker',
    mapId: 'intro',
    label: poi.title,
  },
}))

/* ── Créditos del proyecto ────────────────────────────────────────────── */
export const CREDITOS_MODAL: Modal = {
  id: 'creditos',
  section: 'inicio',
  variant: 'medium',
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
  trigger: {
    type: 'button',
    icon: 'credits',
    frame: '4',
    label: 'Créditos',
  },
}
