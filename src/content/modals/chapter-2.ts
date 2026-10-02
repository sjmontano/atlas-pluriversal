/**
 * MODALES CAPITULO 2 — contenido editorial portado de v17
 * Fuentes: modalsData.jsx ids 27-54
 */

import type { Modal } from '../../types/modal.ts'
import { fichaPerfil, paragraphs } from './_helpers.ts'

/* ── ID 27: Introduction ──────────────────────────────────────────────── */

const CAP2_INTRO: Modal = {
  id: 'cap2-intro',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Capítulo II',
  highlight: 'Redes nodo y entramados territoriales: portadores de capacidades y saberes para las transiciones regionales sistémicas',
  icon: 'presentation',
  body: paragraphs(
    'Las transiciones regionales sistémicas justas surgen como una respuesta integral a las crisis ecológicas y sociales generadas por el modelo de desarrollo desigual dominante centrado en la ocupación física y mono-ontológica de los territorios. Este modelo refuerza una visión unificada del mundo que desmantela los mundos relacionales. En contraposición, las transiciones promueven una transformación cultural, económica y política que reconoce la interdependencia de todos los seres, defendiendo la idea de un pluriverso, es decir, "un mundo donde quepan muchos mundos", fomentando una reconexión de la vida toda.\n\nEstas transiciones, que ya ocurren en cientos de casos en el planeta, visibilizan los efectos destructivos de las sociedades globalizadas contemporáneas y plantean un llamado decidido a un sentir, pensar y actuar basado en la defensa y permanencia en los territorios desde una perspectiva material, epistémica, cultural y ontológica que pone la vida en el centro. Esto implica fortalecer los proyectos de vida comunitaria, asegurar la soberanía alimentaria y establecer redes de solidaridad entre organizaciones étnico-territoriales. Así, estas estrategias representan un cambio radical hacia relaciones más justas, equitativas y sostenibles con la naturaleza y entre las personas, como parte de una resistencia activa al paradigma dominante.\n\nEn el valle alto del río Cauca, estamos conformando un tejido entre transiciones se están materializando en tres nodos o entramados territoriales situados en Suárez y Villa Rica en el Cauca y en el oriente de Cali, en el Valle del Cauca. Estos nodos conforman unos entramados territoriales de alternativas transformadoras que contrarrestan los efectos del sistema dominante, priorizando la reconstrucción del relacionalidad de la vida. A través de mapas y modelos elaborados en el Diagnóstico de Paz Territorial Pluriversal y los talleres del Colaboratorio de Cartografías Críticas y Codiseño Territorial presentamos nuestros territorios en términos de su localización en la cuenca del río Cauca y nuestros empeños y retos.',
    'cap2-intro',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentación',
    mapId: 'chapter2-valle',
  },
}

/* ── ID 31-33: Sintesis territoriales ─────────────────────────────────── */

const SINTESIS_CALI: Modal = {
  id: 'cap2-sintesis-cali',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Síntesis territorial Oriente de Cali',
  highlight: 'Síntesis territorial Oriente de Cali - distrito de Aguablanca',
  icon: 'presentation',
  body: paragraphs(
    'Para el caso del Oriente de Cali la síntesis la construimos entre dos grupos. En el primero concebimos este territorio desde el río Cauca y el océano Pacífico entre Tumaco y Nuquí. Destacamos las casas sobre pilotes, los tenderos de ropa y las palmeras como parte de la vida en las poblaciones costeras y ribereñas y presentamos las tradiciones, saberes y prácticas culturales y artísticas que han llegado a Cali desde nuestros territorios y los de nuestros ancestros a partir de los procesos de migradestierro. Esta primera parte de la síntesis territorial expone también cómo la visión de desarrollo predominante en el modelo de desarrollo regional construido desde Cali y el valle alto del río Cauca ha producido en parte el desplazamiento a Cali de muchas comunidades pobladoras de la región Pacífica. Estas llegan a Cali en condiciones de vulnerabilidad que se agudiza con la segregación espacial y el racismo estructural presente en la ciudad.\n\nLa segunda parte de la síntesis surge del Oriente de Cali y enlaza otros sectores de la ciudad a través de elementos significativos del paisaje urbano y de los vínculos afectivos con estos. Se localizaron la Casa Cultural El Chontaduro y la Biblioteca Rigoberta Menchú como espacios seguros e importantes y las universidades como espacios a los que aspiran a llegar las personas más jóvenes del grupo. Se plasmó la avenida Ciudad de Cali como una línea de conexión con el resto de la ciudad, el lago de Charco Azul como un lugar bonito a resaltar en el oriente y la vista de los Farallones de Cali al atardecer como algo de gran belleza. También se reconoció que en el oriente de Cali hay mucha confrontación e inseguridad en las calles y que desplazarse hacia otras partes en el transporte público tiene muchos problemas como largos tiempos de espera, horarios y buses insuficientes y escasa cobertura. Esta parte de la síntesis completa a escala urbana los relatos de muchas personas que tienen que abandonar sus territorios en el Pacífico.',
    'cap2-sintesis-cali',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Síntesis Cali',
    mapId: 'chapter2-m-oriente-cali',
  },
}

