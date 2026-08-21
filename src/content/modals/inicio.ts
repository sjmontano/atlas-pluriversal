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
  variant: 'large',
  layout: 'inicio',
  title: poi.title,
  icon: 'marker',
  image: poi.image,
  texto: poi.texto,
  body: [],
  actions: [{ label: 'Cerrar', variant: 'ghost' }],
  theme: {
    size: { width: '80vw', height: '88vh' },
  },
  trigger: {
    type: 'poi',
    icon: 'marker',
    mapId: 'intro',
    label: poi.title,
  },
}))
