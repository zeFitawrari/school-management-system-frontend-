import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { RouteFallback } from '@/app/RouteFallback';

export function RootLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <Suspense fallback={<RouteFallback />}>
        <div className="route-fade">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
}
