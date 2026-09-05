/**
 * MODALES CAPITULO 2 — contenido editorial portado de v17
 * Fuentes: modalsData.jsx ids 27-54
 */

import type { Modal } from '../../types/modal.ts'
import { paragraphs, fichaPerfil } from './_helpers.ts'

/* ── ID 27: Introduction ──────────────────────────────────────────────── */

const CAP2_INTRO: Modal = {
  id: 'cap2-intro',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Capitulo II',
  highlight: 'Redes nodo y entramados territoriales',
  icon: 'presentation',
  body: [
    {
      type: 'paragraph',
      id: 'cap2-intro-highlight',
      text: 'Redes nodo y entramados territoriales: portadores de capacidades y saberes para las transiciones regionales sistemicas',
    },
    ...paragraphs(
      'Las transiciones regionales sistemicas justas surgen como una respuesta integral a las crisis ecologicas y sociales generadas por el modelo de desarrollo desigual dominante centrado en la ocupacion fisica y mono-ontologica de los territorios. Este modelo refuerza una vision unificada del mundo que desmantela los mundos relacionales. En contraposicion, las transiciones promueven una transformacion cultural, economica y politica que reconoce la interdependencia de todos los seres, defendiendo la idea de un pluriverso, es decir, "un mundo donde quepan muchos mundos", fomentando una reconexion de la vida toda.',
      'cap2-intro',
    ),
  ],
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Presentacion',
    mapId: 'chapter2-valle',
  },
}

/* ── ID 31-33: Sintesis territoriales ─────────────────────────────────── */

const SINTESIS_CALI: Modal = {
  id: 'cap2-sintesis-cali',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Sintesis territorial Oriente de Cali',
  highlight: 'Distrito de Aguablanca',
  icon: 'presentation',
  body: paragraphs(
    'Para el caso del Oriente de Cali la sintesis la construimos entre dos grupos. En el primero concebimos este territorio desde el rio Cauca y el oceano Pacifico entre Tumaco y Nuqui. Destacamos las casas sobre pilotes, los tenderos de ropa y las palmeras como parte de la vida en las poblaciones costeras y ribereñas y presentamos las tradiciones, saberes y practicas culturales y artisticas que han llegado a Cali desde nuestros territorios y los de nuestros ancestros a partir de los procesos de migradestierro. Esta primera parte de la sintesis territorial expone tambien como la vision de desarrollo predominante en el modelo de desarrollo regional construido desde Cali y el valle alto del rio Cauca ha producido en parte el desplazamiento a Cali de muchas comunidades pobladoras de la region Pacifica. Estas llegan a Cali en condiciones de vulnerabilidad que se agudiza con la segregacion espacial y el racismo estructural presente en la ciudad.',
    'cap2-sintesis-cali',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Sintesis Cali',
    mapId: 'chapter2-m-oriente-cali',
  },
}

const SINTESIS_VILLA_RICA: Modal = {
  id: 'cap2-sintesis-villa-rica',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Sintesis territorial Villa Rica',
  highlight: 'Villa Rica y Puerto Tejada',
  icon: 'presentation',
  body: paragraphs(
    'Esta sintesis la construimos entre varios integrantes de las alternativas transformadoras de Villa Rica y Puerto Tejada y acogemos en nuestro entorno cercano a los municipios de Caloto, Candelaria, Guachene, Padilla y Santander de Quilichao. Nuestro territorio esta inmerso en las dinamicas de implantacion y permanencia de diferentes formas de extractivismo en el valle alto del rio Cauca y en las resistencias a las versiones de este modelo economico que ha configurado esta zona de la cuenca.',
    'cap2-sintesis-vr',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Sintesis Villa Rica',
    mapId: 'chapter2-m-villa-rica',
  },
}

const SINTESIS_SUAREZ: Modal = {
  id: 'cap2-sintesis-suarez',
  section: 'capitulo-2',
  variant: 'large',
  title: 'Sintesis territorial de Suarez',
  highlight: 'Suarez, Cauca',
  icon: 'presentation',
  body: paragraphs(
    'Esta sintesis territorial la pensamos considerando el lugar central que tiene la cabecera municipal y la comunicacion desde aqui con los consejos comunitarios de Brisas, Asnazu, Portugal, Cuenca Rio Ovejas, Bellavista, Mindala, La Toma y Pureto. Reconocimos la relevancia de los rios Cauca y Ovejas y la represa Salvajina en la estructura de nuestro territorio y en ellos las razones de muchas de nuestras luchas.',
    'cap2-sintesis-sz',
  ),
  trigger: {
    type: 'button',
    icon: 'presentation',
    frame: '1',
    label: 'Sintesis Suarez',
    mapId: 'chapter2-m-suarez',
  },
}

