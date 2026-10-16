# Component States Sheet

Task: T04
Status: proposed
Date: 2026-10-14

Required states for every shared primitive. Colour is never the only signal - pair with an icon
and/or text. Focus ring uses `--color-focus-ring` via `:focus-visible`. Transitions use motion
tokens and are disabled under `prefers-reduced-motion`.

States legend: `default` | `hover` | `focus` | `disabled` | `loading` | `error` | `success`.

---

## Button

| State | Treatment |
|-------|-----------|
| default | `--color-primary` bg, `--color-on-primary` text, `--radius-md` |
| hover | `--color-primary-hover` bg (only under `@media (hover: hover) and (pointer: fine)`) |
| focus | visible ring `--shadow-focus`, `:focus-visible` only |
| disabled | 50% opacity, `cursor: not-allowed`, no hover, `aria-disabled` |
| loading | inline spinner replaces label, width stays stable (no layout shift), disabled while pending |
| error | not a button state; surfaced via toast/inline alert |

Variants: primary, secondary (surface + border), ghost, danger (destructive). IconButton has an
accessible name; min 44x44px on touch (`@media (pointer: coarse)`).

## TextInput / Textarea / Select

| State | Treatment |
|-------|-----------|
| default | `--color-border`, `--color-surface`, 16px font, min-height 44px |
| hover | `--color-border-strong` |
| focus | border `--color-accent` + `--shadow-focus` |
| disabled | sunken bg, muted text |
| error | `--danger` border, icon + message beside the field, `aria-describedby`, `aria-invalid` |
| success | `--success` accent + check icon (subtle) |

Every field has a visible label; hint and error text linked with `aria-describedby`.
Correct `type`, `inputmode` and `autocomplete`. Password field has show/hide + caps-lock hint.

## Checkbox / RadioGroup / Switch

- default, hover (fine pointer only), focus ring, disabled, error (group-level message).
- Group gets `role`/`fieldset` + `legend`; error is announced and linked.
- Switch reflects on/off with text label, not colour alone.

## SearchInput

- default, focus, loading (spinner in field), empty-results, clear button (accessible name).
- Debounced; filter state lives in the URL, not Zustand.

## DataTable

| State | Treatment |
|-------|-----------|
| default | sticky header (desktop), zebra-free, row hover under fine pointer |
| sort | active column shows direction arrow + `aria-sort` |
| loading | skeleton rows matching column count |
| empty | EmptyState with role-appropriate action |
| error | ErrorState with retry |
| selection | header select-all (indeterminate), selected row highlight + text count |
| row actions | action menu respects permissions; hidden (per D09) when not permitted |
| responsive | phone = stacked cards; tablet = scroll container + sticky first column; desktop = full table |

## Dialog / Drawer / Bottom sheet

- default, focus trap on open, Escape closes, focus returns to opener.
- Phone: bottom sheet, drag handle, `max-height: 90dvh`, internal scroll.
- Tablet: centred dialog `max-width: 560px`. Desktop: centred dialog or 420px side drawer.
- Destructive ConfirmDialog: danger button, explicit verb label, not just "OK".

## Toast

- variants: success, info, warning, danger.
- queue managed by `useToastStore`; auto-dismiss with pause-on-hover; optional undo action.
- Placement: bottom on phone, top-right on desktop; `aria-live` (polite for info, assertive for
  errors). Disabled animation under reduced motion.

## Tabs

- default, hover, active (underline + weight, not colour alone), focus ring, disabled.
- Phone: horizontally scrollable chip bar; `aria-selected`, arrow-key navigation.
- Active tab reflected in URL search params.

## Card

- default (surface + border + `--shadow-sm`), interactive (hover elevation under fine pointer),
  selected/active state, loading (skeleton).

## Alert / InlineError

- info, success, warning, danger variants with matching icon + text.
- Inline (form/section) and page-level usages; retry action on error where applicable.

---

## Accessibility checks per component

- visible label / accessible name
- keyboard operable, logical tab order
- visible `:focus-visible`
- `aria-describedby` for hints and errors
- no colour-only meaning
- contrast WCAG AA at rest and on focus
- works at 200% zoom

## Verification target (T04 "done when")

Design review signs off these specs; T06 exports tokens to `globals.css`; T14-T17 build the
primitives against this sheet; axe shows no violations on the showcase page (T14).
