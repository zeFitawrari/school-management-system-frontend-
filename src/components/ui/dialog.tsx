import { createPortal } from 'react-dom';
import { useEffect, type ReactNode } from 'react';

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
      aria-describedby={description ? 'dialog-description' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={[
          'w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-xl',
          className ?? '',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p id="dialog-description" className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