/* ── IDs 34-52: Alternativas Transformadoras (fichaPerfil en _helpers.ts) ── */

const AT_ASOYOGE: Modal = fichaPerfil(
  'cap2-at-asoyoge',
  'Asoyoge',
  'Asociacion de agroindustrial de productos agropecuarios y mineros afrodescendientes',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761185904/geoImages/jx2ox2ihls7j9pv15kbg.webp',
  'Monte Redondo. Suarez, Cauca.',
  'Veredas Yolombo y Gelima.',
  'Suarez, Cauca',
  'Nos juntamos el 10 de enero del 2020 para reivindicar y promover el respeto a los derechos humanos, territoriales, sociales, economicos, culturales, ambientales, politicos y por ser victimas del conflicto armado.',
  ['Cultivos de coca para la produccion de drogas de uso ilicito.', 'Presencia de grupos armados al margen de la ley en el territorio.', 'Titulos mineros no consultados.'],
  ['Implementacion de alternativas para la produccion de familias del territorio.', 'Gestion de formacion academicas para jovenes y adultos.', 'Gestion de proyectos de fortalecimiento de tradiciones culturales en el territorio.'],
  'chapter2-suarez',
)

const AT_GUARDIA_CIMARRONA: Modal = fichaPerfil(
  'cap2-at-guardia-cimarrona',
  'Guardia Cimarrona',
  'Alternativa Transformadora Guardia Cimarrona Suarez, Cauca',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761185272/geoImages/reblala1pv2puebswzmc.webp',
  'Monte Redondo. Suarez, Cauca.',
  'Consejo Comunitario Rio Ovejas. Suarez, Cauca.',
  'Suarez, Cauca',
  'La Guardia Cimarrona se conformo en 2014 para garantizar la defensa, el cuidado y la proteccion del territorio.',
  ['La siembra de coca para produccion de drogas ilicitas.', 'Grupos al margen de la ley en el territorio.', 'Abandono estatal o intervenciones estatales lesivas en el territorio.'],
  ['Capacitar a jovenes que estan consumiendo sustancias psicoactivas.', 'Evitar la presencia de la mineria ilegal en el territorio', 'Evitar la implementacion de cultivo de coca en el territorio.'],
  'chapter2-suarez',
)

const AT_ASOCOMS: Modal = fichaPerfil(
  'cap2-at-asocoms',
  'ASOCOMS',
  'Asociacion de Consejos Comunitarios de Suarez',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186221/geoImages/dh5af9kzy1tdno0awcxo.webp',
  'Suarez, Cauca, Barrio Las Brisas',
  'Consejos comunitarios de La Toma, Asnazu, Benavista, Meseta, Pureto, Mindala, Brisas, Portugal y Cuenca Rio Ovejas',
  'Suarez, Cauca',
  'Somos una organizacion que reune varios consejos de las comunidades negras de Suarez. Nos enfocamos en defender nuestros derechos etno territoriales, implementamos el seguimiento y la ejecucion del Plan de manejo ambiental de la represa La Salvajina.',
  ['Impactos adversos a los pobladores y al territorio derivados de la construccion, operacion y mantenimiento de la represa La Salvajina', 'Intereses de los sectores mineros', 'Presencia de grupos armados al margen de la ley'],
  ['Cuidado y defensa de los rios Cauca y Ovejas y de lo publico: el rio, el aire y madre tierra', 'Participacion en el diseno, implementacion y seguimiento del Plan de manejo de la represa La Salvajina', 'Impulso a transformaciones economicas productivas'],
  'chapter2-suarez',
)

