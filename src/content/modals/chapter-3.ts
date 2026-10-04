/**
 * MODALES CAPITULO 3 — contenido editorial portado de v17
 */

import type { Modal } from '../../types/modal.ts'
import { paragraphs, presentacion } from './_helpers.ts'

/* ── Diagramas/Imagen full-bleed (portados de v17 ModalImagen) ────────────────
 * Imagen única 100% sin header, X arriba-derecha, contain para no recortar. */
function diagrama(
  id: string,
  title: string,
  highlight: string,
  icon: string,
  frame: string,
  src: string,
  mapId: string,
  label: string,
): Modal {
  return {
    id,
    section: 'capitulo-3',
    variant: 'large',
    title,
    highlight,
    icon,
    image: src,
    fullImage: true,
    hideHeader: true,
    closeLeft: false,
    panMobile: true,
    /* Caja calzada al aspecto 1.57 de la imagen (contain): en desktop manda
     * el ancho (67vw), en móvil manda el alto (sin hueco vertical).
     * 141dvh = 90×1.57 · 42.6vw = 67÷1.57. Camino A (ver plan B: aspectRatio). */
    theme: { bgFit: 'contain', bgColor: '#ffffff', size: { width: 'min(67vw, 141dvh)', height: 'min(90dvh, 42.6vw)' }, noScrim: true },
    body: [],
    trigger: { type: 'button', icon, frame, label, mapId },
  }
}

/* ── cap3-intro: Introduction ──────────────────────────────────────────────── */

const CAP3_INTRO: Modal = {
  id: 'cap3-intro',
  section: 'capitulo-3',
  variant: 'large',
  title: 'Los cambios del río en el valle alto',
  highlight: 'Capítulo III',
  icon: 'presentation',
  body: paragraphs(
    'Una perspectiva comparativa entre 1970 y 2022 del río Cauca en su paso por el valle alto de su cuenca, revela las transformaciones dramáticas que ha experimentado este sistema fluvial colombiano antes y después de la construcción y puesta en funcionamiento de la represa La Salvajina en 1985. En 1970, el alto valle del río Cauca presentaba un paisaje notablemente diferente al actual. La planicie aluvial era un mosaico dinámico de ecosistemas acuáticos interconectados. Las ciénagas, en la quietud de sus aguas, eran hábitats cruciales para una diversa fauna y flora. Madreviejas, antiguos meandros del río ahora separados del cauce principal, ampliaban el repertorio de humedales, zanjones, caños y pequeños canales naturales de formas singulares entrelazadas en el paisaje. Humedales extensos y cuantiosos actuaban como esponjas naturales, absorbiendo el exceso de agua durante las inundaciones y liberándola lentamente en épocas de sequía. Incluso los charcos temporales jugaban un papel ecológico importante, proporcionando hábitats efímeros pero vitales para anfibios y otros organismos adaptados a ciclos de inundación y sequía. Este complejo sistema acuático no solo sustentaba una rica biodiversidad y regulación del ciclo hídrico; también constituía espacios fundamentales para las comunidades locales dedicadas a la pesca y fertilizaba de forma natural los suelos a través de los sedimentos depositados durante las inundaciones cíclicas.\n\nLas consecuencias del represamiento del río Cauca son evidentes: el curso del río quedó disminuido, los meandros naturales reducidos, y grandes extensiones de lo que antes eran humedales y cuerpos de agua, hábitat de múltiples especies aves, anfibios y peces ahora son espacios rellenados, en su mayoría dedicada a la agricultura intensiva, particularmente al monocultivo de caña de azúcar y a la urbanización sin tregua de suelos fértiles. La disminución de las áreas húmedas de 13.000 a 2.500 hectáreas entre 1980 y 2020 tiene implicaciones profundas no solo para la biodiversidad local, sino también para la resiliencia del ecosistema frente a eventos climáticos extremos y para la disponibilidad de recursos hídricos en la región.\n\nLa transformación del paisaje ha generado nuevos patrones de uso del suelo. Donde antes predominaban ecosistemas naturales diversos, ahora se extienden vastas plantaciones de caña de azúcar. Este cambio ha traído consigo prosperidad económica para algunos sectores, pero también ha exacerbado las desigualdades en el acceso a los recursos naturales y ha planteado desafíos significativos para la sostenibilidad ambiental a largo plazo.\n\nEl mapa 16 propone un comparativo que sirve como un poderoso recordatorio visual de los cambios ocurridos en apenas medio siglo. Más allá de ilustrar transformaciones geográficas, este documento cartográfico invita a una reflexión profunda sobre las consecuencias de nuestras decisiones de desarrollo y planificación territorial. Plantea preguntas cruciales sobre cómo equilibrar las necesidades de crecimiento económico con la preservación de ecosistemas vitales y la gestión sostenible de los recursos hídricos. Este mapa tiene un valor histórico y educativo significativo ya que sirve como herramienta para recuperar la memoria colectiva del río y su valle, permitiendo a las generaciones actuales y futuras comprender la magnitud de los cambios ocurridos y reflexionar sobre las lecciones que se pueden extraer de esta transformación paisajística y ecológica.',
    'cap3-intro',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentación',
    mapId: 'chapter3-introduccion',
  },
}

