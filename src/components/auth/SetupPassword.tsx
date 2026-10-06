import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Plus } from 'lucide-react';

interface SetupPasswordProps {
  brandName?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit: (password: string) => void;
}

export const SetupPassword: React.FC<SetupPasswordProps> = ({
  brandName = 'Dockpoint',
  title = 'Setup Password',
  subtitle = 'Create a password to secure your account',
  submitLabel = 'Set Password',
  onSubmit,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordError('');
    onSubmit(password);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-3.5 py-7 text-[var(--text-primary)] sm:px-5 sm:py-10">
      <div className="flex w-full max-w-[624px] flex-col items-center">
        <a
          className="mb-[18px] inline-flex items-center gap-2 text-[25px] font-bold tracking-tight text-[var(--text-primary)] no-underline sm:mb-[22px]"
          href="/"
          aria-label={`${brandName} home`}
        >
          <span
            className="grid size-[31px] place-items-center rounded-lg bg-[var(--theme-accent)] text-white"
            aria-hidden="true"
          >
            <Plus size={25} strokeWidth={3.5} />
          </span>
          <span>{brandName}</span>
        </a>

        <section
          className="w-full rounded-[9px] border border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-7 shadow-sm sm:px-9 sm:py-[35px]"
          aria-labelledby="setup-password-title"
        >
          <header className="mb-5 text-center">
            <h1 id="setup-password-title" className="mb-1 text-xl leading-[1.35] font-bold">
              {title}
            </h1>
            <p className="m-0 text-[13px] leading-relaxed text-[var(--text-muted)] sm:text-sm">
              {subtitle}
            </p>
          </header>

          <form className="flex flex-col gap-[17px]" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="setup-new-password">
                New Password
              </label>
              <div className="flex min-h-10 items-center gap-[11px] rounded-md border border-[var(--border-color)] px-3 text-[var(--text-primary)] transition focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15">
                <LockKeyhole size={16} aria-hidden="true" />
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  id="setup-new-password"
                  name="newPassword"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordError('');
                  }}
                />
                <button
                  className="grid shrink-0 place-items-center rounded p-1 text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  aria-label={passwordVisible ? 'Hide new password' : 'Show new password'}
                  aria-pressed={passwordVisible}
                >
                  {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="setup-confirm-password">
                Confirm Password
              </label>
              <div className="flex min-h-10 items-center gap-[11px] rounded-md border border-[var(--border-color)] px-3 text-[var(--text-primary)] transition focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15">
                <LockKeyhole size={16} aria-hidden="true" />
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  id="setup-confirm-password"
                  name="confirmPassword"
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordError('');
                  }}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? 'setup-password-error' : undefined}
                />
                <button
                  className="grid shrink-0 place-items-center rounded p-1 text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
                  type="button"
                  onClick={() => setConfirmPasswordVisible((visible) => !visible)}
                  aria-label={confirmPasswordVisible ? 'Hide confirmed password' : 'Show confirmed password'}
                  aria-pressed={confirmPasswordVisible}
                >
                  {confirmPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && (
                <p id="setup-password-error" className="m-0 text-sm text-rose-500" role="alert">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              className="mt-px min-h-10 cursor-pointer rounded-[5px] border-0 bg-[var(--theme-accent)] text-[13px] font-bold text-white transition hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
              type="submit"
            >
              {submitLabel}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};
