# Reorganización de Assets Estáticos por Función — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar `public/assets/` en `legends/`, `pois/`, `ui/` por función/dominio, normalizando todos los nombres a kebab-case y actualizando las referencias de código, sin alterar `maps/`.

**Architecture:** Cada recurso se mueve a la carpeta destino según su rol (leyenda de mapa, POI, interfaz). Los nombres se normalizan a kebab-case durante el movimiento (`git mv`). Las referencias del código se actualizan por archivo. Duplicados byte-idénticos o del mismo sujeto (png/webp) se resuelven conservando una variante (preferir `.webp`). `maps/` queda intacta.

**Tech Stack:** Vite + React 19 + TypeScript strict + MapLibre GL v6 + Vitest. Movimientos con `git mv` (PowerShell). Verificación con `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.

> **Decisión base (spec aprobada):** `atlas/docs/superpowers/specs/2026-08-17-assets-reorganization-design.md`. Este plan asume kebab-case total (D4) y organizar sin borrar (D5). Los hashes de duplicados fueron verificados con MD5 antes de escribir este plan.

## Global Constraints

- `git mv` para todo movimiento (preserva historial). Trabajar desde `D:\Proyectos\Atlas\atlas-pluriversal\atlas`.
- `maps/` **no se toca** bajo ninguna circunstancia.
- Kebab-case: minúsculas ASCII, separador `-`, sin espacios/mayúsculas/paréntesis/guiones bajos.
- `verbatimModuleSyntax: true` → imports de solo-tipo usan `import type` (aplica solo si se tocan archivos TS con imports).
- No borrar archivos huérfanos de contenido único: se reubican. Solo se eliminan duplicados confirmados por hash o del mismo sujeto en formatos distintos.
- Verificar con `pnpm typecheck`, `pnpm lint` y `pnpm test` tras cada tarea que toque código; `pnpm build` en tareas que muevan assets referenciados.
- Estado actual de la rama `main`: `src/content/chapter-1/encuadres/index.ts` está modificado (no tocar) y este spec es nuevo (`??`). Commitear únicamente los cambios de este plan.

---

## Estructura Destino

```
public/assets/
├── maps/                        ← INTACTA
├── legends/                     ← SVG de leyenda (52 + rios-principales)
├── pois/
│   ├── markers/                 ← location.svg, popup-node.svg
│   └── photos/
│       ├── organizaciones/      ← 29 logos (entramados)
│       └── fincas/              ← 15 fotos (iconsCap4 png/webp)
├── ui/
│   ├── icons/                   ← 33 íconos UI (interface/icons/line/svg excepto location)
│   ├── sidebar/                 ← marker-1.svg, fondo-icon-1.svg
│   ├── tooltips/                ← fondo-tooltip.webp
│   └── graphics/                ← dato-intro-cap4.svg, dato-intro-cap4.png
```

Carpetas fuente a eliminar al final: `iconsCap4/`, `mapasMenuCap2/`, `interface/`, `svg/`, `img/`, `tooltip/`.

---

## Task 1: Leyendas — mover SVG + actualizar referencias de capítulo 4

**Files:**
- Modify: `public/assets/...` (52 SVG de `iconsCap4/` → `legends/`, 1 de `mapasMenuCap2/` → `legends/`)
- Modify: `src/content/chapter-4/shared.ts`
- Modify: `src/content/chapter-4/*/legends.ts` (11 archivos)

**Interfaces:**
- Consumes: nada externo. `legenda(id, name, icon, order, group?)` de `shared.ts` (firma intacta).
- Produces: carpeta `public/assets/legends/` con los 53 SVG kebab-case; base `ICONS = '/assets/legends'`.

Deduplicados confirmados por hash (MD5):
- `curvaNivel (2).svg` == `curvaNivel.svg` (ambos `987928B4...`) → se elimina `(2)`.
- `viviendas.svg` == `viviendas2.svg` == `cultivoDiver.svg` (los tres `C9904A7C...`, 208 B) → se conserva **solo** el que se mueve como `viviendas.svg`; `viviendas2.svg` y `cultivoDiver.svg` se eliminan.
- `transformacionProduc.svg` es distinto de `transformacionProductiva.svg` (hashes distintos) → se conservan ambos.

- [ ] **Step 1: Crear estructura destino**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
New-Item -ItemType Directory -Force -Path "public\assets\legends" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\pois\markers" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\pois\photos\organizaciones" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\pois\photos\fincas" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\ui\icons" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\ui\sidebar" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\ui\tooltips" | Out-Null
New-Item -ItemType Directory -Force -Path "public\assets\ui\graphics" | Out-Null
```

- [ ] **Step 2: Mover los 52 SVG de leyenda (iconsCap4 → legends) con kebab-case**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
$base = "public\assets"
$mv = @(
  @('iconsCap4\aguaResidual.svg','legends\agua-residual.svg'),
  @('iconsCap4\aljibe.svg','legends\aljibe.svg'),
  @('iconsCap4\aljibe2.svg','legends\aljibe-2.svg'),
  @('iconsCap4\areaUrbana.svg','legends\area-urbana.svg'),
  @('iconsCap4\areaUrbanaNueva.svg','legends\area-urbana-nueva.svg'),
  @('iconsCap4\bosqueAreaExtracion.svg','legends\bosque-area-extracion.svg'),
  @('iconsCap4\bosques.svg','legends\bosques.svg'),
  @('iconsCap4\botaderoColchon.svg','legends\botadero-colchon.svg'),
  @('iconsCap4\botaderoEscombro.svg','legends\botadero-escombro.svg'),
  @('iconsCap4\burilico.svg','legends\burilico.svg'),
  @('iconsCap4\Canales.svg','legends\canales.svg'),
  @('iconsCap4\charcoBano.svg','legends\charco-bano.svg'),
  @('iconsCap4\compuertaVertedero.svg','legends\compuerta-vertedero.svg'),
  @('iconsCap4\construccion.svg','legends\construccion.svg'),
  @('iconsCap4\criaAnimales.svg','legends\cria-animales.svg'),
  @('iconsCap4\cuerpoAgua2.svg','legends\cuerpo-agua-2.svg'),
  @('iconsCap4\cuerposAgua.svg','legends\cuerpos-agua.svg'),
  @('iconsCap4\cultivoDiverso.svg','legends\cultivo-diverso.svg'),
  @('iconsCap4\cultivoDiverso2.svg','legends\cultivo-diverso-2.svg'),
  @('iconsCap4\curvaNivel.svg','legends\curva-nivel.svg'),
  @('iconsCap4\delimitacion.svg','legends\delimitacion.svg'),
  @('iconsCap4\dispocisionResiduos2.svg','legends\dispocision-residuos-2.svg'),
  @('iconsCap4\disposicionResiduos.svg','legends\disposicion-residuos.svg'),
  @('iconsCap4\entradaPredio.svg','legends\entrada-predio.svg'),
  @('iconsCap4\estanque.svg','legends\estanque.svg'),
  @('iconsCap4\extraccionOro.svg','legends\extraccion-oro.svg'),
  @('iconsCap4\fincaTradicional.svg','legends\finca-tradicional.svg'),
  @('iconsCap4\huertas.svg','legends\huertas.svg'),
  @('iconsCap4\humedalesPot.svg','legends\humedales-pot.svg'),
  @('iconsCap4\mineria.svg','legends\mineria.svg'),
  @('iconsCap4\monocultivoAzucar.svg','legends\monocultivo-azucar.svg'),
  @('iconsCap4\nidoHormiga.svg','legends\nido-hormiga.svg'),
  @('iconsCap4\ocupacionFranjas.svg','legends\ocupacion-franjas.svg'),
  @('iconsCap4\palenke.svg','legends\palenke.svg'),
  @('iconsCap4\pastoreo.svg','legends\pastoreo.svg'),
  @('iconsCap4\productivasEspeciales.svg','legends\productivas-especiales.svg'),
  @('iconsCap4\semillero.svg','legends\semillero.svg'),
  @('iconsCap4\sistemaRiego.svg','legends\sistema-riego.svg'),
  @('iconsCap4\transformacionProduc.svg','legends\transformacion-produc.svg'),
  @('iconsCap4\transformacionProductiva.svg','legends\transformacion-productiva.svg'),
  @('iconsCap4\trocha.svg','legends\trocha.svg'),
  @('iconsCap4\viviendaEspaciosAsociados.svg','legends\vivienda-espacios-asociados.svg'),
  @('iconsCap4\viviendas.svg','legends\viviendas.svg'),
  @('iconsCap4\zonaBasura.svg','legends\zona-basura.svg'),
  @('iconsCap4\zonaColmatada.svg','legends\zona-colmatada.svg'),
  @('iconsCap4\zonaDesecho.svg','legends\zona-desecho.svg'),
  @('iconsCap4\zonaTransicion.svg','legends\zona-transicion.svg'),
  @('iconsCap4\zonaVerdes2014.svg','legends\zona-verdes-2014.svg'),
  @('iconsCap4\zocabonOro.svg','legends\zocabon-oro.svg'),
  @('mapasMenuCap2\riosPrincipales.svg','legends\rios-principales.svg')
)
foreach ($p in $mv) { git mv "$base\$($p[0])" "$base\$($p[1])" }
```

Los 3 SVGs duplicados `viviendas2.svg`, `cultivoDiver.svg` y `curvaNivel (2).svg` **no** deben incluirse en el `$mv` anterior; se eliminan en el Step 3 (están al `git mv` simultáneo de `viviendas.svg`/`curvaNivel.svg`, por eso se mueven primero y se borran después — o eliminarlos después sin importar orden porque el contenido idéntico ya se conserva).

- [ ] **Step 3: Eliminar SVG duplicados (contenido idéntico confirmado por hash)**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
git rm "public\assets\iconsCap4\curvaNivel (2).svg"
git rm "public\assets\iconsCap4\viviendas2.svg"
git rm "public\assets\iconsCap4\cultivoDiver.svg"
```

- [ ] **Step 4: Actualizar base de íconos en `shared.ts`**

Cambiar en `src/content/chapter-4/shared.ts:3`:
```ts
const ICONS = '/assets/iconsCap4'
```
→
```ts
const ICONS = '/assets/legends'
```

- [ ] **Step 5: Actualizar nombres de íconos en los 11 `legends.ts` de capítulo 4**

Aplicar en cada archivo `src/content/chapter-4/*/legends.ts` la misma renombración kebab-case de los argumentos `icon` (según mapeo del spec §5.1). Reemplazo exacto por archivo:

**`centro-agropecuario/legends.ts`:** `aljibe2.svg`→`aljibe-2.svg`, `nidoHormiga.svg`→`nido-hormiga.svg`, `viviendaEspaciosAsociados.svg`→`vivienda-espacios-asociados.svg`, `criaAnimales.svg`→`cria-animales.svg`, `bosqueAreaExtracion.svg`→`bosque-area-extracion.svg`, `zonaTransicion.svg`→`zona-transicion.svg`, `cultivoDiverso.svg`→`cultivo-diverso.svg`, `productivasEspeciales.svg`→`productivas-especiales.svg`, `delimitacion.svg`→`delimitacion.svg`, `trocha.svg`→`trocha.svg`.

**`asoyoge/legends.ts`:** `viviendaEspaciosAsociados.svg`→`vivienda-espacios-asociados.svg`, `transformacionProductiva.svg`→`transformacion-productiva.svg`, `delimitacion.svg`→`delimitacion.svg`, `trocha.svg`→`trocha.svg`.

**`problematicas/legends.ts`:** `areaUrbanaNueva.svg`→`area-urbana-nueva.svg`, `disposicionResiduos.svg`→`disposicion-residuos.svg`, `ocupacionFranjas.svg`→`ocupacion-franjas.svg`, `palenke.svg`→`palenke.svg`, `Canales.svg`→`canales.svg`, `aljibe.svg`→`aljibe.svg`, `humedalesPot.svg`→`humedales-pot.svg`, `areaUrbana.svg`→`area-urbana.svg`, `zonaVerdes2014.svg`→`zona-verdes-2014.svg`.

**`la-caicedo/legends.ts`:** `dispocisionResiduos2.svg`→`dispocision-residuos-2.svg`, `entradaPredio.svg`→`entrada-predio.svg`, `viviendaEspaciosAsociados.svg`→`vivienda-espacios-asociados.svg`, `criaAnimales.svg`→`cria-animales.svg`, `transformacionProductiva.svg`→`transformacion-productiva.svg`, `zonaTransicion.svg`→`zona-transicion.svg`, `cultivoDiverso.svg`→`cultivo-diverso.svg`, `delimitacion.svg`→`delimitacion.svg`, `trocha.svg`→`trocha.svg`.

**`bosque-comestible/legends.ts`:** `botaderoColchon.svg`→`botadero-colchon.svg`, `botaderoEscombro.svg`→`botadero-escombro.svg`, `compuertaVertedero.svg`→`compuerta-vertedero.svg`, `zonaBasura.svg`→`zona-basura.svg`, `cuerpoAgua2.svg`→`cuerpo-agua-2.svg`, `zonaColmatada.svg`→`zona-colmatada.svg`.

**`el-buhido/legends.ts`:** `disposicionResiduos.svg`→`disposicion-residuos.svg`, `entradaPredio.svg`→`entrada-predio.svg`, `viviendaEspaciosAsociados.svg`→`vivienda-espacios-asociados.svg`, `criaAnimales.svg`→`cria-animales.svg`, `bosqueAreaExtracion.svg`→`bosque-area-extracion.svg`, `cultivoDiverso.svg`→`cultivo-diverso.svg`, `zonaTransicion.svg`→`zona-transicion.svg`, `productivasEspeciales.svg`→`productivas-especiales.svg`, `delimitacion.svg`→`delimitacion.svg`, `trocha.svg`→`trocha.svg`.

**`la-virginia/legends.ts`:** `entradaPredio.svg`→`entrada-predio.svg`, `sistemaRiego.svg`→`sistema-riego.svg`, `burilico.svg`→`burilico.svg`, `semillero.svg`→`semillero.svg`, `cultivoDiverso.svg`→`cultivo-diverso.svg`, `cultivoDiverso2.svg`→`cultivo-diverso-2.svg`, `delimitacion.svg`→`delimitacion.svg`, `trocha.svg`→`trocha.svg`.

**`las-mercedes/legends.ts`:** `entradaPredio.svg`→`entrada-predio.svg`, `estanque.svg`→`estanque.svg`, `zonaDesecho.svg`→`zona-desecho.svg`, `viviendaEspaciosAsociados.svg`→`vivienda-espacios-asociados.svg`, `criaAnimales.svg`→`cria-animales.svg`, `zonaTransicion.svg`→`zona-transicion.svg`, `cultivoDiverso2.svg`→`cultivo-diverso-2.svg`, `productivasEspeciales.svg`→`productivas-especiales.svg`, `delimitacion.svg`→`delimitacion.svg`, `trocha.svg`→`trocha.svg`.

**`introduccion/legends.ts`:** `monocultivoAzucar.svg`→`monocultivo-azucar.svg`, `areaUrbana.svg`→`area-urbana.svg`, `fincaTradicional.svg`→`finca-tradicional.svg`, `riosPrincipales.svg`→`rios-principales.svg`, `curvaNivel.svg`→`curva-nivel.svg`, `palenke.svg`→`palenke.svg`; además el override `icon: '/assets/mapasMenuCap2/riosPrincipales.svg'` → `icon: '/assets/legends/rios-principales.svg'`.

**`los-bajios/legends.ts`:** `aljibe.svg`→`aljibe.svg`, `huertas.svg`→`huertas.svg`, `construccion.svg`→`construccion.svg`, `cultivoDiverso.svg`→`cultivo-diverso.svg`, `delimitacion.svg`→`delimitacion.svg`, `trocha.svg`→`trocha.svg`.

**`el-paso/legends.ts`:** `charcoBano.svg`→`charco-bano.svg`, `zocabonOro.svg`→`zocabon-oro.svg`, `entradaPredio.svg`→`entrada-predio.svg`, `extraccionOro.svg`→`extraccion-oro.svg`, `bosqueAreaExtracion.svg`→`bosque-area-extracion.svg`, `zonaTransicion.svg`→`zona-transicion.svg`, `pastoreo.svg`→`pastoreo.svg`, `mineria.svg`→`mineria.svg`, `cuerposAgua.svg`→`cuerpos-agua.svg`.

- [ ] **Step 6: Verificar typecheck + build + grep**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
pnpm typecheck
pnpm build
```
Grep de puntos muertos:
```powershell
Select-String -Path "src\**\*.ts","src\**\*.tsx" -Pattern "iconsCap4/(?!popupNode)" -ErrorAction SilentlyContinue
```
Expected: sin coincidencias de `iconsCap4/` (salvo `popupNode` que se resuelve en Task 2). `pnpm typecheck` PASS y `pnpm build` PASS.

