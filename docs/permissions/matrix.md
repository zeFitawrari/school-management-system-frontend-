# Role x Permission Matrix (Draft) - Phase 0 / T01

Owner: Technical Lead
Status: proposed (must be signed off by Product Owner before Phase 2)
Default: DENY. The frontend only hides/guards for UX; the backend authorises every request.

Legend: `Y` = granted, `-` = denied, `own` = own record only, `linked` = linked child only,
`branch` = limited to assigned branch(es), `all` = organisation-wide (cross-branch).
Cross-branch rows are prefixed with `[cross]`.

Roles: OWN = Owner, SADM = Super Admin, DIR = Director, ACC = Accountant, TUT = Tutor,
STU = Student, PAR = Parent, LIB = Librarian, REC = Receptionist, STAFF = other staff.

---

## Core / identity

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| auth.login | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| profile.read | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| profile.update | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| password.change | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |

## Branches

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| branches.read | branch | Y | branch | branch | branch | - | - | branch | branch | branch |
| branches.create | - | Y | - | - | - | - | - | - | - | - |
| branches.update | - | Y | - | - | - | - | - | - | - | - |
| branches.archive | - | Y | - | - | - | - | - | - | - | - |
| branches.cross.read | Y | Y | - | - | - | - | - | - | - | - |

## Users, roles, permissions

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| users.read | - | Y | branch | - | - | - | - | - | - | - |
| users.create | - | Y | - | - | - | - | - | - | - | - |
| users.update | - | Y | - | - | - | - | - | - | - | - |
| users.deactivate | - | Y | - | - | - | - | - | - | - | - |
| users.reset_access | - | Y | - | - | - | - | - | - | - | - |
| roles.read | - | Y | Y | - | - | - | - | - | - | - |
| roles.manage | - | Y | - | - | - | - | - | - | - | - |
| permissions.read | Y | Y | - | - | - | - | - | - | - | - |

## Students

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| students.read | branch | - | branch | branch | own | - | linked | - | branch | - |
| students.create | - | - | branch | - | - | - | - | - | branch | - |
| students.update | - | - | branch | - | - | - | - | - | - | - |
| students.delete | - | - | - | - | - | - | - | - | - | - |
| students.transfer | - | - | branch | - | - | - | - | - | - | - |
| students.graduate | - | - | branch | - | - | - | - | - | - | - |
| students.suspend | - | - | branch | - | - | - | - | - | - | - |
| students.finance.read | - | - | - | branch | - | - | - | - | - | - |
| students.documents.read | - | - | branch | - | - | own | linked | - | - | - |

## Parents / guardians

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| parents.read | branch | - | branch | branch | - | - | linked | - | branch | - |
| parents.create | - | - | branch | - | - | - | - | - | branch | - |
| parents.update | - | - | branch | - | - | - | - | - | - | - |
| parents.link_child | - | - | branch | - | - | - | - | - | - | - |

## Tutors / staff

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| tutors.read | branch | - | branch | branch | - | - | - | - | branch | - |
| tutors.create | - | - | branch | - | - | - | - | - | - | - |
| tutors.update | - | - | branch | - | - | - | - | - | - | - |
| tutors.hr.read | - | - | branch | - | - | - | - | - | - | - |
| tutors.salary.read | - | - | - | y | - | - | - | - | - | - |

## Vacancies / recruitment

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| vacancies.read | Y | - | branch | - | - | - | - | - | - | - |
| vacancies.manage | - | - | branch | - | - | - | - | - | - | - |

## Academic setup

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| academics.years.manage | - | - | Y | - | - | - | - | - | - | - |
| courses.read | branch | - | Y | - | own | own | linked | - | branch | - |
| courses.manage | - | - | Y | - | - | - | - | - | - | - |
| curriculum.manage | - | - | Y | - | - | - | - | - | - | - |
| groups.read | branch | - | Y | - | own | own | linked | - | branch | - |
| groups.manage | - | - | Y | - | - | - | - | - | - | - |
| packages.read | branch | - | Y | - | - | - | - | - | branch | - |
| packages.manage | - | - | Y | - | - | - | - | - | - | - |
| enrollments.read | branch | - | branch | branch | own | own | linked | - | branch | - |
| enrollments.manage | - | - | branch | - | - | - | - | - | branch | - |

## Scheduling

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| scheduling.read | branch | - | Y | - | own | own | linked | - | branch | - |
| scheduling.manage | - | - | Y | - | - | - | - | - | - | - |

