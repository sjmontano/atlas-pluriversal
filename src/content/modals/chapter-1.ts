/**
 * 🪟 MODALES CAPÍTULO 1 — contenido editorial portado de v17 (literales)
 * =======================================================================
 * Fuentes: modalsData.jsx ids 0–18 y 23–26 (textos en
 * `cap1-textos.generated.ts`) + links Drive de sidebarIconsChapter1.
 *
 * Convención de ids:
 *   cap1-presentacion-<mapa>  Presentación por mapa (rail)
 *   cap1-ficha-<mapa>         Ficha técnica Drive (rail · trigger.href)
 *   cap1-descargar-<mapa>     Descarga Drive (rail · trigger.href)
 *   cap1-perfil-cuenca        Perfil de la cuenca (rail · gallery)
 *   cap1-atlas-proyecto       Presentación del proyecto (id 1 de v17)
 *   cap1-cuenca-<slug>        11 cuencas Tejidos del Agua (click en capa)
 *   cap1-voz-<slug>           4 tramos Voz del río (click en capa)
 */

import type { Modal, ModalAction, ModalBlock } from '../../types/modal.ts'
import { CAP1_TEXTOS } from './cap1-textos.generated.ts'

/** El cierre siempre lo maneja la X del shell; el footer es solo para links. */
const DOC_ACTION = (link: string): ModalAction[] =>
  [{ label: 'Ver documento completo', href: link, variant: 'primary' }]

/** Divide el texto literal de v17 (separado por \n\n) en bloques párrafo. */
function paragraphs(texto: string | null, base: string): ModalBlock[] {
  if (texto === null) return []
  return texto
    .split('\n\n')
    .map((t) => t.trim())
    .filter((t) => t !== '')
    .map((text, i) => ({ type: 'paragraph' as const, id: `${base}-p${i + 1}`, text }))
}

/* ── Presentaciones por mapa (ids 2–7 de v17) ─────────────────────────── */

function presentacion(mapKey: string, textoId: string): Modal {
  const entry = CAP1_TEXTOS[textoId]
  if (entry === undefined) throw new Error(`CAP1_TEXTOS sin id ${textoId}`)
  return {
    id: `cap1-presentacion-${mapKey}`,
    section: 'capitulo-1',
    variant: 'large',
    layout: 'text',
    title: entry.highLight ?? 'Presentación',
    highlight: 'Capítulo I',
    icon: 'presentation',
    body: paragraphs(entry.texto, textoId),
    actions: entry.link !== '' ? DOC_ACTION(entry.link) : [],
    trigger: {
      type: 'button',
      icon: 'presentation',
      frame: '1',
      label: 'Presentación',
      mapId: `chapter1-${mapKey}`,
    },
  }
}

const PRESENTACIONES: Modal[] = [
  presentacion('encuadres', '2'),
  presentacion('bredunco', '3'),
  presentacion('formas-paisaje', '4'),
  presentacion('ecosistemas', '5'),
  presentacion('mosaicos-del-agua', '6'),
  presentacion('un-rio-cauca', '7'),
]

/* ── Presentación del proyecto (id 1 de v17 — texto JSX portado a bloques) ─ */

const ATLAS_PROYECTO: Modal = {
  id: 'cap1-atlas-proyecto',
  section: 'intro',
  variant: 'large',
  layout: 'text',
  title: 'El río pensado y sentido desde la cartografía y el dibujo',
  highlight: 'Atlas Pluriversal del Río Cauca',
  icon: 'presentation',
  body: [
    {
      type: 'paragraph',
      id: '1-p1',
      text: 'Este atlas surge de dos procesos solidarios desarrollados por el Tejido de transicionantes del valle alto del río Cauca entre el 2023 y 2024. El primero es la creación de tres entramados territoriales a partir de un diagnóstico de Paz territorial pluriversal realizado entre las personas que hemos consolidado en juntanzas de muchos tipos, alternativas transformadoras (ATs) en los municipios de Suárez y Villa Rica, en el norte de Cauca y en el oriente de Cali, en el Valle del Cauca. Las ATs, como mingas de pensamiento y acción, dan cuenta del potencial que tenemos como habitantes de esta cuenca, de este río Cauca, para invocar y convocar alrededor de nuestras capacidades y saberes y producir posibilidades emergentes, valientes y contundentes para hacerle frente a los conflictos territoriales creados por el modelo de desarrollo extractivista. El segundo es una juntanza formativa y creativa que tomó la forma de Colaboratorio de cartografías críticas y codiseño territorial donde nos propusimos poner en juego la intuición espacial, el vínculo afectivo y el conocimiento geográfico académico y cotidiano con las representaciones sensibles y técnicas del territorio. Las representaciones gráficas de los lugares de la vida toda en el sur del valle alto del río Cauca nos está permitiendo, a través de dibujos, esquemas, mapas y textos construir herramientas para reconocer, interpretar, analizar y disoñar las transiciones eco sociales justas de los territorios de los que hacemos parte.',
    },
    {
      type: 'paragraph',
      id: '1-p2',
      text: 'La organización de este atlas consta de cuatro partes que abordan aspectos bioculturales relevantes del sur del valle alto del río Cauca. La primera parte está centrada en el tema de la gran cuenca del río, sus partes, formas de paisajes, relaciones ecosistémicas y el mosaico de cuencas pequeñas y tejidos del agua que conforman nuestro territorio. En la segunda parte nos ubicamos en los entramados territoriales, portadores de saberes y capacidades que se tejen en Suárez, entre los territorios de varios de los consejos de comunidades negras, con Villa Rica y cuatro municipios cercanos; Puerto Tejada, Miranda, Guachené y Padilla; y el Oriente de Cali, donde nos enfocamos en una zona urbana. En la tercera parte, hacemos énfasis en las formas en las que el río Cauca se manifiesta en el valle alto de su cuenca, el flujo y dinámica de lo acuático y los cambios en el tiempo causados por las intervenciones del modelo de desarrollo extractivista que nos tiene, desde hace generaciones, enfrentando conflictos y violencias de diversa índole. Finalmente, presentamos casos concretos que conjugan acciones, capacidades y saberes para hacer frente a los conflictos territoriales que ponen en riesgo la soberanía alimentaria, el cuidado del agua y el buen vivir o el vivir sabroso y que dan pautas para desencadenar procesos de pensamiento, imaginación y acción que hacen posibles la transformación productiva, la restauración ecológica y ontológica de los ecosistemas y la reparación de las desigualdades e injusticias históricas en el sur del valle alto del río Cauca.',
    },
    {
      type: 'quote',
      id: '1-q1',
      text: '¹ Alternativas transformadoras son aquellas formas organizativas que procuran romper con los sistemas dominantes para transitar por otros caminos, hacia formas radicales y directas de democracia política y económica para la vida digna, contribuyendo a construir otros mundos y territorios posibles para el buen vivir y el vivir sabroso.',
      source: 'Diagnóstico de Paz Territorial Pluriversal, 2024: 6',
    },
  ],
  actions: [{ label: 'Ver documento', href: CAP1_TEXTOS['1']?.link ?? '', variant: 'primary' }],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'El proyecto', mapId: 'intro' },
}

