import type { ApiClient } from '@/services/api-client';

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  permissions: string[];
  branchIds: string[];
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

/**
 * Thin typed wrapper over the auth endpoints (docs/api-contract.md section 5).
 * Session state and routing live in T09/T11; this only speaks HTTP.
 */
export function createAuthService(client: ApiClient) {
  return {
    login: (input: LoginInput) => client.post<AuthUser>('/auth/login', input),
    logout: () => client.post<void>('/auth/logout'),
    refresh: () => client.post<AuthUser | undefined>('/auth/refresh'),
    getCurrentUser: (signal?: AbortSignal) => client.get<AuthUser>('/auth/me', { signal }),
    changePassword: (input: ChangePasswordInput) =>
      client.post<void>('/auth/password/change', input),
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
