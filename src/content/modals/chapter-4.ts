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

/* ── Diagramas de zonificación (portados de v17 iconsCap4) ────────────────
 * Perfil  = corte transversal de zonificación (v17: botón Perfil/Datos).
 * Árbol   = treemap de % por zona (v17: botón Mapa de árbol).
 * Solo existen donde la comunidad produjo el diagrama (v17 tampoco los
 * tiene para bosque-comestible; sus offsets +63/+72 apuntan a contenido
 * de otros capítulos — bug que aquí se corrige por mapeo nominal).
 */

function diagrama(
  id: string,
  title: string,
  highlight: string,
  icon: 'perfil' | 'mapa-arbol' | 'datos',
  frame: string,
  src: string,
  alt: string,
  caption: string,
  mapId: string,
  label: string,
): Modal {
  return {
    id,
    section: 'capitulo-4',
    variant: 'large',
    title,
    highlight,
    icon,
    body: [{ type: 'image', id: `${id}-img`, src, alt, caption }],
    trigger: { type: 'button', icon, frame, label, mapId },
  }
}

const CAP4_DATO_INTRODUCCION: Modal = diagrama(
  'cap4-dato-introduccion',
  'Datos del capítulo',
  'Capitulo IV',
  'datos',
  '3',
  '/assets/modal/chapter-4/dato-intro-cap4.png',
  'Diagrama de datos del Capítulo IV',
  'Diagrama de datos de las fincas y centros agropecuarios del Capítulo IV.',
  'chapter4-introduccion',
  'Datos',
)

const CAP4_PERFIL_ASOYOGE: Modal = diagrama(
  'cap4-perfil-asoyoge',
  'Centro agropecuario ASOYOGE',
  'Perfil de zonificación',
  'perfil',
  '1',
  '/assets/modal/chapter-4/perfil-asoyoge.png',
  'Perfil de zonificación de ASOYOGE, Suárez',
  'Corte Casa–Procesadora–Vía–Compostera con bosque y vivienda asociada.',
  'chapter4-asoyoge',
  'Perfil',
)

const CAP4_PERFIL_EL_BUHIDO: Modal = diagrama(
  'cap4-perfil-el-buhido',
  'Finca El Buhido',
  'Perfil de zonificación',
  'perfil',
  '1',
  '/assets/modal/chapter-4/perfil-el-buhido.png',
  'Perfil de zonificación de la finca El Buhido, Suárez',
  'Transecto A–B: cultivos diversos, vivienda, cría de animales y bosque.',
  'chapter4-el-buhido',
  'Perfil',
)

const CAP4_ARBOL_EL_BUHIDO: Modal = diagrama(
  'cap4-arbol-el-buhido',
  'Finca El Buhido (1 ha)',
  'Mapa de árbol',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-4/arbol-el-buhido.png',
  'Mapa de árbol de la finca El Buhido',
  'Porcentaje por zona: cultivos diversos 61,91 %, productivas especiales, transición y bosque.',
  'chapter4-el-buhido',
  'Mapa de árbol',
)

const CAP4_PERFIL_EL_PASO: Modal = diagrama(
  'cap4-perfil-el-paso',
  'Finca El Paso',
  'Perfil de zonificación',
  'perfil',
  '1',
  '/assets/modal/chapter-4/perfil-el-paso.png',
  'Perfil de zonificación de la finca El Paso, Suárez',
  'Transecto A–B: río Ovejas, rotación de cultivos, guadual y bosque.',
  'chapter4-el-paso',
  'Perfil',
)

const CAP4_ARBOL_EL_PASO: Modal = diagrama(
  'cap4-arbol-el-paso',
  'Finca El Paso',
  'Mapa de árbol',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-4/arbol-el-paso.png',
  'Mapa de árbol de la finca El Paso',
  'Porcentaje por zona de la finca El Paso.',
  'chapter4-el-paso',
  'Mapa de árbol',
)

const CAP4_PERFIL_LA_VIRGINIA: Modal = diagrama(
  'cap4-perfil-la-virginia',
  'Finca La Virginia',
  'Perfil de zonificación',
  'perfil',
  '1',
  '/assets/modal/chapter-4/perfil-la-virginia.png',
  'Perfil de zonificación de la finca La Virginia, Padilla',
  'Transecto A–B: caña de azúcar, burilico, limón y plátano entre vías.',
  'chapter4-la-virginia',
  'Perfil',
)

