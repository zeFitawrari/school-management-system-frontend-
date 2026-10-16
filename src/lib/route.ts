/**
 * A return path is only accepted when it is an in-app, relative path.
 * Rejects absolute URLs, protocol-relative (`//evil.com`) and backslash tricks
 * to prevent open-redirect attacks after login.
 */
export function isSafeReturnPath(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) {
    return false;
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return false;
  }

  if (value.includes('\\')) {
    return false;
  }

  return true;
}

export function resolveReturnPath(from: unknown, fallback = '/app/dashboard'): string {
  return isSafeReturnPath(from) ? from : fallback;
}
