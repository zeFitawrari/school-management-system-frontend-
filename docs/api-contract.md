# API Contract (Draft) - School Management System Frontend

Task: T03
Status: **proposed** - requires sign-off by Frontend Lead and Backend Lead.
Date: 2026-10-14

The frontend must not invent endpoints, fields or enums. This document is the single agreed
contract between frontend and backend. Until it is signed off, UI work uses MSW mocks derived
from this file. Changing a shape here requires both leads to agree.

---

## 1. Conventions

| Item | Rule |
|------|------|
| Base URL | from `config/env.ts` (`VITE_API_BASE_URL`), validated with Zod |
| Transport | HTTPS, JSON request/response |
| Auth | session cookie (HttpOnly) - see ADR 0003 |
| Content type | `application/json; charset=utf-8` |
| Timeout | client-configured; 15s default, shorter with visible retry on mobile networks |
| Cancellation | every request accepts an `AbortSignal` |
| Correlation | client sends `X-Correlation-Id` (uuid) when supported by backend |
| Idempotency | mutations that can be double-sent send `Idempotency-Key` (uuid) |
| Dates | Gregorian ISO 8601 (`YYYY-MM-DD` or full timestamp); never Ethiopian dates on the wire |
| Money | integer minor units (e.g. cents) OR decimal string - **OPEN Q1**, display via central ETB formatter |
| Branch scope | branch-scoped endpoints accept/derive `branchId`; query keys include it |
| Pagination | see section 3 |

---

## 2. Standard response envelope

Single resource:

```json
{ "data": { "id": "...", "type": "student", "attributes": { } } }
```

Collection:

```json
{
  "data": [ { "id": "...", "type": "student", "attributes": { } } ],
  "meta": { "page": 1, "pageSize": 25, "totalItems": 240, "totalPages": 10 }
}
```

Errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human safe message",
    "details": [ { "field": "email", "message": "Already in use" } ],
    "correlationId": "..."
  }
}
```

The frontend normalises every failure into an `ApiError` (never shows stack traces or raw
server text).

---

## 3. Pagination, sorting, filtering

Query parameters (all list endpoints):

| Param | Type | Notes |
|-------|------|-------|
| `page` | int >= 1 | 1-based |
| `pageSize` | int | viewport default, see table below |
| `sort` | string | `field` or `-field` for descending |
| `q` | string | free-text search where supported |
| filters | per endpoint | explicit, documented per endpoint (e.g. `branchId`, `groupId`, `status`) |

Response meta always includes `page`, `pageSize`, `totalItems`, `totalPages`.

Default page size by viewport (from ROADMAP T03):

| Device | Default `pageSize` |
|--------|--------------------|
| Phone | 10 |
| Tablet | 15 |
| Desktop | 25 |

Unknown query params are ignored. Unknown `sort` fields return `400 VALIDATION_ERROR`.

---

## 4. Error codes and HTTP status mapping

| HTTP | `error.code` | Frontend behaviour |
|------|--------------|--------------------|
| 400 | `VALIDATION_ERROR` | inline field errors + error summary |
| 401 | `UNAUTHENTICATED` | attempt refresh; else session-expired flow and redirect to login |
| 403 | `FORBIDDEN` | render 403 PermissionDenied page (never an empty list) |
| 404 | `NOT_FOUND` | render 404 page |
| 409 | `CONFLICT` | show conflict message (duplicate, capacity, schedule conflict) |
| 422 | `UNPROCESSABLE` | field/business-rule errors from server |
| 429 | `RATE_LIMITED` | show retry-after message; disable submit |
| 500 | `SERVER_ERROR` | generic error state with retry |

Permission-denied (403) rule: frontend guards are UX only. The backend authorises every request.
Direct URL without permission shows the 403 page.

---

## 5. Endpoint map (draft - to confirm)

| Domain | Endpoints (proposed) | Notes |
|--------|----------------------|-------|
| Auth | `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/password/change` | session cookie; `/me` returns profile + permissions |
| Branches | `GET /branches`, `POST /branches`, `GET /branches/:id`, `PATCH /branches/:id` | |
| Users | `GET /users`, `POST /users`, `PATCH /users/:id`, `POST /users/:id/deactivate`, `POST /users/:id/roles` | |
| Students | `GET /students`, `POST /students`, `GET /students/:id`, `PATCH /students/:id`, `POST /students/:id/status` | duplicate check: `POST /students/check-duplicate` |
| Parents | `GET /parents`, `POST /parents`, `POST /parents/:id/children` | link verification per O12 |
| Tutors | `GET /tutors`, `POST /tutors`, `PATCH /tutors/:id` | HR/salary permission-gated |
| Academics | `GET /courses`, `GET /curriculum`, `GET /groups`, `GET /packages`, `GET /enrollments` (+ POST/PATCH) | |
| Scheduling | `GET /sessions`, `POST /sessions`, `PATCH /sessions/:id`, `POST /sessions/conflict-check` | recurrence per O/in T01 |
| Attendance | `GET /attendance`, `POST /attendance` (bulk), `POST /attendance/corrections`, `POST /attendance/lock` | statuses per O01 |
| Examinations | `GET /assessments`, `POST /assessments`, `POST /marks` (bulk), `POST /results/publish` | |
| Assignments | `GET /assignments`, `POST /assignments`, `POST /submissions`, `POST /submissions/:id/grade` | |
| Finance | `GET /fee-structures`, `GET /invoices`, `POST /invoices`, `GET /invoices/:id`, `POST /payments`, `POST /payments/:id/reverse`, `GET /expenses`, `POST /expenses` | idempotency on POST /payments |
| Payroll | `GET /payroll/periods`, `POST /payroll/periods/:id/compute`, `POST /payroll/periods/:id/approve`, `POST /payroll/periods/:id/lock`, `GET /payslips` | |
| Library | `GET /library/books`, `GET /library/loans`, `POST /library/loans`, `POST /library/returns` | |
| Communication | `GET /notifications`, `POST /notifications/read`, `GET /announcements`, `POST /announcements` | |
| Reports | `GET /reports/:reportKey` | server-aggregated; export permission-gated |
| Settings | `GET /settings`, `PATCH /settings` | |
| Audit | `GET /audit-logs` | read-only |

Endpoint names, verbs and payloads are **proposals** and must be confirmed by the backend lead.

### T24 - Parents and guardians addendum (proposed - unconfirmed)

- `POST /parents/:id/children` - parent-child link creation, link verification per O12.
  - Request (proposed - unconfirmed): `{ "studentId": "string" }`.
  - Response (proposed - unconfirmed): `{ "data": Parent }` - the parent with its linked children.
- Unlink a child from a parent: proposed `DELETE /parents/:id/children` with
  `{ "studentId": "string" }` in the body. **Deferred - proposed only; not implemented in T24.**
- Guardian consent flags (per parent and/or per child): proposed fields; **deferred - proposed only;
  not implemented in T24.**

Endpoints implemented during T24 (pending backend-lead confirmation): `GET /parents`, `POST /parents`,
`GET /parents/:id`, `PATCH /parents/:id`, and `POST /parents/:id/children`.

Deferred beyond T24: the unlink endpoint and consent flags, plus any other parents endpoints still
awaiting backend-lead confirmation.

---

## 6. Idempotency rule

- Required for `POST /payments` and any submission that can be double-sent
  (e.g. attendance bulk submit, marks submit, assignment submission).
- Client generates a UUID per logical action (stored in the relevant draft store, e.g.
  `usePaymentDraftStore.idempotencyKey`) and keeps it while the request is in flight.
- The submit button is disabled while pending; retry reuses the same key so the server cannot
  create a duplicate.
- Server returns the original result for a repeated key.

---

## 7. Query key contract

- Every list query key includes every filter that affects the response and `branchId` where
  relevant.
- Key factories live at `features/<name>/api/<name>.keys.ts`.
- After mutations, invalidate the affected keys. No server data is copied into Zustand.

---

## 8. Client auth state (Zustand)

`useAuthStore` holds only: `user` profile, `permissions` (string[]), and `status`
(`idle | loading | authed | expired`). The access token is **not** persisted. See ADR 0003.

---

## 9. Open questions (require answers before Phase 2)

| # | Question | Proposed default |
|---|----------|------------------|
| Q1 | Money representation on the wire: integer minor units or decimal string? | decimal string with 2 dp |
| Q2 | Session: HttpOnly cookie + CSRF token, or bearer token? | HttpOnly cookie + CSRF (ADR 0003) |
| Q3 | Does `/auth/me` return the full permission list or role ids only? | full permission list |
| Q4 | Refresh strategy: rotating refresh token endpoint or sliding session cookie? | sliding session via `POST /auth/refresh` |
| Q5 | Envelope style: JSON:API (`data`/`attributes`) vs flat objects? | JSON:API-lite as in section 2 |
| Q6 | Are IDs opaque strings (uuid) or integers? | opaque uuid strings |
| Q7 | Error `details[].field` naming: dotted path or plain field name? | plain field name |
| Q8 | Which list endpoints support `q` search? | all primary directories |
| Q9 | File upload: multipart to `/uploads` returning a file id, or presigned URLs? | multipart returning file id |
| Q10 | Rate-limit response header name (`Retry-After`)? | standard `Retry-After` |

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Frontend Lead | | | |
| Backend Lead | | | |
