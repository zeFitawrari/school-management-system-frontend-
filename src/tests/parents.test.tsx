import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import { appRoutes } from '@/app/route-config';
import { useAuthStore } from '@/stores/auth.store';
import { useBranchStore } from '@/stores/branch.store';
import { useLocaleStore } from '@/stores/locale.store';
import { useParents } from '@/features/parents';
import type { AuthUser } from '@/services/auth.service';

const directorUser: AuthUser = {
  id: 'user-1',
  fullName: 'Sara Bekele',
  email: 'sara@example.com',
  roles: ['director'],
  permissions: [
    'dashboard.read',
    'parents.read',
    'parents.create',
    'parents.update',
    'students.read',
    'students.documents.read',
  ],
  branchIds: ['branch-1'],
};

const parentUser: AuthUser = {
  id: 'parent-1',
  fullName: 'Kaleb Abebe',
  email: 'kaleb.abebe@example.com',
  roles: ['parent'],
  permissions: ['dashboard.read', 'parents.read', 'students.read', 'students.documents.read', 'invoices.read'],
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

describe('parents API scoping (MSW)', () => {
  it('returns only the current parent record and its linked children for a parent user', async () => {
    useAuthStore.getState().setUser(parentUser, parentUser.permissions);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useParents(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0]?.id).toBe('parent-1');
    expect(result.current.data?.items[0]?.children).toHaveLength(1);
    expect(result.current.data?.items[0]?.children[0]?.id).toBe('student-1');
  });

  it('returns all parents for an admin user', async () => {
    useAuthStore.getState().setUser(directorUser, directorUser.permissions);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useParents(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(2);
  });
});

describe('parent detail access', () => {
  it('renders the 403 page when a parent opens another parent detail URL', async () => {
    useAuthStore.getState().setUser(parentUser, parentUser.permissions);

    renderRoute('/app/parents/parent-2');

    expect(await screen.findByRole('heading', { name: 'Access denied' }, { timeout: 8000 })).toBeInTheDocument();
  });

  it('renders only the linked children for the parent', async () => {
    useAuthStore.getState().setUser(parentUser, parentUser.permissions);

    renderRoute('/app/parents/parent-1');

    expect(await screen.findByText('Abebe Kebede', {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.getByText('group-1')).toBeInTheDocument();
    expect(screen.queryByText('Dawit Bekele')).not.toBeInTheDocument();
  });
});
