export function ForbiddenPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">403</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
}
