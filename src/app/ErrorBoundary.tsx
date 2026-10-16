import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled application error', error, info.componentStack);
  }

  private readonly handleReload = (): void => {
    window.location.reload();
  };

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="grid min-h-dvh place-items-center bg-background p-6">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-card-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred. Please reload the page and try again.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-4 min-h-11 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary-800"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
