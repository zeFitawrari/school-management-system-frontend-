import { HttpResponse, http } from 'msw';

import { demoUser } from '@/tests/mocks/fixtures/auth';

const demoUsers = [
  { ...demoUser, status: 'active' },
  {
    id: 'user-2',
    fullName: 'Tutor Demo',
    email: 'tutor@example.com',
    roles: ['tutor'],
    permissions: ['dashboard.read', 'students.read', 'groups.read', 'attendance.mark'],
    branchIds: ['branch-1'],
    status: 'active',
  },
];

export const userHandlers = [
  http.get('*/users', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoUsers.filter(
      (user) =>
        !q ||
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q),
    );
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    return HttpResponse.json({
      data: slice,
      meta: {
        page,
        pageSize,
        totalItems: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
      },
    });
  }),

  http.get('*/users/:id', ({ params }) => {
    const user = demoUsers.find((item) => item.id === params.id);

    if (!user) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: user });
  }),
];
