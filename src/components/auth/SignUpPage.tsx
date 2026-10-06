import React, { useState } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff, LockKeyhole, Mail, Plus, UserRound } from 'lucide-react';

export interface SignUpDetails {
  name: string;
  email: string;
  password: string;
}

interface SignUpPageProps {
  brandName?: string;
  title?: string;
  subtitle?: string;
  copyrightText?: string;
  onSubmit?: (details: SignUpDetails) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  brandName = 'Dockpoint',
  title = 'Create Account',
  subtitle = 'Enter your details to create an account',
  copyrightText = `Copyright © ${new Date().getFullYear()} - ${brandName}`,
  onSubmit,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onSubmit) return;

    const formData = new FormData(event.currentTarget);
    onSubmit({
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-3.5 py-7 text-[var(--text-primary)] sm:px-5 sm:py-10">
      <div className="flex w-full max-w-[624px] flex-col items-center">
        <Link
          className="mb-[18px] inline-flex items-center gap-2 text-[25px] font-bold tracking-tight text-[var(--text-primary)] no-underline sm:mb-[22px]"
          to="/"
          aria-label={`${brandName} home`}
        >
          <span
            className="grid size-[31px] place-items-center rounded-lg bg-[var(--theme-accent)] text-white"
            aria-hidden="true"
          >
            <Plus size={25} strokeWidth={3.5} />
          </span>
          <span>{brandName}</span>
        </Link>

        <section
          className="w-full rounded-[9px] border border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-7 shadow-sm sm:px-9 sm:py-[35px]"
          aria-labelledby="sign-up-title"
        >
          <header className="mb-5 text-center">
            <h1 id="sign-up-title" className="mb-1 text-xl leading-[1.35] font-bold">
              {title}
            </h1>
            <p className="m-0 text-[13px] leading-relaxed text-[var(--text-muted)] sm:text-sm">
              {subtitle}
            </p>
          </header>

          <form className="flex flex-col gap-[17px]" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="sign-up-name">Name</label>
              <div className="flex min-h-10 items-center gap-[11px] rounded-md border border-[var(--border-color)] px-3 text-[var(--text-primary)] transition focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15">
                <UserRound size={16} aria-hidden="true" />
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  id="sign-up-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="sign-up-email">Email Address</label>
              <div className="flex min-h-10 items-center gap-[11px] rounded-md border border-[var(--border-color)] px-3 text-[var(--text-primary)] transition focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15">
                <Mail size={16} aria-hidden="true" />
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  id="sign-up-email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="sign-up-password">Password</label>
              <div className="flex min-h-10 items-center gap-[11px] rounded-md border border-[var(--border-color)] px-3 text-[var(--text-primary)] transition focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15">
                <LockKeyhole size={16} aria-hidden="true" />
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  id="sign-up-password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Create a password"
                  autoComplete="new-password"
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

            <button
              className="mt-px min-h-10 cursor-pointer rounded-[5px] border-0 bg-[var(--theme-accent)] text-[13px] font-bold text-white transition hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
              type="submit"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-[17px] text-center text-[13px] sm:text-sm">
            Already have an account?{' '}
            <Link
              className="text-[var(--theme-accent)] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
              to="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </section>

        <footer className="mt-5 text-center text-xs text-[var(--text-secondary)] sm:mt-6 sm:text-sm">
          {copyrightText}
        </footer>
      </div>
    </main>
  );
};