const SINTESIS_VILLA_RICA: Modal = {
  id: 'cap2-sintesis-villa-rica',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Síntesis territorial Villa Rica',
  highlight: 'Síntesis territorial Villa Rica',
  icon: 'presentation',
  body: paragraphs(
    'Esta síntesis la construimos entre varios integrantes de las alternativas transformadoras de Villa Rica y Puerto Tejada y acogemos en nuestro entorno cercano a los municipios de Caloto, Candelaria, Guachené, Padilla y Santander de Quilichao. Nuestro territorio está inmerso en las dinámicas de implantación y permanencia de diferentes formas de extractivismo en el valle alto del río Cauca y en las resistencias a las versiones de este modelo económico que ha configurado esta zona de la cuenca. Los tres siglos de esclavitud para la explotación del oro y la producción agrícola que soportaba la intensa actividad minera de la colonia, se traslaparon con la consolidación de la agroindustria de la caña de azúcar y al incremento de la extracción de arcillas y otros insumos fundamentales para la fabricación de materiales de construcción.\n\nActualmente la minería de arcilla y el monocultivo de caña de azúcar son actividades lesivas con la biodiversidad local y con nuestros suelos por las siguientes causas: las excavaciones para la extracción de arcillas deforestan y alteran severamente la configuración de terreno y los cursos del agua y el monocultivo de la caña de azúcar es ya un hecho de agotamiento de la biodiversidad. Además para el sostenimiento y el incremento de su productividad se abusa de los acuíferos de la zona y se contaminan con químicos como el glifosato las aguas profundas y superficiales y los cultivos diversos cercanos.\n\nLos rastros de las actividades extractivas que datan de la colonia están presentes en las haciendas y en el monocultivo de la caña de azúcar que cubre casi el 80% de los suelos fértiles de esta parte del valle alto del río Cauca. Las haciendas, entre las que se destaca La Bolsa, hacen parte de las materialidades de la opresión de la esclavitud y sobre este símbolo se construye gran parte de la memoria y las acciones de resistencia y lucha insistente por la vida digna. Estas se hacen concretas en los proyectos de los consejos comunitarios con tierras tituladas o no y en la disminuida, pero aun potente, presencia de fincas tradicionales y coberturas boscosas protegidas que caracterizan esta zona, conocida también como norte del Cauca.\n\nEn los referentes culturales de los integrantes de las alternativas transformadoras de Villa Rica están presentes los espacios cotidianos de la vida campesina: el aljibe, los caminos vecinales, el parque, la iglesia, la institución educativa, las quebradas, destacando La Tabla, y las conexiones con su entorno: la vía Panamericana y el puente Valencia que cruza el río Cauca y comunica a Villa Rica con Jamundí. Este entorno agrícola productivo, garantía de la alimentación diversificada, sana y suficiente para la región, está sintetizado en las fincas tradicionales de este territorio, acompañadas de varios bosques, juntos interrumpen el monótono tapiz del monocultivo y son una posibilidad de sanar, reencantar y reencarnar las cicatrices profundas de la minería de arcillas.',
    'cap2-sintesis-vr',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Síntesis Villa Rica',
    mapId: 'chapter2-m-villa-rica',
  },
}

const SINTESIS_SUAREZ: Modal = {
  id: 'cap2-sintesis-suarez',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Síntesis territorial de Suárez',
  highlight: 'Síntesis territorial de Suárez',
  icon: 'presentation',
  body: paragraphs(
    'Esta síntesis territorial la pensamos considerando el lugar central que tiene la cabecera municipal y la comunicación desde aquí con los consejos comunitarios de Brisas, Asnazú, Portugal, Cuenca Río Ovejas, Bellavista, Mindalá, La Toma y Pureto. Reconocimos la relevancia de los ríos Cauca y Ovejas y la represa Salvajina en la estructura de nuestro territorio y en ellos las razones de muchas de nuestras luchas. También expresamos a través de este modelo que una de las principales afectaciones que tenemos son las zonas con cultivos ilícitos de coca, que se extienden por amplias áreas incluyendo los bordes de la represa, presentando mayor concentración en los consejos comunitarios de Brisas, Bellavista, Meseta y Pureto. Otra de las afectaciones severas son las zonas de explotación minera. Si bien esta actividad ha estado presente históricamente en nuestro territorio, desde hace años produce problemas por su intensidad y las prácticas contaminantes y lesivas con muchas formas de vida.\n\nNo obstante los problemas mencionados, nuestro territorio tiene potencia transformadora. Aquí destacamos las trayectorias de paz que nos conectan entre consejos comunitarios y nos ha permitido organizarnos para hacerle frente a las adversidades que producen la operación y mantenimiento de la represa, el monocultivo de coca, el conflicto armado, la minería intensiva en nuestros ríos y suelos y el racismo local que nos divide.',
    'cap2-sintesis-sz',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Síntesis Suárez',
    mapId: 'chapter2-m-suarez',
  },
}

/* ── IDs 34-52: Alternativas Transformadoras (fichaPerfil en _helpers.ts) ── */

