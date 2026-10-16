# ADR 0002 - Naming conventions (tutors, groups, courses, curriculum, packages, enrollments, vacancies)

Status: accepted
Date: 2026-10-14
Task: T02

## Context

The existing project structure uses preparatory/training-centre vocabulary: `tutors`, `groups`,
`courses`, `curriculum`, `packages`, `enrollments`, `vacancies`. The business is a
tutoring/training centre (confirmed decision D05), but a future deployment may be a classic
school where users expect words like "Teacher", "Class" or "Subject".

Renaming folders now would invalidate existing work and create churn for no user-visible benefit.

## Decision

1. **Do not rename feature folders.** Folder and code identifiers keep:
   `tutors`, `groups`, `courses`, `curriculum`, `packages`, `enrollments`, `vacancies`.
2. UI labels are **never hard-coded**. They come from i18n keys in `en`, `am` and `om`.
   A term such as "Tutor" or "Teacher" is changed by editing translation files only.
3. Naming conventions for files:
   - components `PascalCase.tsx`
   - hooks `useThing.ts`
   - api `thing.api.ts`, keys `thing.keys.ts`
   - schemas `thing.schema.ts`
   - stores `thing.store.ts`
4. Permission identifiers use dot notation `<domain>.<action>` (see `docs/permissions/matrix.md`).

## Mapping (code term -> default English label, i18n key)

| Code term | English label (default) | i18n key |
|-----------|-------------------------|----------|
| tutors | Tutor | `nav.tutors` / `tutor.title` |
| groups | Group | `nav.groups` / `group.title` |
| courses | Course | `nav.courses` / `course.title` |
| curriculum | Curriculum | `nav.curriculum` / `curriculum.title` |
| packages | Package | `nav.packages` / `package.title` |
| enrollments | Enrollment | `nav.enrollments` / `enrollment.title` |
| vacancies | Vacancy | `nav.vacancies` / `vacancy.title` |

## Consequences

- No folder churn; existing and planned work stays valid.
- Terminology changes are a translation-file edit, not a code change.
- Contributors must use i18n keys instead of literal labels in business logic.

## Alternatives considered

- **Rename to school vocabulary now** (teachers, classes, subjects): rejected to avoid churn and
  because the confirmed business is a training centre.
- **Hard-code labels**: rejected; breaks i18n and dual-language requirement.
