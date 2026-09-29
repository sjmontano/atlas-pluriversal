# Spec v2: Perfil de la cuenca full-bleed + unificación large/xxxl

Fecha: 2026-09-29 · Enfoque: A (unificación global) + carrusel full-bleed.
Revisión v2: la imagen objetivo exige imagen al 100% sin recorte ni bordes,
controles sobre la imagen y X arriba-derecha. El spec v1 (solo `hideHeader`)
no bastaba: el carousel actual es boxed (`52vh`, radio, sombra,
`object-fit: cover` que recorta).

## 1. Problema

`cap1-perfil-cuenca` muestra header completo + carrusel en caja recortada.
Debe verse como la imagen objetivo: panorámica completa, flechas ‹ ›
centradas verticalmente sobre la imagen, dots abajo-centro sobre la imagen,
X arriba-derecha, sin header/título/icono/decorador.

## 2. Decisiones tomadas con el usuario

1. Conservar las 3 imágenes (`perfil-1/3/2.svg`) navegables.
2. X arriba-derecha (no `closeLeft`).
3. Controles: reutilizar assets actuales (flechas line + `salir.svg`), solo
   reubicados sobre la imagen.
4. `large` adopta el tamaño de `xxxl` (`80vw × 90vh`); `xxxl` se elimina.
5. Alcance: solo perfil-cuenca cap1. Si queda bien, se replica a cap4
   (fase 2, fuera de este spec).

## 3. Base técnica verificada

- SVGs `1476×939` (aspecto 1.571) ≈ modal `80vw×90vh` en 16:9 (1.58) →
  `object-fit: contain` llena ~100% sin recortar.
- Fondo de los SVG: crema `#f2eee7` (verificado `.cls-6` en `perfil-1.svg`;
  verificar los 3 en implementación) → fondo del diálogo en el mismo color =
  bandas laterales invisibles si el aspecto no coincide exacto.
- `ModalShell` rama `headBare` ya da X flotante derecha sin ocupar flujo
  (`headBare + closeFloatRight`).
- Las imágenes del carrusel no traen `description` → no se renderiza caja de
  texto; dots + flechas quedan limpios sobre la imagen.

## 4. Cambios

### 4.1 Data — `src/content/modals/chapter-1.ts` (`PERFIL_CUENCA`)

- `variant: 'xxxl'` → `'large'`.
- Agregar `hideHeader: true` + nuevo flag `fullBleed: true`.
- Agregar `theme: { bgColor: '#f2eee7', bodyMaxWidth: '100%',
  contentMarginRight: '0', blockSpacing: '0' }`.
- No tocar: `title` (queda como `aria-label`), `icon`/`highlight`
  (metadatos del trigger), `body` (carrusel intacto), `trigger`.
- No agregar: `fullImage`, `image`, `closeLeft`, `showScrollIndicators`
  (imagen única llena el body → sin overflow → sin riel/flecha/fade).

### 4.2 Tipo — `src/types/modal.ts`

- `Modal`: nuevo opcional `fullBleed?: boolean` (carrusel inmersivo).
- `ModalVariant`: quitar `'xxxl'`.

### 4.3 Render — `ModalRenderer.tsx` + nuevo `layouts/CarouselFondo.tsx`

- `ModalRenderer`: si `modal.fullBleed` y el body es un único bloque
  `carousel`, renderizar `<CarouselFondo images>` en vez de `BlockRenderer`.
- `CarouselFondo` (nuevo, autocontenido; no se refactoriza `CarouselBlock`
  para evitar regresiones): mismo comportamiento (autoplay 6s + pause on
  hover, keyboard ←/→, swipe, dots) con nueva presentación: contenedor al
  100% del body, slides con `object-fit: contain`, flechas prev/next
  absolutas centradas verticalmente sobre la imagen (assets actuales),
  dots abajo-centro sobre la imagen, sin radio/sombra/caja de descripción.
- `ModalShell` (cambio aditivo mínimo, sin alterar lo existente): nueva
  prop opcional `bodyFullBleed` que aplica clase `.bodyInnerFullBleed`
  (padding-left/right 0, margin-right 0, max-width 100%). Requerido porque
  `padding-left: var(--content-left-indent)` no tiene override por tema.
- Sin cambios en `BlockRenderer`, stores ni triggers.

### 4.4 Tokens — `ModalShell.module.css` + migración `xxxl`

- `.large` → `--modal-w: 80vw; --modal-h: 90vh`; eliminar `.xxxl`.
- Migrar a `large`: `chapter-1.ts:79` (este cambio) e `inicio.ts:15`
  (mismo tamaño resultante, sin cambio visual).

## 5. Impacto conocido (aceptado)

- Los `large` de texto (~25) crecen de `max 960px/720px` a `80vw/90vh`;
  si alguno se ve mal, `theme.size` puntual con su medida anterior.
- Diagramas cap4 sin cambio (fijan `theme.size 90vw×90vh` inline).

## 6. Verificación

1. `tests/content/modals.test.ts` + `tsc`/build en verde, cero `'xxxl'`.
2. Visual perfil-cuenca desktop 16:9: imagen llena el modal, sin recorte ni
   bordes, flechas centradas sobre la imagen, dots visibles, X derecha.
3. Visual en viewport angosto/móvil: `contain` + fondo crema, controles
   usables (revisar tamaño de flechas con las media queries existentes).
4. Muestra de `large` de texto tras el cambio de token.

## 7. Fuera de alcance (fase 2)

- Réplica a modales cap4 (`diagrama()`: fondo 100%, X a la derecha,
  `contain` + `bgColor` crema en vez de bordes `#fffeee`).
- Nuevos assets de flechas/X teal; cambios al `ModalShell`.