const CAP4_ARBOL_LA_VIRGINIA: Modal = diagrama(
  'cap4-arbol-la-virginia',
  'Finca La Virginia',
  'Mapa de árbol',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-4/arbol-la-virginia.png',
  'Mapa de árbol de la finca La Virginia',
  'Porcentaje por zona de la finca La Virginia.',
  'chapter4-la-virginia',
  'Mapa de árbol',
)

const CAP4_PERFIL_LA_CAICEDO: Modal = diagrama(
  'cap4-perfil-la-caicedo',
  'Finca La Caicedo',
  'Perfil de zonificación',
  'perfil',
  '1',
  '/assets/modal/chapter-4/perfil-la-caicedo.png',
  'Perfil de zonificación de la finca La Caicedo, Guachené',
  'Transecto B–A: plátano y cacao, galpón, casa y vía.',
  'chapter4-la-caicedo',
  'Perfil',
)

const CAP4_ARBOL_LA_CAICEDO: Modal = diagrama(
  'cap4-arbol-la-caicedo',
  'Finca La Caicedo',
  'Mapa de árbol',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-4/arbol-la-caicedo.png',
  'Mapa de árbol de la finca La Caicedo',
  'Porcentaje por zona de la finca La Caicedo.',
  'chapter4-la-caicedo',
  'Mapa de árbol',
)

const CAP4_PERFIL_CENTRO_AGROPECUARIO: Modal = diagrama(
  'cap4-perfil-centro-agropecuario',
  'Centro agropecuario',
  'Perfil de zonificación',
  'perfil',
  '1',
  '/assets/modal/chapter-4/perfil-centro-agropecuario.png',
  'Zonificación del Centro agropecuario Casa del Niño y de la Niña',
  'Distribución por zonas del centro agropecuario (4,19 ha).',
  'chapter4-centro-agropecuario',
  'Perfil',
)

const CAP4_ARBOL_CENTRO_AGROPECUARIO: Modal = diagrama(
  'cap4-arbol-centro-agropecuario',
  'Centro agropecuario Casa del Niño y de la Niña (4,19 ha)',
  'Mapa de árbol',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-4/arbol-centro-agropecuario.png',
  'Mapa de árbol del centro agropecuario',
  'Porcentaje por zona: pastoreo 42,76 %, productivas especiales, cría y cultivos.',
  'chapter4-centro-agropecuario',
  'Mapa de árbol',
)

const CAP4_ARBOL_LOS_BAJIOS: Modal = diagrama(
  'cap4-arbol-los-bajios',
  'Finca Los Bajíos',
  'Mapa de árbol',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-4/arbol-los-bajios.png',
  'Mapa de árbol de la finca Los Bajíos',
  'Porcentaje por zona de la finca Los Bajíos.',
  'chapter4-los-bajios',
  'Mapa de árbol',
)

const CAP4_ARBOL_LAS_MERCEDES: Modal = diagrama(
  'cap4-arbol-las-mercedes',
  'Finca Las Mercedes',
  'Mapa de árbol',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-4/arbol-las-mercedes.png',
  'Mapa de árbol de la finca Las Mercedes',
  'Porcentaje por zona de la finca Las Mercedes.',
  'chapter4-las-mercedes',
  'Mapa de árbol',
)

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
  CAP4_DATO_INTRODUCCION,
  CAP4_PERFIL_ASOYOGE,
  CAP4_PERFIL_EL_BUHIDO,
  CAP4_ARBOL_EL_BUHIDO,
  CAP4_PERFIL_EL_PASO,
  CAP4_ARBOL_EL_PASO,
  CAP4_PERFIL_LA_VIRGINIA,
  CAP4_ARBOL_LA_VIRGINIA,
  CAP4_PERFIL_LA_CAICEDO,
  CAP4_ARBOL_LA_CAICEDO,
  CAP4_PERFIL_CENTRO_AGROPECUARIO,
  CAP4_ARBOL_CENTRO_AGROPECUARIO,
  CAP4_ARBOL_LOS_BAJIOS,
  CAP4_ARBOL_LAS_MERCEDES,
]
