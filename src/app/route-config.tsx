import { lazy } from 'react';

import { ForbiddenPage } from '@/app/ForbiddenPage';
import { NotFoundPage } from '@/app/NotFoundPage';
import { RedirectToDashboard } from '@/app/RedirectToDashboard';
import { RootLayout } from '@/app/RootLayout';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import { ParentDetailPage, ParentEditPage, ParentListPage, ParentRegistrationPage } from '@/features/parents';
import { StudentListPage, StudentRegistrationPage, StudentDetailPage } from '@/features/students';
import { UserListPage } from '@/features/users';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import type { RouteObject } from 'react-router-dom';

/**
 * Metadata every authenticated route carries. The guard reads
 * `requiredPermissions`; the document title comes from `title`.
 * Permission strings mirror `docs/permissions/matrix.md` (T01).
 */
export type RouteHandle = {
  title: string;
  requiredPermissions?: string[];
};

type ModuleRoute = {
  path: string;
  title: string;
  requiredPermissions?: string[];
};

const PlaceholderPage = lazy(() => import('@/app/RoutePlaceholder'));

const moduleRoutes: ModuleRoute[] = [
  { path: 'app/dashboard', title: 'Dashboard', requiredPermissions: ['dashboard.read'] },
  // { path: 'app/students', title: 'Students', requiredPermissions: ['students.read'] },
  { path: 'app/tutors', title: 'Tutors & staff', requiredPermissions: ['tutors.read'] },
  { path: 'app/vacancies', title: 'Vacancies', requiredPermissions: ['vacancies.read'] },
  { path: 'app/courses', title: 'Courses', requiredPermissions: ['courses.read'] },
  { path: 'app/curriculum', title: 'Curriculum', requiredPermissions: ['courses.read'] },
  { path: 'app/groups', title: 'Groups', requiredPermissions: ['groups.read'] },
  { path: 'app/packages', title: 'Packages', requiredPermissions: ['packages.read'] },
  { path: 'app/enrollments', title: 'Enrollments', requiredPermissions: ['enrollments.read'] },
  { path: 'app/scheduling', title: 'Timetable', requiredPermissions: ['scheduling.read'] },
  { path: 'app/attendance', title: 'Attendance', requiredPermissions: ['attendance.read'] },
  {
    path: 'app/examinations',
    title: 'Examinations',
    requiredPermissions: ['assessments.read'],
  },
  {
    path: 'app/assignments',
    title: 'Assignments',
    requiredPermissions: ['assignments.read'],
  },
  { path: 'app/finance', title: 'Finance', requiredPermissions: ['finance.overview.read'] },
  { path: 'app/expenses', title: 'Expenses', requiredPermissions: ['expenses.read'] },
  { path: 'app/payroll', title: 'Payroll', requiredPermissions: ['payroll.read'] },
  { path: 'app/library', title: 'Library', requiredPermissions: ['library.catalog.read'] },
  {
    path: 'app/announcements',
    title: 'Announcements',
    requiredPermissions: ['announcements.read'],
  },
  {
    path: 'app/notifications',
    title: 'Notifications',
    requiredPermissions: ['notifications.read'],
  },
  { path: 'app/reports', title: 'Reports', requiredPermissions: ['reports.read'] },
  // { path: 'app/users', title: 'Users & roles', requiredPermissions: ['users.read'] },
  { path: 'app/branches', title: 'Branches', requiredPermissions: ['branches.read'] },
  { path: 'app/issues', title: 'Issues' },
  { path: 'app/audit', title: 'Audit log', requiredPermissions: ['audit.read'] },
  { path: 'app/settings', title: 'Settings', requiredPermissions: ['settings.read'] },
];

const moduleRouteObjects: RouteObject[] = moduleRoutes.map((route) => ({
  path: route.path,
  element: (
    <ProtectedRoute requiredPermissions={route.requiredPermissions}>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
  handle: {
    title: route.title,
    requiredPermissions: route.requiredPermissions,
  } satisfies RouteHandle,
}));

export const appRoutes: RouteObject[] = [
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: PlaceholderPage,
        handle: { title: 'Welcome' } satisfies RouteHandle,
      },
      {
        path: 'login',
        element: <LoginPage />,
        handle: { title: 'Sign in' } satisfies RouteHandle,
      },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'app',
            element: (
              <ProtectedRoute>
                <RedirectToDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'app/students',
            element: (
              <ProtectedRoute requiredPermissions={['students.read']}>
                <StudentListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Students', requiredPermissions: ['students.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/students/:studentId',
            element: (
              <ProtectedRoute requiredPermissions={['students.read']}>
                <StudentDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Student profile', requiredPermissions: ['students.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/students/new',
            element: (
              <ProtectedRoute requiredPermissions={['students.read']}>
                <StudentRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Register student', requiredPermissions: ['students.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/parents',
            element: (
              <ProtectedRoute requiredPermissions={['parents.read']}>
                <ParentListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Parents & guardians', requiredPermissions: ['parents.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/parents/new',
            element: (
              <ProtectedRoute requiredPermissions={['parents.create']}>
                <ParentRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add parent', requiredPermissions: ['parents.create'] } satisfies RouteHandle,
          },
          {
            path: 'app/parents/:parentId',
            element: (
              <ProtectedRoute requiredPermissions={['parents.read']}>
                <ParentDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Parent profile', requiredPermissions: ['parents.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/parents/:parentId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['parents.update']}>
                <ParentEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit parent', requiredPermissions: ['parents.update'] } satisfies RouteHandle,
          },
          ...moduleRouteObjects,
          {
            path: 'app/users',
            element: (
              <ProtectedRoute requiredPermissions={['users.read']}>
                <UserListPage />
              </ProtectedRoute>
            ),
            handle: {
              title: 'Users & roles',
              requiredPermissions: ['users.read'],
            } satisfies RouteHandle,
          },
        ],
      },
      {
        path: '403',
        Component: ForbiddenPage,
        handle: { title: 'Access denied' } satisfies RouteHandle,
      },
      {
        path: '*',
        Component: NotFoundPage,
        handle: { title: 'Page not found' } satisfies RouteHandle,
      },
    ],
  },
];