/* ── cap3-presentacion-monocultivo ─────────────────────────────────────────── */

const CAP3_MONOCULTIVO: Modal = presentacion(3, 'monocultivo', {
  title:  'El acaparamiento de la tierra y del uso del suelo\npor la agroindustria de la caña de azúcar\n\n',
  highlight: 'El desierto verde del valle alto del río Cauca' ,
  texto:
    'Los sistemas de producción y las ecologías de los campesinos negros ubicados en el sur del valle alto del río Cauca son reconocidos por su agrobiodiversidad y valores culturales. Pero a pesar de su importancia para la sostenibilidad de la región, estos enfrentan actualmente procesos de “muerte lenta” debido a la gran presión sobre sus tierras ejercidas por la expansión del agronegocio y la urbanización. Los sistemas de agricultura tradicional que son de pequeña escala, así como los valores y relaciones con el territorio de la gente negra, han sido sistemáticamente omitidos en la representación espacial del territorio que se encuentra en los mapas oficiales de ordenamiento territorial, esto se ha dado a través de procesos institucionalizados que favorecen la expansión de usos y actividades que van en detrimento de los territorios ancestrales, lo que refuerza patrones de injusticia y marginalización de los cuerpos afro y sus espacios en la región. Los cambios a gran escala del paisaje debido a la expansión de los monocultivos y la construcción de la represa de la Salvajina en el año 1985 han traído como consecuencia la disminución de la productividad de las fincas tradicionales y la reducción de las zonas de pesca y caza que la complementaban (Vélez-Torrez and Varela, 2014).\n\nComo resultado de estos cambios, la migración de la población rural a las ciudades se ha incrementado, al igual que el desempleo rural. Estas consecuencias sociales han sido acompañadas por una degradación ambiental que está afectando peligrosamente los bienes hídricos de la región. Además, la pérdida de los territorios ancestrales debido a la presión para vender las tierras de los afrocampesinos al agronegocio, la minería de arcilla o las constructoras no está siendo contrarrestada por el Estado. Esto ocurre porque a las comunidades afrodescendientes del valle interandino no se les otorgó el derecho a la titulación colectiva en la Ley 70 de 1993, argumentando que habitan un territorio predominantemente urbano y por fuera de los baldíos de la región Pacífica.\n\nPor estas razones, corregir las fallas de la planeación y del ordenamiento territorial para representar las ecologías afro y los sistemas productivos tradicionales de la población afrodescendiente es muy importante para prevenir la desintegración total de los territorios ancestrales y la degradación ambiental en la región. Sumado a esto, se puede apreciar una ocupación significativa de la zona plana por monocultivos de caña de azúcar, lo que demuestra una baja biodiversidad paisajística, siendo esta un área totalmente dominante, sin ecosistemas significativos y con una homogeneización de un solo cultivo que no brinda ni posibilita la necesidad de una región variada de otros cultivos que suplan la soberanía alimentaria de sus habitantes.',
  triggerLabel: 'Presentación',
})

/* ── cap3-presentacion-encharcaron ─────────────────────────────────────────── */