## Attendance

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| attendance.read | branch | - | Y | - | own | own | linked | - | - | - |
| attendance.mark | - | - | - | - | own | - | - | - | - | - |
| attendance.correct | - | - | branch | - | - | - | - | - | - | - |
| attendance.lock | - | - | branch | - | - | - | - | - | - | - |
| attendance.report.read | branch | - | Y | - | own | - | linked | - | - | - |

## Examinations / assignments

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| assessments.read | branch | - | Y | - | own | own | linked | - | - | - |
| assessments.manage | - | - | Y | - | own | - | - | - | - | - |
| marks.enter | - | - | - | - | own | - | - | - | - | - |
| marks.moderate | - | - | branch | - | - | - | - | - | - | - |
| results.read | branch | - | Y | - | own | own | linked | - | - | - |
| results.publish | - | - | branch | - | - | - | - | - | - | - |
| assignments.read | branch | - | Y | - | own | own | linked | - | - | - |
| assignments.manage | - | - | Y | - | own | - | - | - | - | - |
| submissions.grade | - | - | - | - | own | - | - | - | - | - |
| submissions.submit | - | - | - | - | - | own | - | - | - | - |

## Finance

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| finance.overview.read | Y | - | Y | Y | - | - | - | - | - | - |
| fee_structures.read | Y | - | Y | Y | - | - | - | - | - | - |
| fee_structures.manage | - | - | - | Y | - | - | - | - | - | - |
| invoices.read | branch | - | branch | Y | - | - | linked | - | branch | - |
| invoices.create | - | - | - | Y | - | - | - | - | branch | - |
| invoices.void | - | - | - | Y | - | - | - | - | - | - |
| payments.read | branch | - | branch | Y | - | - | linked | - | branch | - |
| payments.record | - | - | - | Y | - | - | - | - | - | - |
| payments.reverse | - | - | - | Y | - | - | - | - | - | - |
| refunds.approve | - | - | - | Y | - | - | - | - | - | - |
| expenses.read | Y | - | branch | Y | - | - | - | - | - | - |
| expenses.create | - | - | - | Y | - | - | - | - | - | - |
| expenses.approve | - | - | Y | - | - | - | - | - | - | - |
| finance.export | Y | - | Y | Y | - | - | - | - | - | - |

## Payroll

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| payroll.read | Y | - | branch | Y | own | - | - | - | - | - |
| payroll.manage | - | - | - | Y | - | - | - | - | - | - |
| payroll.approve | - | - | Y | - | - | - | - | - | - | - |
| payroll.lock | - | - | Y | - | - | - | - | - | - | - |
| payslip.read | own | - | own | Y | own | - | - | own | own | own |

## Library

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| library.catalog.read | branch | - | Y | - | branch | own | linked | Y | branch | branch |
| library.catalog.manage | - | - | - | - | - | - | - | Y | - | - |
| library.loans.manage | - | - | - | - | - | - | - | Y | - | - |
| library.loans.read | Y | - | Y | - | own | own | linked | Y | - | - |
| library.fines.manage | - | - | - | Y | - | - | - | Y | - | - |

## Communication

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| notifications.read | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| announcements.read | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| announcements.compose | - | - | Y | - | - | - | - | - | - | - |
| messages.send | - | - | Y | - | own | - | - | - | Y | - |

## Reports / dashboard

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| dashboard.read | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| reports.read | Y | - | Y | Y | - | - | - | - | - | - |
| reports.export | Y | - | Y | Y | - | - | - | - | - | - |

## Governance / settings

| Permission | OWN | SADM | DIR | ACC | TUT | STU | PAR | LIB | REC | STAFF |
|------------|-----|------|-----|-----|-----|-----|-----|-----|-----|-------|
| audit.read | Y | Y | - | - | - | - | - | - | - | - |
| settings.read | Y | Y | Y | - | - | - | - | - | - | - |
| settings.manage | - | Y | - | - | - | - | - | - | - | - |
| school_profile.manage | - | Y | - | - | - | - | - | - | - | - |

---

## Notes / sign-off

- Owner is read-mostly and organisation-wide; it does not edit daily records or technical settings.
- Super Admin manages users/roles/branches/settings and does NOT automatically get finance,
  payroll or mark-editing rights.
- `payments.record` requires an idempotency key; `payments.reverse` requires a reason.
- Sensitive fields (salary, payment, guardian, documents) are permission-gated and masked by default.
- This matrix is a draft. It must be signed off in writing before Phase 2 starts.

Sign-off:

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product Owner | | | |
| Technical Lead | | | |
| Finance | | | |
