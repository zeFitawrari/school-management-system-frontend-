import { Link, useMatches } from 'react-router-dom';

import type { RouteHandle } from '@/app/route-config';

export function Breadcrumbs() {
  const matches = useMatches();
  const titles = matches
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .filter((title): title is string => Boolean(title));

  if (titles.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/app/dashboard" className="hover:text-foreground">
            Home
          </Link>
        </li>
        {titles.map((title, index) => (
          <li key={`${title}-${index}`} className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            {index === titles.length - 1 ? (
              <span className="text-foreground">{title}</span>
            ) : (
              <span>{title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
