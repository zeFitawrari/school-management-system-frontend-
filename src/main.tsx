import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { env } from '@/config/env';
import '@/styles/globals.css';

async function enableMocking(): Promise<void> {
  if (!env.isDev || !env.enableMocks) {
    return;
  }

  const { worker } = await import('@/tests/mocks/browser');

  await worker.start({ onUnhandledFrame: 'bypass' });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found in index.html');
}

enableMocking()
  .catch((error: unknown) => {
    console.error('Failed to start the mock service worker', error);
  })
  .finally(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