const AT_ASOYOGE: Modal = fichaPerfil(
  'cap2-at-asoyoge',
  'Asoyoge',
  'Asociación de agroindustrial de productos agropecuarios y mineros afrodescendientes de Yolombó y Gelima - Asoyogé',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761185904/geoImages/jx2ox2ihls7j9pv15kbg.webp',
  'Monte Redondo. Suárez, Cauca.',
  'Veredas Yolombó y Gelima.',
  'Suarez, Cauca',
  'Nos juntamos el 10 de enero del 2020 para reivindicar y promover el respeto a los derechos humanos, territoriales, sociales, económicos, culturales, ambientales, políticos y por ser víctimas del conflicto armado. Esto lo hacemos procurando la equidad de género en las comunidades negras, afrocolombianas, raizales o palenqueras e incentivando la producción, transformación y comercialización de productos agroalimentarios.',
  ['Cultivos de coca para la producción de drogas de uso ilícito.', 'Presencia de grupos armados al margen de la ley en el territorio.', 'Títulos mineros no consultados.'],
  ['Implementación de alternativas para la producción de familias del territorio.', 'Gestión de formación académicas para jóvenes y adultos.', 'Gestión de proyectos de fortalecimiento de tradiciones culturales en el territorio.'],
  'chapter2-suarez',
)

const AT_GUARDIA_CIMARRONA: Modal = fichaPerfil(
  'cap2-at-guardia-cimarrona',
  'Guardia Cimarrona',
  'Alternativa Transformadora Guardia Cimarrona Suárez, Cauca',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761185272/geoImages/reblala1pv2puebswzmc.webp',
  'Monte Redondo. Suárez, Cauca.',
  'Consejo Comunitario Río Ovejas. Suárez, Cauca.',
  'Suarez, Cauca',
  'La Guardia Cimarrona se conformó en 2014 para garantizar la defensa, el cuidado y la protección del territorio.',
  ['La siembra de coca para producción de drogas ilícitas.', 'Grupos al margen de la ley en el territorio.', 'Abandono estatal o intervenciones estatales lesivas en el territorio.'],
  ['Capacitar a jóvenes que están consumiendo sustancias psicoactivas.', 'Evitar la presencia de la minería ilegal en el territorio', 'Evitar la implementación de cultivo de coca en el territorio.'],
  'chapter2-suarez',
)

const AT_ASOCOMS: Modal = fichaPerfil(
  'cap2-at-asocoms',
  'ASOCOMS',
  'Alternativa Transformadora ASOCOMS - Asociación de Consejos Comunitarios de Suárez',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186221/geoImages/dh5af9kzy1tdno0awcxo.webp',
  'Suárez, Cauca, Barrio Las Brisas',
  'Consejos comunitarios de La Toma, Asnazú, Benavista, Meseta, Pureto, Mindala, Brisas, Portugal y Cuenca Río Ovejas',
  'Suarez, Cauca',
  'Somos una organización que reúne varios consejos de las comunidades negras de Suárez. Nos enfocamos en defender nuestros derechos étnico territoriales, implementamos el seguimiento y la ejecución del Plan de manejo ambiental de la represa La Salvajina y luchamos por el cuidado los ríos Cauca y Ovejas y de los daños causados a estos por los proyectos mineros y energéticos extractivistas.',
  ['Impactos adversos a los pobladores y al territorio derivados de la construcción, operación y mantenimiento de la represa La Salvajina', 'Intereses de los sectores mineros', 'Presencia de grupos armados al margen de la ley'],
  ['Cuidado y defensa de los ríos Cauca y Ovejas y de lo público: el río, el aire y madre tierra', 'Participación en el diseño, implementación y seguimiento del Plan de manejo de la represa La Salvajina', 'Impulso a transformaciones económicas productivas'],
  'chapter2-suarez',
)

const AT_ASOMUAFROYO: Modal = fichaPerfil(
  'cap2-at-asomuafroyo',
  'ASOMUAFROYO',
  'Alternativa Transformadora Asociación de Mujeres afrodescendientes de la vereda Yolombó',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186008/geoImages/i44mm4ct4uxhaga8zlnj.webp',
  'Vereda Yolombó. Suárez, Cauca.',
  'Vereda Yolombó. Suárez, Cauca.',
  'Suarez, Cauca',
  'La asociación nace en el 2010 ante el sentimiento cotidiano de exclusión y discriminación, riesgo de desplazamiento forzado por motivos de violencia y no oportunidades laborales y la violación de los derechos ancestrales, étnicos territoriales, social, político y culturales que las comunidades negras han vivido desde la trata transatlántica hasta hoy.',
  ['Acción violenta de grupos armados', 'El cultivo de coca para la producción de drogas ilícitos', 'El abandonado estatal.'],
  ['Diálogos con la comunidad.', 'Encuentros con la Guardia Cimarrona.', 'Talleres de autoprotección y autocuidado.'],
  'chapter2-suarez',
)

const AT_CONSEJO_OVEJAS: Modal = fichaPerfil(
  'cap2-at-consejo-ovejas',
  'Consejo Comunitario de Comunidades Negras Cuenca Río Ovejas',
  'Alternativa Transformadora Consejo comunitario de comunidades negras cuenca río Ovejas',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186036/geoImages/mbyeccjbklrgzx4c3824.webp',
  'Corregimiento de La Toma, Suárez, Cauca',
  'Veredas de Yolombó, Gelima y Dos Aguas',
  'Suarez, Cauca',
  'La asociación surge en el año 1970, motivada a plantear una solución a la desintegración familiar que permeaba el territorio y que afectaba directamente a la niñez. Por otra parte, para dicha época no había procesos organizativos que lucharan por los derechos humanos y el territorio. Por tanto, nuestra alternativa, se ha propuesto la realización de trabajo comunitario en el norte del Cauca por medio de la ejecución de proyectos y programas enfocados en la niñez, la juventud, los adultos mayores, el cuidado del ambiente y la soberanía alimentaria. Todo esto enfocado en la mejora de las condiciones de vida de las poblaciones más vulnerables.',
  ['La siembra de coca para la producción de drogas ilícitas', 'La poca inversión social en los territorios', 'Aspectos de la operación y mantenimiento de la represa Salvajina que afectan a la población'],
  ['La construcción de la agenda de juventud para la participación e incidencia en los planes de desarrollo', 'La formulación de proyectos que buscan mitigar las necesidades de la población juvenil asambleas de juventud', 'La rendición de cuentas acerca de las temas que nos afectan como jóvenes'],
  'chapter2-suarez',
)

