import { HttpResponse, http } from 'msw';

import { demoPassword, demoUser } from '@/tests/mocks/fixtures/auth';

export const authHandlers = [
  http.post('*/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || body.password !== demoPassword) {
      return HttpResponse.json(
        {
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Invalid email or password',
          },
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({ data: demoUser });
  }),

  http.post('*/auth/logout', () => new HttpResponse(null, { status: 204 })),

  http.post('*/auth/refresh', () => HttpResponse.json({ data: demoUser })),

  http.get('*/auth/me', () => HttpResponse.json({ data: demoUser })),

  http.post('*/auth/password/change', () => new HttpResponse(null, { status: 204 })),

  http.post('*/uploads', async ({ request }) => {
    await request.formData();

    return HttpResponse.json({ data: { fileId: 'file-1' } }, { status: 201 });
  }),
];
