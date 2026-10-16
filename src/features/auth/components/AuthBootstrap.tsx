import { useEffect, useRef, type ReactNode } from 'react';

import { RouteFallback } from '@/app/RouteFallback';
import { authService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';

type AuthBootstrapProps = {
  children: ReactNode;
};

/**
 * Calls /auth/me on first load and holds the app on a loading gate until the
 * session state is known.
 */
export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const status = useAuthStore((state) => state.status);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }
    hasStarted.current = true;
    useAuthStore.getState().setStatus('loading');

    authService
      .getCurrentUser()
      .then((user) => {
        useAuthStore.getState().setUser(user, user.permissions);
      })
      .catch(() => {
        useAuthStore.getState().setStatus('unauthenticated');
      });
  }, []);

  if (status === 'idle' || status === 'loading') {
    return <RouteFallback />;
  }

  return <>{children}</>;
}