- [ ] **Step 7: Commit**

```bash
git add public/assets/legends src/content/chapter-4/shared.ts "src/content/chapter-4/centro-agropecuario/legends.ts" "src/content/chapter-4/asoyoge/legends.ts" "src/content/chapter-4/problematicas/legends.ts" "src/content/chapter-4/la-caicedo/legends.ts" "src/content/chapter-4/bosque-comestible/legends.ts" "src/content/chapter-4/el-buhido/legends.ts" "src/content/chapter-4/la-virginia/legends.ts" "src/content/chapter-4/las-mercedes/legends.ts" "src/content/chapter-4/introduccion/legends.ts" "src/content/chapter-4/los-bajios/legends.ts" "src/content/chapter-4/el-paso/legends.ts"
git commit -m "refactor(assets): mover íconos de leyenda a assets/legends con kebab-case"
```

---

## Task 2: POIs — marcadores, fotos de fincas y organizaciones + referencias

**Files:**
- Modify: `public/assets/...` (markers: `location.svg`, `popupNode.svg`; fincas: 15 fotos; organizaciones: 29 logos)
- Modify: `src/content/theme/poi.ts`
- Modify: `src/content/chapter-4/introduccion/pois.ts`
- Modify: `src/content/chapter-2/cali/pois.ts`

