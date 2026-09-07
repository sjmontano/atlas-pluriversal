/**
 * 👥 MODALES DE EQUIPOS — listas de créditos (v17 modalsData ids 19-21)
 * =====================================================================
 * Se abren desde las 3 filas de la página /credits. Texto verbatim v17.
 * Solo usa bloques existentes (paragraph).
 */

import type { Modal } from '../../types/modal.ts'

/* ── v17 id 19: Colaboratorio de Cartografías ─────────────────────────── */

const EQUIPO_COLABORATORIO: Modal = {
  id: 'creditos-colaboratorio',
  section: 'inicio',
  variant: 'medium',
  title: 'Equipos de trabajo',
  highlight: 'Colaboratorio de Cartografías críticas y codiseño territorial',
  icon: 'credits',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Alexander Alvarez, Álvaro Pedrosa, Ana Maria Banguero, Ana Yerli Nazarit, Andrea Melenje, Ángela Patricia Aragón, Armando Vargas, Arturo Escobar, Belen Labrada, Bryan Ortiz, Catherine Girón, Carolina Mina, Claudia Trujillo, Claudia Victoria, Consuelo Lasso, Cristian Valencia, Cristian David Vanegas, Katherintg Labrada, Deyanira Gonzalias, Diana Marcela Carabalí, Diego Hernández, Dora Infante, Edy Serrano, Eli Cuadros, Eliécer Balanta, Erley Ibarra, Ernesto David Cortes, Fallola Ibarguen, Gerson Castro, Gian Marlon Cifuentes, Juan David Macuace, Joan Orobio, Karem Correa, Karen Daniela Martinez, Katherine Girón, Lily Vanesa Hinestrosa, Luis Florez, María Campo, María Orlency Caicedo, Myriam Marín, Natalia Salazar, Natalia Viafara, Nora Lucia Victoria, Ofir Mina, Olga Cecilia Eusse, Patricia Botero, Renata Moreno y Viviana Balanta.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'credits',
    frame: '4',
    label: 'Colaboratorio de Cartografías',
  },
}

/* ── v17 id 20: Concepción del atlas ──────────────────────────────────── */

const EQUIPO_CONCEPCION: Modal = {
  id: 'creditos-concepcion',
  section: 'inicio',
  variant: 'medium',
  title: 'Equipos de trabajo',
  highlight: 'Concepción del atlas, producción cartografica y textual',
  icon: 'credits',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Álvaro Pedrosa, Diego Hernández, Gian Marlon Cifuentes, Karem Yuliana Correa, Myriam Daniela Marín, Olga Cecilia Eusse y Renata Moreno.\n\nRegistros sonoros: Carlos Rodríguez. Fotografías: Anthony Soto.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'credits',
    frame: '4',
    label: 'Concepción del atlas',
  },
}

/* ── v17 id 21: Diseño gráfico y web ──────────────────────────────────── */

const EQUIPO_DISENO: Modal = {
  id: 'creditos-diseno',
  section: 'inicio',
  variant: 'medium',
  title: 'Equipos de trabajo',
  highlight: 'Diseño gráfico y web',
  icon: 'credits',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Colaboratorio de diseño para la innovación social, Grupo de investigación Diseño & Sociedad, Universidad del Cauca. Coordinación: Andrea Melenje y Rafael Enrique Sarmiento López. Ilustración: Mauricio Castro, Diagramación: Neider Yesid Tiafi, Recursos gráficos: Yeri Benavente y Eduar Yondapiz. Desarrolladores: Camilo Sotelo, Jerson Stiv Rojas, Jorge David Echeverry y Santiago José Montaño. Institución Universitaria Colegio Mayor del Cauca.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'credits',
    frame: '4',
    label: 'Diseño gráfico y web',
  },
}

export const CREDITOS_EQUIPOS_MODALS: Modal[] = [
  EQUIPO_COLABORATORIO,
  EQUIPO_CONCEPCION,
  EQUIPO_DISENO,
]
