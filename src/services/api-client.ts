import { ApiError, isAbortError } from '@/services/api-error';
import {
  DEFAULT_MESSAGES,
  JSON_CONTENT_TYPE,
  buildQuery,
  joinUrl,
  parseErrorEnvelope,
  randomId,
  readCookie,
  readMeta,
  safeJson,
  statusToCode,
  toKnownCode,
  unwrapData,
} from '@/services/http';
import type {
  CollectionResult,
  HttpMethod,
  ListParams,
  QueryParams,
  RequestOptions,
} from '@/types/api';

const DEFAULT_TIMEOUT_MS = 15_000;
const UNSAFE_METHODS = new Set<HttpMethod>(['POST', 'PUT', 'PATCH', 'DELETE']);

export type ApiClientConfig = {
  baseUrl: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  /** Called once when any request returns 401. Routing is owned by T09/T11. */
  onUnauthenticated?: () => void;
  /** Optional silent refresh invoked once before a 401 is treated as expired. */
  refresh?: () => Promise<boolean>;
  csrfCookieName?: string;
  csrfHeaderName?: string;
  dev?: boolean;
};

export type ListRequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
};

export type ApiClient = {
  readonly baseUrl: string;
  request<T>(path: string, options?: RequestOptions): Promise<T>;
  requestList<T>(
    path: string,
    params?: ListParams,
    options?: ListRequestOptions,
  ): Promise<CollectionResult<T>>;
  get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T>;
  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T>;
  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T>;
  delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
};

function listParamsToQuery(params?: ListParams): QueryParams {
  if (!params) {
    return {};
  }

  const query: QueryParams = {};

  if (params.page !== undefined) query.page = params.page;
  if (params.pageSize !== undefined) query.pageSize = params.pageSize;
  if (params.sort) query.sort = params.sort;
  if (params.q) query.q = params.q;
  if (params.filters) Object.assign(query, params.filters);

  return query;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  // Resolved per request (not bound at client creation) so runtime fetch
  // patches — e.g. the MSW test server — are honoured.
  const fetchImpl = config.fetchImpl ?? ((input: RequestInfo | URL, init?: RequestInit) => globalThis.fetch(input, init));
  const defaultTimeout = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const csrfCookieName = config.csrfCookieName ?? 'XSRF-TOKEN';
  const csrfHeaderName = config.csrfHeaderName ?? 'X-XSRF-TOKEN';
  const dev = config.dev ?? false;

  async function execute(path: string, options: RequestOptions, attempt = 0): Promise<Response> {
    const method = options.method ?? 'GET';
    const url = `${joinUrl(config.baseUrl, path)}${buildQuery(options.query)}`;

    const headers: Record<string, string> = {
      Accept: JSON_CONTENT_TYPE,
      'X-Correlation-Id': randomId(),
      ...options.headers,
    };

    let body: BodyInit | undefined;

    if (options.body !== undefined && method !== 'GET' && method !== 'DELETE') {
      if (typeof FormData !== 'undefined' && options.body instanceof FormData) {
        body = options.body;
      } else {
        headers['Content-Type'] ??= JSON_CONTENT_TYPE;
        body = JSON.stringify(options.body);
      }
    }

    if (options.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    if (UNSAFE_METHODS.has(method)) {
      const csrf = readCookie(csrfCookieName);

      if (csrf) {
        headers[csrfHeaderName] = csrf;
      }
    }

    const controller = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, options.timeoutMs ?? defaultTimeout);

    const externalSignal = options.signal;
    const onExternalAbort = (): void => controller.abort();
    externalSignal?.addEventListener('abort', onExternalAbort);

    try {
      const response = await fetchImpl(url, {
        method,
        headers,
        body,
        credentials: 'include',
        signal: controller.signal,
      });

      if (!response.ok) {
        const parsed = await safeJson(response);
        const envelope = parseErrorEnvelope(parsed);
        const code = envelope ? toKnownCode(envelope.code) : statusToCode(response.status);

        if (
          response.status === 401 &&
          attempt === 0 &&
          config.refresh &&
          path !== '/auth/refresh'
        ) {
          const refreshed = await config.refresh();

          if (refreshed) {
            return execute(path, options, 1);
          }
        }

        const error = new ApiError({
          code,
          message: envelope?.message ?? DEFAULT_MESSAGES[code],
          status: response.status,
          details: envelope?.details,
          correlationId:
            envelope?.correlationId ?? response.headers.get('X-Correlation-Id') ?? undefined,
        });

        if (code === 'UNAUTHENTICATED') {
          config.onUnauthenticated?.();
        }

        if (dev) {
          console.error(`[api] ${method} ${url} -> ${error.status} ${error.code}`);
        }

        throw error;
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (timedOut) {
        throw new ApiError({ code: 'TIMEOUT', message: DEFAULT_MESSAGES.TIMEOUT, cause: error });
      }

      // cancellation is not a failure for callers (e.g. TanStack Query ignores it)
      if (isAbortError(error)) {
        throw error;
      }

      if (dev) {
        console.error(`[api] ${method} ${url} -> network failure`, error);
      }

      throw new ApiError({
        code: 'NETWORK_ERROR',
        message: DEFAULT_MESSAGES.NETWORK_ERROR,
        cause: error,
      });
    } finally {
      clearTimeout(timeout);
      externalSignal?.removeEventListener('abort', onExternalAbort);
    }
  }

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await execute(path, options);

    if (response.status === 204) {
      return undefined as T;
    }

    const body = await safeJson(response);

    return unwrapData(body) as T;
  }

  async function requestList<T>(
    path: string,
    params?: ListParams,
    options?: ListRequestOptions,
  ): Promise<CollectionResult<T>> {
    const response = await execute(path, {
      method: 'GET',
      query: listParamsToQuery(params),
      signal: options?.signal,
      timeoutMs: options?.timeoutMs,
      headers: options?.headers,
    });

    const body = await safeJson(response);
    const data = unwrapData(body);

    return {
      items: Array.isArray(data) ? (data as T[]) : [],
      meta: readMeta(body),
    };
  }

  return {
    baseUrl: config.baseUrl,
    request,
    requestList,
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  };
}