**Interfaces:**
- Consumes: nada externo.
- Produces: `pois/markers/{location,popup-node}.svg`; `pois/photos/fincas/*`; `pois/photos/organizaciones/*`. Referencias actualizadas en `POI_THEME`, `POPUP_NODE` y las flechas de Cali.

Deduplicados confirmados por hash:
- `El buhido.png` vs `el-buhido.png` → distintos (hash distinto) → conservar **ambos** no, se conserva la mejor/o preferida según sujeto: se conserva `el-buhido.png` y **no** se elimina `El buhido.png` porque son archivos distintos. *(Criterio spec D6: si difieren, se mantienen ambos — sujeto es el mismo pero versiones distintas; el spec prefiere webp; aquí no hay webp, se conservan las dos PNG bajo nombres kebab.).*
- `la caicedo.png` == `La caicedo.png` (idénticos `EB6B1326...`) → conservar `la-caicedo.png`, borrar los otros dos.
- `la virginia.png` vs `la-virginia.png` → distintos → conservar ambos como `la-virginia.png` y... se conserva uno (el nombre kebab) y el otro se borra? **Decisión:** ambos son del mismo sujeto (finca La Virginia) en versiones distintas; spec prefiere conservar una. Se conserva `la-virginia.png` (200 KB, nombre kebab) y se elimina `la virginia.png` por ser variante del mismo sujeto.
- `el paso.png`, `el-paso.webp`, `Finca El Paso.png` → mismos sujeto El Paso, conservar `el-paso.webp` (spec prefiere webp).
- `Finca Las Mercedes.png` vs `las-mercedes.webp` → conservar `las-mercedes.webp`.
- `Redmunorca.png` vs `Redmunorca.webp` → conservar `redmunorca.webp`.