/* ── Perfil de la cuenca (carrusel de v17, vista encuadres) ───────────── */

const PERFIL_CUENCA: Modal = {
  id: 'cap1-perfil-cuenca',
  section: 'capitulo-1',
  variant: 'large',
  layout: 'gallery',
  title: 'Perfil de la cuenca',
  highlight: 'Capítulo I',
  icon: 'perfil',
  gallery: [
    '/assets/ui/perfil/perfil-1.svg',
    '/assets/ui/perfil/perfil-3.svg',
    '/assets/ui/perfil/perfil-2.svg',
  ],
  body: [],
  trigger: {
    type: 'button',
    icon: 'perfil',
    frame: '1',
    label: 'Perfil cuenca',
    mapId: 'chapter1-encuadres',
  },
}

/* ── Cuencas Tejidos del Agua (ids 8–18, click en capa del mosaico) ───── */

interface CuencaDef {
  textoId: string
  slug: string
  icon: number
}

const CUENCAS_DEFS: CuencaDef[] = [
  { textoId: '8', slug: 'piendamo', icon: 1 },
  { textoId: '9', slug: 'salado', icon: 2 },
  { textoId: '10', slug: 'ovejas', icon: 3 },
  { textoId: '11', slug: 'timba', icon: 4 },
  { textoId: '12', slug: 'quinamayo', icon: 5 },
  { textoId: '13', slug: 'claro-jamundi', icon: 6 },
  { textoId: '14', slug: 'palo', icon: 7 },
  { textoId: '15', slug: 'lili-melendez-canaveralejo', icon: 8 },
  { textoId: '16', slug: 'desbaratado', icon: 9 },
  { textoId: '17', slug: 'cali', icon: 10 },
  { textoId: '18', slug: 'guachal', icon: 11 },
]

function cuenca(def: CuencaDef): Modal {
  const entry = CAP1_TEXTOS[def.textoId]
  if (entry === undefined) throw new Error(`CAP1_TEXTOS sin id ${def.textoId}`)
  return {
    id: `cap1-cuenca-${def.slug}`,
    section: 'capitulo-1',
    variant: 'medium',
    layout: 'text',
    title: entry.highLight ?? 'Cuenca',
    highlight: 'Tejidos del agua',
    icon: 'marker',
    iconImage: `/assets/ui/icons/tejidos-agua/cuenca-${def.icon}.svg`,
    body: paragraphs(entry.texto, def.textoId),
    trigger: { type: 'poi', icon: 'marker', mapId: 'chapter1-mosaicos-del-agua', label: entry.highLight ?? undefined },
  }
}

const CUENCAS: Modal[] = CUENCAS_DEFS.map(cuenca)

/* ── Voz del río (ids 23–26, click en capa del río por tramos) ────────── */

function voz(textoId: string, slug: string): Modal {
  const entry = CAP1_TEXTOS[textoId]
  if (entry === undefined) throw new Error(`CAP1_TEXTOS sin id ${textoId}`)
  return {
    id: `cap1-voz-${slug}`,
    section: 'capitulo-1',
    variant: 'medium',
    layout: 'text',
    title: entry.highLight ?? 'Voz del río',
    highlight: 'Voz del río',
    icon: 'fichatecnica',
    body: paragraphs(entry.texto, textoId),
    trigger: { type: 'poi', icon: 'fichatecnica', mapId: 'chapter1-bredunco' },
  }
}

const VOZ_RIO: Modal[] = [
  voz('23', 'valle-alto'),
  voz('24', 'cuenca-alta'),
  voz('25', 'cuenca-media'),
  voz('26', 'cuenca-baja'),
]

/* ── Agregado + índice mapa → modales del rail ────────────────────────── */

export const CHAPTER1_MODALS: Modal[] = [
  ...PRESENTACIONES,
  ATLAS_PROYECTO,
  PERFIL_CUENCA,
  ...CUENCAS,
  ...VOZ_RIO,
]


