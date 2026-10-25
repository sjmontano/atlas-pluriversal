# Guía funcional — Atlas Pluriversal

> **Corte:** 2026-10-19. Describe lo que la aplicación ofrece hoy, no lo que se planeó.
> Para la implementación, ver [ARQUITECTURA.md](ARQUITECTURA.md).

---

## 1. Qué es

El Atlas Pluriversal es una **cartografía narrativa del Valle Alto del Río Cauca**. No es un
SIG ni un mapa de consulta: es una obra editorial navegable. Cada mapa es una lámina
georreferenciada que se recorre con zoom, capas, puntos de interés y textos.

La experiencia se organiza en **cuatro capítulos** y un mapa de introducción. El visitante
puede:

- entrar por la home y elegir un capítulo;
- recorrer los mapas de cada capítulo;
- activar capas temáticas;
- abrir puntos de interés;
- leer, ver galerías y escuchar audio;
- navegar entre mapas mediante encuadres;
- volver a la home o al río.

---

## 2. Público y contexto de uso

El diseño responde a un contexto concreto:

- **Sala comunal** o punto de encuentro, no una oficina.
- **PC de gama baja**: Celeron/A4, 2–4 GB de RAM, GPU integrada.
- **Monitor A4** y navegador de escritorio, con soporte móvil.
- **Conectividad rural 3G**, a veces intermitente o ausente.

Por eso la aplicación prioriza primera pintura rápida, imágenes progresivas, bajo consumo y
mensajes claros cuando la red falla. No prioriza efectos pesados ni mapas 3D.

---

## 3. Estructura narrativa

| Capítulo | Título | Mapas |
|---|---|---|
| Introducción | Mapa de introducción | 1 |
| I | El valle alto del río Cauca, su cuenca y sus mundos | 6 |
| II | Tejidos, nodos y alternativas transformadoras en el sur del valle alto | 7 |
| III | Caminos y conflictos del río Cauca en el valle alto | 6 |
| IV | Actores, acciones, capacidades y poderes en los nodos del Tejido | 11 |

**Total: 31 mapas** (30 de contenido + introducción).

### 3.1 Capítulo I — La cuenca

- Encuadres Territoriales.
- Ecosistemas.
- Formas del Paisaje.
- Bredunco.
- Mosaicos del Agua.
- Un Río Cauca, Muchos Mundos.

### 3.2 Capítulo II — Territorios específicos

- Valle del Cauca.
- Suárez.
- Oriente de Cali.
- Villa Rica.
- Versiones de síntesis: Oriente de Cali (M), Villa Rica (M), Suárez (M).

### 3.3 Capítulo III — Caminos y conflictos

- Introducción del capítulo.
- Monocultivo de Caña.
- Nos Encharcaron el Río.
- Cali se Deseca.
- Humedales del Cauca.
- Arcilla y Territorio.

### 3.4 Capítulo IV — Actores y poderes

- Introducción del capítulo.
- Asoyoge.
- El Buhído.
- Bosque Comestible.
- Los Bajíos.
- El Paso.
- Las Mercedes.
- La Virginia.
- Centro Agropecuario.
- La Caicedo.
- Problemáticas Ambientales.

---

## 4. Recorridos principales

### 4.1 Llegar

La home presenta el Atlas y sus accesos. Desde allí se entra al mapa de introducción o a un
capítulo. También hay accesos a **Entramados** (organizaciones del territorio) y **Créditos**.

### 4.2 Recorrer un capítulo

1. Se elige el capítulo en las pestañas inferiores o desde la home.
2. El capítulo abre su primer mapa.
3. El header muestra el título y una flecha de regreso.
4. El riel lateral ofrece acciones: abrir un modal, ir a otro mapa o abrir un enlace.
5. El minimapa y la brújula orientan.
6. Las pestañas permiten cambiar de capítulo sin volver a la home.

### 4.3 Explorar un mapa

- **Zoom y pan** con mouse, rueda o gestos táctiles.
- **Rotación**: la mayoría de mapas usa una orientación fija (`bearing: -90`); el usuario no
  rota libremente. `chapter4-problematicas` usa −30°.
- **Capas**: el menú de capas muestra un árbol por grupos. Cada capa se enciende o apaga y
  puede regular su opacidad.
- **POI**: al pasar el cursor aparece un tooltip; al hacer clic se abre un modal o un popup
  ligero.
- **Encuadres**: etiquetas y marcos clickeables que llevan a otro mapa del relato.

### 4.4 Leer un modal

Los modales son la unidad de contenido largo. Pueden incluir:

- párrafos, títulos, listas y citas;
- imágenes con pie;
- carruseles con flechas, puntos y gestos;
- columnas;
- fichas técnicas;
- enlaces;
- fondos full-bleed;
- imagen explorable con pan en móvil.

El modal se cierra con la X, con `Esc` o tocando fuera, según el layout.

### 4.5 Escuchar audio

Donde el contenido lo define, un POI abre un reproductor flotante. El reproductor muestra una
forma de onda con filo visible, cambia a verde en hover y se reinicia al cambiar de POI. Está
presente en mapas del capítulo III («Nos Encharcaron el Río» y «Cali se Deseca»).

No todos los mapas tienen audio: depende de los POI cargados.

### 4.6 Volver

- Flecha del header: vuelve al mapa anterior o al capítulo.
- Acciones de home/río en el shell.
- El intro de capítulo vuelve a `/intro`.
- Las rutas son enlazables: `/capitulo/:n/:mapId`.

---

## 5. Funciones transversales

### 5.1 Capas

Tres familias:

| Familia | Qué aporta |
|---|---|
| Raster georreferenciado | Composiciones temáticas sobre el mapa base (ecosistemas, mosaicos). |
| Raster por tiles | Capas de alta resolución con pirámide propia. |
| GeoJSON | Ríos, subcuencas, límites, nodos y conflictos, con estilos y hover. |

