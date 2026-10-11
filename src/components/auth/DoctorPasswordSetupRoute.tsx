import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { SuccessModal } from '../common/FeedbackModals';
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
      const tokens = await setupPassword({
        uid,
        token,
        new_password: newPassword,
      });

      if (tokens) {
        try {
          await establishSession(tokens, 'doctor');
        } catch {
          setSuccessDestination('sign-in');
          setAutomaticSignInUnavailable(true);
        }
      } else {
        setSuccessDestination('sign-in');
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
      <SuccessModal
        open={isSuccessModalOpen}
        title="Password Set Successfully"
        description={
          successDestination === 'dashboard'
            ? 'Your password has been set and your doctor account is signed in. Continue to your dashboard.'
            : automaticSignInUnavailable
              ? 'Your password has been set, but automatic sign-in was unavailable. Sign in with your email and new password.'
              : 'Your password has been set. Sign in with your email and new password.'
        }
        buttonLabel={
          successDestination === 'dashboard' ? 'Go to Dashboard' : 'Go to Sign In'
        }
        onClose={handleSuccessModalClose}
      />
    </>
  );
}
