import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import type { ReactNode } from 'react';
import { SignInPage, type SignInCredentials } from './SignInPage';
import { useAuth } from '../../auth/AuthContext';
import type { UserRole } from '../../auth/authService';
import { LoaderOne } from '../common/LoaderOne';

const getHomePath = (role: UserRole) =>
  role === 'admin' ? '/admin-dashboard' : '/doctor-dashboard';

export function SignInRoute({ role }: { role?: UserRole }) {
  const {
    role: authenticatedRole,
    login,
    getDemoLoginEmail,
    demoLogin,
    isLoading,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDemoEmail, setIsLoadingDemoEmail] = useState(false);
  const [demoEmail, setDemoEmail] = useState<string>();
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
        <LoaderOne />
      </div>
    );
  }

  if (authenticatedRole) {
    return <Navigate to={getHomePath(authenticatedRole)} replace />;
  }

  const handleSelectRole = (selectedRole: UserRole) => {
    navigate(`/${selectedRole}/sign-in`);
  };

  if (!role) {
    return (
      <SignInPage
        title="Sign In"
        subtitle="Choose your account type to continue"
        onSelectRole={handleSelectRole}
      />
    );
  }

  const handleSubmit = async (credentials: SignInCredentials) => {
    setIsSubmitting(true);

    try {
      if (demoEmail) {
        await demoLogin(role);
      } else {
        await login(credentials, role);
      }
      toast.success('Login successful!');
      navigate(getHomePath(role), { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoadingDemoEmail(true);
    try {
      setDemoEmail(await getDemoLoginEmail(role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load the demo account.');
    } finally {
      setIsLoadingDemoEmail(false);
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
      selectedRole={role}
      onSelectRole={handleSelectRole}
      demoEmail={demoEmail}
      onDemoLogin={handleDemoLogin}
      isLoadingDemoEmail={isLoadingDemoEmail}
      onUsePasswordLogin={() => setDemoEmail(undefined)}
      successMessage={
        role === 'doctor' && passwordSetupComplete
          ? automaticSignInUnavailable
            ? 'Your password has been set, but automatic sign-in was unavailable. Sign in with your email and new password.'
            : 'Your password has been set. Sign in with your email and new password.'
          : undefined
      }
      isSubmitting={isSubmitting}
    />
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { role, isLoading } = useAuth();
  const location = useLocation();
  const requiredRole: UserRole = location.pathname.startsWith('/doctor-dashboard')
    ? 'doctor'
    : 'admin';

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
        <LoaderOne />
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (role !== requiredRole) {
    return <Navigate to={getHomePath(role)} replace />;
  }

  return children;
}
