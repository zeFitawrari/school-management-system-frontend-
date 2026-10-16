# School Management System - Frontend

Production web app for a school / training-centre: students, parents, tutors, enrollments,
scheduling, attendance, exams, assignments, finance (fees, invoices, payments, expenses, payroll),
notifications, library, reports, users/roles, audit logs, settings and a public landing page.

Must work well on **phone (360px+), tablet (768px+), laptop and desktop (1024px+)**.
Quality and security matter more than speed.

## Requirements

- Node.js 20+ (developed on Node 22)
- The single package manager for this repo is **npm**. Never mix package managers.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | start the Vite dev server |
| `npm run build` | typecheck then production build |
| `npm run preview` | preview the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with autofix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest once |
| `npm run e2e` | Playwright (added in T59) |

Before a task is considered done, run: `typecheck`, `lint`, `test:run`, `build`.

## Environment

Copy `.env.example` to `.env` and adjust. Vite only exposes `VITE_*` variables to the client, so
**never put secrets there**. `.env` is gitignored. Variables are validated in `src/config/env.ts`
with Zod; an invalid or missing variable fails fast.

## Technology

React + TypeScript (strict) + Vite - Tailwind CSS + shadcn/ui + Radix UI + Lucide - React Router -
TanStack Query + TanStack Table - Zustand (client state only) - React Hook Form + Zod -
Recharts - Vitest + React Testing Library + Playwright + MSW - ESLint + Prettier.

Do not add a new dependency without asking first.

## Folder structure

```
src/
  app/          App root: providers, router, route-config, query-client
  layouts/      AuthLayout, DashboardLayout, PortalLayout
  components/   ui/ (primitives), navigation/, feedback/, common/
  features/     one folder per domain; only public surface is index.ts
  services/     api-client.ts, auth.service.ts, upload.service.ts
  permissions/  permission-catalog.ts, role-presets.ts, access.ts
  stores/       Zustand stores (client state only)
  hooks/        truly cross-feature hooks only
  lib/          pure generic utilities and formatters
  config/       env.ts (validated environment)
  types/        cross-cutting types ONLY
  styles/       globals.css (tokens, breakpoints, base)
  utils/        small pure helpers
  tests/        shared test setup and fixtures
```

### Hard dependency rules

1. `components/ui` and other shared code must NEVER import from `features/`.
2. A feature may import another feature only through its `index.ts`. No deep imports.
3. No circular dependencies between features.
4. Business types live inside their feature, not in `src/types`.
5. Do not create a shared abstraction until two real use cases need it.
6. Reach feature internals only via the `@/` alias so the import-boundary lint rule can enforce it.
   (Relative paths into another feature are not detectable by the rule.)

The boundary rules are enforced by ESLint in `eslint.config.js`.

## Git hooks

Husky + lint-staged + commitlint are configured (`.husky/`, `lint-staged` in `package.json`,
`commitlint.config.js`). They activate once the project is a git repository:

```
git init
npx husky
```

Commit messages follow Conventional Commits (for example `feat(students): add directory filters`).

## Documentation

- `docs/ROADMAP.md` - 60 tasks (T01-T60) phase by phase.
- `docs/BLUEPRINT.md` - architecture blueprint and confirmed decisions.
- `docs/decisions.md` - approved and open business decisions.
- `docs/api-contract.md` - draft API contract (needs backend sign-off).
- `docs/permissions/matrix.md` - role x permission matrix.
- `docs/design/` - tokens, wireframes, component states, iconography.
- `docs/adr/` - architecture decision records.

## Confirmed project decisions

- Multi-branch; every branch-scoped record carries `branchId`; active branch in `useBranchStore`.
- Roles are permission bundles (Owner, Super Admin, Director, Accountant, Tutor, Student, Parent,
  Librarian, Receptionist, other staff). Default deny; backend authorises everything.
- Languages: `en`, `am`, `om`. English fallback; all user-facing text via i18n.
- Calendars: Gregorian for storage, Ethiopian for display (`Intl`), centralised in `lib/`.
