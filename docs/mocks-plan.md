# MSW Mocks Plan

Task: T03 (setup target: T05/T08; handlers grow per feature)
Status: proposed

Purpose: development and tests never wait on the backend. Every handler follows
`docs/api-contract.md`. Mocks live under `src/tests/mocks/` (or `src/services/mocks`
- final location decided in T05) and are shipped only in dev/test builds.

## Principles

- One handler file per domain: `handlers/<domain>.ts` (auth, branches, users, students, ...).
- Fixtures are typed against the feature's domain types so drift breaks typecheck.
- Scenario control via a `?scenario=` param or a small mock control layer for tests:
  `success`, `empty`, `error500`, `unauthorized`, `forbidden`, `validation`.
- Pagination/sorting/filtering are implemented in the handlers so list UIs behave realistically.
- `Idempotency-Key` is honoured for `POST /payments` and submission endpoints (repeat key returns
  the original result, proving no duplicates).
- Branch scoping: handlers read `branchId` and filter accordingly.

## Initial handlers (Phase 0/1)

| Handler | Endpoints | Notes |
|---------|-----------|-------|
| auth | `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/me`, `/auth/csrf` | returns profile + permissions; supports locked/expired |
| branches | `/branches` | multi-branch fixtures |
| users | `/users` | role assignment fixtures |
| students | `/students`, `/students/check-duplicate` | feeds T21/T22 prototype |
| invoices/payments | `/invoices`, `/payments` | idempotency scenario |

## Test scenarios to cover (ties to T08/T17/T59)

- pagination boundaries (page 1, last page, beyond last page)
- empty result
- 401 (refresh succeeds / refresh fails)
- 403 permission denied
- 422 field validation
- 500 with retry
- network failure / timeout / abort
- duplicate payment attempt with same idempotency key

## Open

- Confirm final mock location (T05) and whether handlers are shared with Playwright (T59).
