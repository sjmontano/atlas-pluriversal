/**
 * 🗂️ SHELL ASSETS — Rutas de los recursos de interfaz (copiados de v17)
 * =====================================================================
 * Única fuente de rutas para el chrome. Los archivos viven en
 * `public/assets/ui/**` con nombres kebab-case ASCII (TAREA 14 Fase 0).
 */

export const SHELL_ASSETS = {
  header: {
    bgShort: '/assets/ui/header/titulo-corto.webp',
    bgMedium: '/assets/ui/header/titulo-medio.webp',
    bgLong: '/assets/ui/header/titulo-largo.webp',
  },
  minimap: {
    cuenca: '/assets/ui/minimap/mini-map-cuenca.png',
    valle: '/assets/ui/minimap/mini-map-valle.webp',
    sur: '/assets/ui/minimap/mini-map-sur.webp',
    suarez: '/assets/ui/minimap/suarez.webp',
    'villa-rica': '/assets/ui/minimap/villa-rica.webp',
    cali: '/assets/ui/minimap/cali.webp',
  },
  buttons: {
    home: '/assets/ui/buttons/logo-home.svg',
    unRioCauca: '/assets/ui/buttons/logo-unrio-cauca.svg',
  },
  sidebar: {
    fondoIcon: '/assets/ui/sidebar/fondo-icon.svg',
    tabDefaultBg: '/assets/ui/sidebar/tab-default-bg.webp',
  },
  tooltips: {
    fondo: '/assets/ui/tooltips/fondo-tooltip-4.webp',
  },
  north: {
    color: '/assets/ui/icons/north-color.svg',
  },
} as const
