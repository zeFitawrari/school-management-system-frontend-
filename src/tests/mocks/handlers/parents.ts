import { HttpResponse, http } from 'msw';

import { useAuthStore } from '@/stores/auth.store';
import type { AuthUser } from '@/services/auth.service';
import type { Parent } from '@/features/parents';
import type { Student } from '@/features/students';

const demoStudents: Student[] = [
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

const demoParents: Parent[] = [
  {
    id: 'parent-1',
    parentNumber: 'PAR-001',
    fullName: 'Kaleb Abebe',
    email: 'kaleb.abebe@example.com',
    phone: '+251913111111',
    branchId: 'branch-1',
    status: 'active',
    children: [
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
    ],
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'parent-2',
    parentNumber: 'PAR-002',
    fullName: 'Dawit Bekele',
    email: 'dawit.bekele@example.com',
    phone: '+251914222222',
    branchId: 'branch-1',
    status: 'inactive',
    children: [],
    createdAt: '2026-02-20T10:00:00.000Z',
  },
];

function currentAuthUser(): AuthUser | null {
  return useAuthStore.getState().user;
}

function isParentUser(user: AuthUser | null): boolean {
  return Boolean(user?.roles?.includes('parent'));
}

function isParentAdminUser(user: AuthUser | null): boolean {
  const adminRoles = ['director', 'owner', 'super_admin', 'accountant', 'receptionist'];
  return Boolean(user?.roles && user.roles.some((role) => adminRoles.includes(role)));
}

export const parentHandlers = [
  http.get('*/parents', ({ request }) => {
    const user = currentAuthUser();
    const items = isParentUser(user) ? demoParents.filter((parent) => parent.id === user?.id) : demoParents;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const filtered = items.filter(
      (parent) =>
        !q ||
        parent.fullName.toLowerCase().includes(q) ||
        parent.parentNumber.toLowerCase().includes(q),
    );
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data: slice,
      meta: {
        page,
        pageSize,
        totalItems: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      },
    });
  }),

  http.get('*/parents/:id', ({ params }) => {
    const user = currentAuthUser();
    const parent = demoParents.find((item) => item.id === params.id);

    if (!parent) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Parent not found' } },
        { status: 404 },
      );
    }

    if (isParentUser(user) && user?.id !== parent.id) {
      return HttpResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    return HttpResponse.json({ data: parent });
  }),

  http.post('*/parents', async ({ request }) => {
    const user = currentAuthUser();

    if (!isParentAdminUser(user)) {
      return HttpResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      branchId?: string;
    };

    const parent: Parent = {
      id: 'parent-new',
      parentNumber: `PAR-${String(demoParents.length + 1).padStart(3, '0')}`,
      fullName: body.fullName ?? 'New parent',
      email: body.email,
      phone: body.phone,
      branchId: body.branchId ?? 'branch-1',
      status: 'active',
      children: [],
      createdAt: new Date().toISOString(),
    };

    demoParents.push(parent);

    return HttpResponse.json({ data: parent }, { status: 201 });
  }),

  http.patch('*/parents/:id', async ({ request, params }) => {
    const user = currentAuthUser();

    if (!isParentAdminUser(user)) {
      return HttpResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    const parent = demoParents.find((item) => item.id === params.id);

    if (!parent) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Parent not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Partial<Parent>;

    const updated: Parent = {
      ...parent,
      fullName: body.fullName ?? parent.fullName,
      email: body.email ?? parent.email,
      phone: body.phone ?? parent.phone,
      branchId: body.branchId ?? parent.branchId,
      status: body.status ?? parent.status,
    };

    const index = demoParents.findIndex((item) => item.id === parent.id);
    demoParents[index] = updated;

    return HttpResponse.json({ data: updated });
  }),

  http.post('*/parents/:id/children', async ({ params, request }) => {
    const user = currentAuthUser();

    if (!isParentAdminUser(user)) {
      return HttpResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 },
      );
    }

    const parent = demoParents.find((item) => item.id === params.id);

    if (!parent) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Parent not found' } },
        { status: 404 },
      );
    }

    const body = (await request.json()) as { studentId?: string };
    const student = demoStudents.find((item) => item.id === body.studentId);

    if (!student) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Student not found' } },
        { status: 404 },
      );
    }

    const updated: Parent = {
      ...parent,
      children: [
        ...parent.children,
        { ...student, guardianIds: Array.from(new Set([...student.guardianIds, parent.id])) },
      ],
    };

    const index = demoParents.findIndex((item) => item.id === parent.id);
    demoParents[index] = updated;

    return HttpResponse.json({ data: updated });
  }),
];