const AT_CMJ: Modal = fichaPerfil(
  'cap2-at-cmj',
  'Consejo Municipal de Juventud',
  'Alternativa Transformadora Consejo Municipal de Juventudes Suárez, Cauca',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186247/geoImages/ul3u7hmi5jzvmwgars7z.webp',
  'Corregimiento de La Toma, Suárez, Cauca',
  'Veredas de Yolombó, Gelima y Dos Aguas',
  'Suarez, Cauca',
  'Surgimos por las manifestaciones del 2021. A partir de ese momento los jóvenes de cada territorio nos propusimos marchar, participar, hacer incidencia para lograr un impacto social y veeduría a los entes administrativos del municipio. Estamos interesados en fortalecer espacios de participación recogiendo a toda la población juvenil del territorio.',
  ['La siembra de coca para la producción de drogas ilícitas', 'La poca inversión social en los territorios', 'Aspectos de la operación y mantenimiento de la represa Salvajina que afectan a la población', 'Poca participación de los jóvenes en los espacios de toma de decisiones.'],
  ['Construcción de la agenda de juventud para la participación e incidencia en los planes de desarrollo.', 'Formulación de proyectos que buscan mitigar las necesidades de la población juvenil asamblea de juventud.', 'Seguimiento a la rendición de cuentas acerca de los temas que nos afectan como jóvenes.'],
  'chapter2-suarez',
)

const AT_PLATAFORMA_JUVENTUDES: Modal = fichaPerfil(
  'cap2-at-plataforma-juventudes',
  'Plataforma de Juventudes Suarez',
  'Plataforma de Juventudes Suárez, Cauca',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186274/geoImages/nlbvtqpoldaecg2ym9ls.webp',
  'Barrio Los Almendros. Suárez, Cauca.',
  'Zona urbana Suárez, Cauca.',
  'Suarez, Cauca',
  'Somos jóvenes del municipio de Suárez que desarrollan procesos juveniles basados en la participación por medio del reconocimiento de nuestras diferencias, la creación y seguimiento de agendas, control social y veeduría de recursos públicos locales y promoción de procesos y prácticas organizativas a fin de poder aportar al desarrollo territorial por medio de liderazgos juveniles que impacten de forma positiva a sus comunidades y al municipio. Acogemos los principios orientadores dispuestos en la Constitución Política de Colombia y en el Estatuto de Ciudadanía Juvenil, especialmente los de autonomía, corresponsabilidad, concertación, dignidad, diversidad, interés juvenil, participación, territorialidad, respeto, compromiso, inclusión y autocuidado.',
  ['Baja inclusión de los jóvenes en la toma de decisiones y planes del municipio.', 'Problemas en la ejecución de los recursos públicos.', 'Pocos espacios de expresión y comunicación juvenil.'],
  ['Participamos en el diseño y desarrollo de Agendas Municipales, Distritales, Departamentales y Nacionales de Juventud con base en la agenda concertada al interior del Subsistema de Participación de las Juventudes.', 'Ejercemos veeduría y control social a los planes de desarrollo, políticas públicas de juventud, y a la ejecución de las agendas territoriales de las juventudes, así como a los programas y proyectos desarrollados para los jóvenes por parte de las entidades públicas del orden territorial y nacional.'],
  'chapter2-suarez',
)

const AT_CASA_NINO: Modal = fichaPerfil(
  'cap2-at-casa-nino',
  'Casa del Niño y de la Niña',
  'Alternativa Transformadora Asociación cultural Casa del Niño y de la Niña',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186701/geoImages/pyhbpjnlbhiezwueuzxb.webp',
  'Villa Rica, vía Puerto Tejada. Vereda Agua Azul',
  'Centro, norte Tejada y Guachené',
  'Norte del Cauca',
  'La asociación surgió en el año 1970, motivada a plantear una solución a la desintegración familiar que permeaba el territorio y que afectaba directamente a la niñez, quienes no tenían quién cuidara de ellos. Por otra parte, para dicha época no había procesos organizativos que lucharan por los derechos humanos y el territorio. Por tanto, nuestra alternativa, se ha propuesto la realización de trabajo comunitario en el norte del Cauca, por medio de la ejecución de proyectos y programas enfocados en la niñez, la juventud, los adultos mayores, el cuidado del ambiente y la soberanía alimentaria. Todo esto enfocado en la mejora de las condiciones de vida de las poblaciones más vulnerables.',
  ['Monocultivo de la caña', 'Desintegración familiar y social', 'Pandillas', 'Tráfico y consumo de drogas ilícitos', 'Pocas redes de cuidado para la niñez'],
  ['Creamos procesos organizativos que luchan por garantizar los derechos humanos de manera intergeneracional como lo son: Corporación Colombia Joven y Casa del Adulto Mayor', 'Defendemos las semillas tradicionales en todo el norte del Cauca por la reivindicación de los derechos de las comunidades afro', 'Ejecutamos proyectos con diferentes poblaciones: niñez, juventud y adulto mayor', 'Consolidamos escuelas de paz e interactivas'],
  'chapter2-villa-rica',
)

