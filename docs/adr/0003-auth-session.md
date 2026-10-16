# ADR 0003 - Authentication and session model

Status: proposed
Date: 2026-10-14
Task: T03

## Context

The app is multi-branch, permission-driven and handles money, payroll and personal documents.
The session model must be safe against XSS token theft, support silent refresh, and work on
low-end mobile devices. The frontend is not a security boundary; the backend authorises every
request.

## Decision (proposed)

1. **Session transport:** HttpOnly, Secure, SameSite=Lax session cookie set by the backend.
   - The access token is never stored in JS, `localStorage` or `sessionStorage`.
   - For state-changing requests, a CSRF token is issued (`GET /auth/csrf`) and sent via
     `X-CSRF-Token`, or a double-submit cookie, whichever the backend confirms (see Q2).
2. **Refresh:** sliding session via `POST /auth/refresh`. On 401 the API client attempts one
   silent refresh; if that fails, status becomes `expired` and the user is redirected to login
   with the return path preserved.
3. **Bootstrap:** on app load, call `GET /auth/me` (credentials included). While pending, show a
   full-screen loading gate. `/me` returns profile + permission list.
4. **Logout:** `POST /auth/logout` clears the cookie server-side; the client clears the auth
   store and all other stores via `resetAllStores()`, and clears form drafts.
5. **Auth store contents:** `user`, `permissions`, `status` only. No secrets. `partialize`
   persists nothing sensitive (at most non-sensitive UI prefs elsewhere, never here).
6. **Error handling:** 401 -> refresh-or-expire; 403 -> 403 page; never show raw server errors.
7. **Session-expired UX:** modal with a "sign in again" action; preserve the current route as the
   return path.

## Consequences

- XSS cannot read the session cookie; CSRF is mitigated by the token.
- Silent refresh keeps users signed in without persisting secrets.
- The API client owns refresh logic; feature code never manages tokens.

## Alternatives considered

- **Access token in memory + refresh token in localStorage:** rejected; refresh token in
  `localStorage` is readable by XSS.
- **Bearer token only in memory (no refresh):** rejected; forces frequent re-login.
- **Token in Zustand `persist`:** explicitly forbidden by AGENTS.md 7.2.

## Open

- Q2 in `docs/api-contract.md`: cookie + CSRF vs bearer, to be confirmed by backend.
- Exact CSRF mechanism (header token vs double-submit cookie).