const AT_PLATAFORMA_JUVENTUDES: Modal = fichaPerfil(
  'cap2-at-plataforma-juventudes',
  'Plataforma de Juventudes Suarez',
  'Plataforma de Juventudes Suarez, Cauca',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186274/geoImages/nlbvtqpoldaecg2ym9ls.webp',
  'Barrio Los Almendros. Suarez, Cauca.',
  'Zona urbana Suarez, Cauca.',
  'Suarez, Cauca',
  'Somos jovenes del municipio de Suarez que desarrollan procesos juveniles basados en la participacion por medio del reconocimiento de nuestras diferencias, la creacion y seguimiento de agendas, control social y veeduria de recursos publicos locales.',
  ['Baja inclusion de los jovenes en la toma de decisiones y planes del municipio.', 'Problemas en la ejecucion de los recursos publicos.', 'Pocos espacios de expresion y comunicacion juvenil.'],
  ['Participamos en el diseno y desarrollo de Agendas Municipales, Distritales, Departamentales y Nacionales de Juventud.', 'Ejercemos veeduria y control social a los planes de desarrollo, politicas publicas de juventud.'],
  'chapter2-suarez',
)

const AT_CASA_NINO: Modal = fichaPerfil(
  'cap2-at-casa-nino',
  'Casa del Nino y de la Nina',
  'Asociacion cultural Casa del Nino y de la Nina',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186701/geoImages/pyhbpjnlbhiezwueuzxb.webp',
  'Villa Rica, via Puerto Tejada. Vereda Agua Azul',
  'Centro, norte Tejada y Guachene',
  'Norte del Cauca',
  'La asociacion surgio en el ano 1970, motivada a plantear una solucion a la desintegracion familiar que permeaba el territorio y que afectaba directamente a la niñez.',
  ['Monocultivo de la cana', 'Desintegracion familiar y social', 'Pandillas', 'Trafico y consumo de drogas ilicitos', 'Pocas redes de cuidado para la niñez'],
  ['Creamos procesos organizativos que luchan por garantizar los derechos humanos de manera intergeneracional.', 'Defendemos las semillas tradicionales en todo el norte del Cauca.', 'Ejecutamos proyectos con diferentes poblaciones: niñez, juventud y adulto mayor.'],
  'chapter2-villa-rica',
)

const AT_UOAFROC: Modal = fichaPerfil(
  'cap2-at-uoafroc',
  'UOAFROC',
  'Unidad de organizaciones afrocaucanas',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761187126/geoImages/ki5sktr8jnwo2oowkpqt.webp',
  'Cra. 26 #9-18, Puerto Tejada, Barrio Santa Elena',
  'Departamento del Cauca',
  'Departamento del Cauca',
  'Surgimos en 2003, con la finalidad de resignificar los proyectos educativos desde la educacion y la etnografia para la generacion de autonomia territorial en el tema de la seguridad alimentaria.',
  ['Fortalecimiento de la finca tradicional para la soberania alimentaria', 'Conflicto Armado', 'Contaminacion por fumigacion con glifosato en el monocultivo de cana de azucar'],
  ['Companias de formacion en el tema de resolucion de conflictos', 'Acompanamiento a los pequenos agricultores en la transformacion de la tierra'],
  'chapter2-villa-rica',
)

const AT_TERRITORIO_Y_PAZ: Modal = fichaPerfil(
  'cap2-at-territorio-paz',
  'Territorio y Paz',
  'Consejo comunitario Territorio y Paz',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761187204/geoImages/to8dj0cmmtlzlztkvqr7.webp',
  'Vereda Chalo, Villa Rica',
  'Vereda Chalo, Villa Rica',
  'Villa Rica',
  'Surgimos en 2007, a partir de la necesidad de conformar el primer consejo comunitario en Villa Rica, con la finalidad de defender los intereses de la comunidad afro.',
  ['Grupos armados al margen de la ley', 'Documentacion no consultada antes de hacer consultas previas con la comunidad', 'Venta para la extraccion de grandes cantidades de arcillas', 'Poco reconocimiento de la existencia del territorio por parte de los empresarios'],
  ['Capacitacion a la comunidad sobre la Ley 70 de 1993', 'Exigir a las empresas de la zona franca para que hagan consulta previa', 'Acompanamiento a la Mesa Municipal de Tierra', 'Potenciar los proyectos etnoeducativos y la etno granja como alternativa de seguridad alimentaria'],
  'chapter2-villa-rica',
)

