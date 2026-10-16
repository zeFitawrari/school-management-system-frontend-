import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import { appRoutes } from '@/app/route-config';
import { useAuthStore } from '@/stores/auth.store';
import { useBranchStore } from '@/stores/branch.store';
import { useLocaleStore } from '@/stores/locale.store';
import { useTutors } from '@/features/tutors';
import type { AuthUser } from '@/services/auth.service';

const directorUser: AuthUser = {
  id: 'user-1',
  fullName: 'Sara Bekele',
  email: 'sara@example.com',
  roles: ['director'],
  permissions: [
    'dashboard.read',
    'tutors.read',
    'tutors.create',
    'tutors.update',
    'students.read',
    'parents.read',
  ],
  branchIds: ['branch-1'],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, Wrapper };
}

function renderRoute(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return router;
}

beforeEach(() => {
  useAuthStore.getState().setUser(directorUser, directorUser.permissions);
  useBranchStore.getState().setAvailableBranches([{ id: 'branch-1', name: 'Main branch' }]);
  useLocaleStore.getState().setLanguage('en');
});

afterEach(() => {
  useAuthStore.getState().clear();
  useBranchStore.getState().reset();
  useLocaleStore.getState().reset();
});

describe('tutors API scoping (MSW)', () => {
  it('returns all tutors for a director user', async () => {
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useTutors(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(3);
  });

  it('supports search filtering by name or tutor number', async () => {
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => useTutors({ q: 'TUT-001' }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0]?.id).toBe('tutor-1');
  });
});

describe('tutor detail access', () => {
  it('renders the tutor detail page', async () => {
    renderRoute('/app/tutors/tutor-1');

    expect(await screen.findByText('Alemayehu Tesfaye', {}, { timeout: 8000 })).toBeInTheDocument();
    expect(await screen.findByText(/Mathematics/, {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.queryByText('Getachew Tadesse')).not.toBeInTheDocument();
  });

  it('renders 403 page for a user without tutors.read permission', async () => {
    useAuthStore.getState().setUser(
      { ...directorUser, permissions: ['dashboard.read', 'students.read'] },
      ['dashboard.read', 'students.read'],
    );

    renderRoute('/app/tutors/tutor-1');

    expect(await screen.findByRole('heading', { name: 'Access denied' }, { timeout: 8000 })).toBeInTheDocument();
  });
});