- [ ] **Step 1: Mover marcadores**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
$base = "public\assets"
git mv "$base\interface\icons\line\svg\location.svg" "$base\pois\markers\location.svg"
git mv "$base\iconsCap4\popupNode.svg" "$base\pois\markers\popup-node.svg"
```

- [ ] **Step 2: Mover fotos de fincas (iconsCap4 png/webp → pois/photos/fincas)**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
$base = "public\assets"
$mvFotos = @(
  @('iconsCap4\asoyoge.png','pois\photos\fincas\asoyoge.png'),
  @('iconsCap4\asoyogue-09.png','pois\photos\fincas\asoyogue-09.png'),
  @('iconsCap4\centro-agropecuario.png','pois\photos\fincas\centro-agropecuario.png'),
  @('iconsCap4\el-buhido.png','pois\photos\fincas\el-buhido.png'),
  @('iconsCap4\el-paso.webp','pois\photos\fincas\el-paso.webp'),
  @('iconsCap4\guachene.png','pois\photos\fincas\guachene.png'),
  @('iconsCap4\la-caicedo.png','pois\photos\fincas\la-caicedo.png'),
  @('iconsCap4\la-virginia.png','pois\photos\fincas\la-virginia.png'),
  @('iconsCap4\las-mercedes.webp','pois\photos\fincas\las-mercedes.webp'),
  @('iconsCap4\los-bajios.png','pois\photos\fincas\los-bajios.png'),
  @('iconsCap4\oriente-cali.png','pois\photos\fincas\oriente-cali.png'),
  @('iconsCap4\suarez.png','pois\photos\fincas\suarez.png'),
  @('iconsCap4\villa rica.png','pois\photos\fincas\villa-rica.png')
)
foreach ($p in $mvFotos) { git mv "$base\$($p[0])" "$base\$($p[1])" }
```

