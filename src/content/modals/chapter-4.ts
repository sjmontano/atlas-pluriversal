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

const CAP4_PRESENTACION_ASOYOGE: Modal = {
  id: 'cap4-presentacion-asoyoge',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Centro agropecuario ASOYOGE',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-asoyoge-loc', level: 2, text: 'Vereda Gelima, Consejo de comunidades negras Cuenca Río Ovejas. Suárez, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p01', text: 'Arraigo, retos y aspiraciones: han trabajado desde el 2011 (hace 14 años) en construcción y consolidación del proyecto comunitario. Infraestructura comunitaria diseñada para agregar valor a la producción campesina y evitar la intermediación desleal. Perteneciente al consejo comunitario de comunidades negras Cuenca Río Ovejas. Sueñan con generar empleo para 30 personas y fortalecer el circuito productivo local y la soberanía alimentaria.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p02', text: 'Cultivos: tiene algunos sembrados de plátano y frijoles pero no cultivan para producir dado que el proyecto compra los cultivos de plátano y caña panelera para ser transformados. Por lo que se centra en la transformación, más no en la producción.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p03', text: 'Rotación: no presenta.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p04', text: 'Asociación: no presenta.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p05', text: 'Animales: no presenta.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p06', text: 'Fauna silvestre: posee una alta biodiversidad de aves, insectos, mamíferos y polinizadores en el entorno circundante.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p07', text: 'Disponibilidad y uso del agua: cuentan agua de acueducto veredal, sin embargo, el agua no es potable.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p08', text: 'Conservación de agua en el sistema: tiene una franja de bosque y barreras vivas conformadas por árboles como guamo, nacedero, matarratón, entre otras, que permiten conservar el agua en la cuenca.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p09', text: 'Saberes y conocimientos compartidos: realizan consultas técnicas a jóvenes y emprendedores, y reciben apoyo institucional de organizaciones como el SENA en producción agropecuaria.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p10', text: 'Prácticas culturales: adaptación de saberes culinarios a procesos semi-industriales sin perder la identidad local. Como formas de trabajo colectivo mantienen la mano cambiada y trabajan juntos para realizar jornadas de limpieza. Participan en ferias y eventos comunitarios.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: generación de 6 empleos permanentes y 6 temporales. Producen y transforman harina de plátano y contribuyen a la investigación colectiva de especies locales. Cuentan con una planta para producir abono, ayudando a darle un uso a los residuos vegetales generados. Su labor permite fortalecer el circuito productivo local y mantener un comercio justo. Venden 900 bolsas de harina de plátano al mes al ICBF de Mindala y comercializan sus productos en las ferias y mercados locales.' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p12', text: 'Transformaciones productivas: Producción de Harina de Plátano y Panela. Elaboración de abonos orgánicos. Marca "Zambianzuto" (Frutos Nuestros).' },
    { type: 'paragraph', id: 'cap4-presentacion-asoyoge-p13', text: 'Amenazas: Sostenibilidad financiera, mantenimiento de maquinaria, robos, poca producción, conflicto armado y minería cercana.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-asoyoge' },
}

/* ── cap4-presentacion-el-buhido ──────────────────────────────────────── */

