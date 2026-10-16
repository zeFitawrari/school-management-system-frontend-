import { HttpResponse, http } from 'msw';

const demoStudents = [
  {
    id: 'student-1',
    studentNumber: 'STU-001',
    fullName: 'Abebe Kebede',
    email: 'abebe@example.com',
    phone: '+251911000000',
    branchId: 'branch-1',
    groupId: 'group-1',
    status: 'active',
    packageIds: ['package-1'],
    guardianIds: ['parent-1'],
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'student-2',
    studentNumber: 'STU-002',
    fullName: 'Sara Bekele',
    email: 'sara.student@example.com',
    phone: '+251912000000',
    branchId: 'branch-1',
    groupId: 'group-2',
    status: 'active',
    packageIds: ['package-2'],
    guardianIds: [],
    createdAt: '2026-02-11T10:00:00.000Z',
  },
  {
    id: 'student-3',
    studentNumber: 'STU-003',
    fullName: 'Chaltu Dibaba',
    branchId: 'branch-1',
    groupId: null,
    status: 'suspended',
    packageIds: [],
    guardianIds: [],
    createdAt: '2026-03-12T10:00:00.000Z',
  },
];

export const studentHandlers = [
  http.get('*/students', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoStudents.filter(
      (student) =>
        !q ||
        student.fullName.toLowerCase().includes(q) ||
        student.studentNumber.toLowerCase().includes(q),
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

  http.post('*/students/check-duplicate', async ({ request }) => {
    const body = (await request.json()) as { fullName?: string };
    const match = demoStudents.find(
      (student) => student.fullName.toLowerCase() === body.fullName?.toLowerCase(),
    );

    return HttpResponse.json({
      data: match
        ? { isDuplicate: true, matchedStudentId: match.id, matchedStudentName: match.fullName }
        : { isDuplicate: false },
    });
  }),

  http.get('*/students/:id', ({ params }) => {
    const student = demoStudents.find((item) => item.id === params.id);

    if (!student) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Student not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: student });
  }),

  http.post('*/students', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'student-new',
          studentNumber: 'STU-999',
          createdAt: new Date().toISOString(),
          ...body,
          status: 'active',
          packageIds: (body as { packageIds?: string[] }).packageIds ?? [],
          guardianIds: (body as { guardianIds?: string[] }).guardianIds ?? [],
        },
      },
      { status: 201 },
    );
  }),

  http.post('*/students/:id/transfer', async ({ params, request }) => {
    const body = (await request.json()) as { groupId?: string };
    const student = demoStudents.find((item) => item.id === params.id);

    if (!student) {
      return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Student not found' } }, { status: 404 });
    }

    return HttpResponse.json({ data: { ...student, groupId: body.groupId ?? student.groupId } });
  }),

  http.post('*/students/:id/graduate', ({ params }) => {
    const student = demoStudents.find((item) => item.id === params.id);

    if (!student) {
      return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Student not found' } }, { status: 404 });
    }

    return HttpResponse.json({ data: { ...student, status: 'graduated' } });
  }),

  http.post('*/students/:id/suspend', async ({ params, request }) => {
    const body = (await request.json()) as { reason?: string };
    const student = demoStudents.find((item) => item.id === params.id);

    if (!student) {
      return HttpResponse.json({ error: { code: 'NOT_FOUND', message: 'Student not found' } }, { status: 404 });
    }

    return HttpResponse.json({ data: { ...student, status: 'suspended', suspensionReason: body.reason } });
  }),
];
