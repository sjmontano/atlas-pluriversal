/**
 * ⚖️ MODALES LEGALES — Términos y condiciones del Atlas
 * ======================================================
 * Contenido portado verbatim de v17 `modalsData.jsx` id 22.
 * Se abre desde el footer de Entramados (y a futuro Créditos).
 * Solo usa bloques existentes (heading, paragraph, list, image, link).
 */

import type { Modal } from '../../types/modal.ts'

/* ── Términos y condiciones de uso y política de privacidad (v17 id 22) ─── */

export const TERMINOS_MODAL: Modal = {
  id: 'terminos-condiciones',
  section: 'legales',
  variant: 'large',
  title: 'Términos y condiciones',
  highlight: 'Términos y condiciones de uso y política de privacidad',
  icon: 'credits',
  body: [
    {
      type: 'paragraph',
      id: 'tc-intro',
      text: 'Atlas sur del valle alto del río Cauca. Última actualización: Agosto 2025.',
    },
    {
      type: 'heading',
      id: 'tc-h1',
      level: 2,
      text: '1. Propósito del atlas',
    },
    {
      type: 'paragraph',
      id: 'tc-p1',
      text: 'El Atlas sur del valle alto del río Cauca. Geopoéticas para las transiciones solicita al visitante y usuario de esta página, que lea detalladamente estos términos y condiciones de uso, antes de iniciar su exploración o utilización.',
    },
    {
      type: 'paragraph',
      id: 'tc-p2',
      text: 'Este atlas es una plataforma interactiva de carácter participativo, comunitario y académico. Es el resultado de un proceso colectivo orientado a visibilizar los paisajes, prácticas organizativas y saberes de las alternativas territoriales que conformamos el Tejido de transicionantes por el valle alto del río Cauca. Su propósito es apoyar procesos de planificación, transformación, reflexión e investigación desde y sobre el territorio, desde una perspectiva crítica y solidaria con la relacionalidad radical de la vida. Este atlas no persigue fines de lucro, ni intereses comerciales, ni adhesiones a movimientos políticos particulares. Los contenidos y vínculos de este sitio tienen propósitos exclusivamente educativos, culturales, académicos y de relevancia para el diseño territorial comunitario.',
    },
    {
      type: 'heading',
      id: 'tc-h2',
      level: 2,
      text: '2. Licencia de uso',
    },
    {
      type: 'paragraph',
      id: 'tc-p3',
      text: 'Todos los contenidos del atlas —incluyendo mapas, imágenes, textos, gráficas, audios e infografías— están protegidos bajo la licencia Creative Commons Atribución-NoComercial-SinDerivadas 4.0 Internacional (CC BY-NC-ND 4.0). Esto implica que:',
    },
    {
      type: 'list',
      id: 'tc-l1',
      items: [
        'Se permite la descarga y uso con fines académicos, siempre que se cite adecuadamente la fuente.',
        'No se permite el uso comercial, publicitario o institucional sin autorización previa por escrito.',
        'No está permitido modificar, transformar ni generar obras derivadas de los materiales.',
        'No se permite incorporar los materiales en productos editoriales impresos o digitales con fines distintos a los definidos aquí.',
      ],
    },
    {
      type: 'link',
      id: 'tc-link-cc',
      href: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.es',
      label: 'Más información sobre esta licencia',
    },
    {
      type: 'heading',
      id: 'tc-h3',
      level: 2,
      text: '3. Privacidad y protección de datos',
    },
    {
      type: 'list',
      id: 'tc-l2',
      items: [
        'Este atlas no recopila, solicita ni almacena información personal como nombres, direcciones, correos electrónicos o números de identificación.',
        'No se comercializará, compartirá ni utilizará dicha información con otros fines a los establecidos aquí.',
        'La funcionalidad de interacción del mapa de multiterritorialidades permite ubicar lugares de procedencia (a diferentes escalas como municipios, o regiones, cuencas o veredas), sin requerir datos personales. Este mapa es una herramienta de conexión simbólica entre lugares de origen del Pacífico colombiano y valle alto del río Cauca, como ejercicio de memoria, reconocimiento y territorialización. Es voluntaria, no requiere ningún dato identificable, no tiene implicaciones legales ni institucionales, y tiene fines pedagógicos, simbólicos y de representación cultural. Toda información registrada de manera voluntaria será utilizada exclusivamente para ser visualizada dentro del atlas.',
      ],
    },
    {
      type: 'heading',
      id: 'tc-h4',
      level: 2,
      text: '4. Citación recomendada',
    },
    {
      type: 'paragraph',
      id: 'tc-p4',
      text: 'Si utilizas el atlas en publicaciones académicas, trabajos educativos o proyectos científicos, investigativos, artísticos y culturales, por favor cita de la siguiente forma: Tejido de transicionantes por el valle alto del río Cauca. (2025). Atlas del sur del valle alto del río Cauca. Geopoéticas para las transiciones.',
    },
    {
      type: 'heading',
      id: 'tc-h5',
      level: 2,
      text: '5. Comportamiento del usuario',
    },
    {
      type: 'list',
      id: 'tc-l3',
      items: [
        'No realizar acciones que perjudiquen o interfieran con el funcionamiento del sitio web o sus servicios.',
        'No vulnerar los sistemas de información, la plataforma tecnológica, ni alterar su contenido.',
        'Abstenerse de incurrir en usurpación de identidad, infracción de derechos de autor, falsedad documental o revelación no autorizada de información.',
        'Respetar los fines académicos y comunitarios de la plataforma.',
      ],
    },
    {
      type: 'heading',
      id: 'tc-h6',
      level: 2,
      text: '6. Actualizaciones',
    },
    {
      type: 'paragraph',
      id: 'tc-p5',
      text: 'Los presentes términos y condiciones podrán modificarse si el proyecto incorpora nuevas funciones, tecnologías o políticas de uso. Cualquier actualización será notificada en esta misma sección del sitio web y entrará en vigencia desde su publicación. Los administradores del atlas no adquieren compromiso alguno de actualización permanente del contenido y no se responsabilizan por diferencias entre las versiones impresas y digitales de documentos compartidos. Igualmente, no asumen responsabilidad por errores, omisiones o inexactitudes en la información, ni por el contenido de sitios externos enlazados desde esta plataforma.',
    },
    {
      type: 'heading',
      id: 'tc-h7',
      level: 2,
      text: '7. Disponibilidad del servicio',
    },
    {
      type: 'paragraph',
      id: 'tc-p6',
      text: 'No se garantiza la disponibilidad continua del portal, ya que el acceso puede verse afectado por labores de mantenimiento, actualizaciones técnicas o problemas en la red de comunicaciones. En caso de fallas, se tomarán medidas para restablecer el servicio en el menor tiempo posible. No se asume responsabilidad por daños derivados del uso de la plataforma o de la imposibilidad de acceder a ella.',
    },
    {
      type: 'image',
      id: 'tc-img',
      src: '/assets/modal/entramados/privacidad.webp',
      alt: 'Privacidad y protección de datos',
    },
  ],
  trigger: {
    type: 'button',
    icon: 'credits',
    frame: '3',
    label: 'Términos y condiciones',
  },
}

export const LEGALES_MODALS: Modal[] = [TERMINOS_MODAL]
