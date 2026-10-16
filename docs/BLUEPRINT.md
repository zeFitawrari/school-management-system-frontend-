Complete Frontend Implementation Blueprint (PDF) content summary
School Management System Frontend Blueprint.
Covers architecture, feature modules, RBAC, routing, forms, tables, responsive, a11y, state, API, testing, security, deployment notes.
Phases 0–7 aligned to the roadmap. Key modules: students, parents, tutors/teachers, academics, timetable, attendance, exams, assignments, fees, expenses, payroll, communications, library, reports, users, settings, audit, dashboard, landing.
Tech stack matches roadmap. Responsive: mobile-first, breakpoints 640/768/1024/1280/1536, dvh, safe areas, @container, print.
State: TanStack Query for server, Zustand for client UI/preferences/drafts only. URL for shareable filters.
RBAC: permission catalog, role bundles, default deny, guards and Can component.
API: typed client, normalized errors, pagination, query keys with branchId, idempotency for payments.
Testing: Vitest, RTL, MSW, Playwright. Priority: money, access, attendance, results.


# Confirmed decisions
1. Organisation: MULTI-BRANCH
2. Roles: Owner, Super Admin, Director, Accountant, Tutor, Student, Parent, Librarian, Receptionist, other staff (bundles of permissions)
3. Languages: en, am, om
4. Calendars: Gregorian (storage) + Ethiopian (display)
5. Domain: tutoring/training centre (keep names: tutors, groups, courses, curriculum, packages, enrollments, vacancies). UI text via i18n.
