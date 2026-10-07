import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { SignInPage, type SignInCredentials } from './SignInPage';
import { useAuth } from '../../auth/AuthContext';

export function SignInRoute() {
  const { doctor, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (doctor) {
    return <Navigate to="/doctor-dashboard" replace />;
  }

  const handleSubmit = async (credentials: SignInCredentials) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(credentials);
      const from = location.state?.from;
      const returnPath =
        from && typeof from.pathname === 'string'
          ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
          : '/doctor-dashboard';
      navigate(returnPath, { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignInPage
      onSubmit={handleSubmit}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
    />
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { doctor } = useAuth();
  const location = useLocation();

  if (!doctor) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}
