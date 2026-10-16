// Auto-generated summary of permission identifiers from docs/permissions/matrix.md (T09).
// Permission strings are the source-of-truth values sent by the backend.

export const ROLE_NAMES = ["owner","super_admin","director","accountant","tutor","student","parent","librarian","receptionist","staff"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const ALL_PERMISSIONS = [
  "academics.years.manage",
  "announcements.compose",
  "announcements.read",
  "assessments.manage",
  "assessments.read",
  "assignments.manage",
  "assignments.read",
  "attendance.correct",
  "attendance.lock",
  "attendance.mark",
  "attendance.read",
  "attendance.report.read",
  "audit.read",
  "auth.login",
  "branches.archive",
  "branches.create",
  "branches.cross.read",
  "branches.read",
  "branches.update",
  "courses.manage",
  "courses.read",
  "curriculum.manage",
  "dashboard.read",
  "enrollments.manage",
  "enrollments.read",
  "expenses.approve",
  "expenses.create",
  "expenses.read",
  "finance.export",
  "finance.overview.read",
  "groups.manage",
  "groups.read",
  "invoices.create",
  "invoices.read",
  "invoices.void",
  "library.catalog.manage",
  "library.catalog.read",
  "library.fines.manage",
  "library.loans.manage",
  "library.loans.read",
  "marks.enter",
  "marks.moderate",
  "messages.send",
  "notifications.read",
  "packages.manage",
  "packages.read",
  "parents.create",
  "parents.read",
  "parents.update",
  "password.change",
  "payments.read",
  "payments.record",
  "payments.reverse",
  "payroll.approve",
  "payroll.lock",
  "payroll.manage",
  "payroll.read",
  "payslip.read",
  "permissions.read",
  "profile.read",
  "profile.update",
  "refunds.approve",
  "reports.export",
  "reports.read",
  "results.publish",
  "results.read",
  "roles.manage",
  "roles.read",
  "scheduling.manage",
  "scheduling.read",
  "settings.manage",
  "settings.read",
  "students.create",
  "students.delete",
  "students.documents.read",
  "students.finance.read",
  "students.graduate",
  "students.read",
  "students.suspend",
  "students.transfer",
  "students.update",
  "submissions.grade",
  "submissions.submit",
  "tutors.create",
  "tutors.hr.read",
  "tutors.read",
  "tutors.salary.read",
  "tutors.update",
  "users.create",
  "users.deactivate",
  "users.read",
  "users.update",
  "vacancies.manage",
  "vacancies.read"
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];

export const PERMISSION_GROUPS: Record<string, readonly Permission[]> = {
  "auth": [
    "auth.login"
  ],
  "profile": [
    "profile.read",
    "profile.update"
  ],
  "password": [
    "password.change"
  ],
  "branches": [
    "branches.archive",
    "branches.create",
    "branches.cross.read",
    "branches.read",
    "branches.update"
  ],
  "users": [
    "users.create",
    "users.deactivate",
    "users.read",
    "users.update"
  ],
  "roles": [
    "roles.manage",
    "roles.read"
  ],
  "permissions": [
    "permissions.read"
  ],
  "students": [
    "students.create",
    "students.delete",
    "students.documents.read",
    "students.finance.read",
    "students.graduate",
    "students.read",
    "students.suspend",
    "students.transfer",
    "students.update"
  ],
  "parents": [
    "parents.create",
    "parents.read",
    "parents.update"
  ],
  "tutors": [
    "tutors.create",
    "tutors.hr.read",
    "tutors.read",
    "tutors.salary.read",
    "tutors.update"
  ],
  "vacancies": [
    "vacancies.manage",
    "vacancies.read"
  ],
  "academics": [
    "academics.years.manage"
  ],
  "courses": [
    "courses.manage",
    "courses.read"
  ],
  "curriculum": [
    "curriculum.manage"
  ],
  "groups": [
    "groups.manage",
    "groups.read"
  ],
  "packages": [
    "packages.manage",
    "packages.read"
  ],
  "enrollments": [
    "enrollments.manage",
    "enrollments.read"
  ],
  "scheduling": [
    "scheduling.manage",
    "scheduling.read"
  ],
  "attendance": [
    "attendance.correct",
    "attendance.lock",
    "attendance.mark",
    "attendance.read",
    "attendance.report.read"
  ],
  "assessments": [
    "assessments.manage",
    "assessments.read"
  ],
  "marks": [
    "marks.enter",
    "marks.moderate"
  ],
  "results": [
    "results.publish",
    "results.read"
  ],
  "assignments": [
    "assignments.manage",
    "assignments.read"
  ],
  "submissions": [
    "submissions.grade",
    "submissions.submit"
  ],
  "finance": [
    "finance.export",
    "finance.overview.read"
  ],
  "invoices": [
    "invoices.create",
    "invoices.read",
    "invoices.void"
  ],
  "payments": [
    "payments.read",
    "payments.record",
    "payments.reverse"
  ],
  "refunds": [
    "refunds.approve"
  ],
  "expenses": [
    "expenses.approve",
    "expenses.create",
    "expenses.read"
  ],
  "payroll": [
    "payroll.approve",
    "payroll.lock",
    "payroll.manage",
    "payroll.read"
  ],
  "payslip": [
    "payslip.read"
  ],
  "library": [
    "library.catalog.manage",
    "library.catalog.read",
    "library.fines.manage",
    "library.loans.manage",
    "library.loans.read"
  ],
  "notifications": [
    "notifications.read"
  ],
  "announcements": [
    "announcements.compose",
    "announcements.read"
  ],
  "messages": [
    "messages.send"
  ],
  "dashboard": [
    "dashboard.read"
  ],
  "reports": [
    "reports.export",
    "reports.read"
  ],
  "audit": [
    "audit.read"
  ],
  "settings": [
    "settings.manage",
    "settings.read"
  ]
} as const;

export function isPermission(value: string): value is Permission {
  return (ALL_PERMISSIONS as readonly string[]).includes(value);
}