Reglas de experiencia:

- Las capas pesadas entran apagadas; el usuario decide cuándo cargarlas.
- El hover de ríos y rellenos usa áreas de captura ampliadas.
- Algunas capas permiten desactivar el tooltip.
- La opacidad se ajusta por capa.

### 5.2 POI

| Variante | Apariencia |
|---|---|
| `number` | Círculo con número. |
| `icon` | Marcador con ícono. |
| `arrow` | Flecha direccional con color. |

Comportamiento:

- Pulso animado para llamar la atención sin dominar el mapa.
- Escala adaptada al zoom.
- Tooltip en hover.
- Clic abre modal de contenido o popup ligero.

### 5.3 Encuadres y tramos

- Los **encuadres** son marcos navegables entre mapas.
- Sus etiquetas se dibujan como capas `symbol`, por lo que no derivan al hacer zoom.
- En el capítulo III, los **tramos** abren modales full-bleed desde etiquetas.

### 5.4 Búsqueda visual y orientación

- Minimapa de contexto.
- Indicador norte.
- Etiquetas de océano en mapas de Colombia completa.
- Etiquetas de encuadre con ancho máximo configurable.

### 5.5 Resistencia a la red

| Situación | Qué ve el usuario |
|---|---|
| Primera carga | Placeholder de baja resolución; luego imagen media y tiles. |
| Conexión lenta | Banner de estado degradado tras 15 s con peticiones activas; imagen de rescate. |
| Sin conexión | Banner offline; se conserva lo ya cacheado. |
| Sin tiles | Fallback de imagen Cloudinary en tres resoluciones según zoom. |
| Equipo limitado | Modo de bajo consumo: menos peticiones paralelas y sin fade de tiles. |

La aplicación nunca debe quedar en una pantalla azul vacía. Si el mapa no puede cargar, muestra
un estado comprensible y una imagen de respaldo.

### 5.6 Responsive

- Shell, pestañas, menús y modales se adaptan a móvil.
- El menú de capítulos se vuelve flotante y responsive.
- Los modales ajustan insets, ancho de cuerpo y altura de carrusel.
- `PanViewport` permite explorar imágenes grandes con pan táctil.
- Entramados y Créditos tienen maquetación móvil propia.

---

## 6. Pantallas y rutas

| Ruta | Pantalla | Función |
|---|---|---|
| `/` | Inicio | Presentación, POI de entrada, accesos a capítulos, entramados y créditos. |
| `/intro` | Introducción | Mapa introductorio y sus modales. |
| `/capitulo/:n` | Entrada de capítulo | Redirige al primer mapa. |
| `/capitulo/:n/:mapId` | Visor | Shell + mapa + capas + POI + modales. |
| `/entramados` | Entramados | Organizaciones y logos del territorio. |
| `/creditos` | Créditos | Autorías, agradecimientos y condiciones. |
| `/dev` | Menú de desarrollo | Acceso a los 31 mapas y utilidades. |
| `/test/:mapId` | Prueba de mapa | Calibración y diagnóstico. |

Las rutas de desarrollo no forman parte de la experiencia pública, pero pueden existir en el
build si no se excluyen.

---

## 7. Contenido y estado editorial

- **Textos**: migrados de `v17`, con correcciones y consolidación por capítulo.
- **Imágenes**: mapas calibrados, capas compuestas, fotografías de POI, galerías y logos.
- **Audio**: presente en mapas del capítulo III; el reproductor es reutilizable.
- **Modales**: fichas técnicas, perfiles, árboles, galerías, presentaciones y datos.
- **Pendientes heredados del prototipo**: capas truncadas («Cali se deseca»), flecha
  redundante, desfase del mosaico de cuencas, correspondencia números/textos de cuencas,
  capa «Transformaciones sin información», indicador de punto de vista, flechas y título del
  último perfil del capítulo I, convenciones del panel de capas.

Estos pendientes son **editoriales o de contenido**, no fallos de arquitectura.

---

## 8. Accesibilidad y ergonomía

Implementado:

- Navegación por teclado en carruseles y modales.
- Cierre con `Esc`.
- Tooltips con ajuste al viewport.
- Contraste y tipografía unificados en el shell.
- Estados de carga y error visibles.
- Objetivos táctiles en móvil.

Límites conocidos:

- El canvas WebGL no es accesible por lector de pantalla; el contenido equivalente vive en los
  modales y textos.
- No hay una versión «sin mapa» de la narrativa.
- La navegación depende de gestos de mapa; no hay controles de teclado equivalentes para
  recorrer el territorio.

---

## 9. Qué no hace

- No es un visor de datos abiertos ni permite descargar capas.
- No tiene backend, cuentas, comentarios ni edición en línea.
- No busca direcciones ni calcula rutas.
- No muestra coordenadas al usuario final.
- No garantiza audio en todos los mapas.
- No tiene versión offline completa: el Service Worker cachea tiles visitados, no todo el
  sitio.

---

## 10. Criterios de aceptación funcional

Un corte se considera presentable si:

1. La home carga y permite entrar a los cuatro capítulos.
2. Cada capítulo abre su primer mapa y permite navegar todos sus mapas.
3. Los mapas muestran imagen y, cuando existen, tiles alineados.
4. Las capas encienden, apagan y ajustan opacidad sin romper el mapa.
5. Los POI abren su contenido.
6. Los modales cierran y hacen scroll correctamente en escritorio y móvil.
7. El estado offline y el degradado se comunican.
8. No hay pantalla azul ni error de consola bloqueante.
9. Las rutas profundas funcionan al recargar.
10. El build de producción se sirve sin depender de `/test` ni del panel de calibración.
