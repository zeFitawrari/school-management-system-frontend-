import { type ReactNode } from 'react';

import { hasPermission } from '@/permissions/access';
import { useAuthStore } from '@/stores/auth.store';

export type CanProps = {
  permission?: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function Can({ permission, children, fallback = null }: CanProps) {
  const permissions = useAuthStore((state) => state.permissions);

  if (!hasPermission(permissions, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
