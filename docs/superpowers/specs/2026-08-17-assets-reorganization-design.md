# Reorganización de Assets Estáticos — Diseño

**Fecha:** 2026-08-17
**Alcance:** `atlas/` (frontend principal). Reorganiza las carpetas desordenadas de `public/assets/` por función/dominio y normaliza nombres a kebab-case.
**Relación:** Complementa `2026-08-15-content-structure-design.md` (reorganizó `src/content/`, no los assets estáticos de `public/assets/`).

---

## 1. Objetivos

1. **Organizar por función/dominio** — cada carpeta destino responde a un rol del proyecto: leyendas de mapa, recursos de POIs, interfaz.
2. **Normalizar nombres** — kebab-case (ASCII, minúsculas, sin espacios ni carpetas anidadas artificiales) en todos los archivos movidos.
3. **Resolver duplicados** — una sola variante por recurso cuando exista duplicación (byte-idéntica o del mismo sujeto en formatos distintos).
4. **No perder archivos** — los huérfanos (sin referencia en el código) se reubican también, no se borran, bajo nombres normalizados.
5. **`maps/` no se toca** — la cartografía ya organizada queda intacta.
6. **Mantener el build sano** — toda referencia del código a rutas de assets se actualiza junto con el movimiento.

---

## 2. Decisiones de diseño (del brainstorming)

| # | Decisión |
|---|---|
| D1 | Alcance: solo carpetas desordenadas (`iconsCap4/`, `mapasMenuCap2/`, `svg/sidebar-resources/`, `interface/icons/line/svg/`, `tooltip/`, `img/entramados/`). `maps/` intacta. |
| D2 | Principio de organización: **por función/dominio** (no por capítulo, no plano). |
| D3 | Enfoque aprobado: B — `legends/`, `pois/(markers|photos)`, `ui/(icons|sidebar|tooltips)`. |
| D4 | **Kebab-case total**, incluso en archivos referenciados (se actualiza el código). |
| D5 | Huérfanos: **organizar todo, sin borrar**. |

---

## 3. Estructura Destino

```
public/assets/
├── maps/                        ← INTACTA (cartografía y tiles)
├── legends/                     ← íconos de leyenda de capas (SVG)
│   ├── aljibe.svg
│   ├── aljibe-2.svg
│   ├── area-urbana.svg
│   ├── ...                      ← todos los SVG de leyenda de iconsCap4 + rios-principales.svg
├── pois/                        ← todo lo relacionado con POIs
│   ├── markers/                 ← íconos marcadores: location.svg, popup-node.svg
│   └── photos/
│       ├── organizaciones/      ← logos/orgs desde img/entramados/ (30)
│       └── fincas/              ← fotos de fincas/predios desde iconsCap4/*.png|webp
├── ui/                          ← recursos de interfaz (chrome)
│   ├── icons/                   ← íconos UI desde interface/icons/line/svg/ (excepto location.svg)
│   ├── sidebar/                 ← marker1.svg, fondoIcon1.svg desde svg/sidebar-resources/
│   ├── tooltips/                ← fondo-tooltip.webp (+ FondoTooltip4.webp si no es duplicado)
│   └── graphics/                ← datoIntroCap4.svg/png (gráfico de intro de datos, huérfano)
```

Carpetas fuente que desaparecen tras la migración: `iconsCap4/`, `mapasMenuCap2/`, `interface/`, `svg/`, `img/`, `tooltip/`.

---

## 4. Reglas de nombre (kebab-case)

- Minúsculas ASCII, separador `-`, sin espacios, mayúsculas, paréntesis ni barras bajas.
- camelCase → kebab: `areaUrbanaNueva.svg` → `area-urbana-nueva.svg`.
- Un sufijo numérico se convierte en token: `aljibe2.svg` → `aljibe-2.svg`, `cultivoDiverso2.svg` → `cultivo-diverso-2.svg`.
- Guion duplicado interno (`_`, espacios) → `-`: `home_bottom.svg` → `home-bottom.svg`, `villa rica.png` → `villa-rica.png`.
- Nombres truncados de organizaciones se normalizan al nombre completo conocido (ver §6).
- Errores ortográficos del nombre de archivo **se preservan** salvo truncamiento ilegible (`dispocisionResiduos2.svg` → `dispocision-residuos-2.svg`).

---

## 5. Inventario y Mapeo

### 5.1 `iconsCap4/*.svg` → `legends/`

