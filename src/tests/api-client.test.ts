import { HttpResponse, delay, http } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/services/api-error';
import { createApiClient } from '@/services/api-client';
import { server } from '@/tests/mocks/server';

const baseUrl = 'http://localhost:3000/api';
const url = (path: string): string => `${baseUrl}${path}`;

function makeClient(onUnauthenticated?: () => void) {
  return createApiClient({ baseUrl, timeoutMs: 1000, onUnauthenticated });
}

describe('api-client envelope', () => {
  it('unwraps a single-resource envelope', async () => {
    server.use(http.get(url('/thing'), () => HttpResponse.json({ data: { id: '1' } })));

    await expect(makeClient().get('/thing')).resolves.toEqual({ id: '1' });
  });

  it('returns items and meta for a collection', async () => {
    server.use(
      http.get(url('/things'), () =>
        HttpResponse.json({
          data: [{ id: '1' }, { id: '2' }],
          meta: { page: 1, pageSize: 25, totalItems: 2, totalPages: 1 },
        }),
      ),
    );

    const result = await makeClient().requestList<{ id: string }>('/things');

    expect(result.items).toHaveLength(2);
    expect(result.meta).toEqual({ page: 1, pageSize: 25, totalItems: 2, totalPages: 1 });
  });

  it('returns undefined for 204 responses', async () => {
    server.use(http.delete(url('/thing/1'), () => new HttpResponse(null, { status: 204 })));

    await expect(makeClient().delete('/thing/1')).resolves.toBeUndefined();
  });

  it('passes list params as query parameters and drops empties', async () => {
    let captured = '';

    server.use(
      http.get(url('/things'), ({ request }) => {
        captured = new URL(request.url).search;
        return HttpResponse.json({
          data: [],
          meta: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 },
        });
      }),
    );

    await makeClient().requestList('/things', {
      page: 2,
      pageSize: 10,
      sort: '-name',
      filters: { branchId: 'b1', status: undefined },
    });

    const params = new URLSearchParams(captured);

    expect(params.get('page')).toBe('2');
    expect(params.get('pageSize')).toBe('10');
    expect(params.get('sort')).toBe('-name');
    expect(params.get('branchId')).toBe('b1');
    expect(params.has('status')).toBe(false);
  });
});

describe('api-client error normalisation', () => {
  const cases: Array<[number, string]> = [
    [400, 'VALIDATION_ERROR'],
    [401, 'UNAUTHENTICATED'],
    [403, 'FORBIDDEN'],
    [404, 'NOT_FOUND'],
    [409, 'CONFLICT'],
    [422, 'UNPROCESSABLE'],
    [429, 'RATE_LIMITED'],
    [500, 'SERVER_ERROR'],
  ];

  it.each(cases)('maps HTTP %i to %s', async (status, code) => {
    server.use(
      http.get(url('/fail'), () =>
        HttpResponse.json({ error: { code, message: 'nope' } }, { status }),
      ),
    );

    await expect(makeClient().get('/fail')).rejects.toMatchObject({ code, status });
  });

  it('exposes field-level validation details', async () => {
    server.use(
      http.post(url('/thing'), () =>
        HttpResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid',
              details: [{ field: 'email', message: 'Already in use' }],
            },
          },
          { status: 400 },
        ),
      ),
    );

    await makeClient()
      .post('/thing', {})
      .catch((error: unknown) => {
        expect(error).toBeInstanceOf(ApiError);
        const apiError = error as ApiError;
        expect(apiError.fieldMessage('email')).toBe('Already in use');
        expect(apiError.hasFieldError('email')).toBe(true);
        expect(apiError.hasFieldError('phone')).toBe(false);
      });
  });

  it('falls back to a safe message for non-JSON bodies', async () => {
    server.use(
      http.get(url('/html-error'), () => new HttpResponse('<html>oops</html>', { status: 500 })),
    );

    await makeClient()
      .get('/html-error')
      .catch((error: unknown) => {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).code).toBe('SERVER_ERROR');
        expect((error as ApiError).message).toContain('Something went wrong');
      });
  });

  it('calls onUnauthenticated on 401', async () => {
    const onUnauthenticated = vi.fn();

    server.use(
      http.get(url('/me'), () =>
        HttpResponse.json(
          { error: { code: 'UNAUTHENTICATED', message: 'expired' } },
          { status: 401 },
        ),
      ),
    );

    await expect(makeClient(onUnauthenticated).get('/me')).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
    });
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it('normalises a network failure', async () => {
    server.use(http.get(url('/down'), () => HttpResponse.error()));

    await expect(makeClient().get('/down')).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });

  it('times out slow requests', async () => {
    server.use(
      http.get(url('/slow'), async () => {
        await delay(200);
        return HttpResponse.json({ data: {} });
      }),
    );

    await expect(makeClient().get('/slow', { timeoutMs: 30 })).rejects.toMatchObject({
      code: 'TIMEOUT',
    });
  });

  it('rethrows abort errors untouched', async () => {
    server.use(
      http.get(url('/abort'), async () => {
        await delay(200);
        return HttpResponse.json({ data: {} });
      }),
    );

    const controller = new AbortController();
    const promise = makeClient().get('/abort', { signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });
});

describe('api-client request headers', () => {
  afterEach(() => {
    document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/';
  });

  it('sends a correlation id', async () => {
    let correlationId: string | null = null;

    server.use(
      http.get(url('/thing'), ({ request }) => {
        correlationId = request.headers.get('x-correlation-id');
        return HttpResponse.json({ data: {} });
      }),
    );

    await makeClient().get('/thing');

    expect(correlationId).toBeTruthy();
  });

  it('sends Idempotency-Key for opted-in mutations', async () => {
    let idempotencyKey: string | null = null;

    server.use(
      http.post(url('/payments'), ({ request }) => {
        idempotencyKey = request.headers.get('idempotency-key');
        return HttpResponse.json({ data: { id: 'p1' } });
      }),
    );

    await makeClient().post('/payments', { amount: '10' }, { idempotencyKey: 'key-123' });

    expect(idempotencyKey).toBe('key-123');
  });

  it('sends the CSRF header from the cookie on unsafe methods', async () => {
    let csrf: string | null = null;
    document.cookie = 'XSRF-TOKEN=token-abc; path=/';

    server.use(
      http.post(url('/things'), ({ request }) => {
        csrf = request.headers.get('x-xsrf-token');
        return HttpResponse.json({ data: {} });
      }),
    );

    await makeClient().post('/things', {});

    expect(csrf).toBe('token-abc');
  });
});
