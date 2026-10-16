import { createBrowserRouter } from 'react-router-dom';

import { appRoutes } from '@/app/route-config';

export function createAppRouter() {
  return createBrowserRouter(appRoutes);
}

export const router = createAppRouter();