| Origen | Destino (kebab) | Referenciado |
|---|---|---|
| `aguaResidual.svg` | `agua-residual.svg` | no |
| `aljibe.svg` | `aljibe.svg` | sí (los-bajios, problematicas) |
| `aljibe2.svg` | `aljibe-2.svg` | sí (centro-agropecuario) |
| `areaUrbana.svg` | `area-urbana.svg` | sí |
| `areaUrbanaNueva.svg` | `area-urbana-nueva.svg` | sí (problematicas) |
| `bosqueAreaExtracion.svg` | `bosque-area-extracion.svg` | sí |
| `bosques.svg` | `bosques.svg` | no |
| `botaderoColchon.svg` | `botadero-colchon.svg` | sí |
| `botaderoEscombro.svg` | `botadero-escombro.svg` | sí |
| `burilico.svg` | `burilico.svg` | sí |
| `Canales.svg` | `canales.svg` | sí (problematicas) |
| `charcoBano.svg` | `charco-bano.svg` | sí (el-paso) |
| `compuertaVertedero.svg` | `compuerta-vertedero.svg` | sí |
| `construccion.svg` | `construccion.svg` | sí (los-bajios) |
| `criaAnimales.svg` | `cria-animales.svg` | sí |
| `cuerpoAgua2.svg` | `cuerpo-agua-2.svg` | sí (bosque-comestible) |
| `cuerposAgua.svg` | `cuerpos-agua.svg` | sí (el-paso) |
| `cultivoDiver.svg` | `cultivo-diver.svg` | no (candidato dedup vs cultivoDiverso) |
| `cultivoDiverso.svg` | `cultivo-diverso.svg` | sí |
| `cultivoDiverso2.svg` | `cultivo-diverso-2.svg` | sí |
| `curvaNivel.svg` | `curva-nivel.svg` | sí |
| `curvaNivel (2).svg` | *(eliminar si byte-idéntico a curva-nivel)* | no |
| `delimitacion.svg` | `delimitacion.svg` | sí |
| `dispocisionResiduos2.svg` | `dispocision-residuos-2.svg` | sí (la-caicedo) |
| `disposicionResiduos.svg` | `disposicion-residuos.svg` | sí (el-buhido, problematicas) |
| `entradaPredio.svg` | `entrada-predio.svg` | sí |
| `estanque.svg` | `estanque.svg` | sí (las-mercedes) |
| `extraccionOro.svg` | `extraccion-oro.svg` | sí (el-paso) |
| `fincaTradicional.svg` | `finca-tradicional.svg` | sí (intro) |
| `huertas.svg` | `huertas.svg` | sí (los-bajios) |
| `humedalesPot.svg` | `humedales-pot.svg` | sí (problematicas) |
| `mineria.svg` | `mineria.svg` | sí (el-paso) |
| `monocultivoAzucar.svg` | `monocultivo-azucar.svg` | sí (intro) |
| `nidoHormiga.svg` | `nido-hormiga.svg` | sí (centro-agropecuario) |
| `ocupacionFranjas.svg` | `ocupacion-franjas.svg` | sí (problematicas) |
| `palenke.svg` | `palenke.svg` | sí |
| `pastoreo.svg` | `pastoreo.svg` | sí (el-paso) |
| `productivasEspeciales.svg` | `productivas-especiales.svg` | sí |
| `semillero.svg` | `semillero.svg` | sí (la-virginia) |
| `sistemaRiego.svg` | `sistema-riego.svg` | sí (la-virginia) |
| `transformacionProduc.svg` | `transformacion-produc.svg` | no (candidato dedup vs transformacionProductiva) |
| `transformacionProductiva.svg` | `transformacion-productiva.svg` | sí |
| `trocha.svg` | `trocha.svg` | sí |
| `viviendaEspaciosAsociados.svg` | `vivienda-espacios-asociados.svg` | sí |
| `viviendas.svg` | `viviendas.svg` | no (candidato dedup vs viviendaEspaciosAsociados) |
| `viviendas2.svg` | `viviendas-2.svg` | no (candidato dedup vs viviendaEspaciosAsociados) |
| `zonaBasura.svg` | `zona-basura.svg` | sí (bosque-comestible) |
| `zonaColmatada.svg` | `zona-colmatada.svg` | sí (bosque-comestible) |
| `zonaDesecho.svg` | `zona-desecho.svg` | sí (las-mercedes) |
| `zonaTransicion.svg` | `zona-transicion.svg` | sí |
| `zonaVerdes2014.svg` | `zona-verdes-2014.svg` | sí (problematicas) |
| `zocabonOro.svg` | `zocabon-oro.svg` | sí (el-paso) |

