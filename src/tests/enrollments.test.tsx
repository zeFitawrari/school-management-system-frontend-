import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import { appRoutes } from '@/app/route-config';
import { useAuthStore } from '@/stores/auth.store';
import { useBranchStore } from '@/stores/branch.store';
import { useLocaleStore } from '@/stores/locale.store';
import { useEnrollments } from '@/features/enrollments';
import type { AuthUser } from '@/services/auth.service';

const directorUser: AuthUser = {
  id: 'user-1',
  fullName: 'Sara Bekele',
  email: 'sara@example.com',
  roles: ['director'],
  permissions: [
    'dashboard.read',
    'enrollments.read',
    'enrollments.manage',
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

describe('enrollments API scoping (MSW)', () => {
  it('returns all enrollments for a director user', async () => {
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useEnrollments(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(3);
  });

  it('supports search filtering by enrollment number or student id', async () => {
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useEnrollments({ q: 'ENR-001' }), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0]?.id).toBe('enrollment-1');
  });
});

describe('enrollment detail access', () => {
  it('renders the enrollment detail page', async () => {
    renderRoute('/app/enrollments/enrollment-1');

    expect(await screen.findByText('ENR-001', {}, { timeout: 8000 })).toBeInTheDocument();
    expect(await screen.findByText(/student-1/, {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.queryByText('ENR-003')).not.toBeInTheDocument();
  });

  it('renders 403 page for a user without enrollments.read permission', async () => {
    useAuthStore.getState().setUser(
      { ...directorUser, permissions: ['dashboard.read', 'students.read'] },
      ['dashboard.read', 'students.read'],
    );

    renderRoute('/app/enrollments/enrollment-1');

    expect(await screen.findByRole('heading', { name: 'Access denied' }, { timeout: 8000 })).toBeInTheDocument();
  });
});
