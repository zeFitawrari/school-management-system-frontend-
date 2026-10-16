import { QueryClient } from '@tanstack/react-query';

function getStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const value = (error as { status?: unknown }).status;

    if (typeof value === 'number') {
      return value;
    }
  }

  return undefined;
}

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false;
  }

  const status = getStatus(error);

  // do not retry client errors (auth, permission, not found, validation)
  if (status !== undefined && status >= 400 && status < 500) {
    return false;
  }

  return true;
}

function retryDelay(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, 30_000);
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: shouldRetry,
        retryDelay,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient = createQueryClient();