### 5.2 `mapasMenuCap2/` → `legends/`

| Origen | Destino | Referenciado |
|---|---|---|
| `riosPrincipales.svg` | `rios-principales.svg` | sí (intro/legends.ts) |

### 5.3 `iconsCap4/*.png|webp` → `pois/photos/fincas/`

| Origen | Destino | Nota |
|---|---|---|
| `asoyoge.png` | `asoyoge.png` | huérfano |
| `asoyogue-09.png` | `asoyogue-09.png` | huérfano |
| `centro-agropecuario.png` | `centro-agropecuario.png` | huérfano |
| `El buhido.png` | (dedup vs `el-buhido.png`) | duplicado de sujeto |
| `el-buhido.png` | `el-buhido.png` | huérfano |
| `el paso.png` | (dedup vs `el-paso.webp`) | duplicado de sujeto |
| `el-paso.webp` | `el-paso.webp` | huérfano (preferir webp) |
| `Finca El Paso.png` | (dedup vs `el-paso.webp`) | duplicado de sujeto |
| `Finca Las Mercedes.png` | (dedup vs `las-mercedes.webp`) | duplicado de sujeto |
| `guachene.png` | `guachene.png` | huérfano |
| `la caicedo.png` | (dedup vs `la-caicedo.png`) | duplicado |
| `La caicedo.png` | (dedup vs `la-caicedo.png`) | duplicado |
| `la-caicedo.png` | `la-caicedo.png` | huérfano |
| `la virginia.png` | (dedup vs `la-virginia.png`) | duplicado |
| `la-virginia.png` | `la-virginia.png` | huérfano |
| `las-mercedes.webp` | `las-mercedes.webp` | huérfano (preferir webp) |
| `los-bajios.png` | `los-bajios.png` | huérfano |
| `oriente-cali.png` | `oriente-cali.png` | huérfano |
| `suarez.png` | `suarez.png` | huérfano |
| `villa rica.png` | `villa-rica.png` | huérfano |

### 5.4 `iconsCap4/` → `pois/markers/`

| Origen | Destino | Referenciado |
|---|---|---|
| `popupNode.svg` | `popup-node.svg` | sí (intro/pois.ts) |

### 5.5 `img/entramados/` → `pois/photos/organizaciones/`

| Origen | Destino | Referenciado |
|---|---|---|
| `ACCN.webp` | `accn.webp` | no |
| `Afroyoga.webp` | `afroyoga.webp` | no |
| `Alianza por la agrobiodiversidad.webp` | `alianza-por-la-agrobiodiversidad.webp` | no |
| `Asoyoge.webp` | `asoyoge.webp` | no |
| `asocoms.webp` | `asocoms.webp` | no |
| `asomuafroyo.webp` | `asomuafroyo.webp` | no |
| `Casilda candumi.webp` | `casilda-cundumi.webp` | no |
| `chicas.webp` | `chicas.webp` | no |
| `chicasComunicativas.webp` | `chicas-comunicativas.webp` | **sí** (cali/pois.ts) |
| `Colectivo socio juvenil huellas.webp` | `colectivo-socio-juvenil-huellas.webp` | no |
| `Comité por la defensa del terrio.webp` | `comite-por-la-defensa-del-territorio.webp` | no |
| `Consejo comunitario territorio y.webp` | `consejo-comunitario-territorio-y-paz.webp` | no |
| `Consejo municipal de juventud.webp` | `consejo-municipal-de-juventud.webp` | no |
| `El chontaduro.webp` | `el-chontaduro.webp` | no |
| `fundacionHuellas.webp` | `fundacion-huellas.webp` | no |
| `Guardia cimarrona.webp` | `guardia-cimarrona.webp` | no |
| `la laguna.webp` | `la-laguna.webp` | no |
| `Logo_Consejo_río_Ovejas.webp` | `logo-consejo-rio-ovejas.webp` | no |
| `logoCredits1.webp` | `logo-credits-1.webp` | no |
| `logoCredits2.webp` | `logo-credits-2.webp` | no |
| `matamba.webp` | `matamba.webp` | no |
| `mujer.webp` | `mujer.webp` | no |
| `mujeresDelOriente.webp` | `mujeres-del-oriente.webp` | **sí** (cali/pois.ts) |
| `Plataforma de juventudes.webp` | `plataforma-de-juventudes.webp` | no |
| `privacidad.webp` | `privacidad.webp` | no |
| `Redmunorca.png` | (dedup vs `Redmunorca.webp`) | duplicado de sujeto |
| `Redmunorca.webp` | `redmunorca.webp` | no |
| `Semillas.webp` | `semillas.webp` | no |
| `Uoafroc.webp` | `uoafroc.webp` | no |
| `Un río Cauca.webp` | `un-rio-cauca.webp` | no |

