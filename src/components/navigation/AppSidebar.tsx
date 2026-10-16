import { NavLink } from 'react-router-dom';

import { hasPermission } from '@/permissions/access';
import { useAuthStore } from '@/stores/auth.store';

type NavItem = {
  label: string;
  to: string;
  permission?: string;
};

const items: NavItem[] = [
  { label: 'Dashboard', to: '/app/dashboard', permission: 'dashboard.read' },
  { label: 'Students', to: '/app/students', permission: 'students.read' },
  { label: 'Parents', to: '/app/parents', permission: 'parents.read' },
  { label: 'Tutors', to: '/app/tutors', permission: 'tutors.read' },
  { label: 'Courses', to: '/app/courses', permission: 'courses.read' },
  { label: 'Groups', to: '/app/groups', permission: 'groups.read' },
  { label: 'Enrollments', to: '/app/enrollments', permission: 'enrollments.read' },
  { label: 'Timetable', to: '/app/scheduling', permission: 'scheduling.read' },
  { label: 'Attendance', to: '/app/attendance', permission: 'attendance.read' },
  { label: 'Finance', to: '/app/finance', permission: 'finance.overview.read' },
  { label: 'Settings', to: '/app/settings', permission: 'settings.read' },
];

export function AppSidebar() {
  const permissions = useAuthStore((state) => state.permissions);

  const visibleItems = items.filter(
    (item) => !item.permission || hasPermission(permissions, item.permission),
  );

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:bg-card">
      <div className="border-b border-border px-4 py-4">
        <p className="text-sm font-semibold text-foreground">School Management System</p>
        <p className="text-xs text-muted-foreground">Navigation</p>
      </div>
      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