const CAP4_PRESENTACION_EL_BUHIDO: Modal = {
  id: 'cap4-presentacion-el-buhido',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Finca El Buhido',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-el-buhido-loc', level: 2, text: 'Yolombo, Consejo de comunidades negras Cuenca Río Ovejas. Suárez, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p01', text: 'Arraigo, retos y aspiraciones: espacio dedicado a la conservación de la biodiversidad y el respeto por los ciclos naturales. Con más de 25 años de cultivo en el terreno, su finca está ubicada en el área perteneciente al consejo de comunidades negras Cuenca Río Ovejas. Su sueño es seguir sembrando y criando más animales de manera que la finca prospere.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p02', text: 'Cultivos: se compone de aproximadamente 26 cultivos como: achiote, aguacate, banano, cacao, café, caimo, caña panelera, chirimoya, frijol, guama, guanábana, guayaba, limón tahití, madroño, maíz, mandarina, mango, maracuyá, naranja, papaya, piña, plátano, yuca, zapallo, zapote, pimiento, ají. Tienen plantas ornamentales como salvia gerania, etc. Alelopáticas como oro azul, aji, limon, babosa. etc. Y medicinales como pipilongo, sábila, matarratón, pringamoza, hierbamora, paico, oreganon, ortiguita, salvia, gallinaza, hierbabuena, limoncillo, anamú, nacedero, palma china, ruda, acetaminofén y oro azul.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p03', text: 'Rotación: maíz, café, aguacate, banano, plátano.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p04', text: 'Asociación: café y frutales, guamo y aguacate.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p05', text: 'Animales: gallinas ponedoras, de patio y patos.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p06', text: 'Fauna silvestre: en el entorno está presente fauna como ranas, sapos, azulejos, carpintero, cucarachero, aguilucho, armadillo, ardillas. Polinizadores como abejas, abejorros, ardillas, avispas, colibríes, escarabajos, mariposas, monos, moscas, murciélagos, polillas, reptiles como culebra candillla y culebra petacona.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p07', text: 'Disponibilidad y uso del agua: cuentan con acueducto comunitario de nacimiento, y con un pozo séptico para sus aguas residuales.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p08', text: 'Conservación de agua en el sistema: a pesar de no contar con una fuente de agua o drenaje hídrico cercano, la finca puede considerarse como un bosque protector de las fuentes hídricas al tener una gran cobertura vegetal en diversos estratos. Tiene especies como nacedero, matarratón, guamo y otros de gran envergadura que retienen el agua del subsuelo.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p09', text: 'Saberes y conocimientos compartidos: en los espacios comunitarios ha compartido sus conocimientos sobre formas de cultivar, cuidar el suelo y cosechar.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p10', text: 'Prácticas culturales: siembra y cosecha regida por fases lunares, menguante principalmente, para asegurar calidad de madera y frutos. Participa de las ferias de la vereda. Realiza control manual de las plagas y enfermedades, a la vez que emplea plantas alelopáticas como el ají.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: suple los alimentos básicos de la canasta familiar a 8 personas, comercializa los excedentes de manera directa en la plaza de mercado o con los vecinos. Posee una amplia diversidad de cultivos presentes y conserva cultivos ancestrales que sostienen la gastronomía tradicional. Rescate de sabores y especies no comerciales que enriquecen la dieta local. Producen panela y harina aportando a la alimentación local. Realiza venta de huevos de sus gallinas campesinas.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p12', text: 'Transformaciones productivas: transforman la caña a panela y el plátano en harina.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-buhido-p13', text: 'Amenazas: en ocasiones se presentan cierres en las vías por el conflicto armado latente, lo que impide la comercialización de su cosecha. Hay una baja rentabilidad de la finca porque compran muy barato los productos. En temporada de lluvias intensas los vendavales afectan la infraestructura de la finca. No hay nadie en la familia que tenga interés por seguir la tradición.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-el-buhido' },
}

/* ── cap4-presentacion-bosque-comestible ──────────────────────────────── */