> Nota nombres normalizados: `Comité por la defensa del terrio` → `comite-por-la-defensa-del-territorio`; `Consejo comunitario territorio y.webp` → `consejo-comunitario-territorio-y-paz` (nombres completos según PTOC/POIs). `Casilda candumi` → `casilda-cundumi` (nombre oficial de la líder en villa-rica/pois.ts).

### 5.6 `interface/icons/line/svg/` → `ui/icons/`

| Origen | Destino |
|---|---|
| `arrow-down.svg` | `arrow-down.svg` |
| `arrow-up.svg` | `arrow-up.svg` |
| `back.svg` | `back.svg` |
| `chapter1-map.svg` | `chapter-1-map.svg` |
| `chapter2-maps.svg` | `chapter-2-maps.svg` |
| `chapter3-river.svg` | `chapter-3-river.svg` |
| `chapter4-cacao.svg` | `chapter-4-cacao.svg` |
| `chapter-info.svg` | `chapter-info.svg` |
| `close.svg` | `close.svg` |
| `credits.svg` | `credits.svg` |
| `download.svg` | `download.svg` |
| `fichatecnica.svg` | `ficha-tecnica.svg` (candidato dedup vs technical-sheet) |
| `general-info.svg` | `general-info.svg` |
| `hide.svg` | `hide.svg` |
| `home_bottom.svg` | `home-bottom.svg` |
| `iconInfo.svg` | `icon-info.svg` |
| `iconPresentation.svg` | `icon-presentation.svg` (candidato dedup vs presentation) |
| `layers.svg` | `layers.svg` |
| `levels.svg` | `levels.svg` |
| `location.svg` | → **`pois/markers/location.svg`** (referenciado) |
| `map-gallery.svg` | `map-gallery.svg` |
| `map-info.svg` | `map-info.svg` |
| `metadata.svg` | `metadata.svg` |
| `north.svg` | `north.svg` |
| `play.svg` | `play.svg` |
| `presentation.svg` | `presentation.svg` |
| `presentation2.svg` | `presentation-2.svg` |
| `question-mark.svg` | `question-mark.svg` |
| `roman-i.svg` | `roman-i.svg` |
| `roman-ii.svg` | `roman-ii.svg` |
| `roman-iii.svg` | `roman-iii.svg` |
| `roman-iv.svg` | `roman-iv.svg` |
| `show.svg` | `show.svg` |
| `technical-sheet.svg` | `technical-sheet.svg` |

### 5.7 `svg/sidebar-resources/` → `ui/sidebar/` y `ui/tooltips/`

| Origen | Destino |
|---|---|
| `marker1.svg` | `ui/sidebar/marker-1.svg` |
| `fondoIcon1.svg` | `ui/sidebar/fondo-icon-1.svg` |
| `FondoTooltip4.webp` | (dedup vs `fondo-tooltip.webp`; si distinto → `ui/tooltips/fondo-tooltip-4.webp`) |

### 5.8 `tooltip/` → `ui/tooltips/`

| Origen | Destino | Referenciado |
|---|---|---|
| `fondo-tooltip.webp` | `ui/tooltips/fondo-tooltip.webp` | sí (theme/poi.ts) |

### 5.9 `iconsCap4/datoIntroCap4.*` → `ui/graphics/`

| Origen | Destino |
|---|---|
| `datoIntroCap4.svg` | `ui/graphics/dato-intro-cap4.svg` |
| `datoIntroCap4.png` | `ui/graphics/dato-intro-cap4.png` |

> Clasificación de criterio: gráfico de intro de datos del capítulo (huérfano). Colocado bajo `ui/` porque es recurso de acompañamiento visual, no cartográfico. Revisar si se usa en la UI futura de "datos".

---

## 6. Deduplicación

**Regla:** dos archivos se consideran duplicados si:
- Son **byte-idénticos** (hash igual), o
- Son **el mismo sujeto/imagen** en formatos/versiones distintas (mismo contenido visual, p. ej. `.png` + `.webp`).

