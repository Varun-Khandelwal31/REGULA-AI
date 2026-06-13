import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = localStorage.getItem('regulaai_user');
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  const onboarded = localStorage.getItem('regulaai_onboarding_complete') === 'true';
  if (!onboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}
