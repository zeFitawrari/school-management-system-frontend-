import { HttpResponse, http } from 'msw';

const demoCourses = [
  {
    id: 'course-1',
    code: 'MATH-101',
    name: 'Mathematics I',
    description: 'Introductory mathematics for high school.',
    branchId: 'branch-1',
    credits: 3,
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'course-2',
    code: 'ENG-101',
    name: 'English I',
    description: 'Beginner English language course.',
    branchId: 'branch-1',
    credits: 2,
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'course-3',
    code: 'SCI-101',
    name: 'General Science',
    description: 'Basic science concepts.',
    branchId: 'branch-2',
    credits: 3,
    status: 'inactive',
    createdAt: '2026-02-11T10:00:00.000Z',
  },
];

export const courseHandlers = [
  http.get('*/courses', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoCourses.filter(
      (course) =>
        !q ||
        course.code.toLowerCase().includes(q) ||
        course.name.toLowerCase().includes(q),
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

  http.get('*/courses/:id', ({ params }) => {
    const course = demoCourses.find((item) => item.id === params.id);

    if (!course) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Course not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: course });
  }),

  http.post('*/courses', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'course-new',
          createdAt: new Date().toISOString(),
          status: 'active',
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/courses/:id', async ({ request, params }) => {
    const course = demoCourses.find((item) => item.id === params.id);

    if (!course) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Course not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoCourses[0]>;

    const updated = {
      ...course,
      code: body.code ?? course.code,
      name: body.name ?? course.name,
      description: body.description ?? course.description,
      credits: body.credits ?? course.credits,
      status: body.status ?? course.status,
    };

    const index = demoCourses.findIndex((item) => item.id === course.id);
    demoCourses[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
