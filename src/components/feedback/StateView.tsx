import type { ReactNode } from 'react';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ForbiddenState } from '@/components/feedback/ForbiddenState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { NotFoundPage } from '@/app/NotFoundPage';

export type ViewState = 'loading' | 'empty' | 'error' | 'forbidden' | 'notFound' | 'success';

export type StateViewProps = {
  status: ViewState;
  title?: string;
  description?: string;
  message?: string;
  onRetry?: () => void;
  loadingRows?: number;
  children?: ReactNode;
};

export function StateView({
  status,
  title = 'No data yet',
  description = 'There is nothing to show here.',
  message,
  onRetry,
  loadingRows,
  children,
}: StateViewProps) {
  if (status === 'loading') {
    return <LoadingState rows={loadingRows} />;
  }

  if (status === 'empty') {
    return <EmptyState title={title} description={description} />;
  }

  if (status === 'error') {
    return <ErrorState title="Unable to load" message={message ?? 'Please try again.'} onRetry={onRetry} />;
  }

  if (status === 'forbidden') {
    return <ForbiddenState title={title} message={message} inline />;
  }

  if (status === 'notFound') {
    return <NotFoundPage />;
  }

  return <>{children}</>;
}