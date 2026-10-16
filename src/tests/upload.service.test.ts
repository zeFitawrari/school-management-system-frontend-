import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';

import { createUploadService } from '@/services/upload.service';
import { server } from '@/tests/mocks/server';

const baseUrl = 'http://localhost:3000/api';
const uploadService = createUploadService({ baseUrl });

describe('upload.service', () => {
  it('uploads a file and returns the uploaded file id', async () => {
    const file = new File(['hello world'], 'notes.txt', { type: 'text/plain' });

    const result = await uploadService.uploadFile(file);

    expect(result.fileId).toBeTruthy();
    expect(result.name).toBe('notes.txt');
  });

  it('normalises upload failures into ApiError', async () => {
    server.use(
      http.post('*/uploads', () =>
        HttpResponse.json(
          { error: { code: 'UNPROCESSABLE', message: 'File too large' } },
          { status: 422 },
        ),
      ),
    );

    const file = new File(['x'.repeat(10)], 'big.bin');

    await expect(uploadService.uploadFile(file)).rejects.toMatchObject({
      code: 'UNPROCESSABLE',
      message: 'File too large',
      status: 422,
    });
  });
});

describe('services public surface', () => {
  it('binds a singleton auth service to the configured client', async () => {
    const { authService } = await import('@/services');

    await expect(authService.getCurrentUser()).resolves.toMatchObject({ id: 'user-1' });
  });
});
