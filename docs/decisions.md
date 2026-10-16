# Decision Log - School Management System (Frontend)

Owner: Product Owner / Technical Lead
Started: 2026-10-14
Status legend: `approved` | `proposed` | `open` | `superseded`

This log is the source of truth for business rules. Frontend code must not invent a rule
that is not recorded here (or in `docs/ROADMAP.md` / `docs/BLUEPRINT.md`). When a new rule
is needed, add a row with status `proposed` and ask before coding.

---

## 1. Approved decisions

| # | Decision | Outcome | Owner | Date | Status |
|---|----------|---------|-------|------|--------|
| D01 | Organisation model | Multi-branch. One organisation, many branches. Every branch-scoped record carries `branchId`. Active branch in `useBranchStore`. Query keys include `branchId`. Users may belong to one or more branches. Branch name shown on every page. Switching branch resets branch-specific stores and invalidates queries. Cross-branch views need an explicit permission. | Product Owner | 2026-10-14 | approved |
| D02 | Role model | Roles are bundles of permissions only; no role names hard-coded in components. Owner = business oversight, read-mostly, organisation-wide (all branches). Super Admin = technical administrator (users, roles, branches, settings, config); no automatic finance/payroll/mark editing. Other roles: Director, Accountant, Tutor, Student, Parent, Librarian, Receptionist, other staff. Default deny; backend enforces everything. | Product Owner | 2026-10-14 | approved |
| D03 | Languages | en, am, om. All user-facing text via i18n. English fallback. Fonts must render Ge'ez and Latin. No fixed-width buttons/labels; text wraps. Language persisted in `useLocaleStore`. | Product Owner | 2026-10-14 | approved |
| D04 | Calendars | Backend stores Gregorian ISO. Never store Ethiopian dates. Display/pickers follow `useLocaleStore` calendar preference. Use native `Intl` with `ethiopic` calendar first; ask before adding a date library. All date logic centralised in `lib/` helpers. Handle 13-month Ethiopian calendar (12x30 + Pagume) and academic-year boundaries. | Product Owner | 2026-10-14 | approved |
| D05 | Domain naming | Tutoring/training centre. Keep folder names: tutors, groups, courses, curriculum, packages, enrollments, vacancies. Do NOT rename folders. UI labels come from i18n keys so "Tutor"/"Teacher" can change via translation files only. | Product Owner | 2026-10-14 | approved |
| D06 | Priority workflows | Enrollment, attendance, payments are built and validated first. | Product Owner | 2026-10-14 | approved |
| D07 | API contract shape | Pagination contract: `page`, `pageSize`, `totalItems`, `totalPages`. Errors normalised to a user-safe `ApiError`. Idempotency key required for payments and submissions that can be double-sent. Session model: user profile + permission list held in auth store; access token in memory only, never persisted. | Technical Lead | 2026-10-14 | approved |
| D08 | Permissions default | Default deny. Missing permission shows 403, never an empty list. Unknown route shows 404. | Technical Lead | 2026-10-14 | approved |
| D09 | Disabled vs hidden actions | Actions the user lacks permission for are hidden where they would leave an empty gap; shown disabled-with-tooltip only when context requires the user to know the action exists (e.g. approval queues). One consistent rule per screen. | Technical Lead | 2026-10-14 | approved |
| O12 | Parent-child link verification method | Parent-child links are created by an admin with a verification step; parents cannot link themselves. | Product Owner | 2026-10-16 | approved |

---

## 2. Open decisions (need a business rule before Phases 4-5)

These must be resolved before the referenced tasks start. Until then, UI stays flexible and
the server owns the rule.

| # | Open decision | Needed by | Proposed default | Owner | Status |
|---|---------------|-----------|------------------|-------|--------|
| O01 | Attendance status set | T34 | present, absent, late, excused | Product Owner | open |
| O02 | Attendance locking rule (after how long / who can edit) | T35 | lock at end of day; correction needs `attendance.correct` | Product Owner | open |
| O03 | Grading scale and pass threshold | T37/T38 | 0-100, pass >= 50; grade bands TBD | Product Owner | open |
| O04 | Assessment weighting / moderation policy | T37 | weight per assessment, total 100 per course | Product Owner | open |
| O05 | Result publication rule | T38 | results hidden from student/parent until published | Product Owner | open |
| O06 | Refund / payment reversal policy and approval chain | T42 | reversal needs `payments.reverse` + reason; refund needs approval | Product Owner | open |
| O07 | Fee discounts / scholarships / instalment plans | T40 | discount types TBD | Product Owner | open |
| O08 | Payroll approval chain and period lock | T44 | prepare -> review -> approve -> lock | Product Owner | open |
| O09 | Library loan periods and fine policy | T48 | loan period and fine rate TBD | Product Owner | open |
| O10 | Recruitment applicant stage set | T26 | applied, screening, interview, offer, hired, rejected | Product Owner | open |
| O11 | Notification channels (in-app only vs email/SMS) | T46/T47 | in-app first | Product Owner | open |
| O13 | Academic-year boundaries (Gregorian vs Ethiopian) | T27 | align to Ethiopian academic year; confirm exact dates | Product Owner | open |

---

## 3. Permission identifiers (source of truth)

Permission identifiers use dot notation: `<domain>.<action>`. Roles are bundles. Cross-branch
access is always an explicit permission (for example `branches.cross.read`).

Naming rules:
- Lowercase, dot-separated, no plural inconsistency.
- Actions: `read`, `create`, `update`, `delete`, `approve`, `export`, `record`, `mark`, `publish`, `manage`.
- Scope helpers resolve `branch`, `class` (group), `own record`, `linked child`.

See `docs/permissions/matrix.md` for the full role x permission draft.
