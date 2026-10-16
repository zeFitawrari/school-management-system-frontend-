export function RouteFallback() {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-md space-y-3 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