const CAP4_PRESENTACION_BOSQUE_COMESTIBLE: Modal = {
  id: 'cap4-presentacion-bosque-comestible',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Bosque comestible',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-bosque-comestible-loc', level: 2, text: 'Laguna El Pondaje, barrio Marroquin III. Cali, Valle del Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p01', text: 'Arraigo, retos y aspiraciones: El colectivo lleva aproximadamente 10 años con el proyecto de recuperación ecológica en esta zona urbana altamente marginalizada, transformando un espacio degradado por escombros y basuras arrojadas al humedal, en un aula viva y un ejemplo de resiliencia. Su sueño es ampliar el bosque comestible alrededor de todo el humedal y extender este a todo el oriente de Cali generando un corredor ecológico. Este proceso ha sido apoyado por organizaciones como el SENA, la fundacion Maningua, la Asociación Casa Cultural El Chontaduro y Red Nativos.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p02', text: 'Cultivos: cuentan con plantas como aguacate, limón, plátano, guayaba, mandarina, chirimoya, pitanga, mango, papaya, mamey, entre otros.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p03', text: 'Rotación: no realizan rotación de cultivos puesto que pretenden generar un bosque comestible en donde todos las plantas se encuentren integradas y se de un mutualismo entre estas.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p04', text: 'Asociación: todas las plantas se encuentran asociadas en los diferentes estratos del bosque.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p05', text: 'Animales: no presenta.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p06', text: 'Fauna silvestre: habitan en el área animales como zarigüeyas, iguanas, loros, aguiluchos, carpinteros, abejas, mariposas, colibríes, avispas, murciélagos entre otros.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p07', text: 'Disponibilidad y uso del agua: cuentan con agua potable para el riego de los cultivos en la zona de la huerta madre la laguna. El resto de huertas ubicadas de forma paralela a la franja de protección de 30 metros del humedal El Pondaje, no cuentan con acueducto, por lo que dependen de la comunidad para que les brinde agua desde sus hogares para el riego de las plantas. El agua del humedal no es apta para el riego de los cultivos por sus altos niveles de contaminación y la presencia de metales pesados. Esperan aprovechar el agua del humedal para el riego de las huertas, cuando este se descontamine.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p08', text: 'Conservación de agua en el sistema: esperan ampliar el bosque comestible alrededor del humedal para que actúe como área de respaldo. Buscan extender este a todo el oriente de Cali hasta llegar a la autopista Simón Bolívar.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p09', text: 'Saberes y conocimientos compartidos: Como prácticas de transmisión de conocimientos a jóvenes y niños, tienen talleres de inteligencia ambiental, germinación en vivo y enseñanzas sobre cosecha responsable. Comparten sus experiencias con las huertas urbanas y prácticas de siembra. Se han transmitido conocimientos como la cosecha responsable, el cuidado de especies nativas y la preparación de abonos orgánicos.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p10', text: 'Prácticas culturales: como eventos culturales y lúdicos, realizan ollas comunitarias, pequeños festivales y actividades para que los niños aprendan sobre agricultura y huertas urbanas. Como formas de trabajo colectivo se realizan jornadas de siembra y mingas.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: producción destinada a ollas comunitarias para combatir el hambre barrial. Realizan jornadas de siembra y de educación ambiental al consumidor urbano. Su propósito principal es contribuir a la soberanía alimentaria en el contexto urbano y regenerar ecológicamente esta zona del humedal altamente degradada, mientras se recuperan especies nativas que permitan transformar la zona en un bosque comestible. Realizan conservación e intercambio de semillas de frutales, hortalizas y otras especies, con otros procesos de agricultura comunitaria.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p12', text: 'Transformaciones productivas: no hay.' },
    { type: 'paragraph', id: 'cap4-presentacion-bosque-comestible-p13', text: 'Amenazas: contaminación urbana, inseguridad en la zona, falta de mayor comprensión del concepto del bosque comestible en la comunidad y presión por la expansión de asentamientos informales.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-bosque-comestible' },
}

/* ── cap4-presentacion-los-bajios ─────────────────────────────────────── */

const CAP4_PRESENTACION_LOS_BAJIOS: Modal = {
  id: 'cap4-presentacion-los-bajios',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Finca Los Bajíos',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-los-bajios-loc', level: 2, text: 'Vereda La Primavera. Villa Rica, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p01', text: 'Arraigo, retos y aspiraciones: finca ubicada en una zona de alta presión ambiental. El propietario mantiene la vocación agrícola como resistencia frente a la minería de arcilla y la agroindustria de la caña de azúcar, esta fue la herencia de su madre, una incansable trabajadora de la tierra.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p02', text: 'Cultivos: produce más de 30 cultivos tradicionales como naranja, limón tahití, limón pajarito, limón mandarino, guayaba pera, mandarina, maíz, mango tommy, plátano, plátano cachaco, cilantro, chontaduro, cacao, cebolla larga, achiote, naranja, madroño, anamú, arazá, badea, teca, yuca, cimarrón, árbol de pan, habichuela, carambolo, zapote, papaya, tomate, guanábana, melón, granadilla hueso, pomarroso, ciruelo, espinaca, caucho, frijol cacha, entre otros, abasteciendo rápidamente mercados locales.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p03', text: 'Rotación: no se realiza rotación de cultivos dado que todos los productos se cultivan de manera integrada, priorizando la biodiversidad y el mutualismo.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p04', text: 'Asociación: plátano y cacao.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p05', text: 'Animales: no hay.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p06', text: 'Fauna silvestre: zarigüellas, serpientes, petacona, armadillos, lagartijas, abejas, avispas, ranas, arañas, coleópteros, entre otros.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p07', text: 'Disponibilidad y uso del agua: no cuenta con acueducto y alcantarillado dado que no viven en la finca. Disponen de un aljibe para extraer agua subterránea, sin embargo, este se ve supeditado al lago de minería de arcilla y las bombas de los ingenios que absorben y acaparan el agua, afectando el nivel freático. En temporada de sequía, utiliza el agua del lago de minería contiguo a su finca para regar sus cultivos.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p08', text: 'Conservación de agua en el sistema: uso intensivo de "hojarasca de árboles" como cobertura para retener humedad, vital debido al drenaje del nivel freático causado por lagos mineros vecinos. Amplia cobertura de árboles que actúan como barrera protectora contra la evaporación causada por el sol y disminuyen la temperatura de la finca generando un microclima.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p09', text: 'Saberes y conocimientos compartidos: su madre le compartió los conocimientos sobre agricultura, este ha tratado transmitir a sus hijos sus saberes, sin embargo, en el futuro estos no desean continuar con el cuidado de la finca.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p10', text: 'Prácticas culturales: se realiza control manual de plagas y enfermedades en las plantas, principalmente para la enfermedad Escoba e Bruja, que afecta al cultivo de cacao y daña sus frutos. Se realizan biopreparados y se emplean plantas alelopáticas para el control de insectos y plantas perjudiciales. A su vez se cultiva y cosecha con los ciclos de la luna.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: abastece mercados locales con alimentos frescos de ciclo corto, reduciendo la dependencia alimentaria del municipio. A su vez, hacen resistencia territorial frente a la minería de arcilla que está ocupando los pocos suelos disponibles para la agricultura tradicional.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p12', text: 'Transformaciones productivas: realizan la transformación del cacao en chocolate.' },
    { type: 'paragraph', id: 'cap4-presentacion-los-bajios-p13', text: 'Amenazas: los lagos de minería adyacentes actúan como chupadores de agua, secando el suelo productivo y el aljibe de la finca al profundizar el nivel freático. Las vías de ingreso a la finca son de difícil acceso, en época de lluvias estas tienden a estar inundadas y se convierten en barrizales que impiden el paso de vehículos. La caña a su vez genera una presión en la finca por el acaparamiento de tierras (especialmente fincas de tradición ancestral) y por los impactos negativos generados con los químicos empleados en el cultivo, que afectan la flora y fauna en la finca. La falta de relevo se presenta como una preocupación por la incertidumbre con el futuro de la finca.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-los-bajios' },
}

