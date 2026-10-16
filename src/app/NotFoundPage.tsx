import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-dvh place-items-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or has moved.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 min-h-11 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary-800"
        >
          Go to home
        </button>
      </div>
    </div>
  );
}
