import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import { appRoutes, type RouteHandle } from '@/app/route-config';
import { demoUser } from '@/tests/mocks/fixtures/auth';
import { useAuthStore } from '@/stores/auth.store';
import type { RouteObject } from 'react-router-dom';

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

function childRoutes(): RouteObject[] {
  const rootChildren = appRoutes[0]?.children ?? [];

  return rootChildren.flatMap((route) => (route.children ? route.children : [route]));
}

function handleForPath(path: string): RouteHandle | undefined {
  const key = path.replace(/^\//, '');
  const route = childRoutes().find((item) =>
    key === '' ? item.index === true : item.path === key,
  );

  return route?.handle as RouteHandle | undefined;
}

beforeEach(() => {
  useAuthStore.getState().setUser(demoUser, demoUser.permissions);
});

afterEach(() => {
  useAuthStore.getState().clear();
});

describe('route config', () => {
  it('declares a title on every module route', () => {
    const modules = childRoutes().filter(
      (route) => typeof route.path === 'string' && route.path.startsWith('app/'),
    );

    expect(modules.length).toBeGreaterThan(20);

    for (const route of modules) {
      const handle = route.handle as RouteHandle | undefined;

      expect(handle?.title, `/${route.path}`).toBeTruthy();
    }
  });

  it('carries required permissions on protected module routes', () => {
    expect(handleForPath('/app/students')?.requiredPermissions).toEqual(['students.read']);
    expect(handleForPath('/app/dashboard')?.requiredPermissions).toEqual(['dashboard.read']);
    expect(handleForPath('/app')?.requiredPermissions).toBeUndefined();
  });

  it('exposes public routes without permissions', () => {
    expect(handleForPath('/')?.requiredPermissions).toBeUndefined();
    expect(handleForPath('/login')?.requiredPermissions).toBeUndefined();
  });
});

describe('router', () => {
  it('renders the index route', async () => {
    renderRoute('/');

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Welcome');
  });

  it('redirects /app to the dashboard', async () => {
    renderRoute('/app');

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  });

  it('renders a module placeholder with its title', async () => {
    renderRoute('/app/students');

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Students');
  });

  it('renders 404 for unknown paths', async () => {
    renderRoute('/this-does-not-exist');

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });

  it('renders the 403 page', async () => {
    renderRoute('/403');

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Access denied');
  });
});