const AT_ESCUELA_ITINERANTE: Modal = fichaPerfil(
  'cap2-at-escuela-itinerante',
  'Escuela Itinerante Casilda Cundumi',
  'Alternativa Transformadora Escuela Itinerante Casilda Cundumi',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761186657/geoImages/wwd81a1kiqgrxi4fra4v.webp',
  'Villa Rica, Puerto Tejada, Padilla, Miranda, Guachene y Santander de Quilichao',
  'Zona plana del norte del Cauca',
  'Norte del Cauca',
  'La escuela surgo en 2011, con el fin de defender y crear estrategias para persistir en el territorio, a causa del deterioro constante que se estaba generando por los negocios extractivistas del monocultivo de la cana de azucar y la mineria de arcilla.',
  ['Descomposicion del tejido social', 'Grupos al margen de la ley', 'Monopolio de la cana', 'Contaminacion del medio ambiente y deterioro del territorio', 'Contaminacion de los rios', 'Acaparamiento de la tierra'],
  ['Recuperacion de semillas', 'Recuperacion de la finca tradicional por medio de capacitaciones y ejecucion de proyectos', 'Alianza y juntanza con otras organizaciones', 'Construccion de organizaciones y exigibilidad del derecho', 'Establecer un corredor afro-alimentario'],
  'chapter2-villa-rica',
)

const AT_PALENQUES_JUVENILES: Modal = fichaPerfil(
  'cap2-at-palenques-juveniles',
  'Palenques Juveniles',
  'Colectivo socio-juvenil huellas',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761187057/geoImages/dtarbfe6sduopq1q4xca.webp',
  'Villa Rica, Cauca, Barrio San Fernando',
  'Villa Rica y Puerto Tejada',
  'Norte del Cauca',
  'Somos una organizacion juvenil que transforma, con una vision inclusiva, el liderazgo, la innovacion y el trabajo comunitario en el norte de Cauca.',
  ['Falta de oportunidades para la juventud', 'Multiples violencias contra la niñez y la juventud', 'Debilitamiento de los vinculos en el territorio'],
  ['Promovemos el arte, el deporte y el acceso a oportunidades para la niñez, la juventud y la comunidad', 'Fortalecemos liderazgos en Derechos Humanos, genero y diversidad cultural', 'Promovemos un ambiente sostenible desde el ambiente, la paz, la tecnologia y la economia'],
  'chapter2-villa-rica',
)

const AT_RED_NATIVOS: Modal = fichaPerfil(
  'cap2-at-red-nativos',
  'Red Nativos',
  'Huerta Madre La Laguna',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761792935/geoImages/lnyyorgnj7zmdzzi93p1.webp',
  'Dg. 26g 4, Barrio Marroquin III',
  'Oriente de Cali',
  'Santiago de Cali',
  'Surgimos desde 1990, a raiz de varios desafios dentro del territorio. Entre ellos, los asentamientos de casas informales, las zonas verdes usadas como basureros y escombreras y la transformacion de estos en espacios productivos.',
  ['Asentamientos de casas informales', 'Zonas verdes afectadas como basureros y escombreras', 'Nin vulnerable en condicion de abandono', 'Juventud adicta sin orientacion', 'Necesidad de acceso a alimentos sanos y regeneracion de la tierra'],
  ['Educacion en la vivencia sobre residuos y la transformacion de recursos naturales', 'Educacion basada en acciones correctivas con principios agroecologicos', 'Semilleros con los ninos y siembra de arboles', 'Creacion de huerta', 'Practicas agroecologicas de cultivo de alimentos sanos'],
  'chapter2-cali',
)

const AT_RED_MUJERES: Modal = fichaPerfil(
  'cap2-at-red-mujeres',
  'Red de Mujeres y Organizaciones del Oriente',
  'Alternativa Transformadora Red de Mujeres y Organizaciones del Oriente',
  '/assets/modal/chapter-2/mujeresDelOriente.webp',
  'Diferentes casas',
  'Oriente de Cali',
  'Pacifico Colombiano',
  'Surgimos en el 2000 como iniciativa de mujeres provenientes del litoral Pacifico que nos fuimos encontrando en la Casa Cultural El Chontaduro para desarrollar las juntanzas de territorio.',
  ['Desigualdad', 'Exclusion', 'Injusticias', 'Marginalizacion'],
  ['Creacion de procesos de economias solidarias', 'Fondo comunitario Maria Fenix'],
  'chapter2-cali',
)

