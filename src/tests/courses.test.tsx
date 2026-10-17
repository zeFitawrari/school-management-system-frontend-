import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import { appRoutes } from '@/app/route-config';
import { useAuthStore } from '@/stores/auth.store';
import { useBranchStore } from '@/stores/branch.store';
import { useLocaleStore } from '@/stores/locale.store';
import { useCourses } from '@/features/courses';
import type { AuthUser } from '@/services/auth.service';

const directorUser: AuthUser = {
  id: 'user-1',
  fullName: 'Sara Bekele',
  email: 'sara@example.com',
  roles: ['director'],
  permissions: [
    'dashboard.read',
    'courses.read',
    'courses.manage',
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

describe('courses API scoping (MSW)', () => {
  it('returns all courses for a director user', async () => {
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useCourses(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(3);
  });

  it('supports search filtering by code or name', async () => {
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useCourses({ q: 'MATH' }), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 8000 });

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0]?.id).toBe('course-1');
  });
});

describe('course detail access', () => {
  it('renders the course detail page', async () => {
    renderRoute('/app/courses/course-1');

    expect(await screen.findByText('Mathematics I', {}, { timeout: 8000 })).toBeInTheDocument();
    expect(await screen.findByText(/MATH-101/, {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.queryByText('General Science')).not.toBeInTheDocument();
  });

  it('renders 403 page for a user without courses.read permission', async () => {
    useAuthStore.getState().setUser(
      { ...directorUser, permissions: ['dashboard.read', 'students.read'] },
      ['dashboard.read', 'students.read'],
    );

    renderRoute('/app/courses/course-1');

    expect(await screen.findByRole('heading', { name: 'Access denied' }, { timeout: 8000 })).toBeInTheDocument();
  });
});
