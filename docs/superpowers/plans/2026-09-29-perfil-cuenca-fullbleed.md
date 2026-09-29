# Perfil cuenca full-bleed + unificación large/xxxl Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** El modal `cap1-perfil-cuenca` muestra su carrusel a fondo completo sin header y la variante redundante `xxxl` desaparece en favor de `large` (80vw × 90vh).

**Architecture:** Solo data + tokens + un layout nuevo autocontenido (`CarouselFondo`) + una prop aditiva en `ModalShell`. `BlockRenderer`, stores y triggers no se tocan.

**Tech Stack:** React + TypeScript, CSS Modules, zustand (existente), vitest, tsc, oxlint.

## Global Constraints

- No recorte de imagen: slides siempre `object-fit: contain`.
- Sin bordes visibles: fondo del diálogo igual al fondo de los SVG (`#f2eee7`, a verificar en Task 2).
- X arriba-derecha: nunca `closeLeft: true` en este modal.
- Reutilizar assets actuales de flechas (`/assets/ui/icons/line/arrow-left.svg`, `arrow-right.svg`) y X (`/assets/modal/inicio/salir.svg`); cero assets nuevos.
- Alcance: solo `cap1-perfil-cuenca`. Cap4 queda fuera (fase 2).
- Commits pequeños por tarea, en español siguiendo el estilo del repo.

---

### Task 1: Línea base (tests + typecheck)

**Files:** ninguno (solo lectura/ejecución).

**Interfaces:**
- Consumes: `package.json` scripts (`test` = `vitest run`, `typecheck` = `tsc -b --noEmit`).
- Produces: lista de fallos preexistentes que las tareas siguientes deben dejar en verde.

- [ ] **Step 1: Correr la suite de modales**

Run: `npx vitest run tests/content/modals.test.ts` (workdir: `atlas-pluriversal-main`)
Expected: FAIL en `todos los modales tienen forma coherente` porque `tests/content/modals.test.ts:17` acepta `['xs','small','medium','large','xl','full']` y hoy existen 2 modales `xxxl` (`cap1-perfil-cuenca`, 16 POIs de inicio). Anotar el fallo como "preexistente, lo corrige Task 3".

- [ ] **Step 2: Correr typecheck**

Run: `npx tsc -b --noEmit` (workdir: `atlas-pluriversal-main`)
Expected: PASS (o anotar fallos preexistentes si los hay).

### Task 2: Verificar fondo de los 3 SVG de perfil

**Files:** solo lectura (`public/assets/ui/perfil/perfil-{1,2,3}.svg`).

**Interfaces:**
- Consumes: nada.
- Produces: confirmación del valor `bgColor` a usar en Task 3 (`#f2eee7` si los 3 coinciden).

- [ ] **Step 1: Extraer el fill de fondo de cada SVG**

Run: `python3 -c "import re,glob; [print(f, re.search(r'\.cls-6\s*\{\s*fill:\s*(#[0-9a-fA-F]{6})', open(f,encoding='utf-8').read()).group(1)) for f in sorted(glob.glob('public/assets/ui/perfil/perfil-*.svg'))]"` (workdir: `atlas-pluriversal-main`)
Expected: las 3 líneas imprimen `#f2eee7`. Si alguna difiere, usar ese valor en Task 3 y anotarlo en el commit.

### Task 3: Data + tipos (PERFIL_CUENCA, `fullBleed`, adiós `xxxl`)

**Files:**
- Modify: `src/types/modal.ts:14` (quitar `'xxxl'` del union; agregar `fullBleed?: boolean` a `Modal` con doc: "carrusel inmersivo full-bleed, se renderiza con CarouselFondo").
- Modify: `src/content/modals/chapter-1.ts:76-101` (`PERFIL_CUENCA`: `variant: 'large'`, `hideHeader: true`, `fullBleed: true`, `theme: { bgColor: '#f2eee7', bodyMaxWidth: '100%', contentMarginRight: '0', blockSpacing: '0' }`; no tocar `title`, `icon`, `highlight`, `body`, `trigger`; no agregar `fullImage`/`image`/`closeLeft`/`showScrollIndicators`).
- Modify: `src/content/modals/inicio.ts:15` (`variant: 'xxxl'` → `'large'`).
- Test: `tests/content/modals.test.ts` (agregar test específico, ver Step 1).

**Interfaces:**
- Consumes: `ModalTheme` (claves `bgColor`, `bodyMaxWidth`, `contentMarginRight`, `blockSpacing` ya existen).
- Produces: `Modal.fullBleed?: boolean`; cero usos de `'xxxl'` en `src`; `cap1-perfil-cuenca` con forma full-bleed que consume Task 4.