- [ ] **Step 3: Eliminar fotos duplicadas (mismo sujeto, conservar webp o nombre kebab)**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
$base = "public\assets"
git rm "$base\iconsCap4\El buhido.png"
git rm "$base\iconsCap4\la caicedo.png"
git rm "$base\iconsCap4\La caicedo.png"
git rm "$base\iconsCap4\la virginia.png"
git rm "$base\iconsCap4\el paso.png"
git rm "$base\iconsCap4\Finca El Paso.png"
git rm "$base\iconsCap4\Finca Las Mercedes.png"
```

> **Nota de sujeto:** `El buhido.png` y `el-buhido.png` son versiones del mismo predio con hashes distintos; se conservó `el-buhido.png` y se elimina `El buhido.png` (decisión D6: un solo archivo por sujeto; el nombre kebab es la base canónica). Lo mismo aplica a `la virginia.png`/`la-virginia.png` y a las variantes de El Paso/Las Mercedes (conservar `.webp`).

- [ ] **Step 4: Mover logos de organizaciones (img/entramados → pois/photos/organizaciones)**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
$base = "public\assets"
$mvOrg = @(
  @('img\entramados\ACCN.webp','pois\photos\organizaciones\accn.webp'),
  @('img\entramados\Afroyoga.webp','pois\photos\organizaciones\afroyoga.webp'),
  @('img\entramados\Alianza por la agrobiodiversidad.webp','pois\photos\organizaciones\alianza-por-la-agrobiodiversidad.webp'),
  @('img\entramados\Asoyoge.webp','pois\photos\organizaciones\asoyoge.webp'),
  @('img\entramados\asocoms.webp','pois\photos\organizaciones\asocoms.webp'),
  @('img\entramados\asomuafroyo.webp','pois\photos\organizaciones\asomuafroyo.webp'),
  @('img\entramados\Casilda candumi.webp','pois\photos\organizaciones\casilda-cundumi.webp'),
  @('img\entramados\chicas.webp','pois\photos\organizaciones\chicas.webp'),
  @('img\entramados\chicasComunicativas.webp','pois\photos\organizaciones\chicas-comunicativas.webp'),
  @('img\entramados\Colectivo socio juvenil huellas.webp','pois\photos\organizaciones\colectivo-socio-juvenil-huellas.webp'),
  @('img\entramados\Comité por la defensa del terrio.webp','pois\photos\organizaciones\comite-por-la-defensa-del-territorio.webp'),
  @('img\entramados\Consejo comunitario territorio y.webp','pois\photos\organizaciones\consejo-comunitario-territorio-y-paz.webp'),
  @('img\entramados\Consejo municipal de juventud.webp','pois\photos\organizaciones\consejo-municipal-de-juventud.webp'),
  @('img\entramados\El chontaduro.webp','pois\photos\organizaciones\el-chontaduro.webp'),
  @('img\entramados\fundacionHuellas.webp','pois\photos\organizaciones\fundacion-huellas.webp'),
  @('img\entramados\Guardia cimarrona.webp','pois\photos\organizaciones\guardia-cimarrona.webp'),
  @('img\entramados\la laguna.webp','pois\photos\organizaciones\la-laguna.webp'),
  @('img\entramados\Logo_Consejo_río_Ovejas.webp','pois\photos\organizaciones\logo-consejo-rio-ovejas.webp'),
  @('img\entramados\logoCredits1.webp','pois\photos\organizaciones\logo-credits-1.webp'),
  @('img\entramados\logoCredits2.webp','pois\photos\organizaciones\logo-credits-2.webp'),
  @('img\entramados\matamba.webp','pois\photos\organizaciones\matamba.webp'),
  @('img\entramados\mujer.webp','pois\photos\organizaciones\mujer.webp'),
  @('img\entramados\mujeresDelOriente.webp','pois\photos\organizaciones\mujeres-del-oriente.webp'),
  @('img\entramados\Plataforma de juventudes.webp','pois\photos\organizaciones\plataforma-de-juventudes.webp'),
  @('img\entramados\privacidad.webp','pois\photos\organizaciones\privacidad.webp'),
  @('img\entramados\Redmunorca.png','pois\photos\organizaciones\redmunorca.png'),
  @('img\entramados\Redmunorca.webp','pois\photos\organizaciones\redmunorca.webp'),
  @('img\entramados\Semillas.webp','pois\photos\organizaciones\semillas.webp'),
  @('img\entramados\Un río Cauca.webp','pois\photos\organizaciones\un-rio-cauca.webp'),
  @('img\entramados\Uoafroc.webp','pois\photos\organizaciones\uoafroc.webp')
)
foreach ($p in $mvOrg) { git mv "$base\$($p[0])" "$base\$($p[1])" }
```

