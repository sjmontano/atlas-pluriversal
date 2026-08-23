/**
 * 🎨 GLYPH — Catálogo de iconos monocromo del sistema de modales
 * ==============================================================
 * SVG inline con `fill/stroke = currentColor` para tintar con la paleta.
 * El nombre del glyph se declara en `Modal.icon` y `ModalTrigger.icon`.
 * Agregar un glyph nuevo = añadir entrada aquí sin tocar los consumidores.
 */

import type { ReactNode } from 'react'

const GLYPHS: Record<string, ReactNode> = {
  presentation: (
    <svg viewBox="0 0 41 40" fill="none" aria-hidden="true">
      <path
        d="M17.8565 15.3433C17.6674 17.688 17.5996 20.0407 17.6534 22.3923C17.6534 27.1731 17.4955 28.7741 19.9098 28.7741C22.3241 28.7741 22.1661 27.1731 22.1661 22.3923C22.1661 20.0797 22.1661 17.4558 21.9743 15.3544C26.2727 15.3544 27.7393 15.4545 27.7393 13.1308C27.7393 10.807 26.1937 10.9071 21.5908 10.9071C16.9878 10.9071 11.0762 10.7515 11.0762 13.1308C11.0762 14.8986 14.314 15.2655 17.8565 15.3433Z"
        fill="currentColor"
      />
      <path
        d="M40.6668 2.63502V2.02352C40.6668 1.86786 40.5427 1.72333 40.4863 1.56767C40.3741 1.2426 40.14 0.972115 39.832 0.811632C39.1255 0.481562 38.3572 0.299825 37.5756 0.277956L36.5603 0.211247H35.8157L34.3603 0.111182C30.4794 0 26.6436 0 22.8981 0L12.1015 0.100064L7.14877 0.166774L4.81345 0.200128C4.15911 0.200128 3.34683 0.200128 2.66992 0.277956C2.3785 0.323773 2.09983 0.428398 1.85134 0.585277C1.60285 0.742156 1.38991 0.94791 1.22586 1.18965C0.880421 1.72072 0.674903 2.32834 0.627925 2.95745C0.627925 3.27988 0.548953 3.62455 0.503826 3.94698V4.60295C0.413572 5.29228 0.379727 5.95938 0.345881 6.67095C0.289473 7.89395 0.255627 9.06137 0.199219 10.1398C0.199219 12.2301 0.199219 13.9867 0.199219 15.1764C0.199219 19.4903 0.300754 23.3483 0.391008 26.9395C0.515108 30.8087 0.627925 34.2775 0.729461 37.3907C0.730456 37.6956 0.795067 37.997 0.919278 38.2762C1.04349 38.5555 1.22465 38.8066 1.45149 39.0139C1.93445 39.4066 2.53032 39.6399 3.15504 39.681C3.49349 39.681 3.83194 39.7477 4.17039 39.77H5.07293H6.13342C7.53235 39.77 8.80719 39.77 10.0143 39.7144C12.4174 39.7144 14.527 39.5698 16.2757 39.4698L19.6602 39.2696H20.4048L28.6292 39.2029C29.4528 39.0827 30.2304 38.7531 30.8856 38.2468C31.3932 37.8799 31.8671 37.4907 32.3409 37.1349C33.2999 36.3233 34.2927 35.4338 35.5224 34.2775C36.1316 33.6994 36.7972 33.0545 37.5418 32.3096L38.7038 31.1311L39.3469 30.4417L39.5274 30.2416L39.7643 29.9414C39.9264 29.7346 40.077 29.5193 40.2156 29.2966C40.3058 29.0186 40.3284 28.7295 40.3961 28.4405C40.4133 28.2927 40.4133 28.1435 40.3961 27.9957V27.6955C40.3961 27.3286 40.3961 26.9506 40.3961 26.5837C40.3961 25.8388 40.3961 25.0828 40.3961 24.3045C40.3961 22.7479 40.3961 21.1247 40.4525 19.4569C40.4525 16.1215 40.5202 12.5525 40.554 8.89459C40.554 7.97178 40.554 7.04897 40.554 6.12615V3.9025L40.6668 2.63502Z"
        fill="currentColor"
      />
    </svg>
  ),

  marker: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21c4-3.5 7-6.8 7-10.5a7 7 0 1 0-14 0C5 14.2 8 17.5 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  fichatecnica: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 9h10M7 13h10M7 17h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  info: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 11v5M12 8h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  gallery: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="13"
        y="3"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="13"
        y="13"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),

  download: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  perfil: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 3 9l9 6 9-6-9-6Z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 13v5c0 1.5 3 2.5 7 2.5s7-1 7-2.5v-5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),

  datos: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  'mapa-arbol': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  credits: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8v5M12 16h.01"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),

  /* ── Arte oficial v17 (interface/icons/line/svg) ─────────────────────── */

  back: (
    <svg viewBox="0 0 39.12 35.52" fill="none" aria-hidden="true">
      <path
        d="M25,15.51c-6.09-.07-13.16-.21-18.11.16C9.11,13.36,11.3,11.1,13.17,9c4-4.38,6.61-7.85,5.78-8.83s-4.28,1.61-8.73,5.66C8,7.89,5.52,10.28,3,12.75l-.94.93-.47.47a6.27,6.27,0,0,0-.82.91,4.35,4.35,0,0,0-.12,4.79,6,6,0,0,0,.83,1l.51.5.91.92L4.7,24.07C14.1,33.55,17.12,36.86,19,35S17.51,30.17,8.11,20.69l-.93-.93c4.92.45,11.78.48,17.7.55,10.62.12,14.17.34,14.24-2.24S35.61,15.63,25,15.51Z"
        fill="currentColor"
      />
    </svg>
  ),

  'arrow-up': (
    <svg viewBox="0 0 37.05 21.79" fill="none" aria-hidden="true">
      <path
        d="M.57,21.32C-1.48,19.42,2,16,11.81,5.38l1.88-2,1-1A9.71,9.71,0,0,1,16.34.72a4.48,4.48,0,0,1,5.07.14,5.91,5.91,0,0,1,1,.94l.57.62,1,1.06c2.57,2.83,5,5.62,7.13,8.12,4.19,5,6.84,8.86,5.74,9.72s-4.74-2.15-9.3-6.66C25.22,12.4,22.71,9.76,20.16,7l-1-1-.41-.44s0,0,0,0h0L15.62,8.92C5.77,19.53,2.61,23.21.57,21.32Z"
        fill="currentColor"
      />
    </svg>
  ),
}

export interface GlyphProps {
  name: string
  size?: number
}

/** Renderiza el SVG del glyph por nombre (aria-hidden). */
export function Glyph({ name, size = 28 }: GlyphProps) {
  return (
    <span
      style={{ width: size, height: size, display: 'grid', placeItems: 'center' }}
    >
      {GLYPHS[name] ?? null}
    </span>
  )
}