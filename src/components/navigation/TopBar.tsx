import { BranchSwitcher } from '@/components/navigation/BranchSwitcher';
import { UserMenu } from '@/components/navigation/UserMenu';
import { useUIStore } from '@/stores/ui.store';

export function TopBar() {
  const notificationCount = 0;
  const setMobileNav = useUIStore((state) => state.setMobileNav);

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileNav(true)}
          className="min-h-9 min-w-9 rounded-md border border-border bg-background px-2 text-sm md:hidden"
        >
          Menu
        </button>
        <span className="text-sm font-semibold text-foreground md:hidden">School Management</span>
        <BranchSwitcher />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative min-h-9 min-w-9 rounded-md border border-border bg-background px-2 text-sm"
        >
          {notificationCount > 0 ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-danger px-1 text-[10px] text-white">
              {notificationCount}
            </span>
          ) : null}
          <span aria-hidden="true">!</span>
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