/* ── cap4-presentacion-el-paso ────────────────────────────────────────── */

const CAP4_PRESENTACION_EL_PASO: Modal = {
  id: 'cap4-presentacion-el-paso',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Finca El Paso',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-el-paso-loc', level: 2, text: 'Vereda Dos Aguas, Consejo de comunidades negras Cuenca Río Ovejas. Suárez, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p01', text: 'Arraigo, retos y aspiraciones: Es el hogar de una familia extensa (10 personas). Han cultivado por más de 65 años en el terreno. Es un refugio de biodiversidad en medio de un contexto complejo. Sueñan con “tener de todo en la finca” y que esta sea auto-sostenible. En el futuro la finca continuará de hijos a nietos de quien posee el título de propiedad.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p02', text: 'Cultivos: tiene una gran diversidad de cultivos con más de 30 especies que incluyen: achiote, aguacate, ahuyama, banano, cacao, café, caña panelera, carambola, chirimoya, cilantro, cimarrón, ciruela, estropajo, guama, guanábana, guayaba, limón tahití, lulo, madroño, maíz, mandarina, mango, maracuyá, noni, papaya, piña, plátano, tomate, zapallo, zapote, mambo y badea. Cuentan con plantas medicinales como pipilongo, sábila, matarratón, hierbamora, paico, albahaca morada, ortiga, salvia, albahaca blanca, hierbabuena, llantén, martingal, prontoalivio, eucalipto, limoncillo, albahaca negra, anamú, nacedero, gavilana, guanábano, jengibre, citronela, poleo y ruda.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p03', text: 'Rotación: maiz y cafe' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p04', text: 'Asociación: maíz y café para el aprovechamiento del nitrógeno.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p05', text: 'Animales: tienen vacas, caballos, cerdos, gallinas, conejos y ganzos.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p06', text: 'Fauna silvestre: nutrias, lagartijas, abejas, avispas, arañas, ranas, sapos, entre otras.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p07', text: 'Disponibilidad y uso del agua: cuentan con acueducto comunitario y pozo séptico para depositar las aguas residuales producidas en el hogar, el río Ovejas corre de manera paralela al predio por lo que tienen una gran disponibilidad de agua.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p08', text: 'Conservación de agua en el sistema: la finca cuenta con una gran cantidad de área ocupada por guaduales y zonas en transición cubiertas con árboles como cachimbos, jigua, matarratón y nacedero, que conservan la humedad del suelo y protegen el suelo de la erosión hídrica del río Ovejas. Conservan la hojarasca en el suelo. La finca forma una franja de protección del río con otras fincas que están alrededor.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p09', text: 'Saberes y conocimientos compartidos: transmiten conocimientos ancestrales como tiempos de siembra, fases de la luna y tiempos de las cosechas. También, poseen conocimientos sobre remedios naturales y medicina tradicional que no han sido transmitidos por el recelo hacia la extracción de conocimientos del territorio.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p10', text: 'Prácticas culturales: es una farmacia viva al servicio de todos, usan la diversidad botánica para medicina preventiva y curativa de la familia y la comunidad. Practican diferentes formas de trabajo colectivo como la minga, mano cambiada y aparcería. Continúan realizando prácticas tradicionales como la siembra y cosecha con las fases de la luna. Emplean plantas alelopáticas como el ají para el control de plagas y enfermedades.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: autosuficiencia casi total. Modelo de agricultura regenerativa y resiliente. Alimenta a más de 25 personas y aportan al mercado de Suarez. Transforman y comercializan queso, yogurt, kumis y panela. Cuenta con bancos de semillas de algunas de sus especies como maíz, café y aguacate.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p12', text: 'Transformaciones productivas: queso, yogurt, kumis y panela que comercializa entre vecinos.' },
    { type: 'paragraph', id: 'cap4-presentacion-el-paso-p13', text: 'Amenazas: la exploración minera ha dejado socavones físicos. Presencia de actores armados y químicos de la fumigación de cultivos ilícitos arrastrados por el viento que afectan los cultivos de la finca. Temen por su baja rentabilidad pues están retomando las actividades de siembra al interior de la finca. El verano intenso ocasiona una sequía que no permite que algunos cultivos se den. Al estar ubicados de forma contigua al río, se ven supeditados a las inundaciones que se generan cuando este crece. Algunos de sus cultivos presentan plagas y enfermedades, como por ejemplo el aguacate que tiene antracnosis y pasador.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-el-paso' },
}

