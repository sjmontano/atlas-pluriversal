/**
 * 🧪 MAQUETA UI (dev-only) — Sidebar lateral + 3 tamaños de modales
 * =================================================================
 * Página exclusiva de desarrollo para probar y refinar la UI:
 * - sidebar lateral con IconButtons (frame + glyph + label, estilo v17)
 * - abre los 3 tamaños (small / medium / large) con info, iconos e
 *   imágenes FALSAS (placeholder SVG) — sin tocar contenido real.
 *
 * No es visible al público: solo se monta con VITE_DEV_TOOLS === 'true'
 * (mismo patrón que TestMapPage / CalibrationPanel). Los datos falsos
 * viven aquí, NUNCA en src/content/modals.
 */

import { getModalById } from '@content/modals'
import { useUIStore } from '@stores/index.ts'
import { IconButton } from '@components/modal/IconButton'
import type { Modal } from '../types/modal'
import styles from './UiMockupPage.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

/* ─── Placeholder de imagen (data-uri SVG, sin red) ─────────────────────── */
function ph(label: string, from = '#0599b7', to = '#046c81'): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/>` +
    `</linearGradient></defs>` +
    `<rect width='640' height='400' fill='url(#g)'/>` +
    `<text x='320' y='196' fill='rgba(255,255,255,.95)' font-family='sans-serif' font-size='26' text-anchor='middle' font-weight='600'>${label}</text>` +
    `<text x='320' y='232' fill='rgba(255,255,255,.6)' font-family='sans-serif' font-size='15' text-anchor='middle'>placeholder · imagen de maqueta</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/* ─── Datos falsos (solo maqueta) ───────────────────────────────────────── */
