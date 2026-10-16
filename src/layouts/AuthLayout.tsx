import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-foreground">School Management System</p>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>
        {children}
      </div>
    </div>
  );
}
