import { useMatches } from 'react-router-dom';

type RouteHandle = {
  title?: string;
};

/**
 * Temporary page shown for routes whose feature page is not built yet.
 * Replaced per feature as each page is implemented. Reads its title from the
 * nearest route `handle` so the route tree stays honest while incomplete.
 */
export default function RoutePlaceholder() {
  const matches = useMatches();

  let title = 'Page';

  for (const match of matches) {
    const handle = match.handle as RouteHandle | undefined;

    if (handle?.title) {
      title = handle.title;
    }
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">This page is not built yet.</p>
    </div>
  );
}