- [ ] **Step 1: Agregar test de forma del modal perfil-cuenca**

```ts
it('perfil-cuenca es full-bleed sin header y usa large', () => {
  const modal = getModalById('cap1-perfil-cuenca')
  expect(modal).not.toBeNull()
  expect(modal?.variant).toBe('large')
  expect(modal?.hideHeader).toBe(true)
  expect(modal?.fullBleed).toBe(true)
  expect(modal?.closeLeft).toBeFalsy()
  expect(modal?.fullImage).toBeFalsy()
  expect(modal?.theme?.bgColor).toBe('#f2eee7')
  expect(modal?.body.length).toBe(1)
  expect(modal?.body[0]?.type).toBe('carousel')
})
```

Ubicación: `tests/content/modals.test.ts`, dentro del `describe` existente. Importar nada nuevo (`getModalById` ya está importado).

- [ ] **Step 2: Correr el nuevo test para verlo fallar**

Run: `npx vitest run tests/content/modals.test.ts -t "perfil-cuenca es full-bleed"`
Expected: FAIL (`fullBleed` aún no existe en el objeto).

- [ ] **Step 3: Aplicar los cambios de tipos y data**

```ts
// src/types/modal.ts — en interface Modal, junto a hideHeader/closeLeft:
/** Carrusel inmersivo full-bleed (se renderiza con CarouselFondo).
 *  Requiere hideHeader:true y body con un único bloque 'carousel'. */
fullBleed?: boolean
```

```ts
// src/content/modals/chapter-1.ts — PERFIL_CUENCA:
const PERFIL_CUENCA: Modal = {
  id: 'cap1-perfil-cuenca',
  section: 'capitulo-1',
  variant: 'large',
  title: 'Perfil de la cuenca',
  highlight: 'Capítulo I',
  icon: 'perfil',
  hideHeader: true,
  fullBleed: true,
  theme: {
    bgColor: '#f2eee7',
    bodyMaxWidth: '100%',
    contentMarginRight: '0',
    blockSpacing: '0',
  },
  body: [ /* carrusel intacto, sin cambios */ ],
  trigger: { /* intacto */ },
}
```

Y en `src/content/modals/inicio.ts:15`: `variant: 'xxxl'` → `variant: 'large'`. En `src/types/modal.ts:14`: `export type ModalVariant = 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'full'`.

- [ ] **Step 4: Correr tests y typecheck**

Run: `npx vitest run tests/content/modals.test.ts` — Expected: PASS todo el archivo (incluido el test de coherencia que fallaba en Task 1).
Run: `npx tsc -b --noEmit` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types/modal.ts src/content/modals/chapter-1.ts src/content/modals/inicio.ts tests/content/modals.test.ts
git commit -m "feat(modal): perfil-cuenca full-bleed sin header y large absorbe a xxxl"
```

### Task 4: `ModalShell.bodyFullBleed` + rama `fullBleed` en `ModalRenderer`

**Files:**
- Modify: `src/components/modal/shell/ModalShell.tsx` (nueva prop opcional `bodyFullBleed?: boolean`; aplicarla como `${bodyFullBleed ? styles.bodyInnerFullBleed : ''}` en el `div` de `styles.bodyInner`).
- Modify: `src/components/modal/shell/ModalShell.module.css` (nueva clase al final de la sección body):

```css
/* ─── Body full-bleed (carrusel inmersivo: sin inset de header) ─── */
.bodyInnerFullBleed {
  margin-right: 0;
  max-width: 100%;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
}
```

- Modify: `src/components/modal/shell/ModalRenderer.tsx` (importar `CarouselFondo` de Task 5 —si se implementa en orden distinto, dejar el import comentado NO, mejor: esta tarea solo agrega la rama con el import real tras Task 5; ver nota de orden abajo—, pasar `bodyFullBleed={modal.fullBleed}` al `ModalShell`).

**Interfaces:**
- Consumes: `Modal.fullBleed` (Task 3); `CarouselFondo` (Task 5: `export function CarouselFondo({ images }: { images: { src: string; alt: string }[] })`).
- Produces: rama `fullBleed` funcional en el renderer.

Orden recomendado: implementar Task 5 antes que el cableado del renderer en esta tarea, o hacer ambas en secuencia 5→4. Si se hace 4 primero, el import romperá `tsc` hasta terminar 5.

- [ ] **Step 1: Agregar prop + clase CSS**

En `ModalShellProps`, junto a `showScrollIndicators`:

```tsx
/** Body sin insets (carrusel inmersivo full-bleed). */
bodyFullBleed?: boolean
```

Destructurar con default `false` y usar en `className={...}` del `bodyInner`. Agregar la clase CSS de arriba. En el mismo archivo CSS, unificar el token grande y eliminar el redundante:

```css
/* ANTES */
.large {
  --modal-w: clamp(600px, 90vw, 960px);
  --modal-h: min(75vh, 720px);
}
.xl {
  --modal-w: 65vw;
  --modal-h: 75vh;
}
.xxxl {
  --modal-w: 80vw;
  --modal-h: 90vh;
}

