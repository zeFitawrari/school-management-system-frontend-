import { HttpResponse, http } from 'msw';

const demoAcademicYears = [
  {
    id: 'academic-year-1',
    name: '2026/2027',
    startDate: '2026-09-01',
    endDate: '2027-06-30',
    branchId: 'branch-1',
    status: 'active',
    isCurrent: true,
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'academic-year-2',
    name: '2025/2026',
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    branchId: 'branch-1',
    status: 'archived',
    isCurrent: false,
    createdAt: '2025-01-10T10:00:00.000Z',
  },
  {
    id: 'academic-year-3',
    name: '2027/2028',
    startDate: '2027-09-01',
    endDate: '2028-06-30',
    branchId: 'branch-2',
    status: 'draft',
    isCurrent: false,
    createdAt: '2026-03-12T10:00:00.000Z',
  },
];

export const academicYearHandlers = [
  http.get('*/academic-years', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoAcademicYears.filter(
      (year) =>
        !q ||
        year.name.toLowerCase().includes(q) ||
        year.status.toLowerCase().includes(q),
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

  http.get('*/academic-years/:id', ({ params }) => {
    const year = demoAcademicYears.find((item) => item.id === params.id);

    if (!year) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Academic year not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: year });
  }),

  http.post('*/academic-years', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'academic-year-new',
          createdAt: new Date().toISOString(),
          isCurrent: false,
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/academic-years/:id', async ({ request, params }) => {
    const year = demoAcademicYears.find((item) => item.id === params.id);

    if (!year) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Academic year not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoAcademicYears[0]>;

    const updated = {
      ...year,
      name: body.name ?? year.name,
      startDate: body.startDate ?? year.startDate,
      endDate: body.endDate ?? year.endDate,
      status: body.status ?? year.status,
      isCurrent: body.isCurrent ?? year.isCurrent,
    };

    const index = demoAcademicYears.findIndex((item) => item.id === year.id);
    demoAcademicYears[index] = updated;

    return HttpResponse.json({ data: updated });
  }),

  http.post('*/academic-years/:id/set-current', async ({ params }) => {
    const year = demoAcademicYears.find((item) => item.id === params.id);

    if (!year) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Academic year not found' } },
        { status: 404 },
      );
    }

    demoAcademicYears.forEach((item) => {
      item.isCurrent = item.id === year.id;
    });

    const updated = { ...year, isCurrent: true };
    const index = demoAcademicYears.findIndex((item) => item.id === year.id);
    demoAcademicYears[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