/* ── cap4-presentacion-las-mercedes ───────────────────────────────────── */

const CAP4_PRESENTACION_LAS_MERCEDES: Modal = {
  id: 'cap4-presentacion-las-mercedes',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Finca Las Mercedes',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-las-mercedes-loc', level: 2, text: 'Vereda Gelima, Consejo de comunidades negras Cuenca Río Ovejas. Suárez, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p01', text: 'Arraigo, retos y aspiraciones: finca de ladera, de tradición familiar de hace más de 50 años, caracterizada por un manejo intensivo del espacio y la diversificación de las prácticas productivas para el sustento familiar. Localizada en el territorio del consejo de comunidades negras Cuenca Río Ovejas. Su sueño es que la finca siga produciendo mucho para que sustente a la familia, espera que en el futuro esta siga en manos de sus hijos.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p02', text: 'Cultivos: alberga aproximadamente 29 cultivos tales como: aguacate, arazá, banano, cacao, café, cimarrón, frijol, guama, guanábana, guayaba, habichuela, limón tahití y otras especies, madroño, maíz, mandarina, manga, mango, maracuyá, naranja, cebolla, papaya, perejil, piña, plátano, yuca, zapallo, zapote, patata, cidra papa. A su vez, tiene plantas ornamentales como veranera, lino, croto, anturio, resucitado, jazmin, cadios, veranera, caracucho, orquídeas, moamachos, rosas. Alelopáticas como el ají. Y medicinales como el pipilongo, sábila, matarratón, pringamoza, hierbamora, paico, oreganon, ortiguita, salvia, gallinaza, hierbabuena, limoncillo, anamú, nacedero, palma china, ruda, acetaminofén y oro azul.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p03', text: 'Rotación: maíz, cacao, café y plátano.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p04', text: 'Asociación: cacao, café y plátano para sombra y hortalizas para el control de plagas.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p05', text: 'Animales: tiene cerdos, gallinas ponedoras y de patio.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p06', text: 'Fauna silvestre: está presente una diversidad de fauna silvestre como lagartijas, sapos, mariposas, aves (azulejos, miria, gorrión, perdiz, aguiluchos, cucarachero, bichofue, loro, carpintero), armadillos, guatines, ardillas, zorros. Y polinizadores como abejas, abejorros, ardillas, avispas, colibríes, mariposas, moscas, murciélagos, polillas y lagartijas.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p07', text: 'Disponibilidad y uso del agua: cuenta con una quebrada en la parte baja del predio, sin embargo, esta se encuentra contaminada con aguas residuales. En la finca cuenta con acueducto comunal, de un nacimiento de agua, pero no con alcantarillado, depositan las aguas residuales en la quebrada.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p08', text: 'Conservación de agua en el sistema: tiene nacedero que actúa como barrera del lindero, pero a su vez como un protector de las fuentes de agua ya que conserva y atrae la humedad en el suelo. Protege el bosque y los guaduales que están contiguos a su finca para que se conserve el agua de la quebrada.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p09', text: 'Saberes y conocimientos compartidos: principalmente a su hijo y a organizaciones como Asomafroyo y Asoyoge, con quienes ha compartido sus conocimientos de las plantas, sus usos y formas de cultivar.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p10', text: 'Prácticas culturales: manejo de suelos de ladera mediante coberturas vegetales para evitar erosión y deslizamientos. Conservación de prácticas agrícolas ancestrales como la siembra con las fases de la luna dependiendo del tipo de cultivo: menguante para el maíz y luna nueva y llena para la yuca. Participan en las fiestas a la Virgen del Carmen en agosto.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: suple una red de alimentación de 5 familias, permitiendo su seguridad alimentaria al contar con granos, frutas y proteína durante todo el año. Garantiza la soberanía alimentaria al mantener sus prácticas tradicionales vivas, conserva una gran diversidad de plantas claves en la memoria agrícola, gastronómica y medicinal de su territorio. Su finca es in situ un banco de semillas, pues las recoge, las guarda y regala a otros productores. Comercializa de forma directa con sus vecinos huevos de gallina.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p12', text: 'Transformaciones productivas: procesa el café para venderlo ya listo para su consumo, hace harina de plátano y también envueltos para su venta.' },
    { type: 'paragraph', id: 'cap4-presentacion-las-mercedes-p13', text: 'Amenazas: como amenazas externas está la ubicación de la finca en zona de riesgo por conflicto armado y presencia de cultivos de uso ilícito que puede llegar a generar una afectación a sus cultivos por la fumigación con glifosato. También, se ha presentado robos de herramientas. Como amenazas internas están los deslizamientos que se dan en su finca por tener una elevada pendiente en su terreno y a la vez por la sequía que genera mayor requerimiento de riego de los suelos.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-las-mercedes' },
}

