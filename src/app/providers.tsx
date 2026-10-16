import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/app/ErrorBoundary';
import { AuthBootstrap } from '@/features/auth';
import { Toaster } from '@/components/feedback/Toaster';
import { queryClient } from '@/app/query-client';
import { router } from '@/app/router';

/**
 * Application root providers.
 * Toaster is intentionally added in T15 (its owning task).
 * Theme and locale providers are added in T10 / T18.
 */
export function AppProviders() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