const FAKE_MODALS: Record<string, Modal> = {
  'perfil-cuenca': {
    id: 'perfil-cuenca',
    section: 'dev',
    variant: 'large',
    layout: 'image-text',
    title: 'Perfil de la cuenca',
    highlight: 'Ficha gráfica · LARGE',
    icon: 'perfil',
    image: ph('PERFIL CUENCA', '#b98a5e', '#8a5a2f'),
    body: [
      {
        type: 'paragraph',
        id: 'p1',
        text: 'Texto falso de maqueta para el layout large (image-text). Aquí se probará el hero de imagen con el texto editorial a la derecha, el scroll interno y la jerarquía del encabezado.',
      },
      { type: 'heading', id: 'h1', level: 2, text: 'Titular de sección (bloque heading)' },
      {
        type: 'list',
        id: 'l1',
        ordered: true,
        items: [
          'Elemento falso 1 del listado ordenado',
          'Elemento falso 2',
          'Elemento falso 3',
        ],
      },
      {
        type: 'quote',
        id: 'q1',
        text: 'Cita falsa para probar el bloque quote dentro de un modal large.',
        source: 'Fuente de maqueta',
      },
    ],
    actions: [{ label: 'Cerrar', variant: 'ghost' }],
    trigger: {
      type: 'button',
      icon: 'perfil',
      frame: '1',
      label: 'Perfil cuenca',
    },
  },

  'mapa-arbol': {
    id: 'mapa-arbol',
    section: 'dev',
    variant: 'large',
    layout: 'image-text',
    title: 'Mapa de árbol',
    highlight: 'Ficha gráfica · LARGE',
    icon: 'mapa-arbol',
    image: ph('MAPA DE ÁRBOL', '#2f4f38', '#1c3323'),
    body: [
      {
        type: 'paragraph',
        id: 'p1',
        text: 'Segundo ejemplo large con otra imagen de maqueta, para comparar hero y encabezados entre fichas gráficas.',
      },
      { type: 'heading', id: 'h1', level: 2, text: 'Otra sección de maqueta' },
      {
        type: 'paragraph',
        id: 'p2',
        text: 'Párrafo adicional de relleno para observar el comportamiento del scroll en la variante large.',
      },
    ],
    actions: [{ label: 'Cerrar', variant: 'ghost' }],
    trigger: {
      type: 'button',
      icon: 'mapa-arbol',
      frame: '1',
      label: 'Mapa de árbol',
    },
  },

  'creditos': {
    id: 'creditos',
    section: 'dev',
    variant: 'medium',
    layout: 'text',
    title: 'Créditos (maqueta)',
    highlight: 'Información · MEDIUM',
    icon: 'credits',
    body: [
      {
        type: 'paragraph',
        id: 'p1',
        text: 'Modal medium de prueba para el layout text: bloques editoriales con scroll dentro del contenedor de tamaño medio.',
      },
      { type: 'heading', id: 'h1', level: 2, text: 'Lista de crèditos' },
      {
        type: 'list',
        id: 'l1',
        items: ['Nombre falso 1', 'Nombre falso 2', 'Nombre falso 3'],
      },
    ],
    actions: [{ label: 'Cerrar', variant: 'ghost' }],
    trigger: {
      type: 'button',
      icon: 'credits',
      frame: '4',
      label: 'Créditos',
    },
  },

  'datos': {
    id: 'datos',
    section: 'dev',
    variant: 'medium',
    layout: 'text',
    title: 'Datos (maqueta)',
    highlight: 'Información · MEDIUM',
    icon: 'datos',
    body: [
      {
        type: 'paragraph',
        id: 'p1',
        text: 'Modal medium de prueba para probar el layout text con bloques de tabla.',
      },
      {
        type: 'datatable',
        id: 't1',
        columns: ['Variable', 'Valor'],
        rows: [
          ['Variable falsa A', 'Valor 1'],
          ['Variable falsa B', 'Valor 2'],
          ['Variable falsa C', 'Valor 3'],
        ],
      },
    ],
    actions: [{ label: 'Cerrar', variant: 'ghost' }],
    trigger: {
      type: 'button',
      icon: 'datos',
      frame: '3',
      label: 'Datos',
    },
  },

  'galeria-fake': {
    id: 'galeria-fake',
    section: 'dev',
    variant: 'medium',
    layout: 'gallery',
    title: 'Galería (maqueta)',
    highlight: 'Carrusel · MEDIUM',
    icon: 'gallery',
    gallery: [
      ph('FOTO 1', '#0599b7', '#046c81'),
      ph('FOTO 2', '#b98a5e', '#8a5a2f'),
      ph('FOTO 3', '#2f4f38', '#1c3323'),
    ],
    body: [],
    actions: [{ label: 'Cerrar', variant: 'ghost' }],
    trigger: {
      type: 'button',
      icon: 'gallery',
      frame: '2',
      label: 'Galería',
    },
  },

  'lugar-1': {
    id: 'lugar-1',
    section: 'dev',
    variant: 'large',
    layout: 'image-text',
    title: 'Lugar ejemplo uno',
    highlight: 'POI · LARGE',
    icon: 'marker',
    image: ph('LUGAR 1', '#0599b7', '#046c81'),
    body: [
      {
        type: 'paragraph',
        id: 'p1',
        text: 'Marker falso sobre el escenario de maqueta. Abre el mismo layout large que el nevado-huila real, para refinar tamaño y composición.',
      },
    ],
    actions: [{ label: 'Cerrar', variant: 'ghost' }],
    trigger: {
      type: 'marker',
      icon: 'marker',
      frame: '1',
      label: 'Lugar ejemplo uno',
      position: { top: '30%', left: '30%' },
    },
  },

  'lugar-2': {
    id: 'lugar-2',
    section: 'dev',
    variant: 'large',
    layout: 'image-text',
    title: 'Lugar ejemplo dos',
    highlight: 'POI · LARGE',
    icon: 'marker',
    image: ph('LUGAR 2', '#b98a5e', '#8a5a2f'),
    body: [
      {
        type: 'paragraph',
        id: 'p1',
        text: 'Segundo marker de maqueta para comparar el mismo modal con distinta imagen hero.',
      },
    ],
    actions: [{ label: 'Cerrar', variant: 'ghost' }],
    trigger: {
      type: 'marker',
      icon: 'marker',
      frame: '1',
      label: 'Lugar ejemplo dos',
      position: { top: '55%', left: '56%' },
    },
  },
}

/* ─── Sidebar de maqueta (grupos de triggers) ───────────────────────────── */
interface SidebarItem {
  id: string
  label: string
  frame?: string
}

