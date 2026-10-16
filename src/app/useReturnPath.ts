import { useLocation, type Location } from 'react-router-dom';

import { resolveReturnPath } from '@/lib/route';

type ReturnState = {
  from?: Location | string;
};

/**
 * Returns the sanitised path to navigate to after a successful login.
 * The path is set by the auth guard via `navigate('/login', { state: { from } })`.
 */
export function useReturnPath(fallback = '/app/dashboard'): string {
  const location = useLocation();
  const state = location.state as ReturnState | null;
  const from = state?.from;

  if (typeof from === 'string') {
    return resolveReturnPath(from, fallback);
  }

  if (from && typeof from === 'object') {
    return resolveReturnPath(`${from.pathname}${from.search}${from.hash}`, fallback);
  }

  return fallback;
}
