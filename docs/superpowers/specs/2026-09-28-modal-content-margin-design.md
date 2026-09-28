# Diseño: margen derecho del contenido del modal configurable

Fecha: 2026-09-28
Estado: aprobado por usuario
Alcance: `src/components/modal/shell/*`, `src/types/modal.ts`, uso en `src/content/modals/*`

## 1. Problema
`.bodyInner` (`ModalShell.module.css`) tiene el margen fijo `margin: 0px calc(14vw) 0px 0px`.
El valor `calc(14vw)` controla el ancho efectivo del contenido, pero no se puede
ajustar por modal. Se quiere una variable opcional en la definición del modal
(ej. `FICHA_TECNICA`): si se omite usa el default actual, si se define usa ese valor.

Ejemplo actual:
```ts
const FICHA_TECNICA: Modal = {
  id: 'ficha-tecnica',
  section: 'legales',
  variant: 'medium',
  title: 'Ficha técnica',
  highlight: 'Sobre el Atlas',
  icon: 'fichatecnica',
  body: [{ type: 'paragraph', id: 'p1', text: '...' }],
  trigger: { type: 'button', icon: 'fichatecnica', frame: '3', label: 'Ficha técnica', mapId: 'herramientas' },
}
```

## 2. Decisiones tomadas con el usuario
- Formato: solo el margen derecho (ej. `'calc(10vw)'`, `'100px'`, `'10%'`).
  El Shell arma `margin: 0 <valor> 0 0`.
- Responsive: solo desktop/tablet. En móvil (<640px) se ignora el custom
  y se mantiene el layout responsive actual (`max-width:100%`, `padding-right:20px`).
- Ubicación: nueva key en `ModalTheme` (patrón existente como `bodyMaxWidth`),
  no prop top-level.

## 3. Enfoques considerados
- A (elegido): `theme.contentMarginRight?: string` → CSS var `--body-margin-right`.
  Pro: sigue el patrón `theme → themeVars → CSS var`, cambio mínimo,
  default intacto, sin tocar `ModalRenderer`/`BlockRenderer`.
- B (descartado): prop top-level `Modal.contentMargin`. Contra: rompe el patrón
  visual-en-theme, exige prop extra en `ModalShell` + `ModalRenderer`.
- C (descartado): reutilizar `bodyMaxWidth`. Contra: `max-width ≠ margin-right`,
  no controla el hueco derecho real contra el riel/fade.

## 4. Diseño (enfoque A)
### 4.1 `src/types/modal.ts` — `ModalTheme`
```ts
/** Margen derecho del .bodyInner (default: 'calc(14vw)'). Solo desktop/tablet. */
contentMarginRight?: string
```

### 4.2 `src/components/modal/shell/ModalShell.module.css`
- `.dialog`: agregar `--body-margin-right: calc(14vw);`
- `.bodyInner`: `margin: 0px calc(14vw) 0px 0px;` →
  `margin: 0 var(--body-margin-right) 0 0;`
- `@media (max-width: 640px)`: agregar `margin-right: 0;` en `.bodyInner`
  para ignorar el custom en móvil.

### 4.3 `src/components/modal/shell/ModalShell.tsx` — `themeVars`
```ts
...(theme?.contentMarginRight ? { '--body-margin-right': theme.contentMarginRight } as CSSProperties : {}),
```

### 4.4 Uso
```ts
// default (sin cambios): margen calc(14vw)
const FICHA_TECNICA: Modal = { /* ... sin theme.contentMarginRight ... */ }

// custom:
theme: { contentMarginRight: 'calc(10vw)' }
```
Vacío/omitido → `calc(14vw)`. Acepta cualquier valor CSS válido de longitud.

## 5. Data flow
`content/modals/*.ts` (theme) → `MODALS[getModalById]` → `openModal(modal)` →
`ModalRenderer` (pasa `theme` íntegro) → `ModalShell` (inyecta var) → CSS.

## 6. Error handling
- Sin validación runtime (string CSS libre, igual que `bodyMaxWidth`).
- Valor inválido: el navegador descarta la declaración y cae al default.
- Documentar formato en el comentario del tipo.

## 7. Testing
- Desktop: modal sin `contentMarginRight` → idéntico a hoy (14vw).
- Desktop: modal con `'calc(5vw)'` / `'100px'` → hueco derecho cambia.
- Móvil <640px: con y sin valor → sin cambios (margen 0 + padding-right 20px).
- `InicioLayout` (fullImage): el margen aplica al `bodyInner` contenedor igual;
  sin cambio específico.

## 8. Fuera de alcance (YAGNI)
- Control de los 4 lados del margin.
- Aplicar custom en móvil.
- Validación CSS en TS.
- Migrar modales existentes (todos quedan en default hasta que se les ponga valor).