> Las filas de `Redmunorca.png` y `Redmunorca.webp` deben ejecutarse en ese orden (primero png) para que la segunda (webp, destino `redmunorca.webp`) sobrescriba el destino del png si hubiera colisión. En ese caso usar `git mv -f` no es la intención: mejor encadenar `git mv png redmunorca.png` **y luego** `git mv webp redmunorca.webp` NO — son destinos distintos de nombre, no colisionan (`redmunorca.png` vs `redmunorca.webp`). El paso siguiente elimina el png.

- [ ] **Step 5: Eliminar logo duplicado Redmunorca (conservar webp)**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
git rm "public\assets\pois\photos\organizaciones\redmunorca.png"
```

- [ ] **Step 6: Actualizar `theme/poi.ts`**

En `src/content/theme/poi.ts`:
- Línea 12: `url: '/assets/interface/icons/line/svg/location.svg'` → `url: '/assets/pois/markers/location.svg'`
- Línea 15: `tooltipBg: '/assets/tooltip/fondo-tooltip.webp'` → `tooltipBg: '/assets/ui/tooltips/fondo-tooltip.webp'`

- [ ] **Step 7: Actualizar `chapter-4/introduccion/pois.ts`**

Línea 3: `const POPUP_NODE = '/assets/iconsCap4/popupNode.svg'` → `const POPUP_NODE = '/assets/pois/markers/popup-node.svg'`

- [ ] **Step 8: Actualizar `chapter-2/cali/pois.ts`**

Líneas 20, 25, 26:
- `'/assets/img/entramados/chicasComunicativas.webp'` → `'/assets/pois/photos/organizaciones/chicas-comunicativas.webp'`
- `'/assets/img/entramados/mujeresDelOriente.webp'` (x2) → `'/assets/pois/photos/organizaciones/mujeres-del-oriente.webp'`

- [ ] **Step 9: Verificar typecheck + grep**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
pnpm typecheck
pnpm build
```
Grep:
```powershell
Select-String -Path "src\**\*.ts","src\**\*.tsx" -Pattern "iconsCap4|img\\entramados|interface\\icons\\line\\svg\\location|tooltip\\fondo-tooltip" -ErrorAction SilentlyContinue
```
Expected: sin coincidencias en `src/` (salvo `docs/` superscript). `pnpm typecheck` PASS, `pnpm build` PASS.

