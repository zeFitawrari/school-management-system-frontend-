import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Home', to: '/app/dashboard' },
  { label: 'Attendance', to: '/app/attendance' },
  { label: 'Finance', to: '/app/finance' },
  { label: 'More', to: '/app/settings' },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 py-1 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-11 items-center justify-center rounded-md text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
