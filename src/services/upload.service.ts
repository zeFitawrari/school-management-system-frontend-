import { ApiError } from '@/services/api-error';
import {
  DEFAULT_MESSAGES,
  JSON_CONTENT_TYPE,
  joinUrl,
  parseErrorEnvelope,
  parseJson,
  randomId,
  readCookie,
  statusToCode,
  toKnownCode,
  unwrapData,
} from '@/services/http';

export type UploadedFile = {
  fileId: string;
  url?: string;
  name?: string;
  size?: number;
  mimeType?: string;
};

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

export type UploadOptions = {
  /** FormData field name; defaults to `file`. */
  fieldName?: string;
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
};

export type UploadConfig = {
  baseUrl: string;
  path?: string;
  onUnauthenticated?: () => void;
  csrfCookieName?: string;
  csrfHeaderName?: string;
};

/**
 * File uploads need byte-level progress, which `fetch` cannot report, so this
 * service uses XHR. Failures are normalised into the same `ApiError` shape as
 * the JSON client so callers handle one error type.
 */
export function createUploadService(config: UploadConfig) {
  const path = config.path ?? '/uploads';
  const csrfCookieName = config.csrfCookieName ?? 'XSRF-TOKEN';
  const csrfHeaderName = config.csrfHeaderName ?? 'X-XSRF-TOKEN';

  function uploadFile(file: File, options: UploadOptions = {}): Promise<UploadedFile> {
    return new Promise<UploadedFile>((resolve, reject) => {
      const form = new FormData();
      form.append(options.fieldName ?? 'file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', joinUrl(config.baseUrl, path));
      xhr.withCredentials = true;
      xhr.setRequestHeader('Accept', JSON_CONTENT_TYPE);

      const correlationId = randomId();
      xhr.setRequestHeader('X-Correlation-Id', correlationId);

      const unsafeCsrf = readCookie(csrfCookieName);
      if (unsafeCsrf) {
        xhr.setRequestHeader(csrfHeaderName, unsafeCsrf);
      }

      const externalSignal = options.signal;
      const onAbort = (): void => xhr.abort();
      externalSignal?.addEventListener('abort', onAbort);

      const cleanup = (): void => externalSignal?.removeEventListener('abort', onAbort);

      xhr.upload.addEventListener('progress', (event) => {
        if (!options.onProgress || !event.lengthComputable) {
          return;
        }

        options.onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: event.total > 0 ? Math.round((event.loaded / event.total) * 100) : 0,
        });
      });

      xhr.addEventListener('load', () => {
        cleanup();

        const body = parseJson(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          // Keep the original file name as a fallback for environments/mocks where
          // the multipart body is not parsed back into a File (see T08 note).
          const uploaded = (unwrapData(body) ?? {}) as Partial<UploadedFile>;
          resolve({
            fileId: uploaded.fileId ?? '',
            url: uploaded.url,
            name: uploaded.name ?? file.name,
            size: uploaded.size,
            mimeType: uploaded.mimeType,
          });
          return;
        }

        const envelope = parseErrorEnvelope(body);
        const code = envelope ? toKnownCode(envelope.code) : statusToCode(xhr.status);

        if (code === 'UNAUTHENTICATED') {
          config.onUnauthenticated?.();
        }

        reject(
          new ApiError({
            code,
            message: envelope?.message ?? DEFAULT_MESSAGES[code],
            status: xhr.status,
            details: envelope?.details,
            correlationId: envelope?.correlationId ?? correlationId,
          }),
        );
      });

      xhr.addEventListener('error', () => {
        cleanup();
        reject(new ApiError({ code: 'NETWORK_ERROR', message: DEFAULT_MESSAGES.NETWORK_ERROR }));
      });

      xhr.addEventListener('timeout', () => {
        cleanup();
        reject(new ApiError({ code: 'TIMEOUT', message: DEFAULT_MESSAGES.TIMEOUT }));
      });

      xhr.addEventListener('abort', () => {
        cleanup();
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      });

      xhr.send(form);
    });
  }

  return { uploadFile };
}

export type UploadService = ReturnType<typeof createUploadService>;
