import { Navigate, useLocation } from 'react-router-dom';

import { ForbiddenPage } from '@/app/ForbiddenPage';
import { RouteFallback } from '@/app/RouteFallback';
import { hasPermission } from '@/permissions/access';
import { useAuthStore } from '@/stores/auth.store';
import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  requiredPermissions?: string[];
  children?: ReactNode;
};

/**
 * Route guard. Redirects unauthenticated users to /login with their current
 * location preserved as the return path; shows 403 for missing permissions.
 */
export function ProtectedRoute({ requiredPermissions, children }: ProtectedRouteProps) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <RouteFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasPermission(user.permissions, requiredPermissions)) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}
