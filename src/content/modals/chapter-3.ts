/**
 * MODALES CAPITULO 3 — contenido editorial portado de v17
 */

import type { Modal } from '../../types/modal.ts'
import { paragraphs, presentacion } from './_helpers.ts'

/* ── cap3-intro: Introduction ──────────────────────────────────────────────── */

const CAP3_INTRO: Modal = {
  id: 'cap3-intro',
  section: 'capitulo-3',
  variant: 'large',
  title: 'Capitulo III',
  highlight: 'Los caminos y conflictos del río Cauca en el valle alto',
  icon: 'presentation',
  body: [
    {
      type: 'paragraph',
      id: 'cap3-intro-highlight',
      text: 'Los caminos y conflictos del río Cauca en el valle alto',
    },
    ...paragraphs(
      'Una perspectiva comparativa entre 1970 y 2022 del río Cauca en su paso por el valle alto de su cuenca, revela las transformaciones dramaticas que ha experimentado este sistema fluvial colombiano antes y despues de la construccion y puesta en funcionamiento de la represa La Salvajina en 1985.',
      'cap3-intro',
    ),
  ],
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentacion',
    mapId: 'chapter3-introduccion',
  },
}

/* ── cap3-presentacion-monocultivo ─────────────────────────────────────────── */

const CAP3_MONOCULTIVO: Modal = presentacion(3, 'monocultivo', {
  title: 'Monocultivo de caña',
  highlight: 'El desierto verde del valle alto del río Cauca',
  texto:
    'El monocultivo de caña de azucar ha configurado de manera determinante el paisaje y las dinamicas sociales del valle alto del rio Cauca. Desde mediados del siglo XX, la expansion de los trapiches y luego de los ingenios azucareros transformo extensas areas de bosque y humedales en monocultivos que hoy cubren buena parte de la planicie aluvial. Esta transformacion ha generado consecuencias ambientales y sociales profundas que afectan la vida de las comunidades que habitan el territorio.',
  triggerLabel: 'Presentacion',
})

/* ── cap3-presentacion-encharcaron ─────────────────────────────────────────── */

const CAP3_ENCHARCARON: Modal = presentacion(3, 'encharcaron', {
  title: 'Nos encharcaron el río',
  highlight: 'Nos encharcaron el río',
  texto:
    'La construccion de infraestructura hidraulica y la modificacion de los cauces del rio Cauca han provocado el encharcamiento de extensas areas del valle alto. Las comunidades riberanas han sido testigos de como sus territorios inundables, antes fuente de vida y sustento, se han transformado en areas estancadas que afectan tanto la produccion agropecuaria como la salud de los habitantes.',
  triggerLabel: 'Presentacion',
})

/* ── cap3-presentacion-cali-deseca ─────────────────────────────────────────── */

const CAP3_CALI_DESECA: Modal = presentacion(3, 'cali-deseca', {
  title: 'Cali deseca',
  highlight: 'Cali deseca',
  texto:
    'Santiago de Cali, la capital del Valle del Cauca, enfrenta una creciente crisis de disponibilidad hidrica. El modelo de desarrollo urbano e industrial de la ciudad ha generado una demanda de agua que supera la capacidad de renovacion de los acuiferos y la disponibilidad superficial del rio Cali y sus afluentes. La sequia recurrente evidencia las consecuencias de un modelo que no considera los limites hidricos del territorio.',
  triggerLabel: 'Presentacion',
})

/* ── cap3-presentacion-humedales ───────────────────────────────────────────── */

const CAP3_HUMEDALES: Modal = presentacion(3, 'humedales', {
  title: 'Se encharca arriba se deseca abajo',
  highlight: 'Se encharca arriba se deseca abajo',
  texto:
    'El sistema hidrico del valle alto del rio Cauca presenta una paradox: mientras las zonas altas de la cuenca se encharcan por la acumulacion de aguas en areas deprimidas, las zonas bajas y la ciudad de Cali sufren la sequia y la falta de agua. Esta dinamica revela la interdependencia de los diferentes tramos del sistema fluvial y las consecuencias de las intervenciones humanas en el ciclo hidrologico regional.',
  triggerLabel: 'Presentacion',
})

/* ── cap3-presentacion-arcilla ─────────────────────────────────────────────── */

const CAP3_ARCILLA: Modal = presentacion(3, 'arcilla', {
  title: 'Aguas que llegan',
  highlight: 'Aguas que llegan',
  texto:
    'Las aguas que llegan al valle alto del rio Cauca traen consigo sedimentos y arcillas que han sido depositadas a lo largo de millones de anos. Estos materiales, hojeados por las comunidades locales, son parte fundamental del territorio y de las dinamicas culturales que las poblaciones afrodescendientes e indigenas han mantenido en la region. La extraccion de arcilla por parte de empresas mineras ha generado conflictos territoriales significativos.',
  triggerLabel: 'Presentacion',
})

/* ── Export ────────────────────────────────────────────────────────────── */

export const CHAPTER3_MODALS: Modal[] = [
  CAP3_INTRO,
  CAP3_MONOCULTIVO,
  CAP3_ENCHARCARON,
  CAP3_CALI_DESECA,
  CAP3_HUMEDALES,
  CAP3_ARCILLA,
]
