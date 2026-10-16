import { ForbiddenPage } from '@/app/ForbiddenPage';

export type ForbiddenStateProps = {
  title?: string;
  message?: string;
  inline?: boolean;
};

export function ForbiddenState({ title = 'Access denied', message = 'You do not have permission to view this content.', inline = false }: ForbiddenStateProps) {
  if (!inline) {
    return <ForbiddenPage />;
  }

  return (
    <div className="grid min-h-40 place-items-center rounded-lg border border-border bg-card p-8 text-center">
      <div className="max-w-md">
        <p className="text-sm font-medium text-muted-foreground">403</p>
        <h3 className="mt-1 text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
