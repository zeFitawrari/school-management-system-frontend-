import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { AuthUser } from '@/services/auth.service';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'expired' | 'unauthenticated';

export type AuthState = {
  user: AuthUser | null;
  permissions: string[];
  status: AuthStatus;
  setUser: (user: AuthUser | null, permissions?: string[]) => void;
  setPermissions: (permissions: string[]) => void;
  setStatus: (status: AuthStatus) => void;
  clear: () => void;
  reset: () => void;
};

const initialState: Pick<AuthState, 'user' | 'permissions' | 'status'> = {
  user: null,
  permissions: [],
  status: 'idle',
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...initialState,
      setUser: (user, permissions) =>
        set(
          {
            user,
            permissions: permissions ?? user?.permissions ?? [],
            status: user ? 'authenticated' : 'unauthenticated',
          },
          false,
          'auth/setUser',
        ),
      setPermissions: (permissions) => set({ permissions }, false, 'auth/setPermissions'),
      setStatus: (status) => set({ status }, false, 'auth/setStatus'),
      clear: () => set(initialState, false, 'auth/clear'),
      reset: () => set(initialState, false, 'auth/reset'),
    }),
    { name: 'auth', enabled: import.meta.env.DEV },
  ),
);
