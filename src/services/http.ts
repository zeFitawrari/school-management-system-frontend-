import type {
  ApiErrorCode,
  ApiErrorEnvelope,
  ApiFieldError,
  PaginationMeta,
  QueryParams,
} from '@/types/api';

export const JSON_CONTENT_TYPE = 'application/json';

export const EMPTY_META: PaginationMeta = { page: 1, pageSize: 0, totalItems: 0, totalPages: 0 };

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE',
  429: 'RATE_LIMITED',
};

const KNOWN_CODES: readonly ApiErrorCode[] = [
  'VALIDATION_ERROR',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'UNPROCESSABLE',
  'RATE_LIMITED',
  'SERVER_ERROR',
  'NETWORK_ERROR',
  'TIMEOUT',
  'ABORTED',
];

export const DEFAULT_MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION_ERROR: 'Some details are invalid. Please check and try again.',
  UNAUTHENTICATED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to do this.',
  NOT_FOUND: 'The requested item could not be found.',
  CONFLICT: 'This conflicts with existing data.',
  UNPROCESSABLE: 'This action could not be completed.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  SERVER_ERROR: 'Something went wrong on our side. Please try again.',
  NETWORK_ERROR: 'Network error. Check your connection and try again.',
  TIMEOUT: 'The request took too long. Please try again.',
  ABORTED: 'The request was cancelled.',
};

export function joinUrl(baseUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;

  return `${base}${suffix}`;
}

export function buildQuery(params?: QueryParams): string {
  if (!params) {
    return '';
  }

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    search.append(key, String(value));
  }

  const query = search.toString();

  return query ? `?${query}` : '';
}

export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const prefix = `${name}=`;
  const entry = document.cookie.split('; ').find((row) => row.startsWith(prefix));

  return entry ? decodeURIComponent(entry.slice(prefix.length)) : undefined;
}

export function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function toKnownCode(code: string): ApiErrorCode {
  return (KNOWN_CODES as readonly string[]).includes(code)
    ? (code as ApiErrorCode)
    : 'SERVER_ERROR';
}

export function statusToCode(status: number): ApiErrorCode {
  return STATUS_TO_CODE[status] ?? 'SERVER_ERROR';
}

export function parseJson(text: string): unknown {
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

export async function safeJson(response: Response): Promise<unknown> {
  return parseJson(await response.text());
}

export function parseErrorEnvelope(body: unknown): ApiErrorEnvelope['error'] | undefined {
  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return undefined;
  }

  const raw = (body as { error?: unknown }).error;

  if (typeof raw !== 'object' || raw === null) {
    return undefined;
  }

  const record = raw as Record<string, unknown>;
  const code = typeof record.code === 'string' ? record.code : undefined;
  const message = typeof record.message === 'string' ? record.message : undefined;

  if (!code || !message) {
    return undefined;
  }

  const details = Array.isArray(record.details) ? (record.details as ApiFieldError[]) : undefined;
  const correlationId = typeof record.correlationId === 'string' ? record.correlationId : undefined;

  return { code, message, details, correlationId };
}

export function unwrapData(body: unknown): unknown {
  if (typeof body === 'object' && body !== null && 'data' in body) {
    return (body as { data: unknown }).data;
  }

  return body;
}

export function readMeta(body: unknown): PaginationMeta {
  if (typeof body !== 'object' || body === null || !('meta' in body)) {
    return EMPTY_META;
  }

  const meta = (body as { meta?: unknown }).meta;

  if (typeof meta !== 'object' || meta === null) {
    return EMPTY_META;
  }

  const record = meta as Record<string, unknown>;

  return {
    page: typeof record.page === 'number' ? record.page : 1,
    pageSize: typeof record.pageSize === 'number' ? record.pageSize : 0,
    totalItems: typeof record.totalItems === 'number' ? record.totalItems : 0,
    totalPages: typeof record.totalPages === 'number' ? record.totalPages : 0,
  };
}
