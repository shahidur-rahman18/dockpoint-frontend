import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router';

export interface NotFoundProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export function NotFound({
  title = 'Oops, something went wrong',
  description = "The page you are looking for doesn't exist or may have been moved.",
  actionLabel = 'Back to Dashboard',
  actionTo = '/admin-dashboard',
}: NotFoundProps) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="relative mb-7 select-none text-[clamp(7rem,24vw,13rem)] font-black leading-none tracking-[-0.08em] text-[var(--theme-accent)]"
      >
        <span>404</span>
        <span className="absolute right-[13%] top-[2%] grid size-12 place-items-center rounded-full border-4 border-[var(--bg-surface)] bg-[var(--bg-subtle)] text-[var(--theme-accent)] shadow-md sm:size-16">
          <SearchX className="size-6 sm:size-8" strokeWidth={2.5} />
        </span>
      </div>

      <span className="mb-3 rounded-full border border-[var(--border-color)] bg-[var(--bg-subtle)] px-3 py-1 text-xs font-bold tracking-[0.16em] text-[var(--theme-accent)]">
        PAGE NOT FOUND
      </span>
      <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
        {title}
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--text-muted)] sm:text-base">
        {description}
      </p>

      <Link
        to={actionTo}
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--theme-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
      >
        <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
        {actionLabel}
      </Link>
    </section>
  );
}

export default NotFound;
