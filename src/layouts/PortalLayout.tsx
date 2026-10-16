import { BottomNav } from '@/components/navigation/BottomNav';
import { TopBar } from '@/components/navigation/TopBar';
import type { ReactNode } from 'react';

type PortalLayoutProps = {
  children: ReactNode;
};

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <TopBar />
      <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
