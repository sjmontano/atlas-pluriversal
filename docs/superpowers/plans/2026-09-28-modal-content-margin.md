# Modal content-margin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir `theme.contentMarginRight` opcional por modal para controlar el margen derecho de `.bodyInner`, con default `calc(14vw)` y sin cambios en móvil.

**Architecture:** Sigue el patrón existente `ModalTheme → themeVars (ModalShell.tsx) → CSS var (--body-margin-right)`. Sin tocar `ModalRenderer` ni `BlockRenderer`. Solo 3 archivos fuente + tests.

**Tech Stack:** React 19 + TypeScript ~6.0, CSS Modules, zustand, vitest 4 + Testing Library, vite 8.

## Global Constraints

- Vacío/omitido = `calc(14vw)` actual, cero regresión visual.
- Solo desktop/tablet; en móvil (<640px) el custom se ignora.
- Acepta cualquier longitud CSS válida (`calc()`, `vw`, `px`, `%`).
- No validación runtime; valor inválido lo descarta el navegador.
- No migrar modales existentes; todos quedan en default.

---

### Task 1: Tipo `contentMarginRight` + CSS var con default

**Files:**
- Modify: `atlas-pluriversal-main/src/types/modal.ts:48-63`
- Modify: `atlas-pluriversal-main/src/components/modal/shell/ModalShell.module.css:19-38`
- Modify: `atlas-pluriversal-main/src/components/modal/shell/ModalShell.module.css:291-308`
- Test: `atlas-pluriversal-main/tests/components/ModalShell.test.tsx`

**Interfaces:**
- Consumes: `ModalTheme` existente (`bodyMaxWidth`, `iconSize`, etc. en `types/modal.ts:48-63`).
- Produces: `ModalTheme.contentMarginRight?: string` — lo usa Task 2 en `ModalShell.tsx` como `theme?.contentMarginRight`.

- [ ] **Step 1: Write the failing test (tipo + default CSS)**

```tsx
// Append to tests/components/ModalShell.test.tsx
import type { ModalTheme } from '@types/modal.ts'

it('ModalTheme acepta contentMarginRight opcional', () => {
  const theme: ModalTheme = { contentMarginRight: 'calc(10vw)' }
  expect(theme.contentMarginRight).toBe('calc(10vw)')
  const empty: ModalTheme = {}
  expect(empty.contentMarginRight).toBeUndefined()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/ModalShell.test.tsx -t "contentMarginRight"` (workdir: `atlas-pluriversal-main`)
Expected: FAIL with `error TS2322: Property 'contentMarginRight' does not exist on type 'ModalTheme'` (o `Cannot find` si el tipo falta).

- [ ] **Step 3: Write minimal implementation — tipo**

```ts
// src/types/modal.ts, dentro de interface ModalTheme, después de columnGap (línea ~62):
  /** Margen derecho del .bodyInner (default: 'calc(14vw)'). Solo desktop/tablet; en móvil se ignora. */
  contentMarginRight?: string
```

Contexto exacto actual (líneas 58-63):
```ts
  /** Espaciado entre bloques */
  blockSpacing?: string
  /** Espaciado entre columnas (columns block) */
  columnGap?: string
}
```
Resultado:
```ts
  /** Espaciado entre bloques */
  blockSpacing?: string
  /** Espaciado entre columnas (columns block) */
  columnGap?: string
  /** Margen derecho del .bodyInner (default: 'calc(14vw)'). Solo desktop/tablet; en móvil se ignora. */
  contentMarginRight?: string
}
```

- [ ] **Step 4: Write minimal implementation — CSS var default**

```css
/* src/components/modal/shell/ModalShell.module.css, en .dialog junto a --block-spacing/--column-gap (líneas ~31-32): */
  --block-spacing: 16px;
  --column-gap: 1.5em;
  --body-margin-right: calc(14vw);
```

```css
/* .bodyInner (línea ~292), cambiar: */
.bodyInner {
  margin: 0px calc(14vw) 0px 0px;
```
por:
```css
.bodyInner {
  margin: 0 var(--body-margin-right) 0 0;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- tests/components/ModalShell.test.tsx` (workdir: `atlas-pluriversal-main`)
Expected: PASS (todos los existentes + el nuevo de tipo).

- [ ] **Step 6: Commit**

```bash
git add atlas-pluriversal-main/src/types/modal.ts atlas-pluriversal-main/src/components/modal/shell/ModalShell.module.css atlas-pluriversal-main/tests/components/ModalShell.test.tsx
git commit -m "feat(modal): add contentMarginRight theme key with CSS var default"
```

---

### Task 2: Inyectar la var desde `ModalShell.tsx`

**Files:**
- Modify: `atlas-pluriversal-main/src/components/modal/shell/ModalShell.tsx:118-129`
- Test: `atlas-pluriversal-main/tests/components/ModalShell.test.tsx`

**Interfaces:**
- Consumes: `ModalTheme.contentMarginRight` (Task 1).
- Produces: `style="--body-margin-right: <valor>"` en el `div[role=dialog]` — lo verifica el test; ningún otro componente necesita cambios (`ModalRenderer` pasa `theme` íntegro).

- [ ] **Step 1: Write the failing test (inyección + default)**

