import { HttpResponse, http } from 'msw';

const demoEnrollments = [
  {
    id: 'enrollment-1',
    enrollmentNumber: 'ENR-001',
    studentId: 'student-1',
    groupId: 'group-1',
    branchId: 'branch-1',
    academicYearId: 'academic-year-1',
    status: 'active',
    enrolledAt: '2026-09-01',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'enrollment-2',
    enrollmentNumber: 'ENR-002',
    studentId: 'student-2',
    groupId: 'group-2',
    branchId: 'branch-1',
    academicYearId: 'academic-year-1',
    status: 'active',
    enrolledAt: '2026-02-11',
    createdAt: '2026-02-11T10:00:00.000Z',
  },
  {
    id: 'enrollment-3',
    enrollmentNumber: 'ENR-003',
    studentId: 'student-3',
    groupId: 'group-3',
    branchId: 'branch-2',
    academicYearId: 'academic-year-1',
    status: 'dropped',
    enrolledAt: '2026-03-12',
    createdAt: '2026-03-12T10:00:00.000Z',
  },
];

export const enrollmentHandlers = [
  http.get('*/enrollments', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const items = demoEnrollments.filter(
      (enrollment) =>
        !q ||
        enrollment.enrollmentNumber.toLowerCase().includes(q) ||
        enrollment.studentId.toLowerCase().includes(q) ||
        enrollment.groupId.toLowerCase().includes(q),
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

  http.get('*/enrollments/:id', ({ params }) => {
    const enrollment = demoEnrollments.find((item) => item.id === params.id);

    if (!enrollment) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Enrollment not found' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: enrollment });
  }),

  http.post('*/enrollments', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        data: {
          id: 'enrollment-new',
          enrollmentNumber: `ENR-${String(demoEnrollments.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          status: 'active',
          ...body,
        },
      },
      { status: 201 },
    );
  }),

  http.patch('*/enrollments/:id', async ({ request, params }) => {
    const enrollment = demoEnrollments.find((item) => item.id === params.id);

    if (!enrollment) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Enrollment not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<typeof demoEnrollments[0]>;

    const updated = {
      ...enrollment,
      studentId: body.studentId ?? enrollment.studentId,
      groupId: body.groupId ?? enrollment.groupId,
      branchId: body.branchId ?? enrollment.branchId,
      academicYearId: body.academicYearId ?? enrollment.academicYearId,
      status: body.status ?? enrollment.status,
    };

    const index = demoEnrollments.findIndex((item) => item.id === enrollment.id);
    demoEnrollments[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
