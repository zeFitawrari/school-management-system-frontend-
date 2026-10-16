# ADR 0001 - Feature-based architecture and module boundaries

Status: accepted
Date: 2026-10-14
Task: T02

## Context

The project is a large, production school/training-centre management app with many domains
(students, tutors, groups, attendance, finance, payroll, library, communications, reports and
more). Without boundaries, shared UI drifts into feature logic, features reach into each other's
internals, and circular dependencies make the app hard to change and test.

The confirmed decisions (multi-branch, permission bundles, i18n, dual calendar) all increase the
number of cross-cutting concerns, which makes clean boundaries more important.

## Decision

1. The app is organised as **vertical feature slices** under `src/features/<name>/`.
2. Shared infrastructure lives outside features: `app/`, `layouts/`, `components/`, `services/`,
   `permissions/`, `stores/`, `hooks/`, `lib/`, `config/`, `types/`, `styles/`, `utils/`.
3. Dependency rules (enforced by review now, and by ESLint import boundaries in T05):
   - `components/ui` and other shared code must **never** import from `features/`.
   - A feature may import another feature **only through that feature's `index.ts`**. No deep
     imports into `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `types/` or `utils/`.
   - No circular dependencies between features.
   - Business types (Student, Invoice, ...) live inside their feature. `src/types/` holds only
     cross-cutting contracts (pagination, ApiError, shared enums).
   - Do not create a shared abstraction until two real use cases need it.
   - Route config stays separate from page implementations.
   - Pages compose; components render; hooks wrap queries/mutations; api files own HTTP details.
   - Never call `fetch` directly in components; go through `services/api-client.ts` via feature
     api files.
4. Every feature folder exposes a single public entry point: `features/<name>/index.ts`.
   Only intended public exports are re-exported from this file.
5. Standard feature layout (create subfolders only when needed):
   `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `types/`, `utils/`, `index.ts`.

## Consequences

- Clear ownership: each feature folder has one owner and one public surface.
- Refactors stay local to a feature; cross-feature changes require an explicit index contract.
- ESLint boundary rule (T05) can mechanically prevent regressions.
- Slightly more ceremony to expose anything cross-feature, which is intentional.

## Alternatives considered

- **Layered architecture** (all components/, all hooks/, all services/ by type): rejected because
  it scatters one domain across many top-level folders and invites god-modules.
- **Implicit deep imports between features**: rejected because it creates hidden coupling and
  circular dependencies.
