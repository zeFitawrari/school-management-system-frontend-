import type { AuthUser } from '@/services/auth.service';

export const demoUser: AuthUser = {
  id: 'user-1',
  fullName: 'Sara Bekele',
  email: 'sara@example.com',
  roles: ['director'],
  permissions: [
    'dashboard.read',
    'students.read',
    'parents.read',
    'tutors.read',
    'courses.read',
    'groups.read',
    'enrollments.read',
    'scheduling.read',
    'attendance.read',
    'assessments.read',
    'assignments.read',
    'finance.overview.read',
    'expenses.read',
    'payroll.read',
    'library.catalog.read',
    'announcements.read',
    'notifications.read',
    'reports.read',
    'settings.read',
  ],
  branchIds: ['branch-1'],
};

export const demoPassword = 'secret';
