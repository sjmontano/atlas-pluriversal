/**
 * 🧩 MODAL — Tipos del sistema de modales del Atlas
 * ==================================================
 * Contrato de datos y presentación del sistema de modales (3 tamaños).
 * La fuente de verdad de los datos vive en `src/content/modals/`
 * (registro por id + índice por mapa); estos tipos tipan su consumo.
 */

export type ModalVariant = 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'full'

export type ModalLayout =
  /** medium · carrusel de imágenes con miniaturas */
  | 'gallery'
  /** small · ficha técnica (tabla de `meta`) */
  | 'datasheet'
  /** medium · bloques editoriales con scroll */
  | 'text'
  /** small · aviso / en construcción */
  | 'alert'
  /** large · modal de inicio (POIs): imagen de fondo 100% + gota + decorador */
  | 'inicio'
  /** large · modal completo (bienvenida): carrusel + 2 columnas + scroll indicators */
  | 'feature'

/* ─── Tema (modelo plantilla + configuración, sin Tailwind) ───────────────
   Cada modal fuera del estándar puede sobrescribir los colores del layout
   vía CSS custom properties. El layout aporta los valores por defecto. */
export interface ModalTheme {
  /** Color del título (default: --modal-inicio-title) */
  titleColor?: string
  /** Color del cuerpo de texto (default: --modal-inicio-text) */
  textColor?: string
  /** Tamaño personalizado (sobrescribe el token de la variante) */
  size?: { width: string; height: string }
}

/* ─── Bloques tipados del body ─────────────────────────────────────────── */

export type ModalBlock =
  | { type: 'paragraph'; id: string; text: string }
  | { type: 'heading'; id: string; level?: 2 | 3; text: string }
  | { type: 'list'; id: string; ordered?: boolean; items: string[] }
  | {
    type: 'datatable'
    id: string
    columns: string[]
    rows: string[][]
  }
  | { type: 'quote'; id: string; text: string; source?: string }

/* ─── Acciones (footer) ────────────────────────────────────────────────── */

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
  /** Mapa al que se indexa (MAP_MODAL_INDEX) */
  mapId?: string
  /** Posición % del marker sobre el mapa */
  position?: { top: string; left: string }
  /** Si está presente, el trigger abre esta URL externa en vez de un modal
   *  (caso v17: fichas técnicas/descargas en Google Drive). */
  href?: string
  /** Si está presente, el trigger navega a este mapa en vez de abrir modal
   *  (caso v17: "Síntesis" → onMapChange). */
  gotoMapId?: string
}

/* ─── ModalData ────────────────────────────────────────────────────────── */

export interface Modal {
  id: string
  /** "inicio" | "intro" | "capitulo-1" | "legales" | ... */
  section: string
  variant: ModalVariant
  layout: ModalLayout
  title: string
  highlight?: string
  /** Nombre del glyph del header/trigger */
  icon: string
  /** Imagen de icono propia (p.ej. iconos de cuencas). Sustituye al glyph
   *  en el badge del header del modal. */
  iconImage?: string
  /** Imagen hero (URL) — layouts gallery / inicio / feature */
  image?: string
  /** Cuerpo largo (párrafo) — layout inicio (soporta `\n`) */
  texto?: string
  /** Tema (CSS variables) — layout inicio / feature */
  theme?: ModalTheme
  /** Galería de imágenes (URLs) — layout gallery */
  gallery?: string[]
  body: ModalBlock[]
  actions?: ModalAction[]
  /** Tabla de la ficha técnica (layout datasheet) */
  meta?: Record<string, string>
  trigger: ModalTrigger

  /* ─── Campos específicos para layout 'feature' (modal completo/bienvenida) ─── */
  /** Imágenes para carrusel (id=1 bienvenida) */
  carouselImages?: { src: string; alt: string; description?: string }[];
  /** Cuerpo a dos columnas (60/40) — layout feature */
  twoColumnBody?: {
    main: React.ReactNode;
    aside?: React.ReactNode;
  };
  /** Imagen con caption — layout feature */
  imageWithCaption?: {
    src: string;
    alt: string;
    caption?: string;
    maxWidth?: string;
  };
  /** Link "Ver documento completo" (href) — layout feature */
  fullDocLink?: string;
  /** Mostrar indicadores de scroll (flecha bounce + fade bottom) */
  showScrollIndicators?: boolean;
}