/* ── cap4-presentacion-la-virginia ────────────────────────────────────── */

const CAP4_PRESENTACION_LA_VIRGINIA: Modal = {
  id: 'cap4-presentacion-la-virginia',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Finca La Virginia',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-la-virginia-loc', level: 2, text: 'Corregimiento Las Cosechas. Padilla, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p01', text: 'Arraigo, retos y aspiraciones: finca tradicional herencia de tercera generación, hace más de 90 años es propiedad de su familia. El propietario la define como "su pensión y vida", resistiendo ofertas de compra para mantener la tierra en manos campesinas. Menciona que no tiene sentido vender porque “la plata se gasta y quedan sin nada los que han decidido vender”.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p02', text: 'Cultivos: tiene una gran variedad de cultivos (aproximadamente 20) presentes tales como: zapallo, banano, limón tahití y pajarito, pitaya, guama guanábana, mamey, maíz, mandarina oneco y arrayana, mango, naranja común, papaya, plátano, yuca, zapote, entre otros, como cacao que vende a la empresa Chocolate Hunter, aguacate que vende al INPEC, y algunas plantas de Café que mantiene como reliquia.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p03', text: 'Rotación: Se hace resiembra de plátano.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p04', text: 'Asociación: Cacao y plátano.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p05', text: 'Animales: No reporta.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p06', text: 'Fauna silvestre: ha observado animales como la culebra petacona grande, ardillas, ranas, sapos, murciélagos y lagartijas de muchos colores. Aves como el azulejo, asomas, periquitas y loras, morrocó. chupaflor. También se ven insectos como mariposas, polillas, abejas, avispas y arañas.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p07', text: 'Disponibilidad y uso del agua: el riego de sus cultivos depende principalmente de la lluvia, cuenta con un aljibe, pero el agua disponible depende de los ingenios debido a que acaparan el agua, generando que los pozos de los finqueros tradicionales deban profundizarse. Cuenta con acueducto y agua potable, pero no cuenta con alcantarillado, por lo que las agua residuales van a un pozo séptico, a una acequia o al suelo.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p08', text: 'Conservación de agua en el sistema: cuenta con 3 grandes árboles de burilico que al ser de raíces profundas, retienen y conservan la humedad del suelo, a la vez que proporcionan sombra para los cultivos circundantes, impidiendo la evaporación de la poca agua disponible en la zona. Conserva la cobertura vegetal y la hojarasca, gracias a ello la tierra se mantiene oscura. Emplea plantas como el cachimbo y el nacedero que permiten conservar el agua.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p09', text: 'Saberes y conocimientos compartidos: sus conocimientos los ha transmitido a través de una cartilla escrita por Maria Camila Cambindo, en la cual se recoge la voz de todos los agricultores asociados a ASOFINTRA (Asociación de Finqueros Tradicionales de Padilla Cauca), ésta realizó una Caracterización de Estrategias de Persistencia y Resiliencia Socioecológica en Fincas Tradicionales Afrocampesinas de Padilla-Cauca. Ha transmitido conocimientos como la realización de una tromba para el manejo de las hormigas arrieras.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p10', text: 'Prácticas culturales: En ocasiones se celebra la cosecha, también participa de la fiesta de la Cruz, que se realiza el 3 de mayo en Padilla.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: fortalecimiento del tejido gremial a través de ASOFINTRA, la cual cuenta con más de 100 asociados, espera en el futuro contribuir con sus productos a un centro de acopio que se va a construir para esta figura de asociatividad. Contribuye a la seguridad alimentaria del territorio al alimentar a 9 personas de su familia y suplir todo el año el mercado de Padilla, Florida y Cali con los productos que cosecha en su finca.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p12', text: 'Transformaciones productivas: emplea rayadura de naranja para la realización de galletas.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-virginia-p13', text: 'Amenazas: presenta una escasez de agua superficial al ser acaparada por ingenios, obligando a profundizar pozos. La caña de azúcar afecta su finca dado que los químicos empleados en la fumigación del monocultivo quema sus plantas, a su vez, la quema de la caña contamina el entorno.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-la-virginia' },
}

