import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    pool: 'threads',
    setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 30000,
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
