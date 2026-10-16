import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { AppSidebar } from '@/components/navigation/AppSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { MobileDrawer } from '@/components/navigation/MobileDrawer';
import { TopBar } from '@/components/navigation/TopBar';
import { useUIStore } from '@/stores/ui.store';
import type { ReactNode } from 'react';

type DashboardLayoutProps = {
  children?: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const setMobileNav = useUIStore((state) => state.setMobileNav);

  useEffect(() => {
    setMobileNav(false);
  }, [location.pathname, setMobileNav]);

  return (
    <div className="flex min-h-dvh flex-col bg-background md:flex-row">
      <AppSidebar />
      <MobileDrawer />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          <div className="mx-auto w-full max-w-7xl">
            <Breadcrumbs />
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
