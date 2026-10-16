# Design Tokens

Task: T04
Status: proposed (design review pending)
Date: 2026-10-14

Source of truth for colour, type, spacing, radius, elevation and motion. Components must use
tokens, never ad-hoc hex values. Implemented in `src/styles/tokens.css` (raw palette and role
tokens) and `src/styles/globals.css` (Tailwind v4 `@theme` mapping). `docs/design/tokens.css`
mirrors the implementation for reference.

Token names: raw palette uses `--primary-*`, `--accent-*`, `--neutral-*`. Role tokens use plain
names (`--background`, `--foreground`, `--card`, `--muted`, `--border`, `--ring`, ...). Tailwind
v4 maps them to utilities via `@theme inline` (e.g. `--color-background: var(--background)`), so
`bg-card`, `text-muted-foreground` and `var(--card)` resolve to the same value and follow the
light/dark theme.

Brand anchors (from the blueprint, confirmed D05/ROADMAP): primary navy `#173B69`, accent blue
`#3978B9`.

---

## 1. Colour

### 1.1 Brand scales

Primary (navy):

| Token | Hex |
|-------|-----|
| `--primary-50` | `#F0F4F9` |
| `--primary-100` | `#DCE6F2` |
| `--primary-200` | `#B9CDE5` |
| `--primary-300` | `#8FB0D3` |
| `--primary-400` | `#5C86BC` |
| `--primary-500` | `#2F5A96` |
| `--primary-600` | `#234A80` |
| `--primary-700` | `#173B69` |
| `--primary-800` | `#122F54` |
| `--primary-900` | `#0D2340` |

Accent (blue):

| Token | Hex |
|-------|-----|
| `--accent-50` | `#EDF4FB` |
| `--accent-100` | `#D6E7F6` |
| `--accent-200` | `#AED0ED` |
| `--accent-300` | `#7FB3E0` |
| `--accent-400` | `#5A9ACF` |
| `--accent-500` | `#3978B9` |
| `--accent-600` | `#2E649C` |
| `--accent-700` | `#25517E` |
| `--accent-800` | `#1C3E61` |
| `--accent-900` | `#142C46` |

Neutrals:

| Token | Hex |
|-------|-----|
| `--neutral-0` | `#FFFFFF` |
| `--neutral-50` | `#F8FAFC` |
| `--neutral-100` | `#F1F5F9` |
| `--neutral-200` | `#E2E8F0` |
| `--neutral-300` | `#CBD5E1` |
| `--neutral-400` | `#94A3B8` |
| `--neutral-500` | `#64748B` |
| `--neutral-600` | `#475569` |
| `--neutral-700` | `#334155` |
| `--neutral-800` | `#1E293B` |
| `--neutral-900` | `#0F172A` |
| `--neutral-950` | `#020617` |

Semantic:

| Token | Light | Dark |
|-------|-------|------|
| `--success` | `#16A34A` | `#22C55E` |
| `--warning` | `#D97706` | `#F59E0B` |
| `--danger` | `#DC2626` | `#EF4444` |
| `--info` | `#2563EB` | `#3B82F6` |

Each semantic colour has a soft background pair (`--success-soft`, etc.) for badges and alerts.

### 1.2 Role tokens (implementation source: `src/styles/tokens.css`)

These are the plain-named tokens components style against, directly via `var(...)` or through
Tailwind utilities (shown in the last column). Dark values are set under `[data-theme="dark"]`.

| Token | Light value | Dark value | Tailwind utility | Use |
|-------|-------------|------------|------------------|-----|
| `--background` | `--neutral-50` | `#0B1220` | `bg-background` | app background |
| `--foreground` | `--neutral-900` | `--neutral-100` | `text-foreground` | body text |
| `--card` | `--neutral-0` | `#0F172A` | `bg-card` | cards, panels |
| `--card-foreground` | `--neutral-900` | `--neutral-100` | `text-card-foreground` | text on cards |
| `--popover` | `--neutral-0` | `--neutral-800` | `bg-popover` | popovers, dialogs |
| `--popover-foreground` | `--neutral-900` | `--neutral-100` | `text-popover-foreground` | text on popovers |
| `--primary` | `--primary-700` | `--primary-300` | `bg-primary` | primary actions, brand |
| `--primary-foreground` | `--neutral-0` | `--primary-900` | `text-primary-foreground` | text on primary |
| `--secondary` | `--neutral-100` | `--neutral-800` | `bg-secondary` | secondary surfaces |
| `--secondary-foreground` | `--neutral-900` | `--neutral-100` | `text-secondary-foreground` | text on secondary |
| `--muted` | `--neutral-100` | `--neutral-800` | `bg-muted` | muted surfaces |
| `--muted-foreground` | `--neutral-500` | `--neutral-400` | `text-muted-foreground` | secondary text |
| `--accent` | `--accent-500` | `--accent-400` | `bg-accent` | links, highlights |
| `--accent-foreground` | `--neutral-0` | `--primary-900` | `text-accent-foreground` | text on accent |
| `--destructive` | `#DC2626` | `#EF4444` | `bg-destructive` | destructive actions |
| `--border` | `--neutral-200` | `--neutral-800` | `border-border` | dividers, inputs |
| `--border-strong` | `--neutral-300` | `--neutral-700` | `border-border-strong` | emphasis borders |
| `--input` | `--neutral-200` | `--neutral-800` | `border-input` | form field borders |
| `--ring` | `--accent-500` | `--accent-400` | `ring-ring` | `:focus-visible` ring |
| `--surface-sunken` | `--neutral-100` | `#0A101C` | `bg-surface-sunken` | wells, table headers |
| `--text-subtle` | `--neutral-400` | `--neutral-500` | `text-text-subtle` | placeholders, captions |
| `--overlay` | `rgb(2 6 23 / 0.5)` | `rgb(0 0 0 / 0.6)` | — | modal backdrop |
| `--success` / `--warning` / `--info` / `--danger` | semantic | semantic | `bg-success` etc. | status (always paired with text/icon) |

