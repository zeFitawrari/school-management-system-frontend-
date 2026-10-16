import { createApiClient } from '@/services/api-client';
import { createAuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { env } from '@/config/env';

/**
 * Shared API client. On 401 it first tries a silent refresh; if that fails the
 * auth store is cleared and marked expired so the route guards redirect.
 */
export const api = createApiClient({
  baseUrl: env.apiBaseUrl,
  dev: env.isDev,
  onUnauthenticated: () => {
    useAuthStore.getState().clear();
    useAuthStore.getState().setStatus('expired');
  },
  refresh: async () => {
    try {
      const user = await createAuthService(api).refresh();
      if (user) {
        useAuthStore.getState().setUser(user, user.permissions);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  },
});