const CAP3_ENCHARCARON: Modal = presentacion(3, 'encharcaron', {
  title: 'Poblamiento entre 1960-1971 en el área inundada por la represa Salvajina en Suárez.',
  highlight: 'Nos encharcaron el río',
  texto:
    'Este mapa, elaborado a partir de imágenes de índices de vuelo de Suárez entre 1960 y 1971, busca recuperar y preservar la memoria del poblamiento existente en el área que actualmente ocupa el embalse de la represa La Salvajina. Su importancia radica en revelar la presencia histórica de comunidades afrocolombianas que habitaban las riberas del río Cauca antes de la construcción de la represa, hecho que se evidencia en el mapa a través de las construcciones existentes en ese momento, tales como caminos viales y viviendas.\n\nAdemás, el mapa permite apreciar cómo era el cauce del río Cauca antes de la construcción de La Salvajina, ofreciendo una visión histórica de su trayectoria y dinámica natural. Esta representación no solo muestra los asentamientos humanos, sino que también, captura la relación íntima que estas comunidades mantenían con el río, cuyo curso moldeaba su vida cotidiana y su organización espacial.\n\nEn la elaboración del mapa se han incluido elementos geográficos actuales para facilitar una comparativa visual entre lo que existió entre 1960-1971 y lo que se encuentra en la actualidad. Esta exposición de elementos históricos y contemporáneos permite al observador entender de manera más clara y directa las transformaciones radicales que ha experimentado el territorio.\n\nEste ejercicio cartográfico trasciende la mera documentación geográfica; se convierte en un acto de justicia histórica y recuperación de la memoria. Al visibilizar los asentamientos y las formas de vida que fueron sumergidos por la represa, el mapa da voz a aquellas comunidades cuya presencia física fue borrada del paisaje. Nos recuerda que antes de ser un embalse, este espacio era un territorio vivo, habitado por personas cuyas historias, culturas y derechos deben ser reconocidos y respetados.\n\nLos Consejos comunitarios de Suárez en sus diagnósticos para la construcción del Plan de Manejo Ambiental de la Salvajina, entre 2010 y 2021, reconocieron 150 impactos, agrupados en 11 componentes, asociados tanto a la operación como al mantenimiento de la represa (Anexo 1: https://docs.google.com/document/d/16tA9314j_m5Zy-MOUI7MPp-1mod1u7R-/edit#heading=h.gjdgxs ). Si bien estos impactos están relacionados con el entorno de Suárez, que perdió 31 km de cauce de río por un charco poco accesible y de proporciones enormes, estos repercuten en el curso inmediato del Cauca que es su valle alto.',
  triggerLabel: 'Presentación',
})

/* ── cap3-presentacion-cali-deseca ─────────────────────────────────────────── */

const CAP3_CALI_DESECA: Modal = presentacion(3, 'cali-deseca', {
  title: 'Los cuerpos de agua en Cali: paisaje hídrico sumergido\nen concreto\n\n',
  highlight: 'Cali deseca',
  texto:
    'Las diferentes características urbanas que han permeado a la ciudad de Cali permitieron que en esta se ejecutarán diferentes ideas de “desarrollo” enfocadas al crecimiento económico y urbano que era necesario años atrás para afrontar temas como un alto crecimiento poblacional. Sin embargo, esas ideas generaron cambios muy abruptos en los circuitos o sistemas naturales en los que se ha implantado la ciudad, los cuales fueron sumamente ignorados en dichas ejecuciones. Uno de estos fue la transformación y deterioro del sistema acuático que prevalecía en esta zona del valle geográfico del río Cauca donde diferentes ríos provenientes de la cordillera Occidental unían sus aguas al Cauca. Originalmente, la ciudad estaba rodeada por una gran cantidad de humedales y lagunas, que formaban un sistema hídrico complejo y vital para el equilibrio ecológico de la región.\n\nDesde la segunda mitad del siglo XX, el crecimiento urbano descontrolado y la expansión agrícola llevaron a la destrucción y degradación de muchos de cuerpos de agua asociados a la llanura inundable del Cauca. Los humedales de Cali, que solían actuar como esponjas naturales absorbiendo el exceso de agua y reduciendo el riesgo de inundaciones, fueron rellenados y convertidos en terrenos para la construcción de viviendas, vías, zonas de industria y agricultura. Este proceso, conocido como “relleno”, fue impulsado por “la necesidad de más espacio para el desarrollo urbano” y la falta de políticas ambientales estrictas en la época.\n\nPor otro lado, las lagunas, que solían ser refugios de biodiversidad y fuentes de agua dulce, también se vieron afectadas. La laguna El Pondaje y la laguna Charco Azul, por ejemplo, fueron reducidas significativamente en tamaño debido a la urbanización y la contaminación. La extracción de agua para uso doméstico y agrícola también contribuyó a la disminución de estos cuerpos de agua.\n\nLa transformación del paisaje hídrico de Cali se refleja claramente en la cartografía histórica y actual de la ciudad. Los mapas antiguos de principios del siglo XX muestran una abundante presencia de humedales y lagunas distribuidos en todo el valle del río Cauca, destacando la riqueza hídrica de la región. El mapa N° 18 está construido a partir de la carta geográfica del municipio de 1937 y un mapa de las Empresas Municipales de este mismo. Sobre el área urbana se puede visualizar cómo el sistema de humedales estaba interconectado con el río cauca, cómo abarcaba grandes zonas del área plana y montañosa con la variedad de quebradas y cómo este paisaje sumergido era un soporte para la biodiversidad local.\n\nAl comparar estos mapas históricos con la cartografía contemporánea, se puede observar una drástica reducción en la extensión y número de estos cuerpos de agua. El mapa N° 19 está construído con los datos actuales del 2022, donde ya se visualizan la construcción de canales y la desaparición de diversas quebradas, humedales y lagos, evidencia las áreas urbanizadas donde antes existían estos. Esta cartografía de Cali pone en evidencia la transformación del paisaje y subraya la pérdida de espacios naturales que alguna vez fueron cruciales para la sostenibilidad ambiental de la ciudad.\n\nLa desaparición de los humedales y lagunas ha tenido múltiples consecuencias negativas para Cali. La pérdida de estos ecosistemas ha reducido la capacidad de la ciudad para manejar el agua de manera natural, incrementando la vulnerabilidad ante inundaciones y sequías. Además, la desaparición de estos cuerpos de agua ha afectado la biodiversidad local, eliminando hábitats esenciales para muchas especies de flora y fauna',
  triggerLabel: 'Presentación',
})