Contrast: body text meets WCAG AA (4.5:1) against its surface in both themes; large text and
icons meet 3:1. Colour is never the only signal (always pair with text or icon).

---

## 2. Typography

Font stack (Amharic/Ge'ez + Latin). Final font selection is confirmed in T18; the stack already
reserves a Ge'ez-capable family so the app renders correctly meanwhile.

```
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Ethiopic", "Noto Sans", "Noto Sans Afan Oromo", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

Fluid type scale (`--text-*`) and line heights (`--leading-*`):

| Token | Size (clamp) | Line height | Use |
|-------|--------------|-------------|-----|
| `--text-xs` | `0.75rem` | 1.25rem | captions, badges |
| `--text-sm` | `0.875rem` | 1.25rem | secondary, table meta |
| `--text-base` | `clamp(0.9375rem, 0.9rem + 0.2vw, 1rem)` | 1.5rem | body |
| `--text-lg` | `1.125rem` | 1.75rem | lead paragraph |
| `--text-xl` | `1.25rem` | 1.75rem | card titles |
| `--text-2xl` | `1.5rem` | 2rem | section titles |
| `--text-3xl` | `clamp(1.5rem, 1.3rem + 1vw, 1.875rem)` | 2.25rem | page titles |
| `--text-4xl` | `clamp(1.875rem, 1.5rem + 1.5vw, 2.25rem)` | 2.5rem | hero |
| `--text-5xl` | `clamp(2.25rem, 1.8rem + 2vw, 3rem)` | 1.1 | landing hero |

Weights: `--font-regular: 400`, `--font-medium: 500`, `--font-semibold: 600`, `--font-bold: 700`.
Inputs use `--text-base` (>=16px) to prevent iOS zoom.

---

## 3. Spacing (4px base)

`--space-0: 0`, `--space-1: 0.25rem`, `--space-2: 0.5rem`, `--space-3: 0.75rem`,
`--space-4: 1rem`, `--space-5: 1.25rem`, `--space-6: 1.5rem`, `--space-8: 2rem`,
`--space-10: 2.5rem`, `--space-12: 3rem`, `--space-16: 4rem`, `--space-20: 5rem`,
`--space-24: 6rem`.

Layout: content container `width: min(100%, 1440px)`, `padding-inline: clamp(1rem, 3vw, 2rem)`.

---

## 4. Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `0.375rem` (6px) |
| `--radius-md` | `0.5rem` (8px) |
| `--radius-lg` | `0.75rem` (12px) |
| `--radius-xl` | `1rem` (16px) |
| `--radius-2xl` | `1.5rem` (24px) |
| `--radius-full` | `9999px` |

---

## 5. Elevation / shadow

| Token | Value |
|-------|-------|
| `--shadow-xs` | `0 1px 2px 0 rgb(15 23 42 / 0.05)` |
| `--shadow-sm` | `0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)` |
| `--shadow-md` | `0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)` |
| `--shadow-lg` | `0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)` |
| `--shadow-xl` | `0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)` |
| `--shadow-focus` | `0 0 0 3px rgb(57 120 185 / 0.4)` |

---

## 6. Motion

| Token | Value |
|-------|-------|
| `--duration-fast` | `120ms` |
| `--duration-base` | `200ms` |
| `--duration-slow` | `300ms` |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` |

All transitions are disabled under `prefers-reduced-motion: reduce`.

---

## 7. Breakpoints

CSS variables cannot be used inside `@media`, so these are documented constants defined once in
`globals.css` (T06):

| Name | Query |
|------|-------|
| base | none (from 320px) |
| sm | `(min-width: 640px)` |
| md | `(min-width: 768px)` |
| lg | `(min-width: 1024px)` |
| xl | `(min-width: 1280px)` |
| 2xl | `(min-width: 1536px)` |

---

## 8. Z-index

`--z-base: 0`, `--z-sticky: 20`, `--z-drawer: 40`, `--z-modal: 50`, `--z-toast: 60`,
`--z-tooltip: 70`.
