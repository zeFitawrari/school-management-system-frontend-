import { AppSidebar } from '@/components/navigation/AppSidebar';
import { useUIStore } from '@/stores/ui.store';

export function MobileDrawer() {
  const open = useUIStore((state) => state.mobileNavOpen);
  const setMobileNav = useUIStore((state) => state.setMobileNav);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-foreground/40"
        onClick={() => setMobileNav(false)}
      />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card shadow-lg">
        <AppSidebar />
      </div>
    </div>
  );
}