const AT_CHICAS_COMUNICATIVAS: Modal = fichaPerfil(
  'cap2-at-chicas-comunicativas',
  'Chicas Comunicativas',
  'Alternativa Transformadora Chicas Comunicativas',
  '/assets/modal/chapter-2/chicasComunicativas.webp',
  'Biblioteca Rigoberta Menchu',
  'Comuna 15',
  'Oriente de Cali',
  'Nacemos en el 2018 como un proceso conformado por jovenes mujeres que tenemos entre 14 y 15 años y habitamos en la comuna 15, en el barrio Brisas de Las Palmas en Cali.',
  ['Desigualdad entre hombres y mujeres', 'Violencia de genero', 'Falta de oportunidades para las mujeres', 'Falta de representatividad de las mujeres en lugares de incidencia politica'],
  ['Comunicacion asertiva con base en los derechos', 'Contextualizacion de las diferentes problemáticas del sector', 'Murales con mensajes para la comunidad', 'Jornadas informativas'],
  'chapter2-cali',
)

const AT_MATAMBA: Modal = fichaPerfil(
  'cap2-at-matamba',
  'Matamba Fundacion',
  'Alternativa Transformadora Matamba fundacion',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761794790/geoImages/mecisufjjucxdzzalslg.webp',
  'Comuna 3',
  'Barrio San Cayetano',
  'Comunas 3, 4 y 9 de Cali',
  'Surgimos en el 2017, como una idea despues de un encuentro internacional de personas negras hablando de sus aportes a la sociedad.',
  ['Violencia estructural', 'Impedimento de la libre expresion de genero y/o orientacion sexual', 'Racismo estructural', 'Avance generacional y movilidad social casi nulo en Colombia'],
  ['Proyectos y publicaciones en pro de educar a la sociedad en terminos de diversidad etno-racial y sexogenéricos.', 'Visibilizacion de creaciones y creadores negrxs', 'Produccion de la revista Matamba'],
  'chapter2-cali',
)

const AT_CASA_CULTURAL: Modal = fichaPerfil(
  'cap2-at-casa-cultural',
  'Casa Cultural El Chontaduro',
  'Asociacion Casa cultural El Chontaduro',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761794279/geoImages/gqy5xtw09p0qfta46jr6.webp',
  'Barrio Marroquin III Dg. 26g 9 #72s 32',
  'Oriente de Cali',
  'Pacifico colombiano y sur del valle alto del rio Cauca',
  'Empezamos a gestarnos en 1983, aunque nos constituimos legalmente en 1986. Trabajamos por la defensa de los derechos humanos, el cuidado eco-ambiental, a traves de la promocion y animacion a la lectura y la formacion artistica.',
  ['Desesperanza aprendida', 'Desmembramiento del tejido social', 'Fronteras invisibles', 'Muerte prematura de la juventud', 'Segregacion, marginalizacion y hacinamiento', 'Deterioro de los humedales'],
  ['Ninez: fortalecimiento de la identidad, la memoria ancestral', 'Genero: resistencia y reexistencia de las mujeres negras', 'Juventudes: dignificacion y transformacion de realidades de vida'],
  'chapter2-cali',
)

const AT_AFRO_YOGA: Modal = fichaPerfil(
  'cap2-at-afro-yoga',
  'Afro Yoga',
  'Alternativa Transformadora Afro Yoga',
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp',
  'Encuentros en diferentes lugares',
  'Santiago de Cali',
  'Pacifico Colombiano',
  'Surge en el 2018, como parte de un proceso afrofeminista, para la sanacion de las mujeres negras, donde se realizan encuentros de bienestar enfocados en la practica del Yoga kemético y del Kundalini yoga.',
  ['Violencia de genero', 'Desigualdad social', 'Racismo estructural'],
  ['Proceso Repalpitar del utero donde propiciamos espacios de sanacion', 'Trabajo con niñas y jovenes para sanar y reconocer la violencia de genero', 'Escuelas afro feministas y antirracistas', 'Encuentros de bienestar, sanacion, yoga, autocuidado'],
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
    variant: 'large',
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
