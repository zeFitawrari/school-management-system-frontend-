import type { ReactNode } from 'react';

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="grid min-h-40 place-items-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <div className="max-w-md">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
