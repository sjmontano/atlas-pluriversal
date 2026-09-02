/**
 * 🎬 MODALES DEL MAPA INTRO — Presentación del Atlas
 * ====================================================
 * Modales que aparecen en el mapa intro (/intro).
 * Cada mapa puede tener su propio archivo de modals.ts.
 *
 * Configuración:
 *   - variant  → tamaño del modal (xs | small | medium | large | xl | full)
 *   - fullImage → imagen de fondo full-bleed + scrim automático
 *   - theme    → CSS variables (titleColor, bgColor, textColor)
 *   - body[]   → bloques apilables (paragraph, heading, quote, image, carousel, columns, meta, link)
 */

import type { Modal } from '../../types/modal.ts'

/* ── Assets ──────────────────────────────────────────────────────────────── */

const PRESENTACION_ICON = '/assets/modal/feature/presentation.svg'
const TALLER_1 = '/assets/img/talleres/taller-1.webp'
const TALLER_2 = '/assets/img/talleres/taller-2.webp'
const TALLER_3 = '/assets/img/talleres/taller-3.webp'

/* ── Presentación del Atlas ────────────────────────────────────────────────
 *  Modal de bienvenida con carrusel + columns + link.
 *  Para configurar: cambia textos, fotos oblocks aquí. */

export const PRESENTACION_MODAL: Modal = {
  id: 'presentacion',
  section: 'intro',
  variant: 'xl',

  title: 'Presentación del Atlas',
  icon: 'presentation',
  iconImage: PRESENTACION_ICON,

  body: [
    /* Carrusel de fotos de talleres */
    {
      type: 'carousel',
      id: 'pres-carousel',
      images: [
        {
          src: TALLER_1,
          alt: 'Taller 1',
          description:
            'Foto 1: Taller La intuición espacial y las construcciones geográficas. Octubre 7 de 2023. Villa Rica, Cauca.',
        },
        {
          src: TALLER_2,
          alt: 'Taller 2',
          description:
            'Foto 2: Taller Cuando el cuerpo habla: descubriendo relatos territoriales. Enero 17 de 2024. Villa Rica, Cauca.',
        },
        {
          src: TALLER_3,
          alt: 'Taller 3',
          description:
            'Foto 3: Taller Mundos relacionales y codiseño territorial. Agosto 24 de 2024. Villa Rica.',
        },
      ],
    },

    /* Dos columnas: texto principal + cita al pie */
    {
      type: 'columns',
      id: 'pres-columns',
      main: [
        {
          type: 'paragraph',
          id: 'pres-p1',
          text: 'Este atlas surge de dos procesos solidarios desarrollados por el Tejido de transicionantes del valle alto del río Cauca entre el 2023 y 2024. El primero es la creación de tres entramados territoriales a partir de un diagnóstico de Paz territorial pluriversal realizado entre las personas que hemos consolidado en juntanzas de muchos tipos, alternativas transformadoras (ATs) en los municipios de Suárez y Villa Rica, en el norte de Cauca y en el oriente de Cali, en el Valle del Cauca. Las ATs, como mingas de pensamiento y acción, dan cuenta del potencial que tenemos como habitantes de esta cuenca, de este río Cauca, para invocar y convocar alrededor de nuestras capacidades y saberes y producir posibilidades emergentes, valientes y contundentes para hacerle frente a los conflictos territoriales creados por el modelo de desarrollo extractivista. El segundo es una juntanza formativa y creativa que tomó la forma de Colaboratorio de cartografías críticas y codiseño territorial donde nos propusimos poner en juego la intuición espacial, el vínculo afectivo y el conocimiento geográfico académico y cotidiano con las representaciones sensibles y técnicas del territorio. Las representaciones gráficas de los lugares de la vida toda en el sur del valle alto del río Cauca nos está permitiendo, a través de dibujos, esquemas, mapas y textos construir herramientas para reconocer, interpretar, analizar y disoñar las transiciones eco sociales justas de los territorios de los que hacemos parte.',
        },
        {
          type: 'paragraph',
          id: 'pres-p2',
          text: 'La organización de este atlas consta de cuatro partes que abordan aspectos bioculturales relevantes del sur del valle alto del río Cauca. La primera parte está centrada en el tema de la gran cuenca del río, sus partes, formas de paisajes, relaciones ecosistémicas y el mosaico de cuencas pequeñas y tejidos del agua que conforman nuestro territorio. En la segunda parte nos ubicamos en los entramados territoriales, portadores de saberes y capacidades que se tejen en Suárez, entre los territorios de varios de los consejos de comunidades negras, con Villa Rica y cuatro municipios cercanos; Puerto Tejada, Miranda, Guachené y Padilla; y el Oriente de Cali, donde nos enfocamos en una zona urbana. En la tercera parte, hacemos énfasis en las formas en las que el río Cauca se manifiesta en el valle alto de su cuenca, el flujo y dinámica de lo acuático y los cambios en el tiempo causados por las intervenciones del modelo de desarrollo extractivista que nos tiene, desde hace generaciones, enfrentando conflictos y violencias de diversa índole. Finalmente, presentamos casos concretos que conjugan acciones, capacidades y saberes para hacer frente a los conflictos territoriales que ponen en riesgo la soberanía alimentaria, el cuidado del agua y el buen vivir o el vivir sabroso y que dan pautas para desencadenar procesos de pensamiento, imaginación y acción que hagan posibles la transformación productiva, la restauración ecológica y ontológica de los ecosistemas y la reparación de las desigualdades e injusticias históricas en el sur del valle alto del río Cauca.',
        },
      ],
      aside: [
        {
          type: 'quote',
          id: 'pres-q1',
          text: 'Alternativas transformadoras son aquellas formas organizativas que procuran romper con los sistemas dominantes para transitar por otros caminos, hacia formas radicales y directas de democracia política y económica para la vida digna, contribuyendo a construir otros mundos y territorios posibles para el buen vivir y el vivir sabroso.',
          source: 'Diagnóstico de Paz Territorial Pluriversal, 2024: 6',
        },
      ],
    },
  ],

  showScrollIndicators: true,

  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentación',
    mapId: 'intro',
  },
}

/* ── Presentación del mapa (confines del sur) ────────────────────────────── */

export const CUENCA_CAUCA: Modal = {
  id: 'cuenca-cauca',
  section: 'intro',
  variant: 'large',
  title: 'Confines del sur del valle alto caucano',
  highlight: 'Presentación',
  icon: 'presentation',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Esta mapa se conforma de dos elementos: una imagen 3D construida a partir del Modelo de Elevación Nacional de Colombia adquirido por el IGAC y procesada en un modelo 3D en el software Qgis.',
    },
    {
      type: 'quote',
      id: 'q1',
      text: 'El territorio del sur del valle alto del río Cauca: cordilleras, planicie y agua en movimiento.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentación',
    mapId: 'intro',
  },
}

/* ── En construcción (aviso) ─────────────────────────────────────────────── */

export const EN_CONSTRUCCION: Modal = {
  id: 'en-construccion',
  section: 'legales',
  variant: 'xs',
  title: 'En construcción',
  highlight: 'Aviso',
  icon: 'info',
  body: [
    {
      type: 'paragraph',
      id: 'p1',
      text: 'Este contenido del Atlas estará disponible próximamente.',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'info',
    frame: '3',
    label: 'Aviso',
  },
}

/* ── Todos los modales de este mapa ──────────────────────────────────────── */

export const INTRO_MODALS: Modal[] = [
  PRESENTACION_MODAL,
  CUENCA_CAUCA,
  EN_CONSTRUCCION,
]