const AT_UOAFROC: Modal = fichaPerfil(
  'cap2-at-uoafroc',
  'UOAFROC',
  'Alternativa Transformadora UOAFROC-Unidad de organizaciones afrocaucanas',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761187126/geoImages/ki5sktr8jnwo2oowkpqt.webp',
  'Cra. 26 #9-18, Puerto Tejada, Barrio Santa Elena',
  'Departamento del Cauca',
  'Departamento del Cauca',
  'Surgimos en 2003, con la finalidad de resignificar los proyectos educativos desde la educación y la etnografía para la generación de autonomía territorial en el tema de la seguridad alimentaria. Por ello, en la actualidad realizamos procesos de formación y potencialización de productos de alimentación de fincas tradicionales.',
  ['Fortalecimiento de la finca tradicional para la soberanía alimentaria', 'Conflicto Armado', 'Contaminación por fumigación con glifosato en el monocultivo de caña de azúcar'],
  ['Compañías de formación en el tema de resolución de conflictos', 'Acompañamiento a los pequeños agricultores en la transformación de la tierra'],
  'chapter2-villa-rica',
)

const AT_TERRITORIO_Y_PAZ: Modal = fichaPerfil(
  'cap2-at-territorio-paz',
  'Territorio y Paz',
  'Alternativa Transformadora Consejo comunitario Territorio y Paz',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761187204/geoImages/to8dj0cmmtlzlztkvqr7.webp',
  'Vereda Chalo, Villa Rica',
  'Vereda Chalo, Villa Rica',
  'Villa Rica',
  'Surgimos en 2007, a partir de la necesidad de conformar el primer consejo comunitario en Villa Rica, con la finalidad de defender los intereses de la comunidad afro, de acuerdo a la Ley 70 de 1993. Actualmente nuestra alternativa realiza capacitaciones a la comunidad para defender el territorio y la conservación del mismo, de acuerdo a las normas, leyes y decretos de la comunidad, las cuales permiten que la comunidad conozca sus deberes y sus derechos.',
  ['Grupos armados al margen de la ley', 'Documentación no consultada antes de hacer consultas previas con la comunidad', 'Venta para la extracción de grandes cantidades de arcillas', 'Poco reconocimiento de la existencia del territorio por parte de los empresarios'],
  ['Capacitación a la comunidad sobre la Ley 70 de 1993, el Decreto 1745 de 1995, la Ley 21 de 1991, entre otras para proteger el territorio', 'Exigir a las empresas de la zona franca para que hagan consulta previa', 'Acompañamiento a la Mesa Municipal de Tierra', 'Potenciar los proyectos etnoeducativos y la etno granja como alternativa de seguridad alimentaria', 'Capacitaciones a la comunidad para defender el territorio y la conservación del mismo, de acuerdo a las normas, leyes y decretos de la comunidad'],
  'chapter2-villa-rica',
)

const AT_ESCUELA_ITINERANTE: Modal = fichaPerfil(
  'cap2-at-escuela-itinerante',
  'Escuela Itinerante Casilda Cundumi',
  'Alternativa Transformadora Escuela Itinerante Casilda Cundumi',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186657/geoImages/wwd81a1kiqgrxi4fra4v.webp',
  'Villa Rica, Puerto Tejada, Padilla, Miranda, Guachené y Santander de Quilichao',
  'Zona plana del norte del Cauca',
  'Norte del Cauca',
  'La escuela surge en 2011, con el fin de defender y crear estrategias para persistir en el territorio, a causa del deterioro constante que se estaba generando por los negocios extractivistas del monocultivo de la caña de azúcar y la minería de arcilla.',
  ['Descomposición del tejido social', 'Grupos al margen de la ley', 'Monopolio de la caña', 'Contaminación del medio ambiente y deterioro del territorio', 'Presencia de la delincuencia común', 'Contaminación de los ríos', 'Acaparamiento de la tierra'],
  ['Recuperación de semillas', 'Recuperación de la finca tradicional por medio de capacitaciones y ejecución de proyectos', 'Alianza y juntanza con otras organizaciones', 'Construcción de organizaciones y exigibilidad del derecho', 'Reconocimiento de la cultura defendida', 'Creación de comité por la defensa del territorio', 'Establecer un corredor afro-alimentario, como estrategia de desarrollo territorial para promover la soberanía alimentaria, autonomía territorial alimentaria, la conservación de la biodiversidad y los derechos de las comunidades', 'Creando estrategias para persistir en el territorio', 'Investigaciones sobre el territorio'],
  'chapter2-villa-rica',
)

