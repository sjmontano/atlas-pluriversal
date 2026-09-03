/**
 * MODALES CAPITULO 4 — actores, acciones, capacidades y poderes
 */

import type { Modal } from '../../types/modal.ts'
import { paragraphs, presentacion } from './_helpers.ts'

/* ── cap4-intro ───────────────────────────────────────────────────────── */

const CAP4_INTRO: Modal = {
  id: 'cap4-intro',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Capitulo IV',
  highlight: 'Actores, acciones, capacidades y poderes en los nodos del tejido',
  icon: 'presentation',
  body: paragraphs(
    'En este capitulo presentamos las fincas y centros agropecuarios que hacen parte de las alternativas transformadoras en los tres nodos o entramados territoriales.',
    'cap4-intro',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentacion',
    mapId: 'chapter4-introduccion',
  },
}

/* ── cap4-presentacion-asoyoge ────────────────────────────────────────── */

const CAP4_PRESENTACION_ASOYOGE: Modal = presentacion(4, 'asoyoge', {
  title: 'Centro agropecuario ASOYOGE',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'La ASOYOGE es una asociación de agroindustrial de productos agropecuarios y mineros afrodescendientes ubicada en Monte Redondo, Suarez, Cauca. Sus integrantes desarrollan procesos de producción sostenible, recuperación de semillas y formación comunitaria.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-el-buhido ──────────────────────────────────────── */

const CAP4_PRESENTACION_EL_BUHIDO: Modal = presentacion(4, 'el-buhido', {
  title: 'Finca El Buhido',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'La finca El Buhido es un espacio de producción agroecológica que promueve la recuperación de saberes ancestrales y la soberanía alimentaria en el municipio de Suarez, Cauca.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-bosque-comestible ──────────────────────────────── */

const CAP4_PRESENTACION_BOSQUE_COMESTIBLE: Modal = presentacion(4, 'bosque-comestible', {
  title: 'Bosque comestible',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'El bosque comestible es un sistema agroforestal que integra especies alimentarias en un diseño que imita la estructura del bosque natural, promoviendo la diversidad y la resiliencia del territorio.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-los-bajios ─────────────────────────────────────── */

const CAP4_PRESENTACION_LOS_BAJIOS: Modal = presentacion(4, 'los-bajios', {
  title: 'Finca Los Bajíos',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'La finca Los Bajíos es un espacio de producción agroecológica ubicado en el valle alto del río Cauca, donde se desarrollan prácticas de recuperación de suelos y diversificación de cultivos.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-el-paso ────────────────────────────────────────── */

const CAP4_PRESENTACION_EL_PASO: Modal = presentacion(4, 'el-paso', {
  title: 'Finca El Paso',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'La finca El Paso es un espacio de producción sostenible que combina prácticas agroecológicas con la conservación de fuentes hídricas en el municipio de Villa Rica, Cauca.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-las-mercedes ───────────────────────────────────── */

const CAP4_PRESENTACION_LAS_MERCEDES: Modal = presentacion(4, 'las-mercedes', {
  title: 'Finca Las Mercedes',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'La finca Las Mercedes es un espacio de producción agroecológica que promueve la recuperación de semillas criollas y la formación en soberanía alimentaria en Suarez, Cauca.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-la-virginia ────────────────────────────────────── */

const CAP4_PRESENTACION_LA_VIRGINIA: Modal = presentacion(4, 'la-virginia', {
  title: 'Finca La Virginia',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'La finca La Virginia es un espacio de producción sostenible que integra prácticas agroecológicas con la conservación del patrimonio natural en el municipio de Suarez, Cauca.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-centro-agropecuario ────────────────────────────── */

const CAP4_PRESENTACION_CENTRO_AGROPECUARIO: Modal = presentacion(4, 'centro-agropecuario', {
  title: 'Centro agropecuario',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'El centro agropecuario es un espacio de formación y producción que promueve la recuperación de saberes ancestrales y la soberanía alimentaria en el oriente de Cali.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-la-caicedo ─────────────────────────────────────── */

const CAP4_PRESENTACION_LA_CAICEDO: Modal = presentacion(4, 'la-caicedo', {
  title: 'Finca La Caicedo',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'La finca La Caicedo es un espacio de producción agroecológica que promueve la recuperación de semillas y la diversificación de cultivos en el oriente de Cali.',
  triggerLabel: 'Presentacion',
})

/* ── cap4-presentacion-problematicas ──────────────────────────────────── */

const CAP4_PRESENTACION_PROBLEMACAS: Modal = presentacion(4, 'problematicas', {
  title: 'Problemáticas ambientales',
  highlight: 'Actores, acciones, capacidades y poderes',
  texto:
    'En este apartado se presentan las principales problemáticas ambientales que afectan los humedales del valle alto del río Cauca, identificadas por las comunidades que habitan y cuidan estos territorios.',
  triggerLabel: 'Presentacion',
})

/* ── Export ────────────────────────────────────────────────────────────── */

export const CHAPTER4_MODALS: Modal[] = [
  CAP4_INTRO,
  CAP4_PRESENTACION_ASOYOGE,
  CAP4_PRESENTACION_EL_BUHIDO,
  CAP4_PRESENTACION_BOSQUE_COMESTIBLE,
  CAP4_PRESENTACION_LOS_BAJIOS,
  CAP4_PRESENTACION_EL_PASO,
  CAP4_PRESENTACION_LAS_MERCEDES,
  CAP4_PRESENTACION_LA_VIRGINIA,
  CAP4_PRESENTACION_CENTRO_AGROPECUARIO,
  CAP4_PRESENTACION_LA_CAICEDO,
  CAP4_PRESENTACION_PROBLEMACAS,
]
