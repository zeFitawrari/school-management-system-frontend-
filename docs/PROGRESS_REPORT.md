# School Management System Frontend - Progress Report

Date: 2026-10-17
Current milestone: T24 complete (24/60 roadmap tasks, ~40%)

## 1. Executive summary

The project has progressed from an empty scaffold to a working foundation plus the first
vertical slice of people management. Routing, authentication, authorization helpers,
Zustand stores, API integration, shared primitives, responsive app shell, optional branch
context, and student registration/profile lifecycle are implemented. The parents and guardians
module (directory, create/edit, detail, child linking, server-side scoping) is implemented. The
latest full verification completed with typecheck, lint, tests, and production build passing.

## 2. Completed tasks

### Phase 0 - Discovery and alignment
- **T01** Product decisions, multi-branch model, role/permission matrix draft, open decisions.
- **T02** Repository audit and target `src/` skeleton.
- **T03** MSW mock plan; initial handlers implemented for auth, users, students.
- **T04** Design tokens, wireframes, component states, iconography specs.

### Phase 1 - Foundation and design system
- **T05** Vite, TypeScript, Tailwind, ESLint boundary rules, Husky, scripts, validated env.
- **T06** Design tokens and responsive CSS base.
- **T07** App shell, providers, query client, route config, placeholders, 403/404.
- **T08** API client, auth/upload services, query keys, typed errors, tests.
- **T09** Permission catalog, role presets, access/scope helpers.
- **T10** Zustand store catalogue and global reset.
- **T11** Auth/session runtime, login page, route guards, return path.
- **T12** Auth, dashboard and portal layouts.
- **T13** Navigation app shell, mobile drawer, breadcrumbs, branch switcher, user menu.
- **T14** Shared UI primitives (button, input, select, dialog, tabs, card, search, etc.).
- **T15** Toast feedback system and provider wiring.
- **T16** Loading, empty, error, forbidden, and not-found state components.
- **T17** TanStack Table data table with sorting, filtering and pagination.
- **T18** Date/currency formatting and lightweight i18n helpers.

### Phase 2 - People and organisation
- **T19** Multi-branch context helpers and `BranchGuard`.
- **T20** Users and roles directory plus admin mutations.
- **T21** Student directory, query integration and MSW handlers.
- **T22** Student registration wizard with draft store and duplicate checks.
- **T23** Student detail page with transfer, graduate and suspend actions.
- **T24** Parents and guardians directory, create/edit, child linking, server-side scoping and 403 handling.

## 3. Current implementation surface

- `src/app`: router, route config, providers, query client, layouts integration.
- `src/layouts`: `AuthLayout`, `DashboardLayout`, `PortalLayout`.
- `src/components`: navigation shell, UI primitives, feedback states, data table, toasts.
- `src/features/auth`: login, route guard, auth bootstrap.
- `src/features/branches`: branch context and guard.
- `src/features/users`: directory page and hooks.
- `src/features/students`: directory, registration wizard, profile/lifecycle actions.
- `src/features/parents`: directory, create/edit, detail, child linking.
- `src/lib`: dates, currency, i18n.
- `src/permissions`: catalog, presets, access helpers.
- `src/services`: API client, auth service, upload service, query keys.
- `src/stores`: auth, UI, theme, locale, branch, table prefs, toasts, notifications, drafts, layout stores.
- `src/tests/mocks`: MSW handlers for auth, users, students, and parents.

## 4. Verification status

Last successful gates:
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run test:run`: 11 test files / 59 tests passing
- `npm run build`: pass

Notes:
- `vite.config.ts` test timeout was increased to 30 seconds for stability in the jsdom/MSW environment.
- `@tanstack/react-table` v8 was added for T17.

## 5. Remaining roadmap

### Phase 2
- T24 Parents and guardians - complete
- T25 Tutors and staff
- T26 Vacancies and recruitment

### Phase 3 - Academic setup and scheduling
- T27 Academic years and calendar context
- T28 Courses, curriculum and packages
- T29 Groups and sections
- T30 Enrollment workflow
- T31 Scheduling and timetable
- T32 Teacher availability and conflict handling
- T33 Public/portal timetable views

### Phase 4 - Attendance and assessment
- T34 Attendance marking
- T35 Attendance correction and locking
- T36 Examinations and grading setup
- T37 Marks entry
- T38 Result publication
- T39 Assignments and submissions

### Phase 5 - Finance, expenses and payroll
- T40 Fee structures
- T41 Invoices
- T42 Payments and idempotency
- T43 Expenses
- T44 Payroll
- T45 Financial reports

### Phase 6 - Communication, services and insights
- T46 Notifications
- T47 Announcements and messaging
- T48 Library
- T49 Issues/support
- T50 Reports and analytics
- T51 Dashboards
- T52 Parent/student portals
- T53 Public landing page

### Phase 7 - Governance, hardening and release
- T54 Audit logs
- T55 Settings
- T56 Accessibility and responsive polish
- T57 Performance optimization
- T58 Security hardening
- T59 End-to-end critical flows
- T60 Release checklist and UAT

## 6. Known gaps and risks

- Feature CRUD remains incomplete beyond students/users; most feature folders still expose only skeleton pages.
- Mock handlers exist for auth, users, students, and parents; additional domains need handlers as their tasks start.
- Many product rules remain open in `docs/decisions.md` (grading, attendance locking, refunds, payroll, parent verification, academic-year boundaries).
- Direct CRUD editing and deeper feature tests are still limited.
- No git commits have been created yet, so the working tree currently represents the full accumulated change set.

## 7. Recommended next task

Start with **T25 - Tutors and staff**, following the same pattern as students: types, service, keys, hooks, list/form pages, MSW handlers, route wiring, and supporting tests.