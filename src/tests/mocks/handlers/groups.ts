import { HttpResponse, http } from 'msw';

const demoGroups = [
  {
    id: 'group-1',
    code: 'GRP-001',
    name: 'Grade 10 Math A',
    courseId: 'course-1',
    branchId: 'branch-1',
    tutorId: 'tutor-1',
    capacity: 30,
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'group-2',
    code: 'GRP-002',
    name: 'Grade 10 English B',
    courseId: 'course-2',
    branchId: 'branch-1',
    tutorId: 'tutor-2',
    capacity: 25,
    status: 'active',
    createdAt: '2026-02-11T10:00:00.000Z',
  },
  {
    id: 'group-3',
    code: 'GRP-003',
    name: 'Grade 9 Science',
    courseId: 'course-3',
    branchId: 'branch-2',
    tutorId: null,
    capacity: 35,
    status: 'inactive',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
];

export const groupHandlers = [
  http.get('*/groups', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoGroups.filter(
      (group) =>
        !q ||
        group.code.toLowerCase().includes(q) ||
        group.name.toLowerCase().includes(q),
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

  http.get('*/groups/:id', ({ params }) => {
    const group = demoGroups.find((item) => item.id === params.id);

    if (!group) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Group not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: group });
  }),

  http.post('*/groups', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'group-new',
          createdAt: new Date().toISOString(),
          status: 'active',
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/groups/:id', async ({ request, params }) => {
    const group = demoGroups.find((item) => item.id === params.id);

    if (!group) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Group not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoGroups[0]>;

    const updated = {
      ...group,
      code: body.code ?? group.code,
      name: body.name ?? group.name,
      courseId: body.courseId ?? group.courseId,
      tutorId: body.tutorId ?? group.tutorId,
      capacity: body.capacity ?? group.capacity,
      status: body.status ?? group.status,
    };

    const index = demoGroups.findIndex((item) => item.id === group.id);
    demoGroups[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