/* DESPUÉS (borrar .xxxl, .large hereda sus valores) */
.large {
  --modal-w: 80vw;
  --modal-h: 90vh;
}
.xl {
  --modal-w: 65vw;
  --modal-h: 75vh;
}
```

No tocar los overrides responsive `@media (max-width: 640px)` (`.large` móvil sigue en `95vw/88dvh`).

- [ ] **Step 2: Agregar la rama en `ModalRenderer`**

```tsx
import { CarouselFondo } from '../layouts/CarouselFondo'

const renderBody = () => {
  if (modal.fullBleed) {
    const first = modal.body[0]
    if (first && first.type === 'carousel') {
      return <CarouselFondo images={first.images} />
    }
    return <BlockRenderer blocks={modal.body} />
  }
  if (modal.fullImage) {
    return <InicioLayout modal={modal} />
  }
  return <BlockRenderer blocks={modal.body} />
}
```

Y en el JSX: `<ModalShell ... bodyFullBleed={modal.fullBleed} ...>`.

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc -b --noEmit` — Expected: PASS (requiere Task 5 terminada).
Run: `npx oxlint src/components/modal/shell/ModalShell.tsx src/components/modal/shell/ModalRenderer.tsx` — Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/modal/shell/ModalShell.tsx src/components/modal/shell/ModalShell.module.css src/components/modal/shell/ModalRenderer.tsx
git commit -m "feat(modal): rama fullBleed en renderer y body sin insets en shell"
```

### Task 5: Nuevo `layouts/CarouselFondo.tsx` + estilos

**Files:**
- Create: `src/components/modal/layouts/CarouselFondo.tsx`
- Create: `src/components/modal/layouts/CarouselFondo.module.css`
- Test: `tests/components/CarouselFondo.test.tsx` (nuevo; verifica render + navegación por dots; usa `@testing-library/react` + `vitest`, ya instalados).

**Interfaces:**
- Consumes: nada de otras tareas (componente autocontenido; no importa de `BlockRenderer`).
- Produces: `export function CarouselFondo({ images }: { images: { src: string; alt: string }[] })` que consume Task 4.

- [ ] **Step 1: Escribir el test que falla**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CarouselFondo } from '@components/modal/layouts/CarouselFondo'

const IMAGES = [
  { src: '/img/a.svg', alt: 'Imagen A' },
  { src: '/img/b.svg', alt: 'Imagen B' },
]

describe('CarouselFondo', () => {
  it('muestra la primera imagen y navega con siguiente/anterior', () => {
    render(<CarouselFondo images={IMAGES} />)
    expect(screen.getByAltText('Imagen A')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente imagen' }))
    expect(screen.getByAltText('Imagen B')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Imagen anterior' }))
    expect(screen.getByAltText('Imagen A')).toBeTruthy()
  })

  it('renderiza un dot por imagen', () => {
    render(<CarouselFondo images={IMAGES} />)
    expect(screen.getByRole('button', { name: 'Ir a imagen 1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ir a imagen 2' })).toBeTruthy()
  })
})
```

Nota: verificar que `@components` es alias válido en `vitest`/`tsconfig` (el código fuente lo usa: `ModalRenderer` importa `@stores/modalStore`). Si el alias no resuelve en tests, usar ruta relativa `../../src/components/modal/layouts/CarouselFondo`.

- [ ] **Step 2: Correr el test para verlo fallar**

Run: `npx vitest run tests/components/CarouselFondo.test.tsx`
Expected: FAIL (`CarouselFondo` no existe).

- [ ] **Step 3: Implementar `CarouselFondo.tsx`**