En ese caso se conserva **una sola variante**, prefiriendo `.webp` sobre `.png` (y el nombre mejor formado si son idénticos).

| Candidatos | Resolución |
|---|---|
| `curvaNivel (2).svg` vs `curva-nivel.svg` | conservar `curva-nivel.svg`; eliminar `(2)` si byte-idéntico |
| `cultivoDiver.svg` vs `cultivo-diverso.svg` | revisar hash/visual; eliminar si idéntico |
| `transformacionProduc.svg` vs `transformacion-productiva.svg` | revisar hash/visual |
| `viviendas.svg`, `viviendas2.svg` vs `vivienda-espacios-asociados.svg` | revisar hash/visual |
| `El buhido.png`/`el-buhido.png` | conservar `el-buhido.png` |
| `el paso.png`/`el-paso.webp`/`Finca El Paso.png` | conservar `el-paso.webp` |
| `Finca Las Mercedes.png`/`las-mercedes.webp` | conservar `las-mercedes.webp` |
| `la caicedo.png`/`La caicedo.png`/`la-caicedo.png` | conservar `la-caicedo.png` |
| `la virginia.png`/`la-virginia.png` | conservar `la-virginia.png` |
| `Redmunorca.png`/`Redmunorca.webp` | conservar `redmunorca.webp` |
| `fichatecnica.svg`/`technical-sheet.svg` | revisar hash/visual |
| `iconPresentation.svg`/`presentation.svg` | revisar hash/visual |
| `FondoTooltip4.webp`/`fondo-tooltip.webp` | revisar hash/visual |

Si un candidato resulta **distinto** (no duplicado), se mantiene con su nombre kebab en la carpeta destino correspondiente.

---

## 7. Actualización de Referencias en Código

| Archivo | Cambio |
|---|---|
| `src/content/theme/poi.ts` | `gota.url` → `/assets/pois/markers/location.svg`; `tooltipBg` → `/assets/ui/tooltips/fondo-tooltip.webp` |
| `src/content/chapter-4/shared.ts` | `const ICONS = '/assets/iconsCap4'` → `'/assets/legends'` |
| Todos los `chapter-4/*/legends.ts` (11 archivos) | cada argumento de ícono de `legenda()` a su nombre kebab (§5.1) |
| `src/content/chapter-4/introduccion/legends.ts` | `riosPrincipales.svg` → `rios-principales.svg`; override de `icon` → `/assets/legends/rios-principales.svg` |
| `src/content/chapter-4/introduccion/pois.ts` | `POPUP_NODE` → `/assets/pois/markers/popup-node.svg` |
| `src/content/chapter-2/cali/pois.ts` (3 ocurrencias) | `chicasComunicativas.webp` → `/assets/pois/photos/organizaciones/chicas-comunicativas.webp`; `mujeresDelOriente.webp` → `/assets/pois/photos/organizaciones/mujeres-del-oriente.webp` |

> No hay otras referencias en `src/` (verificado por grep). Las referencias en `docs/*.md` son descriptivas (no funcionales) y quedan fuera de alcance salvo las de `MANTENER` si así lo indica el usuario.

---

## 8. Fuera de Alcance (YAGNI)

- Mover/renombrar `maps/` (cartografía ya organizada) — se respeta intacta.
- Refactorizar el import por base `ICONS = '/assets/legends'` en un módulo de constantes global (se mantiene el patrón actual: base en `chapter-4/shared.ts`).
- Reescribir documentos en `docs/` que enumeran los assets con sus nombres antiguos (BITACORA, GUIDE, MEMORIA_TECNICA, PLAN_ATLAS).
- Mover assets de `res/`, `tiles/`, `contexto/` u otras fuentes fuera de `public/`.
- `ECOSYSTEMS_LAYERS` en `chapter-1/ecosistemas/layers-shared.ts` es código muerto no cableado (su `LOW` apunta a `img/Capas/...`, ruta inexistente) — se deja como está.

---

## 9. Verificación

1. `pnpm typecheck` — PASS.
2. `pnpm lint` — sin errores nuevos.
3. `pnpm test` — todos PASS (ningún test referencia assets movidos).
4. `pnpm build` — PASS.
5. Navegador: capítulo 4 (leyendas y POIs), capítulo 2 Cali (POIs con fotos de organizaciones), tooltips y sidebar sin errores de red 404 en assets.
6. Certificar que todas las carpetas fuente quedan vacías y se eliminan.