```tsx
it('inyecta --body-margin-right solo si theme.contentMarginRight está definido', () => {
  const { rerender, container } = render(
    <ModalShell open title="T" variant="medium" onClose={vi.fn()}>
      <p>c</p>
    </ModalShell>,
  )
  const dialog = container.querySelector('[role="dialog"]') as HTMLElement
  // default: la var NO va inline (vive en el CSS como calc(14vw))
  expect(dialog.style.getPropertyValue('--body-margin-right')).toBe('')

  rerender(
    <ModalShell open title="T" variant="medium" onClose={vi.fn()} theme={{ contentMarginRight: 'calc(5vw)' }}>
      <p>c</p>
    </ModalShell>,
  )
  const dialog2 = container.querySelector('[role="dialog"]') as HTMLElement
  expect(dialog2.style.getPropertyValue('--body-margin-right')).toBe('calc(5vw)')
})
```

Nota: el archivo ya importa `render`, `screen`, `vi` y `ModalShell`. Si falta `rerender`, viene del return de `render` — no requiere imports nuevos.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/ModalShell.test.tsx -t "inyecta --body-margin-right"` (workdir: `atlas-pluriversal-main`)
Expected: FAIL — `expected '' to be 'calc(5vw)'` en el segundo assert (la var nunca se inyecta).

- [ ] **Step 3: Write minimal implementation**

```ts
// src/components/modal/shell/ModalShell.tsx, en themeVars (líneas 118-129), agregar al final:
    ...(theme?.columnGap ? { '--column-gap': theme.columnGap } as CSSProperties : {}),
    ...(theme?.contentMarginRight ? { '--body-margin-right': theme.contentMarginRight } as CSSProperties : {}),
```

Contexto exacto actual (líneas 127-129):
```ts
    ...(theme?.blockSpacing ? { '--block-spacing': theme.blockSpacing } as CSSProperties : {}),
    ...(theme?.columnGap ? { '--column-gap': theme.columnGap } as CSSProperties : {}),
  }
```
Resultado:
```ts
    ...(theme?.blockSpacing ? { '--block-spacing': theme.blockSpacing } as CSSProperties : {}),
    ...(theme?.columnGap ? { '--column-gap': theme.columnGap } as CSSProperties : {}),
    ...(theme?.contentMarginRight ? { '--body-margin-right': theme.contentMarginRight } as CSSProperties : {}),
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/ModalShell.test.tsx` (workdir: `atlas-pluriversal-main`)
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add atlas-pluriversal-main/src/components/modal/shell/ModalShell.tsx atlas-pluriversal-main/tests/components/ModalShell.test.tsx
git commit -m "feat(modal): inject --body-margin-right from theme.contentMarginRight"
```

---

### Task 3: Guard móvil + verificación global

**Files:**
- Modify: `atlas-pluriversal-main/src/components/modal/shell/ModalShell.module.css:359-444` (bloque `@media (max-width: 640px)`)
- Test: `atlas-pluriversal-main/tests/components/ModalShell.test.tsx` (sin cambios nuevos; regresión)
- Verify: `atlas-pluriversal-main/tests/content/modals.test.ts` (existente, sin cambios)

**Interfaces:**
- Consumes: `--body-margin-right` y `margin` de Task 1-2.
- Produces: garantía responsive — `margin-right: 0` en móvil ignora el custom.

- [ ] **Step 1: Write minimal implementation — guard móvil**

```css
/* En @media (max-width: 640px), bloque .bodyInner con padding-right: 20px (líneas ~437-439): */
  .bodyInner {
    padding-right: 20px;
  }
```
por:
```css
  .bodyInner {
    padding-right: 20px;
    margin-right: 0;
  }
```

Rationale: en móvil el contenido ya es `max-width:100% !important` + `padding-left: var(--modal-padding)`. Forzar `margin-right: 0` neutraliza tanto el default `calc(14vw)` como cualquier custom, cumpliendo "solo desktop/tablet".

- [ ] **Step 2: Run full modal-related tests**

Run: `npm test -- tests/components/ModalShell.test.tsx tests/content/modals.test.ts tests/components/CustomScrollbar.test.tsx` (workdir: `atlas-pluriversal-main`)
Expected: PASS todo. Nota: `tests/content/modals.test.ts` tiene asserts desactualizados preexistentes (`variant small` + bloque `meta` para `ficha-tecnica`, que hoy es `medium` + `paragraph`) — si fallan, es fallo preexistente, no de este cambio; repórtalo sin "arreglarlo" en este plan.

- [ ] **Step 3: Run typecheck + lint**

Run: `npm run typecheck` (workdir: `atlas-pluriversal-main`)
Expected: PASS sin errores.

Run: `npm run lint` (workdir: `atlas-pluriversal-main`)
Expected: PASS sin errores nuevos.

- [ ] **Step 4: Manual visual check (requerido antes de cerrar)**

1. `npm run dev` y abrir un modal sin `contentMarginRight` (ej. `ficha-tecnica`) en desktop → hueco derecho idéntico a hoy.
2. Añadir temporalmente `theme: { contentMarginRight: 'calc(5vw)' }` a `FICHA_TECNICA` en `src/content/modals/index.ts:62`, recargar → contenido más ancho. Revertir el cambio temporal.
3. DevTools responsive <640px con y sin valor → sin cambios.

- [ ] **Step 5: Commit**

```bash
git add atlas-pluriversal-main/src/components/modal/shell/ModalShell.module.css
git commit -m "fix(modal): ignore custom content margin on mobile"
```
