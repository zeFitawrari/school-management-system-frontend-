# Repository Audit and Structure Reconciliation

Task: T02
Date: 2026-10-14
Status: complete (baseline)

## Context

At the time of T02, `src/` did not exist and there was no `package.json` or build tooling. The
Vite + React + TypeScript scaffold is delivered in **T05**. This audit therefore records the
**target** structure, creates the `src/` skeleton, and captures the naming decision. Feature
module contents will be verified again as each feature task begins.

## Existing feature folders (from the roadmap screenshot) vs blueprint module

| Existing feature folder | Blueprint module | Target path | Action |
|-------------------------|------------------|-------------|--------|
| features/attendance | Attendance (student + tutor) | `src/features/attendance` | keep; extend in T34-T36 |
| features/audit | Audit logs | `src/features/audit` | keep; T54 |
| features/auth | Identity and access | `src/features/auth` | keep; T11 |
| features/branches | Branches (multi-branch) | `src/features/branches` | keep; T19 |
| features/courses | Academic setup / subjects | `src/features/courses` | keep; T28 |
| features/curriculum | Academic setup / curriculum | `src/features/curriculum` | keep; T28 |
| features/dashboard | Dashboard | `src/features/dashboard` | keep; T51 |
| features/enrollments | Enrollment workflow | `src/features/enrollments` | keep; T31 |
| features/finance | Fees, invoices, payments, expenses | `src/features/finance` | keep; T40-T43, T45 |
| features/groups | Classes / sections | `src/features/groups` | keep (name kept); T29 |
| features/issues | Support / issue tracking | `src/features/issues` | keep; T49 |
| features/landing | Public landing page | `src/features/landing` | keep; T53 |
| features/notifications | Communications | `src/features/notifications` | keep; T46, T47 |
| features/packages | Fee/course bundles | `src/features/packages` | keep; T30 |
| features/payroll | Payroll | `src/features/payroll` | keep; T44 |
| features/reports | Reports and analytics | `src/features/reports` | keep; T36, T50 |
| features/scheduling | Timetable | `src/features/scheduling` | keep; T32, T33 |
| features/settings | Settings | `src/features/settings` | keep; T55 |
| features/students | Students | `src/features/students` | keep; T21-T23 |
| features/tutors | Teachers / staff | `src/features/tutors` | keep (name kept); T25 |
| features/users | Users and roles | `src/features/users` | keep; T20 |
| features/vacancies | Recruitment | `src/features/vacancies` | keep; T26 |

## Planned feature folders (not in the screenshot)

| Feature folder | Blueprint module | Target path | First task |
|----------------|------------------|-------------|------------|
| parents | Parents and guardians | `src/features/parents` | T24 |
| examinations | Exams, marks, results | `src/features/examinations` | T37, T38 |
| assignments | Assignments and submissions | `src/features/assignments` | T39 |
| library | Library | `src/features/library` | T48 |
| communications | Announcements / messaging | `src/features/communications` | T47 |

Note: expenses live inside `features/finance` (T43) unless a separate slice is justified later.

## Non-feature folders created / required

| Path | Purpose | Status |
|------|---------|--------|
| `src/app/` | App.tsx, router.tsx, route-config.ts, providers.tsx, query-client.ts | created (T02), filled T07 |
| `src/layouts/` | AuthLayout, DashboardLayout, PortalLayout | created (T02), filled T12 |
| `src/components/ui/` | shared primitives (no feature imports) | created (T02), filled T14-T17 |
| `src/components/navigation/` | nav shell pieces | created (T02), filled T13 |
| `src/components/feedback/` | toasts, states | created (T02), filled T15, T16 |
| `src/components/common/` | shared composites | created (T02) |
| `src/services/` | api-client.ts, auth.service.ts, upload.service.ts | created (T02), filled T08 |
| `src/permissions/` | permission-catalog.ts, role-presets.ts, access.ts | created (T02), filled T09 |
| `src/stores/` | Zustand stores | created (T02), filled T10 |
| `src/hooks/` | cross-feature hooks only | created (T02) |
| `src/lib/` | pure generic utilities and formatters | created (T02), filled T18 |
| `src/config/` | env.ts (validated environment) | created (T02), filled T05 |
| `src/types/` | cross-cutting types ONLY | created (T02) |
| `src/styles/` | globals.css (tokens, breakpoints, base) | created (T02), filled T06 |
| `src/utils/` | small pure helpers | created (T02) |
| `src/tests/` | shared test setup and fixtures | created (T02), filled T59 |

## Feature skeleton

Each feature folder in `src/features/<name>/` contains `index.ts` (the only public entry point)
and subfolders `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `types/`, `utils/`.
Subfolders are present in the skeleton; contents are added by the owning task.

## Architecture decisions

- `docs/adr/0001-feature-boundaries.md` - dependency rules and `index.ts` public boundary.
- `docs/adr/0002-naming-conventions.md` - folder names kept; UI labels via i18n.

## Verification

- Skeleton created on disk under `src/` (folders + `index.ts` per feature).
- No existing code was deleted, renamed or overwritten.
- Tooling checks (typecheck, lint, test, build) are not applicable yet; there is no build tooling
  until T05.
