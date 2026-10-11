import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { SignInPage, type SignInCredentials } from './SignInPage';
import { useAuth } from '../../auth/AuthContext';
import type { UserRole } from '../../auth/authService';

const getHomePath = (role: UserRole) =>
  role === 'admin' ? '/admin-dashboard' : '/doctor-dashboard';

export function SignInRoute({ role }: { role: UserRole }) {
  const { role: authenticatedRole, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordSetupComplete =
    location.state !== null &&
    typeof location.state === 'object' &&
    'passwordSetupComplete' in location.state &&
    location.state.passwordSetupComplete === true;
  const automaticSignInUnavailable =
    location.state !== null &&
    typeof location.state === 'object' &&
    'automaticSignInUnavailable' in location.state &&
    location.state.automaticSignInUnavailable === true;

  if (authenticatedRole) {
    return <Navigate to={getHomePath(authenticatedRole)} replace />;
  }

  const handleSubmit = async (credentials: SignInCredentials) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(credentials, role);
      navigate(getHomePath(role), { replace: true });
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
      title={role === 'admin' ? 'Admin Sign In' : 'Doctor Sign In'}
      subtitle={
        role === 'admin'
          ? 'Sign in to access the administration dashboard'
          : 'Sign in to access your doctor dashboard'
      }
      onSubmit={handleSubmit}
      errorMessage={errorMessage}
      successMessage={
        role === 'doctor' && passwordSetupComplete
          ? automaticSignInUnavailable
            ? 'Your password has been set, but automatic sign-in was unavailable. Sign in with your email and new password.'
            : 'Your password has been set. Sign in with your email and new password.'
          : undefined
      }
      isSubmitting={isSubmitting}
      showRegister={role === 'doctor'}
    />
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const location = useLocation();
  const requiredRole: UserRole = location.pathname.startsWith('/doctor-dashboard')
    ? 'doctor'
    : 'admin';

  if (!role) {
    const signInPath = requiredRole === 'admin' ? '/admin/sign-in' : '/doctor/sign-in';
    return <Navigate to={signInPath} replace state={{ from: location }} />;
  }

  if (role !== requiredRole) {
    return <Navigate to={getHomePath(role)} replace />;
  }

  return children;
}