const AT_PALENQUES_JUVENILES: Modal = fichaPerfil(
  'cap2-at-palenques-juveniles',
  'Palenques Juveniles',
  'Alternativa transformadora Palenques juveniles (Colectivo socio-juvenil huellas)',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761187057/geoImages/dtarbfe6sduopq1q4xca.webp',
  'Villa Rica, Cauca, Barrio San Fernando',
  'Villa Rica y Puerto Tejada',
  'Norte del Cauca',
  'Somos una organización juvenil que transforma, con una visión inclusiva, el liderazgo, la innovación y el trabajo comunitario en el norte de Cauca.',
  ['Falta de oportunidades para la juventud', 'Múltiples violencias contra la niñez y la juventud', 'Debilitamiento de los vínculos en el territorio'],
  ['Promovemos el arte, el deporte y el acceso a oportunidades para la niñez, la juventud y la comunidad', 'Fortalecemos liderazgos en Derechos Humanos, género y diversidad cultural', 'Promovemos un ambiente sostenible desde el ambiente, la paz, la tecnología y la economía'],
  'chapter2-villa-rica',
)

const AT_RED_NATIVOS: Modal = fichaPerfil(
  'cap2-at-red-nativos',
  'Red Nativos',
  'Alternativa Transformadora Red Nativos - Huerta Madre La Laguna',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761792935/geoImages/lnyyorgnj7zmdzzi93p1.webp',
  'Dg. 26g 4, Barrio Marroquín III',
  'Oriente de Cali',
  'Santiago de Cali',
  'Surgimos desde 1990, a raíz de varios desafíos dentro del territorio. Entre ellos, los asentamientos de casas informales, las zonas verdes usadas como basureros y escombreras y la transformación de estos en espacios productivos, la niñez vulnerable en condición de abandono, la juventud con adicciones, sin orientación, el acceso a los alimentos, regeneración de la tierra, aporte desde nuestro alcance al calentamiento global, atención de conciencia hacia el cuidado y la conservación de nuestros recursos naturales y vitales flora, fauna, agua y aire.',
  ['Asentamientos de casas informales', 'Zonas verdes afectadas como basureros y escombreras', 'Niñez vulnerable en condición de abandono', 'Juventud adicta sin orientación', 'Necesidad de acceso a alimentos sanos y regeneración de la tierra', 'Necesidad de aportar desde nuestro alcance al calentamiento global'],
  ['Educación en la vivencia sobre residuos y la transformación de recursos naturales y vitales: flora, fauna, suelo, agua y aire', 'Educación basada en acciones correctivas con principios agroecológicos', 'Semilleros con los niños y siembra de árboles', 'Alianza con SENA agroecológico de Tuluá', 'Creación de huerta', 'Taller inteligencia ambiental en instituciones educativas', 'Prácticas agroecológicas de cultivo de alimentos sanos'],
  'chapter2-cali',
)

const AT_RED_MUJERES: Modal = fichaPerfil(
  'cap2-at-red-mujeres',
  'Red de Mujeres y Organizaciones del Oriente',
  'Alternativa Transformadora Red de Mujeres y Organizaciones del Oriente',
  '/assets/modal/chapter-2/mujeresDelOriente.webp',
  'Diferentes casas',
  'Oriente de Cali',
  'Pacífico Colombiano',
  'Surgimos en el 2000 como iniciativa de mujeres provenientes del litoral Pacífico que nos fuimos encontrando en la Casa Cultural El Chontaduro para desarrollar las juntanzas de territorio y tratar aspectos relacionados con las dinámicas del contexto caminando hacia los propios procesos, los oficios varios y con el tiempo creamos procesos de economías solidarias.\n\nProcesos que conforman la red:\n- Asociación Lila Mujer\n- Escuela Taller Amauta\n- Fondo Solidario Oriente\n- AESDA\n- Fundación Legado Ancestral del Pacífico\n- Asociación Matamba Tierra\n- Fundación Nectar\n- Fundación Girasoles\n- Fundación Integración Pacífica\n- Mujeres Vencedoras del Pacífico\n- Asociación Casa Cultural El Chontaduro',
  ['Desigualdad', 'Exclusión', 'Injusticias', 'Marginalización'],
  ['Creación de procesos de economías solidarias', 'Fondo comunitario María Fenix'],
  'chapter2-cali',
)

const AT_CHICAS_COMUNICATIVAS: Modal = fichaPerfil(
  'cap2-at-chicas-comunicativas',
  'Chicas Comunicativas',
  'Alternativa Transformadora Chicas Comunicativas',
  '/assets/modal/chapter-2/chicasComunicativas.webp',
  'Biblioteca Rigoberta Menchú',
  'Comuna 15',
  'Oriente de Cali',
  'Nacemos en el 2018 como un proceso conformado por jóvenes mujeres que tenemos entre 14 y 15 años y habitamos en la comuna 15, en el barrio Brisas de Las Palmas en Cali. Nos juntamos con la necesidad de encontrar espacios seguros para el diálogo y el encuentro de las niñas, adolescentes y jóvenes. Al principio éramos un club de lectura, ubicado en la biblioteca Rigoberta Menchú, luego nos trasladamos a la emisora y desde ahí empezamos a realizar radio, para comunicar las diferentes problemáticas que atraviesan a las niñas en su comunidad sobre todo el acoso callejero y los piropos.',
  ['Desigualdad entre hombres y mujeres', 'Violencia de género', 'Falta de oportunidades para las mujeres, para el fortalecimiento de su autonomía económica', 'Falta de representatividad de las mujeres en lugares de incidencia política y de toma de decisiones'],
  ['Comunicación asertiva con base en los derechos, los valores, temas de actualidad y las situaciones de violencia de género que nos atraviesan siempre', 'Contextualización de las diferentes problemáticas del sector, como el acoso callejero, a partir de diferentes espacios y escenarios, entre ellos, mesas de radio', 'Murales con mensajes para la comunidad', 'Jornadas informativas - en los lugares donde otras niñas no tienen la posibilidad de enterarse de muchas cosas, como los asentamientos'],
  'chapter2-cali',
)

