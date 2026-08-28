/**
 * 🎬 PRESENTACIÓN — Modal de bienvenida (layout 'feature')
 * ========================================================
 * Modal de bienvenida del Atlas (id=0 en v17).
 * Usa layout 'feature': carrusel + 2 columnas + scroll indicators.
 * Datos adaptados de v17 modalsData[1] (id=1 en v17 = presentación).
 */

import type { Modal } from '../../types/modal.ts'

const presentacionIcon = '/assets/modal/feature/presentation.svg'
const taller1 = '/assets/img/talleres/taller-1.webp'
const taller2 = '/assets/img/talleres/taller-2.webp'
const taller3 = '/assets/img/talleres/taller-3.webp'
const fondoTejidos = '/assets/img/background/tejidos.png'

export const PRESENTACION_MODAL: Modal = {
  id: 'presentacion',
  section: 'intro',
  variant: 'xl', // gigante: 90vw × 90vh
  layout: 'feature',
  title: 'Presentación del Atlas',
  highlight: 'El río pensado y sentido desde la cartografía y el dibujo',
  icon: 'presentation',
  iconImage: presentacionIcon,
  image: fondoTejidos,
  texto: '',
  body: [], // Requerido por el tipo Modal; FeatureLayout usa twoColumnBody
  carouselImages: [
    {
      src: taller1,
      alt: 'Taller 1',
      description:
        'Foto 1: Taller La intuición espacial y las construcciones geográficas ¿Por qué los mapas importan? Octubre 7 de 2023. Casa Cultural del Niño y de la Niña. Villa Rica, Cauca. Diana Bernal.',
    },
    {
      src: taller2,
      alt: 'Taller 2',
      description:
        'Foto 2: Taller Cuando el cuerpo habla: descubriendo relatos territoriales. Enero 17 de 2024. Casa Cultural del Niño y de la Niña. Villa Rica, Cauca. Olga Eusse.',
    },
    {
      src: taller3,
      alt: 'Taller 3',
      description:
        'Foto 3: Taller Mundos relacionales y codiseño territorial. Agosto 24 de 2024. Casa Cultural del Niño y de la Niña. Villa Rica. Ana María Rendón.',
    },
  ],
  twoColumnBody: {
    main: (
      <>
        <p>
          Este atlas surge de dos procesos solidarios desarrollados por el
          Tejido de transicionantes del valle alto del río Cauca entre el 2023 y
          2024. El primero es la creación de tres entramados territoriales a
          partir de un diagnóstico de Paz territorial pluriversal realizado
          entre las personas que hemos consolidado en juntanzas de muchos tipos,
          alternativas transformadoras (ATs) en los municipios de Suárez y Villa
          Rica, en el norte de Cauca y en el oriente de Cali, en el Valle del
          Cauca. Las ATs, como mingas de pensamiento y acción, dan cuenta del
          potencial que tenemos como habitantes de esta cuenca, de este río
          Cauca, para invocar y convocar alrededor de nuestras capacidades y
          saberes y producir posibilidades emergentes, valientes y contundentes
          para hacerle frente a los conflictos territoriales creados por el
          modelo de desarrollo extractivista.
        </p>
        <p>
          El segundo es una juntanza formativa y creativa que tomó la forma de
          Colaboratorio de cartografías críticas y codiseño territorial donde
          nos propusimos poner en juego la intuición espacial, el vínculo
          afectivo y el conocimiento geográfico académico y cotidiano con las
          representaciones sensibles y técnicas del territorio. Las
          representaciones gráficas de los lugares de la vida toda en el sur del
          valle alto del río Cauca nos está permitiendo, a través de dibujos,
          esquemas, mapas y textos construir herramientas para reconocer,
          interpretar, analizar y disoñar las transiciones eco sociales justas
          de los territorios de los que hacemos parte.
        </p>
        <p>
          La organización de este atlas consta de cuatro partes que abordan
          aspectos bioculturales relevantes del sur del valle alto del río
          Cauca. La primera parte está centrada en el tema de la gran cuenca del
          río, sus partes, formas de paisajes, relaciones ecosistémicas y el
          mosaico de cuencas pequeñas y tejidos del agua que conforman nuestro
          territorio. En la segunda parte nos ubicamos en los entramados
          territoriales, portadores de saberes y capacidades que se tejen en
          Suárez, entre los territorios de varios de los consejos de comunidades
          negras, con Villa Rica y cuatro municipios cercanos; Puerto Tejada,
          Miranda, Guachené y Padilla; y el Oriente de Cali, donde nos
          enfocamos en una zona urbana. En la tercera parte, hacemos énfasis en
          las formas en las que el río Cauca se manifiesta en el valle alto de
          su cuenca, el flujo y dinámica de lo acuático y los cambios en el
          tiempo causados por las intervenciones del modelo de desarrollo
          extractivista que nos tiene, desde hace generaciones, enfrentando
          conflictos y violencias de diversa índole. Finalmente, presentamos
          casos concretos que conjugan acciones, capacidades y saberes para
          hacer frente a los conflictos territoriales que ponen en riesgo la
          soberanía alimentaria, el cuidado del agua y el buen vivir o el vivir
          sabroso y que dan pautas para desencadenar procesos de pensamiento,
          imaginación y acción que hagan posibles la transformación productiva,
          la restauración ecológica y ontológica de los ecosistemas y la
          reparación de las desigualdades e injusticias históricas en el sur del
          valle alto del río Cauca.
        </p>
      </>
    ),
    aside: (
      <>
        <sup>1</sup> Alternativas transformadoras son aquellas formas
        organizativas que procuran romper con los sistemas dominantes para
        transitar por otros caminos, hacia formas radicales y directas de
        democracia política y económica para la vida digna, contribuyendo a
        construir otros mundos y territorios posibles para el buen vivir y el
        vivir sabroso.
        <br />
        <span style={{ fontStyle: 'italic', fontSize: '0.95em' }}>
          (Diagnóstico de Paz Territorial Pluriversal, 2024: 6)
        </span>
      </>
    ),
  },
  fullDocLink: 'https://docs.google.com/document/d/1b8t-bCbnQOOCKgBMKEWtUB0e9oru086TC7NiXr875RE/edit?usp=sharing',
  showScrollIndicators: true,
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentación',
    mapId: 'intro',
  },
}