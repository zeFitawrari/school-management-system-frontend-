import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.url(),
  VITE_APP_NAME: z.string().min(1).default('School Management System'),
  VITE_ENABLE_DEVTOOLS: z.enum(['true', 'false']).default('false'),
  VITE_ENABLE_MOCKS: z.enum(['true', 'false']).default('false'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `- ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
  appName: parsed.data.VITE_APP_NAME,
  enableDevtools: parsed.data.VITE_ENABLE_DEVTOOLS === 'true',
  enableMocks: parsed.data.VITE_ENABLE_MOCKS === 'true',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export type Env = typeof env;
