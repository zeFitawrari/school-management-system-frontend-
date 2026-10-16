import { api } from '@/services/api';
import { createAuthService } from '@/services/auth.service';
import { createUploadService } from '@/services/upload.service';
import { env } from '@/config/env';

/** Service singletons bound to the configured API base URL. */
export const authService = createAuthService(api);
export const uploadService = createUploadService({ baseUrl: env.apiBaseUrl });

export { api } from '@/services/api';
export { ApiError, isApiError, isAbortError } from '@/services/api-error';
export { createApiClient } from '@/services/api-client';
export type { ApiClient, ApiClientConfig, ListRequestOptions } from '@/services/api-client';
export { createAuthService } from '@/services/auth.service';
export type {
  AuthService,
  AuthUser,
  ChangePasswordInput,
  LoginInput,
} from '@/services/auth.service';
export { createUploadService } from '@/services/upload.service';
export type {
  UploadConfig,
  UploadedFile,
  UploadOptions,
  UploadProgress,
  UploadService,
} from '@/services/upload.service';
export { createQueryKeys, normaliseFilters } from '@/services/query-keys';
export type { ListFilters } from '@/services/query-keys';
export { env } from '@/config/env';