/* ── cap3-presentacion-humedales ───────────────────────────────────────────── */

const CAP3_HUMEDALES: Modal = presentacion(3, 'humedales', {
  title: 'Se encharca arriba se deseca abajo',
  highlight: '',
  texto:
    'Este mapa, elaborado a partir de imágenes de índices de vuelo de Suárez entre 1960 y 1971, busca recuperar y preservar la memoria del poblamiento existente en el área que actualmente ocupa el embalse de la represa La Salvajina. Su importancia radica en revelar la presencia histórica de comunidades afrocolombianas que habitaban las riberas del río Cauca antes de la construcción de la represa, hecho que se evidencia en el mapa a través de las construcciones existentes en ese momento, tales como caminos viales y viviendas.\n\nAdemás, el mapa permite apreciar cómo era el cauce del río Cauca antes de la construcción de La Salvajina, ofreciendo una visión histórica de su trayectoria y dinámica natural. Esta representación no solo muestra los asentamientos humanos, sino que también, captura la relación íntima que estas comunidades mantenían con el río, cuyo curso moldeaba su vida cotidiana y su organización espacial.\n\nEn la elaboración del mapa se han incluido elementos geográficos actuales para facilitar una comparativa visual entre lo que existió entre 1960-1971 y lo que se encuentra en la actualidad. Esta exposición de elementos históricos y contemporáneos permite al observador entender de manera más clara y directa las transformaciones radicales que ha experimentado el territorio.\n\nEste ejercicio cartográfico trasciende la mera documentación geográfica; se convierte en un acto de justicia histórica y recuperación de la memoria. Al visibilizar los asentamientos y las formas de vida que fueron sumergidos por la represa, el mapa da voz a aquellas comunidades cuya presencia física fue borrada del paisaje. Nos recuerda que antes de ser un embalse, este espacio era un territorio vivo, habitado por personas cuyas historias, culturas y derechos deben ser reconocidos y respetados.\n\nLos Consejos comunitarios de Suárez en sus diagnósticos para la construcción del Plan de Manejo Ambiental de la Salvajina, entre 2010 y 2021, reconocieron 150 impactos, agrupados en 11 componentes, asociados tanto a la operación como al mantenimiento de la represa (Anexo 1: https://docs.google.com/document/d/16tA9314j_m5Zy-MOUI7MPp-1mod1u7R-/edit#heading=h.gjdgxs ). Si bien estos impactos están relacionados con el entorno de Suárez, que perdió 31 km de cauce de río por un charco poco accesible y de proporciones enormes, estos repercuten en el curso inmediato del Cauca que es su valle alto.',
  triggerLabel: 'Presentación',
})

/* ── cap3-presentacion-arcilla ─────────────────────────────────────────────── */