```tsx
/**
 * 🖼️ CAROUSEL FONDO — Carrusel inmersivo full-bleed
 * ==================================================
 * Variante de presentación del bloque 'carousel' para modales
 * fullBleed (sin header): slides con contain (sin recorte),
 * flechas centradas verticalmente SOBRE la imagen y dots
 * abajo-centro SOBRE la imagen. Reutiliza los assets actuales
 * del sistema. Lógica espejo de CarouselBlock (autoplay 6s,
 * teclado, swipe); no se extrae hook compartido para no
 * modificar BlockRenderer.
 */

import { useState, useEffect, useCallback } from 'react'
import styles from './CarouselFondo.module.css'

export interface CarouselFondoImage {
  src: string
  alt: string
}

export function CarouselFondo({ images }: { images: CarouselFondoImage[] }) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  useEffect(() => {
    if (isPaused || images.length <= 1) return
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [isPaused, images.length, next])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  }, [next, prev])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    setTouchStart(touch.clientX)
    setTouchDelta(0)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return
    const touch = e.touches[0]
    if (!touch) return
    setTouchDelta(touch.clientX - touchStart)
  }, [touchStart])

  const onTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta) > 50) {
      if (touchDelta > 0) prev()
      else next()
    }
    setTouchStart(null)
    setTouchDelta(0)
  }, [touchDelta, next, prev])

  if (images.length === 0) return null

  return (
    <div
      className={styles.fondo}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de imágenes"
    >
      {images.length > 1 && (
        <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={prev} aria-label="Imagen anterior">
          <img src="/assets/ui/icons/line/arrow-left.svg" alt="" aria-hidden="true" />
        </button>
      )}
      <div
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <img
            key={i}
            className={`${styles.slide}${i === index ? ` ${styles.active}` : ''}`}
            src={img.src}
            alt={img.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            aria-hidden={i === index ? undefined : true}
          />
        ))}
        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot}${i === index ? ` ${styles.dotActive}` : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <button type="button" className={`${styles.nav} ${styles.next}`} onClick={next} aria-label="Siguiente imagen">
          <img src="/assets/ui/icons/line/arrow-right.svg" alt="" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Crear `CarouselFondo.module.css`**

```css
/* ─── Carrusel inmersivo full-bleed ─────────────────────────────── */
.fondo {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  outline: none;
}

.viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  touch-action: pan-y;
}

.slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.active {
  opacity: 1;
  pointer-events: auto;
}

/* Flechas sobre la imagen, centradas verticalmente */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 45px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  background-image: url('/assets/ui/sidebar/fondo-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav img {
  width: 24px;
  height: 24px;
}

.nav:hover {
  transform: translateY(-50%) scale(1.15);
}

.nav:active {
  transform: translateY(-50%) scale(0.95);
}

.prev {
  left: 12px;
}

.next {
  right: 12px;
}

/* Dots sobre la imagen, abajo-centro */
.dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(173, 216, 230, 0.6);
  cursor: pointer;
  appearance: none;
  padding: 0;
}

.dotActive {
  background: var(--primary-blue, #0599b7);
  transform: scale(1.3);
}

@media (max-width: 640px) {
  .nav {
    width: 36px;
    height: 37px;
  }

  .nav img {
    width: 20px;
    height: 20px;
  }

  .prev {
    left: 6px;
  }

  .next {
    right: 6px;
  }
}
```

Nota: el fondo crema lo pone el diálogo vía `theme.bgColor`; este CSS no fija color de fondo a propósito.

- [ ] **Step 5: Correr test + typecheck + lint**

Run: `npx vitest run tests/components/CarouselFondo.test.tsx` — Expected: PASS.
Run: `npx tsc -b --noEmit` — Expected: PASS.
Run: `npx oxlint src/components/modal/layouts/CarouselFondo.tsx` — Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/components/modal/layouts/CarouselFondo.tsx src/components/modal/layouts/CarouselFondo.module.css tests/components/CarouselFondo.test.tsx
git commit -m "feat(modal): CarouselFondo inmersivo para carrusel full-bleed"
```

### Task 6: Verificación final (automática + visual)

**Files:** ninguno nuevo.

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: evidencia de que el plan cumple el spec v2.

- [ ] **Step 1: Suite completa + lint**

Run: `npx vitest run` — Expected: PASS (cero `'xxxl'` restantes; test de coherencia en verde).
Run: `npx tsc -b --noEmit` — Expected: PASS.
Run: `npx oxlint` — Expected: sin errores nuevos.
Run: `rg -n "xxxl" src tests` — Expected: cero resultados.

- [ ] **Step 2: Revisión visual en dev**

Run: `npm run dev`, abrir el mapa de encuadres cap1 y el trigger `perfil-cuenca`.
Checklist visual: imagen llena el modal sin recorte ni bordes; flechas centradas verticalmente sobre la imagen; dots abajo-centro; X arriba-derecha; autoplay 6s y swipe funcionan; viewport angosto/móvil usable. Anotar capturas o descripción en el commit si hay ajustes.

- [ ] **Step 3: Muestra de `large` de texto**

Abrir 2–3 modales `large` de texto (p.ej. una presentación cap4 y `cap1-atlas-proyecto`) y confirmar que el nuevo tamaño no rompe lectura. Si alguno se ve mal, abrir issue de seguimiento con `theme.size` puntual (no entra en este plan).
