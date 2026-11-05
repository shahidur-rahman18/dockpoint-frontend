import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { Modal } from '../common/Modal';
import { getPasswordSetupErrorMessage, setupPassword } from '../../services/accountService';
import { SetupPassword } from './SetupPassword';

export function DoctorPasswordSetupRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successDestination, setSuccessDestination] = useState<'dashboard' | 'sign-in'>('dashboard');
  const [automaticSignInUnavailable, setAutomaticSignInUnavailable] = useState(false);
  const uid = searchParams.get('uid')?.trim() ?? '';
  const token = searchParams.get('token')?.trim() ?? '';
  const hasValidLink = Boolean(uid && token);

  const handleSuccessModalClose = () => {
    if (successDestination === 'dashboard') {
      navigate('/doctor-dashboard', { replace: true });
      return;
    }

    navigate('/doctor/sign-in', {
      replace: true,
      state: {
        passwordSetupComplete: true,
        automaticSignInUnavailable,
      },
    });
  };

  const handleSubmit = async (newPassword: string) => {
    if (!hasValidLink) {
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await setupPassword({
        uid,
        token,
        new_password: newPassword,
      });

      try {
        await establishSession('doctor');
      } catch {
        setSuccessDestination('sign-in');
        setAutomaticSignInUnavailable(true);
      }

      setIsSuccessModalOpen(true);
    } catch (error) {
      setErrorMessage(getPasswordSetupErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SetupPassword
        title="Set Up Your Doctor Account"
        subtitle="Create a password to activate your doctor account."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitDisabled={!hasValidLink}
        errorMessage={
          hasValidLink
            ? errorMessage
            : 'This password setup link is incomplete. Please use the full link from your email.'
        }
      />
      <Modal
        open={isSuccessModalOpen}
        title="Password Set Successfully"
        size="sm"
        showHeader={false}
        contentClassName="!mt-0 -mx-1 text-center"
        onClose={handleSuccessModalClose}
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 aria-hidden="true" className="size-8" />
        </div>
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          Password Set Successfully
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {successDestination === 'dashboard'
            ? 'Your password has been set and your doctor account is signed in. Continue to your dashboard.'
            : automaticSignInUnavailable
              ? 'Your password has been set, but automatic sign-in was unavailable. Sign in with your email and new password.'
              : 'Your password has been set. Sign in with your email and new password.'}
        </p>
        <button
          type="button"
          onClick={handleSuccessModalClose}
          className="mt-5 min-h-10 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          {successDestination === 'dashboard' ? 'Go to Dashboard' : 'Go to Sign In'}
        </button>
      </Modal>
    </>
  );
}
