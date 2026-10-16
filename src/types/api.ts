/**
 * Cross-cutting API contract types (docs/api-contract.md).
 * Only put types here that more than one feature shares. Feature-specific
 * payloads live at `features/<name>/types`.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'ABORTED';

export type ApiFieldError = {
  field: string;
  message: string;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

/** Single resource envelope: `{ data: {...} }`. */
export type SingleResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

/** Collection envelope: `{ data: [...], meta: { page, pageSize, ... } }`. */
export type CollectionResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

/** Error envelope returned by the backend on failure. */
export type ApiErrorEnvelope = {
  error: {
    code: ApiErrorCode | string;
    message: string;
    details?: ApiFieldError[];
    correlationId?: string;
  };
};

/** Normalised list result the UI consumes. */
export type CollectionResult<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type QueryPrimitive = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryPrimitive>;

/** `field` ascending, `-field` descending (docs/api-contract.md section 3). */
export type SortParam = string;

export type ListParams = {
  page?: number;
  pageSize?: number;
  sort?: SortParam;
  q?: string;
  filters?: QueryParams;
};

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: QueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Adds `Idempotency-Key` for mutations that can be double-sent. */
  idempotencyKey?: string;
};