const SIDEBAR_GROUPS: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'Mapa · presentación',
    items: [{ id: 'cuenca-cauca', label: 'Presentación', frame: '1' }],
  },
  {
    title: 'Mapa · herramientas',
    items: [
      { id: 'ficha-tecnica', label: 'Ficha técnica', frame: '3' },
      { id: 'galeria-fake', label: 'Galería', frame: '2' },
      { id: 'en-construccion', label: 'Aviso', frame: '3' },
    ],
  },
  {
    title: 'POIs · modal inicio',
    items: [
      { id: 'los-farallones', label: 'Los Farallones', frame: '1' },
      { id: 'embalse-calima', label: 'Embalse Calima', frame: '1' },
      { id: 'cerro-catalina-teta', label: 'Cerro Catalina', frame: '1' },
    ],
  },
  {
    title: 'Fichas gráficas',
    items: [
      { id: 'perfil-cuenca', label: 'Perfil cuenca', frame: '1' },
      { id: 'mapa-arbol', label: 'Mapa de árbol', frame: '1' },
    ],
  },
  {
    title: 'Información',
    items: [
      { id: 'creditos', label: 'Créditos', frame: '4' },
      { id: 'datos', label: 'Datos', frame: '3' },
    ],
  },
]

/* Selector rápido de los 3 tamaños */
const SIZE_CHIPS: { variant: string; id: string }[] = [
  { variant: 'small', id: 'ficha-tecnica' },
  { variant: 'medium', id: 'cuenca-cauca' },
  { variant: 'large', id: 'perfil-cuenca' },
]

/* Markers falsos sobre el escenario */
const MARKERS: { id: string; top: string; left: string }[] = [
  { id: 'lugar-1', top: '30%', left: '30%' },
  { id: 'lugar-2', top: '55%', left: '56%' },
  /* POIs reales → layout inicio (full-bleed, gota + decorador repetido) */
  { id: 'los-farallones', top: '34%', left: '46%' },
  { id: 'embalse-calima', top: '24%', left: '66%' },
  { id: 'cerro-catalina-teta', top: '58%', left: '30%' },
]

function resolveModal(id: string): Modal | null {
  return getModalById(id) ?? FAKE_MODALS[id] ?? null
}

export function UiMockupPage() {
  const openModal = useUIStore((s) => s.openModal)

  if (!ENABLE_DEV_TOOLS) {
    return (
      <div className={styles.page}>
        <p className={styles.devOff}>
          Maqueta UI desactivada. Ejecuta el dev con <code>VITE_DEV_TOOLS=true</code>.
        </p>
      </div>
    )
  }

  const openById = (id: string) => {
    const modal = resolveModal(id)
    if (modal) openModal(modal)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headLeft}>
          <span className={styles.badge}>DEV</span>
          <h1 className={styles.title}>Maqueta UI — Sidebar + Modales</h1>
        </div>
        <div className={styles.chips}>
          {SIZE_CHIPS.map((chip) => (
            <button
              key={chip.variant}
              type="button"
              className={styles.chip}
              onClick={() => openById(chip.id)}
            >
              <span className={styles.chipName}>{chip.variant}</span>
              <span className={styles.chipHint}>abrir</span>
            </button>
          ))}
        </div>
      </header>

      <div className={styles.stage}>
        <nav className={styles.sidebar} aria-label="Sidebar lateral (maqueta)">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.title} className={styles.group}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              {group.items.map((item) => (
                <IconButton
                  key={item.id}
                  icon={resolveModal(item.id)?.icon ?? 'info'}
                  label={item.label}
                  frame={item.frame}
                  onClick={() => openById(item.id)}
                />
              ))}
            </div>
          ))}
        </nav>

        {MARKERS.map((marker) => {
          const modal = resolveModal(marker.id)
          if (!modal) return null
          return (
            <button
              key={marker.id}
              type="button"
              className={styles.marker}
              style={{ top: marker.top, left: marker.left }}
              aria-label={modal.title}
              title={modal.title}
              onClick={() => openById(marker.id)}
            >
              <span className={styles.markerDot} />
            </button>
          )
        })}

        <p className={styles.hint}>
          Sidebar lateral (estilo v17) · los botones abren modales de maqueta con
          info, iconos e imágenes falsas · 3 tamaños (small / medium / large).
          Los markers de la fila «POIs · modal inicio» abren el layout full-bleed
          (gota + decorador repetido) con datos reales. Redimensiona el viewport
          para refinar el responsive.
        </p>
      </div>
    </div>
  )
}