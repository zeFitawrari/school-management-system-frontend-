SCHOOL MANAGEMENT SYSTEM
Frontend Delivery
Task Roadmap
60 tasks across 8 phases, with Zustand state design
and mobile-first responsive CSS for every task
Stack: React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query,
Zustand, React Hook Form, Zod, TanStack Table, Recharts, Vitest, Playwright
Targets: phone (360px+), tablet (768px+), laptop and desktop (1024px+)
Prepared from: Frontend Implementation Blueprint (PDF) and current src folder structure (screenshot) | October 2026

SCHOOL MANAGEMENT SYSTEM | FRONTEND TASK ROADMAP October 2026
Mobile-first | Zustand for client state | TanStack Query for server state Page 2
Contents
1. Executive summary 3
2. Analysis of the blueprint document 3
3. Analysis of the current project structure (screenshot) 4
4. Zustand state strategy 5
5. Responsive CSS system (media-query rulebook) 6
6. Device and browser test matrix 7
7. Roadmap overview 7
Phase 0: Discovery and Alignment 9
Phase 1: Foundation and Design System 11
Phase 2: People and Organisation 16
Phase 3: Academic Setup and Scheduling 19
Phase 4: Attendance and Assessment 22
Phase 5: Finance, Expenses and Payroll 25
Phase 6: Communication, Services and Insights 28
Phase 7: Governance, Hardening and Release 31
16. Timeline, team and effort 34
17. Per-task completion checklist 34
18. Risks, assumptions and next steps 34
SCHOOL MANAGEMENT SYSTEM | FRONTEND TASK ROADMAP October 2026
Mobile-first | Zustand for client state | TanStack Query for server state Page 3
1. Executive summary
This document analyses two inputs: the Complete Frontend Implementation Blueprint (PDF) for a School Management
System, and a screenshot of the current src folder. It converts them into a phase-by-phase delivery plan of 60 tasks. Every
task states its objective, deliverables, Zustand state, responsive CSS with media queries for phone, tablet and desktop, UI
notes and a clear completion test.
Item Summary
Project type Real, production-targeted school management platform: students, attendance, assessment, finance, payroll,
library, communication, reporting and governance.
Delivery shape 8 phases (0 to 7), 60 tasks, about 32 weeks for a small team of 2 to 3 frontend engineers, 1 designer, 1 QA, with
backend running in parallel. Estimates are planning figures, not commitments.
State strategy TanStack Query owns server data. Zustand owns UI state, preferences, active branch, notification counters and
form drafts. Selectors keep rendering fast.
Responsive strategy Mobile-first CSS. Base styles target phones; media queries at 640, 768, 1024, 1280 and 1536 add tablet and
desktop layouts. Every task lists its own phone, tablet and desktop CSS rules.
Security position Frontend guards improve UX only. The backend must authorise every request, record scope, calculation and
approval (blueprint principle).
How the Zustand request fits the blueprint
The blueprint says to use Zustand only for client-owned state and not as a duplicate API cache. This plan follows that: Zustand is
used heavily where it genuinely speeds the app (sidebar, theme, branch, drafts for attendance, marks and payments, notification
badge, calendar view), while lists and records stay in TanStack Query. Putting API data in Zustand would create stale-data and
permission-leak bugs, so it is deliberately avoided.
2. Analysis of the blueprint document
The 22-page blueprint is an architecture and delivery specification. Its key points, and what they mean for the task plan:
Blueprint area What it says Impact on the task plan
Architecture Feature-based modular React app; shared infra small; one
authenticated shell; backend enforces security; modular
monolith first.
Phase 1 builds shell, providers, router, API client.
Features are vertical slices.
Stack React, TypeScript, Vite, Tailwind, shadcn/Radix, React
Router, TanStack Query/Table, RHF + Zod, Zustand (when
needed), Recharts, Vitest, Playwright.
Tooling task T05; each stack item maps to a task.
Dependency
rules
Shared UI must not import features; cross-feature imports via
index.ts; no circular imports.
ESLint boundary rule in T05; ADR in T02.
Folder structure app, layouts, components (ui, navigation, feedback, common),
features, services, permissions, hooks, stores, lib, config,
types, styles, tests.
Gap audit in T02 against the real tree.
Routing Nested routes under /app with metadata for title and required
permissions; lazy loading; 403 and 404 pages.
T07, T09, T16.
RBAC Permission identifiers, roles as bundles, scope (branch, class,
own, linked child); default deny.
T09 and T20.
Pages 17 module groups: auth, dashboard, students, parents,
teachers, academics, timetable, attendance, exams,
assignments, fees, expenses, payroll, communications,
library, reports, users, settings, audit.
Phases 2 to 7 cover every one.
Design system Navy #173B69, blue #3978B9, 4px spacing, accessible
primitives, mobile-first breakpoints.
T04, T06, T14 to T17.
API and server
state
Shared client, typed contracts, pagination, error normalisation,
query keys with filters.
T03, T08, T17.
Forms and tables RHF + Zod; server-side paging; URL filters; card layout on
mobile.
T14, T17, T22.
SCHOOL MANAGEMENT SYSTEM | FRONTEND TASK ROADMAP October 2026
Mobile-first | Zustand for client state | TanStack Query for server state Page 4
Blueprint area What it says Impact on the task plan
Responsive and
a11y
Desktop, tablet, mobile behaviours; semantic HTML;
keyboard; reduced motion; English and Amharic; ETB;
Ethiopian calendar question.
T06, T18, T56, T58.
Security and
testing
CSRF/XSS, upload and export controls, CI gates, e2e of
critical flows.
T59 and T60.
Open decisions Branch model, Owner vs Super Admin, grading, attendance
locking, refunds, payroll chain, language and calendar, API
contract, hosting.
Phase 0, task T01.
Observations and gaps in the blueprint
1) It does not define exact field schemas, approval transitions or full permission matrix, so Phase 0 is mandatory. 2) Zustand is
mentioned but not specified; this roadmap adds a full store catalogue (section 4). 3) Responsive rules are described at viewport
level only; this roadmap adds a media-query rulebook and per-task CSS (section 5). 4) Parents, examinations, assignments,
library and communications modules are in the blueprint but not visible in the current folder tree; they are scheduled in Phases 3
to 6.
3. Analysis of the current project structure (screenshot)
The screenshot shows a VS Code explorer with src/ expanded. Items with a dot are modified (git indicator): components,
features and landing. Reading the tree:
Existing folder Maps to blueprint module Status / action
features/attendance Attendance (student and teacher) Rebuild or extend in T34 to T36 with draft store and locking.
features/audit Audit logs T54.
features/auth Identity and access T11 (verify against permissions engine T09).
features/branches Branch context (multi-branch) T19. Confirms branch model is likely multi-branch; verify in
T01.
features/courses, curriculum Academic setup / subjects T28.
features/dashboard Dashboard T51 (role-based widgets).
features/enrollments Enrollment workflow T31.
features/finance Fees, invoices, payments, expenses T40 to T43, T45.
features/groups Classes / sections T29. Name 'groups' kept; document mapping.
features/issues Support / issue tracking (not in
blueprint)
T49.
features/landing Public page (not in blueprint) T53. Marked modified; review current state first.
features/notifications Communications T46, T47.
features/packages Fee/course bundles (not in blueprint) T30.
features/payroll Payroll T44.
features/reports Reports and analytics T36, T50.
features/scheduling Timetable T32, T33.
features/settings Settings T55.
features/students Students T21 to T23.
features/tutors Teachers / staff T25. 'tutors' used instead of 'teachers'.
features/users Users and roles T20.
features/vacancies Recruitment (not in blueprint) T26.
hooks, lib, services, stores,
types, utils
Cross-feature layers Keep; apply blueprint rule: types only for cross-cutting
contracts, stores for client state only (T10).
components Shared UI Modified; verify it has no feature imports (T02, T05).
SCHOOL MANAGEMENT SYSTEM | FRONTEND TASK ROADMAP October 2026
Mobile-first | Zustand for client state | TanStack Query for server state Page 5
Missing from the tree (to create): app/ (providers, router, route-config), layouts/, permissions/, config/, styles/, tests/. Missing
feature modules: parents, examinations, assignments, library, communications (announcements), expenses (if not inside
finance). Naming note: the project appears closer to a tutoring/training centre (tutors, groups, packages, vacancies) than a
classic school; T01 should confirm this so labels and workflows match the real business.
Assumption
The screenshot only shows top-level folders; subfolder contents were not visible. Statuses above are plans to verify in T02, not
claims about existing code quality.
4. Zustand state strategy
Goal: a fast, predictable client-state layer. Speed comes from tiny stores, selector subscriptions (components re-render only
when the field they read changes), and keeping heavy server data out of stores.
Rules
• One store per concern, in src/stores, exported as typed hooks. No single giant global store.
• Always select a single field or use useShallow: const open = useUIStore(s => s.mobileNavOpen). Never call
useUIStore() without a selector.
• persist only small non-sensitive values, using partialize and a version for migrations. Drafts use sessionStorage. Tokens
and salary/payment data are never persisted.
• devtools only in development. Name actions (for example ui/toggleSidebar).
• A global resetAllStores() runs on logout and branch change to avoid cross-user or cross-branch leaks.
• Outside React (API client), use useAuthStore.getState().clear().
• Server state (students, invoices, results) stays in TanStack Query. URL holds shareable filters and active tab.
Store catalogue
Store Holds Persist Tasks
useAuthStore user, permissions, status; access token in memory No (token), minimal T09, T11
useUIStore sidebarCollapsed, mobileNavOpen, density,
pipeline view
Partial (localStorage) T12, T13, T26, T27
useThemeStore light / dark / system Yes T18, T55
useLocaleStore language (en, am), calendar (Gregorian,
Ethiopian)
Yes T18, T55
useBranchStore activeBranchId, availableBranches Yes (id only) T13, T19
useTablePrefsStore per-table columns, density, pageSize Yes T17 and list features
useToastStore toast queue No T15
useNotificationStore unreadCount, latest items No T13, T46
useCalendarViewStore view mode, anchor date, filters Partial T32
useStudentDraftStore registration step and non-sensitive fields sessionStorage T22
useEnrollmentDraftStore wizard state sessionStorage T31
useAttendanceDraftStore marks by sessionId, dirty flag sessionStorage T34, T35
useMarksDraftStore cell values by assessment and student sessionStorage T37
usePaymentDraftStore amount, method, reference, idempotencyKey No T42
usePayrollWizardStore step, selected period (no amounts) No T44
useUploadStore upload progress per file No T39, T43
useReportFilterStore last-used report filters Yes T36, T45, T50
useDashboardLayoutStore widget order and visibility Yes T51
useChildContextStore selectedChildId for parents sessionStorage T52
SCHOOL MANAGEMENT SYSTEM | FRONTEND TASK ROADMAP October 2026
Mobile-first | Zustand for client state | TanStack Query for server state Page 6
Reference pattern
// stores/ui.store.ts
import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
type UIState = {
 sidebarCollapsed: boolean;
 mobileNavOpen: boolean;
 toggleSidebar: () => void;
 setMobileNav: (open: boolean) => void;
};
export const useUIStore = create<UIState>()(
 devtools(
 persist(
 (set) => ({
 sidebarCollapsed: false,
 mobileNavOpen: false,
 toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }), false, 'ui/toggleSidebar'),
 setMobileNav: (open) => set({ mobileNavOpen: open }, false, 'ui/setMobileNav'),
 }),
 { name: 'sms-ui', version: 1, storage: createJSONStorage(() => localStorage),
 partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) }
 ),
 { name: 'ui', enabled: import.meta.env.DEV }
 )
);
// usage: only re-renders when this one field changes
const collapsed = useUIStore((s) => s.sidebarCollapsed);
5. Responsive CSS system (media-query rulebook)
Every task follows the same mobile-first method: write base styles for a 360px phone, then add min-width media queries to
enhance for larger screens. The task cards list the specific rules; this section defines the shared system.
Breakpoints
Name Query Typical device Layout behaviour
Base (xs) no query, from 320px Small and normal phones 1 column, drawer nav, bottom bar, 16px inputs, 44px
targets
sm @media (min-width: 640px) Large phones, landscape
phones
2-up cards, inline buttons, wider dialogs
md @media (min-width: 768px) Tablet portrait Icon rail sidebar, 2-column forms, side drawers
lg @media (min-width: 1024px) Tablet landscape, small laptop Full sidebar, full tables, 12-column grids
xl @media (min-width: 1280px) Desktop Dense mode, side-by-side panels, 3 to 4 column KPIs
2xl @media (min-width: 1536px) Large monitors Cap content width (max-width 1440px), more breathing
space
Media features to use besides width
Feature Use
prefers-reduced-motion: reduce Disable transitions and animations; avoid parallax and auto-play.
prefers-color-scheme: dark Default theme on first load; tokens redefined, never hard-coded colours.
hover: hover and pointer: fine / coarse Show hover effects only for mouse; enlarge targets and spacing for touch.
orientation: landscape Adjust bottom bars and sheets on landscape phones (reduce heights).
print Invoices, receipts, report cards, timetables: hide navigation, black on white, @page A4.
min-resolution / srcset Serve crisp but light images (landing page and avatars).
Container queries (@container) Widgets and cards adapt to their slot, not the whole viewport (dashboards, tables).
SCHOOL MANAGEMENT SYSTEM | FRONTEND TASK ROADMAP October 2026
Mobile-first | Zustand for client state | TanStack Query for server state Page 7
Mandatory rules for every task
• Mobile-first: base CSS has no media query; enhancements use min-width only.
• No fixed widths on layout containers; use min(), clamp(), grid fr and minmax().
• Touch targets at least 44 x 44px on touch; inputs use 16px font to avoid iOS zoom.
• Use dvh (not vh) for full-height screens; add env(safe-area-inset-*) padding for fixed bars on notched phones.
• No horizontal page scroll at 320px; wide tables scroll inside their own container or become cards.
• Fluid type: font-size: clamp(0.9rem, 0.85rem + 0.3vw, 1rem); headings scale similarly.
• Sticky primary action bars on mobile forms; inline actions from tablet upward.
• Keyboard and focus styles visible at every size; focus-visible rings from design tokens.
• Test each task at 360, 768, 1024 and 1440 before marking it done (see section 6).
Reference CSS pattern
:root { --space: 1rem; --radius: 12px; --navy:#173B69; --blue:#3978B9; }
.page { padding: var(--space); padding-bottom: calc(var(--space) + env(safe-area-inset-bottom)); }
.grid { display: grid; gap: var(--space); grid-template-columns: 1fr; } /* phone */
@media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .page { padding: 1.5rem; } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .grid { grid-template-columns: repeat(4, 1fr); } .page { max-width: 1440px; margin-inline: auto@media (hover: hover) and (pointer: fine) { .row:hover { background: #f1f5f9; } }
@media (pointer: coarse) { .btn { min-height: 44px; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
@media print { nav, .no-print { display: none !important; } body { background: #fff; color: #000; } }
6. Device and browser test matrix
Viewport (px) Represents Check
360 x 740 Common Android phone No overflow, bottom bar, sheets, keyboard overlap
390 x 844 iPhone (notch / safe area) Safe-area padding, Safari quirks, 16px inputs
412 x 915 Large Android phone Cards 1-up, sticky bars
768 x 1024 Tablet portrait Icon rail sidebar, 2-column forms
1024 x 768 Tablet landscape / small laptop Full sidebar, tables, calendars
1280 x 800 Laptop Dense lists, side panels
1440 x 900 Desktop Dashboard 12-column grid
1920 x 1080 Large monitor Max-width cap, no stretched forms
Browsers: Chrome and Samsung Internet (Android), Safari (iOS), Chrome, Edge, Firefox, Safari (desktop). Also test portrait and landscape,
200% zoom, text-only enlargement, slow 4G and a low-end CPU profile.
7. Roadmap overview
Phas
e
Name Weeks Task
s
Task IDs Exit criteria
0 Discovery and Alignment Weeks 1-2 4 T01 - T04 Stakeholders sign the permission matrix; open decisions have
owners; API contract draft and design tokens approved.
1 Foundation and Design
System
Weeks 3-6 14 T05 - T18 A signed-in user can open the responsive app shell on phone,
tablet and desktop; a protected route, a permission-denied page
and a 404 all work.
2 People and Organisation Weeks
7-10
8 T19 - T26 Role-scoped CRUD for people validated against the backend;
direct-URL and permission tests pass.
3 Academic Setup and
Scheduling
Weeks
11-14
7 T27 - T33 An enrolled student appears in a group with a conflict-free
schedule visible to student, parent and tutor.
SCHOOL MANAGEMENT SYSTEM | FRONTEND TASK ROADMAP October 2026
Mobile-first | Zustand for client state | TanStack Query for server state Page 8
Phas
e
Name Weeks Task
s
Task IDs Exit criteria
4 Attendance and
Assessment
Weeks
15-18
6 T34 - T39 A teacher can mark attendance and enter marks on a phone in
under a minute; parents see only published results.
5 Finance, Expenses and
Payroll
Weeks
19-23
6 T40 - T45 Financial calculations, approvals and duplicate protection
reviewed by Finance and QA with test accounts.
6 Communication,
Services and Insights
Weeks
24-27
8 T46 - T53 Role-appropriate dashboards and portals work; every role sees
only its own widgets.
7 Governance, Hardening
and Release
Weeks
28-32
7 T54 - T60 Release checklist approved; backup and rollback owners
named; UAT accepted in staging.
Delivery principles
• Vertical slices: each feature goes list, form, profile, tests; ship small and validate early.
• Priority workflows first: enrollment, attendance, payments (as the blueprint advises).
• Backend parallel: use MSW mocks from the agreed contract (T03) so UI work never waits.
• Definition of done for every task: states (loading, empty, error, permission-denied), responsive at 4 widths, accessibility
basics, tests, docs.
• Task card legend: Est. = rough effort in working days for one engineer; Needs = prerequisite tasks.
