import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import docpointLogo from '../../assets/Docpoint.png';

export interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInPageProps {
  brandName?: string;
  title?: string;
  subtitle?: string;
  copyrightText?: string;
  onSubmit?: (credentials: SignInCredentials) => void | Promise<void>;
  successMessage?: string;
  isSubmitting?: boolean;
  onForgotPassword?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  brandName = 'Dockpoint',
  title = 'Sign In',
  subtitle = 'Please enter your details to access the dashboard',
  copyrightText = `Copyright © ${new Date().getFullYear()} - ${brandName}`,
  onSubmit,
  successMessage,
  isSubmitting = false,
  onForgotPassword,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onSubmit) return;

    const formData = new FormData(event.currentTarget);
    await onSubmit({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-3.5 py-7 text-[var(--text-primary)] sm:px-5 sm:py-10">
      <div className="flex w-full max-w-[624px] flex-col items-center">
        <a
          className="mb-[18px] inline-flex items-center gap-2 text-[25px] font-bold tracking-tight text-[var(--text-primary)] no-underline sm:mb-[22px]"
          href="/"
          aria-label={`${brandName} home`}
        >
          <span className="relative block size-11 shrink-0 overflow-hidden" aria-hidden="true">
            <img
              src={docpointLogo}
              alt=""
              className="absolute left-1/2 top-1/2 w-[88px] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </span>
          <span>{brandName}</span>
        </a>

        <section
          className="w-full rounded-[9px] border border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-7 shadow-sm sm:px-9 sm:py-[35px]"
          aria-labelledby="sign-in-title"
        >
          <header className="mb-5 text-center">
            <h1 id="sign-in-title" className="mb-1 text-xl leading-[1.35] font-bold">
              {title}
            </h1>
            <p className="m-0 text-[13px] leading-relaxed text-[var(--text-muted)] sm:text-sm">
              {subtitle}
            </p>
          </header>

          <form className="flex flex-col gap-[17px]" onSubmit={handleSubmit}>
            {successMessage && (
              <p
                className="m-0 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                role="status"
              >
                {successMessage}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="sign-in-email">Email Address</label>
              <div className="flex min-h-10 items-center gap-[11px] rounded-md border border-[var(--border-color)] px-3 text-[var(--text-primary)] transition focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15">
                <Mail size={16} aria-hidden="true" />
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  id="sign-in-email"
                  name="email"
                  type="email"
                  placeholder="Enter Email Address"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="sign-in-password">Password</label>
              <div className="flex min-h-10 items-center gap-[11px] rounded-md border border-[var(--border-color)] px-3 text-[var(--text-primary)] transition focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15">
                <LockKeyhole size={16} aria-hidden="true" />
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  id="sign-in-password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  required
                />
                <button
                  className="grid shrink-0 place-items-center rounded p-1 text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={passwordVisible}
                >
                  {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="mt-px flex min-h-[22px] items-center justify-end gap-3 text-[13px] sm:text-sm">
              {onForgotPassword ? (
                <button
                  className="cursor-pointer border-0 bg-transparent p-0 text-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
                  type="button"
                  onClick={onForgotPassword}
                >
                  Forgot Password?
                </button>
              ) : (
                <span className="text-rose-500">Forgot Password?</span>
              )}
            </div>

            <button
              className="mt-px min-h-10 cursor-pointer rounded-[5px] border-0 bg-[var(--theme-accent)] text-[13px] font-bold text-white transition hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)] disabled:cursor-wait disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

        </section>

        <footer className="mt-5 text-center text-xs text-[var(--text-secondary)] sm:mt-6 sm:text-sm">
          {copyrightText}
        </footer>
      </div>
    </main>
  );
};