const AT_MATAMBA: Modal = fichaPerfil(
  'cap2-at-matamba',
  'Matamba Fundacion',
  'Alternativa Transformadora Matamba fundación',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761794790/geoImages/mecisufjjucxdzzalslg.webp',
  'Comuna 3',
  'Barrio San Cayetano',
  'Comunas 3, 4 y 9 de Cali',
  'Surgimos en el 2017, como una idea después de un encuentro internacional de personas negras hablando de sus aportes a la sociedad, así que los co-fundadores se sentaron a pensar ¿qué podemos hacer por los jóvenes negros y diversos del Distrito de Aguablanca?.',
  ['Violencia estructural', 'Impedimento de la libre expresión de género y/o orientación sexual', 'Racismo estructural', 'Avance generacional y movilidad social casi nulo en Colombia que mantiene a las personas empobrecidas en el mismo lugar'],
  ['Proyectos y publicaciones en pro de educar a la sociedad en términos de diversidad étnico-racial y sexogenéricos.', 'Visibilización de creaciones y creadores negrxs con el fin de apoyar lo que tienen para decir, entre lo que destacan sus denuncias y sentires frente a sí mismos y otrxs.', 'Exponemos a través del proyecto -Cali, Capital de la resistencia- las motivaciones y acciones de jóvenes negrxs en el marco del paro 2021', 'Proyectos que impactan personas negras diversas del litoral.', 'Creación de espacios seguros para la expresión sexogenérica, de ahí nace Negras, Maricas y Disidentes.', 'Producción de la revista Matamba.'],
  'chapter2-cali',
)

const AT_CASA_CULTURAL: Modal = fichaPerfil(
  'cap2-at-casa-cultural',
  'Casa Cultural El Chontaduro',
  'Asociación Casa cultural El Chontaduro',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761794279/geoImages/gqy5xtw09p0qfta46jr6.webp',
  'Barrio Marroquín III Dg. 26g 9 #72s 32',
  'Oriente de Cali',
  'Pacífico colombiano y sur del valle alto del río Cauca',
  'Empezamos a gestarnos en 1983, aunque nos constituimos legalmente en 1986. Trabajamos por la defensa de los derechos humanos, el cuidado eco-ambiental, a través de la promoción y animación a la lectura y la formación artística de niños, niñas, jóvenes y adultos tomando el arte como estrategia para la formación de personas críticas, autocríticas y comprometidas en la búsqueda de soluciones colectivas a la problemática de su país.',
  ['Desesperanza aprendida', 'Desmembramiento del tejido social', 'Oficinas delincuenciales', 'Fronteras invisibles', 'Muerte prematura de la juventud', 'Borramiento de los afrofeminismos', 'Segregación, marginalización y hacinamiento', 'Microtráfico', 'Falta de espacios públicos', 'Deterioro de los humedales'],
  ['Niñez: fortalecimiento de la identidad, la memoria ancestral, la resignificación de prácticas culturales para sembrar esperanza en el territorio y continuidad en el tejido comunitario. Espacios: Biblioteca, Chonta Mandinga -Capoeira Angola y Laboratorio de audiovisuales.', 'Género: resistencia y reexistencia de las mujeres negras y empobrecidas del oriente de Cali desde apuestas pedagógicas y metodológicas transversalizadas por el afecto, el amor, el cuidado desde un enfoque de género, étnico racial y territorial. Procesos: Escuela Socio-Política Entre Mujeres y el Grupo de Mujeres.', 'Juventudes: dignificación y transformación de realidades de vida en las y los jóvenes negras y diversas social y sexualmente del territorio. Desde la educación y la comunicación populares y alternativas buscamos incentivar la incidencia política. Procesos: Pre-Ices Comunitario Popular Paulo Freire.'],
  'chapter2-cali',
)

const AT_AFRO_YOGA: Modal = fichaPerfil(
  'cap2-at-afro-yoga',
  'Afro Yoga',
  'Alternativa Transformadora Afro Yoga',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp',
  'Encuentros en diferentes lugares',
  'Santiago de Cali',
  'Pacífico Colombiano',
  'Surge en el 2018, como parte de un proceso afrofeminista, para la sanación de las mujeres negras, donde se realizan encuentros de bienestar enfocados en la práctica del Yoga kemético y del Kundalini yoga.',
  ['Violencia de género', 'Desigualdad social', 'Racismo estructural'],
  ['Proceso Repalpitar del útero donde propiciamos espacios de sanación de la violencia sexual con mujeres negras.', 'Trabajo con niñas y jóvenes para sanar y reconocer la violencia de género y cómo se vive.', 'Escuelas afro feministas y antirracistas.', 'Encuentros de bienestar, sanación, yoga, autocuidado y espacios de escucha.'],
  'chapter2-cali',
)

/* ── Galerías de imágenes (portadas de v17 galeriasChapter2) ───────────── */