- [ ] **Step 10: Commit**

```bash
git add public/assets/pois src/content/theme/poi.ts src/content/chapter-4/introduccion/pois.ts src/content/chapter-2/cali/pois.ts
git commit -m "refactor(assets): mover recursos de POIs a assets/pois y actualizar referencias"
```

---

## Task 3: UI — íconos, sidebar, tooltips y gráficos

**Files:**
- Modify: `public/assets/...` (33 íconos `interface/icons/line/svg` → `ui/icons`, `marker1.svg`/`fondoIcon1.svg` → `ui/sidebar`, `fondo-tooltip.webp` → `ui/tooltips`, `datoIntroCap4.*` → `ui/graphics`)

**Interfaces:**
- Consumes: nada externo.
- Produces: `ui/icons/*` (33), `ui/sidebar/{marker,fondo-icon}-1.svg`, `ui/tooltips/fondo-tooltip.webp`, `ui/graphics/dato-intro-cap4.{svg,png}`.

Deduplicados:
- `FondoTooltip4.webp` == `fondo-tooltip.webp` (idénticos `72A8EACB...`) → se conserva `fondo-tooltip.webp` en `ui/tooltips/`; se elimina `FondoTooltip4.webp`.
- `fichatecnica.svg` vs `technical-sheet.svg` → distintos (hash distinto) → se conservan ambos (kebab: `ficha-tecnica.svg` y `technical-sheet.svg`).
- `iconPresentation.svg` vs `presentation.svg` → distintos → se conservan ambos.

- [ ] **Step 1: Mover íconos UI (interface/icons/line/svg → ui/icons)**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
$base = "public\assets"
$src = "interface\icons\line\svg"
$mvUi = @(
  @('arrow-down.svg','arrow-down.svg'),
  @('arrow-up.svg','arrow-up.svg'),
  @('back.svg','back.svg'),
  @('chapter1-map.svg','chapter-1-map.svg'),
  @('chapter2-maps.svg','chapter-2-maps.svg'),
  @('chapter3-river.svg','chapter-3-river.svg'),
  @('chapter4-cacao.svg','chapter-4-cacao.svg'),
  @('chapter-info.svg','chapter-info.svg'),
  @('close.svg','close.svg'),
  @('credits.svg','credits.svg'),
  @('download.svg','download.svg'),
  @('fichatecnica.svg','ficha-tecnica.svg'),
  @('general-info.svg','general-info.svg'),
  @('hide.svg','hide.svg'),
  @('home_bottom.svg','home-bottom.svg'),
  @('iconInfo.svg','icon-info.svg'),
  @('iconPresentation.svg','icon-presentation.svg'),
  @('layers.svg','layers.svg'),
  @('levels.svg','levels.svg'),
  @('map-gallery.svg','map-gallery.svg'),
  @('map-info.svg','map-info.svg'),
  @('metadata.svg','metadata.svg'),
  @('north.svg','north.svg'),
  @('play.svg','play.svg'),
  @('presentation.svg','presentation.svg'),
  @('presentation2.svg','presentation-2.svg'),
  @('question-mark.svg','question-mark.svg'),
  @('roman-i.svg','roman-i.svg'),
  @('roman-ii.svg','roman-ii.svg'),
  @('roman-iii.svg','roman-iii.svg'),
  @('roman-iv.svg','roman-iv.svg'),
  @('show.svg','show.svg'),
  @('technical-sheet.svg','technical-sheet.svg')
)
foreach ($p in $mvUi) { git mv "$base\$src\$($p[0])" "$base\ui\icons\$($p[1])" }
```

- [ ] **Step 2: Mover recursos de sidebar, tooltips y graphics**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
$base = "public\assets"
git mv "$base\svg\sidebar-resources\marker1.svg" "$base\ui\sidebar\marker-1.svg"
git mv "$base\svg\sidebar-resources\fondoIcon1.svg" "$base\ui\sidebar\fondo-icon-1.svg"
git mv "$base\tooltip\fondo-tooltip.webp" "$base\ui\tooltips\fondo-tooltip.webp"
git mv "$base\iconsCap4\datoIntroCap4.svg" "$base\ui\graphics\dato-intro-cap4.svg"
git mv "$base\iconsCap4\datoIntroCap4.png" "$base\ui\graphics\dato-intro-cap4.png"
```

