import { beforeEach, describe, expect, it } from 'vitest';

import { createApiClient } from '@/services/api-client';
import { createAuthService } from '@/services/auth.service';
import { demoPassword, demoUser } from '@/tests/mocks/fixtures/auth';

const baseUrl = 'http://localhost:3000/api';

describe('auth.service', () => {
  let authService: ReturnType<typeof createAuthService>;

  beforeEach(() => {
    // Constructed during the test (after MSW is listening) so the client picks up
    // the patched fetch and does not hit the network.
    const client = createApiClient({ baseUrl });
    authService = createAuthService(client);
  });

  it('logs in and returns the authenticated user', async () => {
    const user = await authService.login({ email: demoUser.email, password: demoPassword });

    expect(user.id).toBe(demoUser.id);
    expect(user.email).toBe(demoUser.email);
    expect(user.permissions.length).toBeGreaterThan(0);
  });

  it('rejects with UNAUTHENTICATED on bad credentials', async () => {
    await expect(
      authService.login({ email: demoUser.email, password: 'wrong' }),
    ).rejects.toMatchObject({ code: 'UNAUTHENTICATED', status: 401 });
  });

  it('fetches the current user from /auth/me', async () => {
    const user = await authService.getCurrentUser();

    expect(user.email).toBe(demoUser.email);
    expect(user.branchIds).toContain('branch-1');
  });

  it('resolves for logout and password change (204)', async () => {
    await expect(authService.logout()).resolves.toBeUndefined();
    await expect(
      authService.changePassword({ currentPassword: 'secret', newPassword: 'new-secret' }),
    ).resolves.toBeUndefined();
  });
});