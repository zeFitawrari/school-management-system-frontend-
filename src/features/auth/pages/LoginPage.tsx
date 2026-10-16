import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { isApiError } from '@/services/api-error';
import { authService } from '@/services';
import { useAuthStore } from '@/stores/auth.store';
import { useReturnPath } from '@/app/useReturnPath';

export function LoginPage() {
  const navigate = useNavigate();
  const returnPath = useReturnPath('/app/dashboard');
  const status = useAuthStore((state) => state.status);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === 'authenticated') {
    return <Navigate to={returnPath} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const user = await authService.login({ email, password });
      useAuthStore.getState().setUser(user, user.permissions);
      navigate(returnPath, { replace: true });
    } catch (error) {
      if (isApiError(error)) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unable to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-card-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use your school account to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          {errorMessage ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
