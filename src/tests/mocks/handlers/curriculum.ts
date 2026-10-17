import { HttpResponse, http } from 'msw';

const demoCurriculum = [
  {
    id: 'curriculum-1',
    name: 'Grade 10 Mathematics',
    courseId: 'course-1',
    branchId: 'branch-1',
    academicYearId: 'academic-year-1',
    description: 'Mathematics curriculum for grade 10.',
    order: 1,
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'curriculum-2',
    name: 'Grade 10 English',
    courseId: 'course-2',
    branchId: 'branch-1',
    academicYearId: 'academic-year-1',
    description: 'English curriculum for grade 10.',
    order: 2,
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'curriculum-3',
    name: 'Grade 10 Science',
    courseId: 'course-3',
    branchId: 'branch-2',
    academicYearId: 'academic-year-1',
    description: 'Science curriculum for grade 10.',
    order: 3,
    status: 'inactive',
    createdAt: '2026-02-11T10:00:00.000Z',
  },
];

export const curriculumHandlers = [
  http.get('*/curriculum', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoCurriculum.filter(
      (item) =>
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.courseId.toLowerCase().includes(q),
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

  http.get('*/curriculum/:id', ({ params }) => {
    const item = demoCurriculum.find((item) => item.id === params.id);

    if (!item) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Curriculum not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: item });
  }),

  http.post('*/curriculum', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'curriculum-new',
          createdAt: new Date().toISOString(),
          status: 'active',
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/curriculum/:id', async ({ request, params }) => {
    const item = demoCurriculum.find((item) => item.id === params.id);

    if (!item) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Curriculum not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoCurriculum[0]>;

    const updated = {
      ...item,
      name: body.name ?? item.name,
      courseId: body.courseId ?? item.courseId,
      description: body.description ?? item.description,
      order: body.order ?? item.order,
      status: body.status ?? item.status,
    };

    const index = demoCurriculum.findIndex((item) => item.id === item.id);
    demoCurriculum[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
