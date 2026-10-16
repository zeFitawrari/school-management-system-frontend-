import { Navigate } from 'react-router-dom';

export function RedirectToDashboard() {
  return <Navigate to="/app/dashboard" replace />;
}