/* ── cap4-presentacion-centro-agropecuario ────────────────────────────── */

const CAP4_PRESENTACION_CENTRO_AGROPECUARIO: Modal = {
  id: 'cap4-presentacion-centro-agropecuario',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Centro agropecuario',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-centro-agropecuario-loc', level: 2, text: 'Vereda Cabito, Consejo comunitario Riberas del río Palo. Guachené, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p01', text: 'Arraigo, retos y aspiraciones: comenzaron su labor de cultivo hace más de 30 años en el terreno. Ha sido un espacio educativo, investigativo y de formación para niños y campesinos. Sueñan con reconstruir la infraestructura. Han recibido apoyo de diferentes organizaciones e instituciones como la Universidad Autónoma de Occidente, CRC, Save the Children, UOAFROC (Unidad de Organizaciones Afrocaucanas).' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p02', text: 'Cultivos: cuentan con plantas como cacao, plátano, colimo, chontaduro, cítricos, maracuyá, limón, arazá, guayaba, mango, manga, entre otros.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p03', text: 'Rotación: planean hacer una rotación del cultivo de caña de azúcar a otros cultivos tradicionales en tres años.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p04', text: 'Asociación: plátano y cacao.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p05', text: 'Animales: No reporta.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p06', text: 'Fauna silvestre: armadillos, zarigüeyas, ardillas, lagartijas, hormiga arriera, diversidad de polinizadores. Antes se observaba una mayor biodiversidad, en la actualidad esta se encuentra reducida.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p07', text: 'Disponibilidad y uso del agua: cuentan con dos aljibes de los que extraen el agua necesaria para el sostenimiento de los que habitan la vivienda y para el riego de los cultivos. El río Palo y Barragán se encuentran distantes.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p08', text: 'Conservación de agua en el sistema: conservan la hojarasca en el suelo, el centro cuenta con un guadual y pequeñas áreas de respaldo cercanas, lo que permite conservar el agua subterránea.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p09', text: 'Saberes y conocimientos compartidos: archivos y materiales producidos por Edelberto Balanta, capacitaciones realizadas en conjunto con UOAFROC y Save the Children. Antes de la pandemia ofrecían servicios de asesoría y apoyo a la comunidad, en la actualidad no lo hacen por falta de capacidad financiera y por cambio de enfoques de la asociación.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p10', text: 'Prácticas culturales: validación del Viche como producto cultural y económico de las comunidades afrocaucanas, buscan desestigmatizar el cultivo de caña de azúcar como planta pero cuestionando la práctica extensiva del monocultivo. Conservan el trabajo colectivo de aparcería y mano cambiada.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p11', text: 'Aporte a la soberanía alimentaria y al sustento familiar: formación de nuevas generaciones en agricultura y cultura. Los frutos que da el centro alimentan a una familia de 4 miembros y a las personas que hacen parte de la Asociación Cultural Casa del Niño y de la Niña.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p12', text: 'Transformaciones productivas: producción de Viche (bebida ancestral), anteriormente realizaban investigación genética en cacao y plátano.' },
    { type: 'paragraph', id: 'cap4-presentacion-centro-agropecuario-p13', text: 'Amenazas: necesidad de mejorar infraestructura para ampliar la capacidad educativa y productiva. Enfrentan robos constantes al estar situada en un punto estratégico, altamente conectado con diferentes centros poblados. La baja rentabilidad de la producción pone en riesgo el futuro del centro.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-centro-agropecuario' },
}

