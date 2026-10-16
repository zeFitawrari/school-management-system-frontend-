import type { ApiErrorCode, ApiFieldError } from '@/types/api';

export type ApiErrorInit = {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: ApiFieldError[];
  correlationId?: string;
  cause?: unknown;
};

/**
 * The single failure type every API call rejects with. Components and forms
 * switch on `code`; they never read raw server text or stack traces.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly details: ApiFieldError[];
  readonly correlationId?: string;

  constructor(init: ApiErrorInit) {
    super(init.message, init.cause !== undefined ? { cause: init.cause } : undefined);
    this.name = 'ApiError';
    this.code = init.code;
    this.status = init.status;
    this.details = init.details ?? [];
    this.correlationId = init.correlationId;
  }

  /** True when a field-level error exists for the given form field name. */
  hasFieldError(field: string): boolean {
    return this.details.some((detail) => detail.field === field);
  }

  /** First message for a field, if any (for inline form errors). */
  fieldMessage(field: string): string | undefined {
    return this.details.find((detail) => detail.field === field)?.message;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export function isAbortError(value: unknown): boolean {
  return (
    (value instanceof DOMException && value.name === 'AbortError') ||
    (typeof value === 'object' &&
      value !== null &&
      'name' in value &&
      (value as { name?: unknown }).name === 'AbortError')
  );
}
