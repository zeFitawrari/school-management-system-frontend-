import type { ReactNode } from 'react';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

export type QueryStateProps<TData> = {
  isLoading: boolean;
  isError: boolean;
  data: TData | undefined;
  isEmpty?: (data: TData | undefined) => boolean;
  error?: unknown;
  onRetry?: () => void;
  loadingRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorMessage?: string;
  children: ReactNode | ((data: TData) => ReactNode);
};

export function QueryState<TData>({
  isLoading,
  isError,
  data,
  isEmpty,
  error,
  onRetry,
  loadingRows,
  emptyTitle = 'No data yet',
  emptyDescription = 'There is nothing to show here.',
  errorTitle = 'Unable to load',
  errorMessage,
  children,
}: QueryStateProps<TData>) {
  if (isLoading) {
    return <LoadingState rows={loadingRows} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage ?? (error instanceof Error ? error.message : 'Please try again.')}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty?.(data) ?? (Array.isArray(data) ? data.length === 0 : data === undefined || data === null)) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return <>{typeof children === 'function' ? (children as (data: TData) => ReactNode)(data as TData) : children}</>;
}
