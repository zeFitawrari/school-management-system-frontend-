import { lazy } from 'react';

import { ForbiddenPage } from '@/app/ForbiddenPage';
import { NotFoundPage } from '@/app/NotFoundPage';
import { RedirectToDashboard } from '@/app/RedirectToDashboard';
import { RootLayout } from '@/app/RootLayout';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import { ParentDetailPage, ParentEditPage, ParentListPage, ParentRegistrationPage } from '@/features/parents';
import { StudentListPage, StudentRegistrationPage, StudentDetailPage } from '@/features/students';
import { TutorDetailPage, TutorEditPage, TutorListPage, TutorRegistrationPage } from '@/features/tutors';
import { VacancyDetailPage, VacancyEditPage, VacancyListPage, VacancyRegistrationPage } from '@/features/vacancies';
import { AcademicYearDetailPage, AcademicYearEditPage, AcademicYearListPage, AcademicYearRegistrationPage } from '@/features/academic-years';
import { CourseDetailPage, CourseEditPage, CourseListPage, CourseRegistrationPage } from '@/features/courses';
import { CurriculumDetailPage, CurriculumEditPage, CurriculumListPage, CurriculumRegistrationPage } from '@/features/curriculum';
import { PackageDetailPage, PackageEditPage, PackageListPage, PackageRegistrationPage } from '@/features/packages';
import { GroupDetailPage, GroupEditPage, GroupListPage, GroupRegistrationPage } from '@/features/groups';
import { EnrollmentDetailPage, EnrollmentEditPage, EnrollmentListPage, EnrollmentRegistrationPage } from '@/features/enrollments';
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
  { path: 'app/groups', title: 'Groups', requiredPermissions: ['groups.read'] },
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
          {
            path: 'app/tutors',
            element: (
              <ProtectedRoute requiredPermissions={['tutors.read']}>
                <TutorListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Tutors & staff', requiredPermissions: ['tutors.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/tutors/new',
            element: (
              <ProtectedRoute requiredPermissions={['tutors.create']}>
                <TutorRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add tutor', requiredPermissions: ['tutors.create'] } satisfies RouteHandle,
          },
          {
            path: 'app/tutors/:tutorId',
            element: (
              <ProtectedRoute requiredPermissions={['tutors.read']}>
                <TutorDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Tutor profile', requiredPermissions: ['tutors.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/tutors/:tutorId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['tutors.update']}>
                <TutorEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit tutor', requiredPermissions: ['tutors.update'] } satisfies RouteHandle,
          },
          {
            path: 'app/vacancies',
            element: (
              <ProtectedRoute requiredPermissions={['vacancies.read']}>
                <VacancyListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Vacancies', requiredPermissions: ['vacancies.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/vacancies/new',
            element: (
              <ProtectedRoute requiredPermissions={['vacancies.manage']}>
                <VacancyRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add vacancy', requiredPermissions: ['vacancies.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/vacancies/:vacancyId',
            element: (
              <ProtectedRoute requiredPermissions={['vacancies.read']}>
                <VacancyDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Vacancy profile', requiredPermissions: ['vacancies.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/vacancies/:vacancyId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['vacancies.manage']}>
                <VacancyEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit vacancy', requiredPermissions: ['vacancies.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/academic-years',
            element: (
              <ProtectedRoute requiredPermissions={['academics.years.manage']}>
                <AcademicYearListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Academic Years', requiredPermissions: ['academics.years.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/academic-years/new',
            element: (
              <ProtectedRoute requiredPermissions={['academics.years.manage']}>
                <AcademicYearRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add academic year', requiredPermissions: ['academics.years.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/academic-years/:academicYearId',
            element: (
              <ProtectedRoute requiredPermissions={['academics.years.manage']}>
                <AcademicYearDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Academic year profile', requiredPermissions: ['academics.years.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/academic-years/:academicYearId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['academics.years.manage']}>
                <AcademicYearEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit academic year', requiredPermissions: ['academics.years.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/courses',
            element: (
              <ProtectedRoute requiredPermissions={['courses.read']}>
                <CourseListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Courses', requiredPermissions: ['courses.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/courses/new',
            element: (
              <ProtectedRoute requiredPermissions={['courses.manage']}>
                <CourseRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add course', requiredPermissions: ['courses.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/courses/:courseId',
            element: (
              <ProtectedRoute requiredPermissions={['courses.read']}>
                <CourseDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Course profile', requiredPermissions: ['courses.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/courses/:courseId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['courses.manage']}>
                <CourseEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit course', requiredPermissions: ['courses.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/curriculum',
            element: (
              <ProtectedRoute requiredPermissions={['curriculum.manage']}>
                <CurriculumListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Curriculum', requiredPermissions: ['curriculum.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/curriculum/new',
            element: (
              <ProtectedRoute requiredPermissions={['curriculum.manage']}>
                <CurriculumRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add curriculum', requiredPermissions: ['curriculum.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/curriculum/:curriculumId',
            element: (
              <ProtectedRoute requiredPermissions={['curriculum.manage']}>
                <CurriculumDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Curriculum profile', requiredPermissions: ['curriculum.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/curriculum/:curriculumId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['curriculum.manage']}>
                <CurriculumEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit curriculum', requiredPermissions: ['curriculum.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/packages',
            element: (
              <ProtectedRoute requiredPermissions={['packages.read']}>
                <PackageListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Packages', requiredPermissions: ['packages.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/packages/new',
            element: (
              <ProtectedRoute requiredPermissions={['packages.manage']}>
                <PackageRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add package', requiredPermissions: ['packages.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/packages/:packageId',
            element: (
              <ProtectedRoute requiredPermissions={['packages.read']}>
                <PackageDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Package profile', requiredPermissions: ['packages.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/packages/:packageId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['packages.manage']}>
                <PackageEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit package', requiredPermissions: ['packages.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/groups',
            element: (
              <ProtectedRoute requiredPermissions={['groups.read']}>
                <GroupListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Groups', requiredPermissions: ['groups.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/groups/new',
            element: (
              <ProtectedRoute requiredPermissions={['groups.manage']}>
                <GroupRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add group', requiredPermissions: ['groups.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/groups/:groupId',
            element: (
              <ProtectedRoute requiredPermissions={['groups.read']}>
                <GroupDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Group profile', requiredPermissions: ['groups.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/groups/:groupId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['groups.manage']}>
                <GroupEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit group', requiredPermissions: ['groups.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/enrollments',
            element: (
              <ProtectedRoute requiredPermissions={['enrollments.read']}>
                <EnrollmentListPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Enrollments', requiredPermissions: ['enrollments.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/enrollments/new',
            element: (
              <ProtectedRoute requiredPermissions={['enrollments.manage']}>
                <EnrollmentRegistrationPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Add enrollment', requiredPermissions: ['enrollments.manage'] } satisfies RouteHandle,
          },
          {
            path: 'app/enrollments/:enrollmentId',
            element: (
              <ProtectedRoute requiredPermissions={['enrollments.read']}>
                <EnrollmentDetailPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Enrollment profile', requiredPermissions: ['enrollments.read'] } satisfies RouteHandle,
          },
          {
            path: 'app/enrollments/:enrollmentId/edit',
            element: (
              <ProtectedRoute requiredPermissions={['enrollments.manage']}>
                <EnrollmentEditPage />
              </ProtectedRoute>
            ),
            handle: { title: 'Edit enrollment', requiredPermissions: ['enrollments.manage'] } satisfies RouteHandle,
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
