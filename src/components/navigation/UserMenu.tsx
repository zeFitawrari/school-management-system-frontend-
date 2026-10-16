import { useNavigate } from 'react-router-dom';

import { authService } from '@/services';
import { resetAllStores } from '@/stores/reset';
import { useAuthStore } from '@/stores/auth.store';

export function UserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  async function handleLogout() {
    try {
      await authService.logout();
    } catch {
      // Server-side failure should not block local session cleanup.
    } finally {
      resetAllStores();
      navigate('/login', { replace: true });
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-foreground sm:inline">{user.fullName}</span>
      <button
        type="button"
        onClick={handleLogout}
        className="min-h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground transition hover:bg-accent"
      >
        Sign out
      </button>
    </div>
  );
}
