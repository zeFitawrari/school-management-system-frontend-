import type { ReactNode } from 'react';

export type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
};

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
  retryLabel = 'Retry',
  action,
}: ErrorStateProps) {
  return (
    <div className="grid min-h-40 place-items-center rounded-lg border border-danger-soft bg-danger-soft/40 p-8 text-center">
      <div className="max-w-md">
        <h3 className="text-base font-semibold text-danger">{title}</h3>
        <p className="mt-1 text-sm text-foreground">{message}</p>
        <div className="mt-4 flex justify-center gap-2">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="min-h-9 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
            >
              {retryLabel}
            </button>
          ) : null}
          {action}
        </div>
      </div>
    </div>
  );
}
