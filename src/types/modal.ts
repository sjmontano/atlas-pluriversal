/**
 * 🧩 MODAL — Tipos del sistema de modales del Atlas
 * ==================================================
 * Contrato de datos y presentación del sistema de modales.
 * La fuente de verdad de los datos vive en `src/content/modals/`
 * (registro por id + índice por mapa); estos tipos tipan su consumo.
 *
 * Arquitectura:
 * - 1 solo header (icono + título + decorador + X)
 * - Body = ModalBlock[] (bloques apilables: text, image, carousel, columns, meta, link)
 * - Sin footer (el botón X ya está en el header)
 */

export type ModalVariant = 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'full'

/* ─── Bloques tipados del body ─────────────────────────────────────────── */

export type ModalBlock =
  | { type: 'paragraph'; id: string; text: string }
  | { type: 'heading'; id: string; level?: 2 | 3; text: string }
  | { type: 'list'; id: string; ordered?: boolean; items: string[] }
  | { type: 'quote'; id: string; text: string; source?: string }
  | { type: 'image'; id: string; src: string; alt: string; caption?: string }
  | {
    type: 'carousel'
    id: string
    images: { src: string; alt: string; description?: string }[]
  }
  | { type: 'columns'; id: string; main: ModalBlock[]; aside?: ModalBlock[] }
  | { type: 'meta'; id: string; data: Record<string, string> }
  | { type: 'link'; id: string; href: string; label: string }

/* ─── Tema (CSS variables por modal) ──────────────────────────────────── */

export interface ModalTheme {
  /** Color del título (default: --dark-green) */
  titleColor?: string
  /** Color del cuerpo de texto (default: --text-primary) */
  textColor?: string
  /** Color de fondo del modal (default: --modal-bg) */
  bgColor?: string
  /** Tamaño personalizado (sobrescribe el token de la variante) */
  size?: { width: string; height: string }
}

/* ─── Acciones (footer — solo para botón de cerrar legacy) ─────────────── */

export interface ModalAction {
  label: string
  href?: string
  variant?: 'primary' | 'ghost' | 'link'
  onClick?: 'close'
}

/* ─── Trigger: cómo se abre y a qué mapa se indexa ─────────────────────── */

export interface ModalTrigger {
  /** button (IconButton) | marker (POI) | poi */
  type: 'button' | 'marker' | 'poi'
  /** Nombre del glyph (ver components/modal/Glyph.tsx) */
  icon: string
  /** Frame 1–4 (identidad visual por sección) */
  frame?: string
  /** Etiqueta del trigger */
  label?: string
  /** Mapa al que se indexa */
  mapId?: string
  /** Posición % del marker sobre el mapa */
  position?: { top: string; left: string }
  /** Si está presente, el trigger abre esta URL externa en vez de un modal */
  href?: string
  /** Si está presente, el trigger navega a este mapa en vez de abrir modal */
  gotoMapId?: string
}

/* ─── ModalData ────────────────────────────────────────────────────────── */

export interface Modal {
  id: string
  /** "inicio" | "intro" | "capitulo-1" | "legales" | ... */
  section: string
  variant: ModalVariant
  title: string
  highlight?: string
  /** Nombre del glyph del header/trigger */
  icon: string
  /** Imagen de icono propia (sustituye al glyph en el badge) */
  iconImage?: string
  /** Imagen de fondo (se usa con fullImage=true) */
  image?: string
  /** Activa imagen de fondo full-bleed + scrim automático */
  fullImage?: boolean
  /** Tema (CSS variables) — colores y tamaño personalizado */
  theme?: ModalTheme
  /** Contenido del body (bloques apilables) */
  body: ModalBlock[]
  /** Mostrar indicadores de scroll (flecha bounce + fade bottom) */
  showScrollIndicators?: boolean
  /** Footer actions (legacy — preferir blocks link en body) */
  actions?: ModalAction[]
  /** @deprecated Usar block type 'meta' en body */
  meta?: Record<string, string>
  trigger: ModalTrigger
}