/* ── cap4-presentacion-la-caicedo ─────────────────────────────────────── */

const CAP4_PRESENTACION_LA_CAICEDO: Modal = {
  id: 'cap4-presentacion-la-caicedo',
  section: 'capitulo-4',
  variant: 'large',
  title: 'Finca La Caicedo',
  highlight: 'Actores, acciones, capacidades y poderes',
  icon: 'presentation',
  body: [
    { type: 'heading', id: 'cap4-presentacion-la-caicedo-loc', level: 2, text: 'Vereda La Caponera, Consejo Comunitario Riveras del río Palo. Guachené, Cauca' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p01', text: 'Arraigo, retos y aspiraciones: finca de herencia familiar con 120 años de historia en dos generaciones. Es el punto de encuentro de la familia extensa y el hogar de cuatro personas. Sus propietarios tienen el propósito de que esta sea una finca demostrativa de la región en la que se producen alimentos sanos y que permanezca como patrimonio para sus renacientes.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p02', text: 'Cultivos: funciona como un banco de germoplasma vivo. Se registraron 23 especies: achiote, aguacate, banano, cacao, cimarrón, guama, guanábana, guayaba, limón Tahití, maíz, mamoncillo, mandarina, mango, maracuyá, naranja valenciana y tangelo, papaya, plátano, yuca, zapallo, zapote, árbol de pan, chontaduro, pomoroso y plantas medicinales como sábila, matarratón, pringamosa, hierbamora, paico, oreganón, albahaca morada, llantén, limoncillo, anamú, nacedero y guanábano.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p03', text: 'Rotación: yuca, zapallo y maíz en ciclos de tres meses.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p04', text: 'Asociación: plátano y cacao.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p05', text: 'Animales: se crían cerdos y gallinas ponedoras y de patio.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p06', text: 'Disponibilidad y uso del agua: La Caicedo está conectada a la red de acueducto local. El agua para cocinar se compra a un ingenio cercano. No se tiene alcantarillado en la zona, se tiene un pozo séptico.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p07', text: 'Conservación de agua en el sistema: la finca conforma un sistema agroforestal con una cobertura arbórea articulada a la zona de cultivos diversos y una zona en transición que cubren el 96% del área. Esta a su vez está conectada con fincas tradicionales aledañas que tienen zonas arborizadas frondosas y extensas hacia el suroccidente y el nororiente. El suelo se protege con hojarasca y cultivos acolchados asociados.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p08', text: 'Saberes y conocimientos compartidos: principalmente a hijxs, nietxs y sobrinxs conocimientos técnicos sobre el trabajo en el campo y valores y manejo de emociones para la vida.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p09', text: 'Prácticas culturales: No se voltea el suelo. Se maneja una cobertura permanente de hojarasca y biomasa para retener humedad. Y se usa miel de purga, gallinaza compostada y tierra de hormiguero para nutrir el suelo. Se hace control manual de arvenses con biopreparados y uso selectivo de insumos.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p10', text: 'Aporte a la soberanía alimentaria y al sustento familiar: garantiza la alimentación directa de 9 personas de la familia. Los excedentes de plátano y cacao se venden en las plazas de mercado de Puerto Tejada y Jamundí o a compradores especializados.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p11', text: 'Transformaciones productivas: no hay.' },
    { type: 'paragraph', id: 'cap4-presentacion-la-caicedo-p12', text: 'Amenazas: presión por los monocultivos de caña circundantes que buscan extenderse a predios pequeños a través de la compra y el arrendamiento. Disminución en la fertilidad del suelo. Se considera que el EOT de Guachené no contempla disposiciones favorables para la sustentabilidad de las fincas tradicionales.' },
  ],
  trigger: { type: 'button', icon: 'presentation', frame: '1', label: 'Presentacion', mapId: 'chapter4-la-caicedo' },
}

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
    /* Solo imagen + X (estilo v17 ModalImagen): la imagen ocupa el 100%
     * del fondo (contain para no recortar diagramas con texto), sin header
     * y con la X espejada a la izquierda. Body vacío: sin scroll no hay
     * riel, fade ni flecha. Tamaño gigante 90×90 como v17. */
    image: src,
    fullImage: true,
    hideHeader: true,
    closeLeft: true,
    theme: { bgFit: 'contain', size: { width: '90vw', height: '90vh' } },
    body: [],
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
