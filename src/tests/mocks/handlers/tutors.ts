import { HttpResponse, http } from 'msw';

const demoTutors = [
  {
    id: 'tutor-1',
    tutorNumber: 'TUT-001',
    fullName: 'Alemayehu Tesfaye',
    email: 'alemayehu@example.com',
    phone: '+251911111111',
    branchId: 'branch-1',
    status: 'active',
    subjects: ['Mathematics', 'Physics'],
    hireDate: '2024-09-01',
    createdAt: '2024-09-01T08:00:00.000Z',
  },
  {
    id: 'tutor-2',
    tutorNumber: 'TUT-002',
    fullName: 'Fatuma Ahmed',
    email: 'fatuma@example.com',
    phone: '+251912222222',
    branchId: 'branch-1',
    status: 'active',
    subjects: ['English', 'Biology'],
    hireDate: '2025-01-15',
    createdAt: '2025-01-15T09:00:00.000Z',
  },
  {
    id: 'tutor-3',
    tutorNumber: 'TUT-003',
    fullName: 'Getachew Tadesse',
    email: 'getachew@example.com',
    phone: '+251913333333',
    branchId: 'branch-2',
    status: 'inactive',
    subjects: ['Chemistry'],
    hireDate: '2023-08-20',
    createdAt: '2023-08-20T10:00:00.000Z',
  },
];

export const tutorHandlers = [
  http.get('*/tutors', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoTutors.filter(
      (tutor) =>
        !q ||
        tutor.fullName.toLowerCase().includes(q) ||
        tutor.tutorNumber.toLowerCase().includes(q) ||
        tutor.subjects.some((subject) => subject.toLowerCase().includes(q)),
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

  http.get('*/tutors/:id', ({ params }) => {
    const tutor = demoTutors.find((item) => item.id === params.id);

    if (!tutor) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Tutor not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: tutor });
  }),

  http.post('*/tutors', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'tutor-new',
          tutorNumber: `TUT-${String(demoTutors.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          status: 'active',
          subjects: [],
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/tutors/:id', async ({ request, params }) => {
    const tutor = demoTutors.find((item) => item.id === params.id);

    if (!tutor) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Tutor not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoTutors[0]>;

    const updated = {
      ...tutor,
      fullName: body.fullName ?? tutor.fullName,
      email: body.email ?? tutor.email,
      phone: body.phone ?? tutor.phone,
      status: body.status ?? tutor.status,
      subjects: body.subjects ?? tutor.subjects,
    };

    const index = demoTutors.findIndex((item) => item.id === tutor.id);
    demoTutors[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
