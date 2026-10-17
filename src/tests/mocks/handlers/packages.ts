import { HttpResponse, http } from 'msw';

const demoPackages = [
  {
    id: 'package-1',
    code: 'PKG-001',
    name: 'Basic Math Package',
    description: 'Basic mathematics bundle for grade 10.',
    branchId: 'branch-1',
    price: 5000,
    durationWeeks: 12,
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'package-2',
    code: 'PKG-002',
    name: 'English Bundle',
    description: 'English language learning package.',
    branchId: 'branch-1',
    price: 4000,
    durationWeeks: 8,
    status: 'active',
    createdAt: '2026-02-11T10:00:00.000Z',
  },
  {
    id: 'package-3',
    code: 'PKG-003',
    name: 'Science Intensive',
    description: 'Intensive science preparation.',
    branchId: 'branch-2',
    price: 6000,
    durationWeeks: 10,
    status: 'inactive',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
];

export const packageHandlers = [
  http.get('*/packages', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoPackages.filter(
      (pkg) =>
        !q ||
        pkg.code.toLowerCase().includes(q) ||
        pkg.name.toLowerCase().includes(q),
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

  http.get('*/packages/:id', ({ params }) => {
    const pkg = demoPackages.find((item) => item.id === params.id);

    if (!pkg) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Package not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: pkg });
  }),

  http.post('*/packages', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'package-new',
          createdAt: new Date().toISOString(),
          status: 'active',
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/packages/:id', async ({ request, params }) => {
    const pkg = demoPackages.find((item) => item.id === params.id);

    if (!pkg) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Package not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoPackages[0]>;

    const updated = {
      ...pkg,
      code: body.code ?? pkg.code,
      name: body.name ?? pkg.name,
      description: body.description ?? pkg.description,
      price: body.price ?? pkg.price,
      durationWeeks: body.durationWeeks ?? pkg.durationWeeks,
      status: body.status ?? pkg.status,
    };

    const index = demoPackages.findIndex((item) => item.id === pkg.id);
    demoPackages[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