function galeria(
  id: string,
  highlight: string,
  base: string,
  files: string[],
  descripciones: string[],
  mapId: string,
): Modal {
  return {
    id,
    section: 'capitulo-2',
    variant: 'xl',
    title: 'Galería de imágenes',
    highlight,
    icon: 'gallery',
    body: [
      {
        type: 'carousel',
        id: `${id}-carousel`,
        images: files.map((f, i) => ({
          src: `${base}/${f}`,
          alt: `${highlight} ${i + 1}`,
          description: descripciones[i] ?? '',
        })),
      },
    ],
    trigger: {
      type: 'button',
      icon: 'gallery',
      frame: '2',
      label: 'Galería de imágenes',
      mapId,
    },
  }
}

const GALERIA_SUAREZ: Modal = galeria(
  'cap2-galeria-suarez',
  'Suárez',
  '/assets/modal/chapter-2/galeria/suarez',
  ['suarez1.webp', 'suarez2.webp', 'suarez3.webp', 'suarez4.webp', 'suarez6.webp', 'suarez7.webp'],
  [
    'Tejido de las Alternativas Transformadoras del nodo Suárez, Cauca. Encuentro en la Asociación Cultural Casa del Niño y de la Niña, Villa Rica, Cauca. Marzo de 2023.',
    'Visual del área urbana de Suárez y del río Cauca desde La Toma. Diciembre de 2024.',
    'Taller del Colaboratorio de Cartografias críticas y codiseño territorial. Mirador de La Toma. Suárez, Cauca. Diciembre de 2023.',
    'Taller del Colaboratorio de Narrativas para las Transiciones Mirador de La Toma. Suárez, Cauca. 2024.',
    'Visita a la represa Salvajina. Encuentro de Alternativas Transformadoras. Asnazú. Suárez, Cauca. Noviembre de 2023.',
    'Visita a la Asociación Agroindustrial de Productores Agropecuarios y Mineros Afrodescendientes de Yolombó y Gelima - Asoyogé. La Toma. Suárez, Cauca. Noviembre de 2023.',
  ],
  'chapter2-suarez',
)

const GALERIA_VILLA_RICA: Modal = galeria(
  'cap2-galeria-villa-rica',
  'Villa Rica',
  '/assets/modal/chapter-2/galeria/villa-rica',
  ['villaRica1.webp', 'villaRica2.webp', 'villaRica3.webp', 'villaRica4.webp', 'villaRica5.webp', 'villaRica6.webp'],
  [
    'Finca tradicional Bajíos II. Vereda La Primavera. Villa Rica, Cauca.',
    'Línea de tiempo del territorio de las alternativas transformadoras de Villa Rica. Cali, junio 2023.',
    'Fruto del cacao en cultivos de Villa Rica, Cauca.',
    'Visita a la finca tradicional La Caicedo. Vereda La Caponera. Guachené, Cauca. Al fondo el mayor Robertino Caicedo. Noviembre de 2024.',
    'Primer encuentro de Alternativas Transformadoras del trayecto de diseño de transiciones ecosociales justas en sur del valle alto del río Cauca. Asociación Cultural Casa del Niño y de la Niña, Villa Rica, Cauca. 2023.',
    'Rincón de una finca tradicional en las visitas de caracterización. Guachené, Cauca. 2024.',
  ],
  'chapter2-villa-rica',
)

const GALERIA_CALI: Modal = galeria(
  'cap2-galeria-cali',
  'Oriente de Cali',
  '/assets/modal/chapter-2/galeria/cali',
  ['cali1.webp', 'cali2.webp', 'cali4.webp', 'cali5.webp', 'cali6.webp', 'cali7.webp'],
  [
    'Visita Huerta Madre La Laguna - Red Nativos. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.',
    'Taller Aguas que van, aguas que llegan. Colaboratorio de Cartografías críticas y Codiseño territorial. Asociación Cultural Casa El Chontaduro. Cali, Valle. Febrero, 2025.',
    'Mayora Elena Hinestroza. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.',
    'Taller de Lineas de tiempo. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.',
    'Mayora Edy Serrano. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.',
    'Taller del Colaboratorio de Narrativas para las Transiciones. Universidad del Valle. Cali, Valle. 2024.',
  ],
  'chapter2-cali',
)

/* ── Export ────────────────────────────────────────────────────────────── */

export const CHAPTER2_MODALS: Modal[] = [
  CAP2_INTRO,
  SINTESIS_CALI,
  SINTESIS_VILLA_RICA,
  SINTESIS_SUAREZ,
  GALERIA_SUAREZ,
  GALERIA_VILLA_RICA,
  GALERIA_CALI,
  AT_ASOYOGE,
  AT_GUARDIA_CIMARRONA,
  AT_ASOCOMS,
  AT_ASOMUAFROYO,
  AT_CONSEJO_OVEJAS,
  AT_CMJ,
  AT_PLATAFORMA_JUVENTUDES,
  AT_CASA_NINO,
  AT_UOAFROC,
  AT_TERRITORIO_Y_PAZ,
  AT_ESCUELA_ITINERANTE,
  AT_PALENQUES_JUVENILES,
  AT_RED_NATIVOS,
  AT_RED_MUJERES,
  AT_CHICAS_COMUNICATIVAS,
  AT_MATAMBA,
  AT_CASA_CULTURAL,
  AT_AFRO_YOGA,
]