const CAP3_ARCILLA: Modal = presentacion(3, 'arcilla', {
  title: 'Aguas que llegan',
  highlight: '',
  texto:
    'Este mapa, elaborado a partir de imágenes de índices de vuelo de Suárez entre 1960 y 1971, busca recuperar y preservar la memoria del poblamiento existente en el área que actualmente ocupa el embalse de la represa La Salvajina. Su importancia radica en revelar la presencia histórica de comunidades afrocolombianas que habitaban las riberas del río Cauca antes de la construcción de la represa, hecho que se evidencia en el mapa a través de las construcciones existentes en ese momento, tales como caminos viales y viviendas.\n\nAdemás, el mapa permite apreciar cómo era el cauce del río Cauca antes de la construcción de La Salvajina, ofreciendo una visión histórica de su trayectoria y dinámica natural. Esta representación no solo muestra los asentamientos humanos, sino que también, captura la relación íntima que estas comunidades mantenían con el río, cuyo curso moldeaba su vida cotidiana y su organización espacial.\n\nEn la elaboración del mapa se han incluido elementos geográficos actuales para facilitar una comparativa visual entre lo que existió entre 1960-1971 y lo que se encuentra en la actualidad. Esta exposición de elementos históricos y contemporáneos permite al observador entender de manera más clara y directa las transformaciones radicales que ha experimentado el territorio.\n\nEste ejercicio cartográfico trasciende la mera documentación geográfica; se convierte en un acto de justicia histórica y recuperación de la memoria. Al visibilizar los asentamientos y las formas de vida que fueron sumergidos por la represa, el mapa da voz a aquellas comunidades cuya presencia física fue borrada del paisaje. Nos recuerda que antes de ser un embalse, este espacio era un territorio vivo, habitado por personas cuyas historias, culturas y derechos deben ser reconocidos y respetados.\n\nLos Consejos comunitarios de Suárez en sus diagnósticos para la construcción del Plan de Manejo Ambiental de la Salvajina, entre 2010 y 2021, reconocieron 150 impactos, agrupados en 11 componentes, asociados tanto a la operación como al mantenimiento de la represa (Anexo 1: https://docs.google.com/document/d/16tA9314j_m5Zy-MOUI7MPp-1mod1u7R-/edit#heading=h.gjdgxs ). Si bien estos impactos están relacionados con el entorno de Suárez, que perdió 31 km de cauce de río por un charco poco accesible y de proporciones enormes, estos repercuten en el curso inmediato del Cauca que es su valle alto.',
  triggerLabel: 'Presentación',
})

/* ── Tramos «Se encharca arriba se deseca abajo» (ids 66–69 v17) ─────────────
 * 4 imágenes full-bleed (webp 8035×5118, fondo blanco), estilo diagrama cap4.
 * Trigger: markers del geojson cap3-se-encharca.json (nombres tramos). */

const CAP3_TRAMO_1: Modal = diagrama(
  'cap3-tramo-1',
  'Tramo 1: Buenos Aires - Yumbo',
  'Se encharca arriba se deseca abajo',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-3/tramo1humedales.webp',
  'chapter3-humedales',
  'Tramo 1',
)

const CAP3_TRAMO_2: Modal = diagrama(
  'cap3-tramo-2',
  'Tramo 2: Yumbo - San Pedro',
  'Se encharca arriba se deseca abajo',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-3/tramo2humedales.webp',
  'chapter3-humedales',
  'Tramo 2',
)

const CAP3_TRAMO_3: Modal = diagrama(
  'cap3-tramo-3',
  'Tramo 3: San Pedro - Zarzal',
  'Se encharca arriba se deseca abajo',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-3/tramo3humedales.webp',
  'chapter3-humedales',
  'Tramo 3',
)

const CAP3_TRAMO_4: Modal = diagrama(
  'cap3-tramo-4',
  'Tramo 4: Zarzal - La Victoria',
  'Se encharca arriba se deseca abajo',
  'mapa-arbol',
  '1',
  '/assets/modal/chapter-3/tramo4humedales.webp',
  'chapter3-humedales',
  'Tramo 4',
)

/* ── Export ────────────────────────────────────────────────────────────── */

export const CHAPTER3_MODALS: Modal[] = [
  CAP3_INTRO,
  CAP3_MONOCULTIVO,
  CAP3_ENCHARCARON,
  CAP3_CALI_DESECA,
  CAP3_HUMEDALES,
  CAP3_ARCILLA,
  CAP3_TRAMO_1,
  CAP3_TRAMO_2,
  CAP3_TRAMO_3,
  CAP3_TRAMO_4,
]