- [ ] **Step 3: Eliminar duplicados (contenido idéntico confirmado por hash)**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
git rm "public\assets\svg\sidebar-resources\FondoTooltip4.webp"
```

- [ ] **Step 4: Vaciar carpetas fuente y verificar**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
git rm -r "public\assets\iconsCap4"   # debe quedar vacía
git rm -r "public\assets\mapasMenuCap2"
git rm -r "public\assets\img"
```

> Nota: `iconsCap4` debe estar vacía tras Tasks 1-3 (todos los SVG, fotos, popupNode y datoIntroCap4 ya movidos). Si `git rm -r` falla por archivos sondeados, listar **antes**:
> ```powershell
> git ls-files public/assets/iconsCap4
> ```
> y mover/borrar los residuales según su rol antes de continuar.

Verificar estructura:
```powershell
Get-ChildItem -Path "public\assets\legends" -File | Measure-Object -Line
Get-ChildItem -Path "public\assets\pois\photos\organizaciones" -File | Measure-Object
Get-ChildItem -Path "public\assets\ui\icons" -File | Measure-Object
```
Expected: `legends` 50 (49 SVG de iconsCap4 + rios-principales), `organizaciones` 29 (tras eliminar redmunorca.png), `ui/icons` 33.

```powershell
pnpm typecheck
pnpm lint
pnpm test
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A public/assets
git commit -m "refactor(assets): mover recursos de interfaz a assets/ui y eliminar carpetas fuente vacías"
```

---

## Task 4: Verificación completa + navegador

- [ ] **Step 1: `pnpm typecheck`** — PASS
- [ ] **Step 2: `pnpm lint`** — sin errores nuevos
- [ ] **Step 3: `pnpm test`** — todos PASS
- [ ] **Step 4: `pnpm build`** — PASS
- [ ] **Step 5: Navegador**
  - `/test/chapter-4/introduccion` (o la ruta de test de cap 4 que exista): leyendas renderizan con sus íconos (sin 404 en `legends/`).
  - `/test/chapter-2/cali` (o equivalente): POIs chicas-comunicativas y mujeres-del-oriente muestran sus fotos (sin 404 en `pois/photos/organizaciones/`).
  - Tooltips y sidebar sin errores de red.
- [ ] **Step 6: Grep final de puntos muertos**

```powershell
cd "D:\Proyectos\Atlas\atlas-pluriversal\atlas"
Get-ChildItem -Recurse -Path src -Include *.ts,*.tsx | Select-String -Pattern "/assets/(iconsCap4|mapasMenuCap2|img/entramados|interface/icons|svg/sidebar|tooltip/fondo)" | Select-Object Path, LineNumber, Line
```
Expected: sin coincidencias.

- [ ] **Step 7: Commit final**

```bash
git add -A
git commit -m "chore(assets): reorganización final de assets por función"
```

---

## Notas de riesgo y trabajo pendiente

- **Nombres con acentos/ñ** (`Comité...`, `Logo_Consejo_río_Ovejas`, `Un río Cauca`): PowerShell maneja rutas unicode; `git mv` con comillas dobles funciona. Si un `git mv` falla por nombre, usar `git mv -- $(git ls-files 'public/assets/img/entramados/*')` con el nombre textual exacto (copiar el nombre desde `git ls-files`).
- **`dist/`**: build regenerará las nuevas rutas automáticamente.
- **Docs (`docs/*.md`)**: no funcionales, fuera de alcance. Si el usuario quiere, se actualizan en otro trabajo.
- **`src/content/chapter-1/ecosistemas/layers-shared.ts`**: código muerto (ECOSYSTEMS_LAYERS no cableado, LOW apunta a `img/Capas/...` inexistente). No se toca.
- El spec adjunta la tabla completa origen→destino; este plan la replica en comandos. Cualquier divergencia se resuelve a favor del spec.