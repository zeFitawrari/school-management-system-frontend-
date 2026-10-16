import { useEffect, useState } from 'react';

import { useToastStore } from '@/stores/toast.store';
import type { ToastItem, ToastVariant } from '@/stores/toast.store';

const variantClasses: Record<ToastVariant, string> = {
  default: 'border-border bg-card text-card-foreground',
  success: 'border-success bg-success-soft text-foreground',
  warning: 'border-warning bg-warning-soft text-foreground',
  danger: 'border-danger bg-danger-soft text-foreground',
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const remove = useToastStore((state) => state.remove);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const duration = toast.durationMs ?? 4000;

    if (duration <= 0) {
      return;
    }

    if (paused) {
      return;
    }

    const timer = window.setTimeout(() => remove(toast.id), duration);
    return () => window.clearTimeout(timer);
  }, [toast, paused, remove]);

  return (
    <div
      role={toast.variant === 'danger' ? 'alert' : 'status'}
      aria-live={toast.variant === 'danger' ? 'assertive' : 'polite'}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={[
        'pointer-events-auto w-full rounded-lg border p-4 shadow-lg transition',
        variantClasses[toast.variant],
        paused ? '' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => remove(toast.id)}
          className="min-h-6 min-w-6 rounded text-sm text-muted-foreground transition hover:text-foreground"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
