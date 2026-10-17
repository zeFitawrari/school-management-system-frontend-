import { HttpResponse, http } from 'msw';

const demoVacancies = [
  {
    id: 'vacancy-1',
    vacancyNumber: 'VAC-001',
    title: 'Mathematics Tutor',
    department: 'Mathematics',
    branchId: 'branch-1',
    status: 'open',
    description: 'We are looking for a qualified mathematics tutor for high school levels.',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'vacancy-2',
    vacancyNumber: 'VAC-002',
    title: 'English Tutor',
    department: 'Languages',
    branchId: 'branch-1',
    status: 'open',
    description: 'English language tutor for beginner and intermediate levels.',
    createdAt: '2026-02-11T10:00:00.000Z',
  },
  {
    id: 'vacancy-3',
    vacancyNumber: 'VAC-003',
    title: 'Science Tutor',
    department: 'Science',
    branchId: 'branch-2',
    status: 'closed',
    description: 'Science tutor position has been filled.',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
];

export const vacancyHandlers = [
  http.get('*/vacancies', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoVacancies.filter(
      (vacancy) =>
        !q ||
        vacancy.title.toLowerCase().includes(q) ||
        vacancy.vacancyNumber.toLowerCase().includes(q) ||
        (vacancy.department ?? '').toLowerCase().includes(q),
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

  http.get('*/vacancies/:id', ({ params }) => {
    const vacancy = demoVacancies.find((item) => item.id === params.id);

    if (!vacancy) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Vacancy not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: vacancy });
  }),

  http.post('*/vacancies', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'vacancy-new',
          vacancyNumber: `VAC-${String(demoVacancies.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          status: 'open',
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/vacancies/:id', async ({ request, params }) => {
    const vacancy = demoVacancies.find((item) => item.id === params.id);

    if (!vacancy) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Vacancy not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoVacancies[0]>;

    const updated = {
      ...vacancy,
      title: body.title ?? vacancy.title,
      department: body.department ?? vacancy.department,
      description: body.description ?? vacancy.description,
      status: body.status ?? vacancy.status,
    };

    const index = demoVacancies.findIndex((item) => item.id === vacancy.id);
    demoVacancies[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
