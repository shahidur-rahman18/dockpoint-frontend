import { Calendar, UserRound } from 'lucide-react';
import type { DoctorListItem } from '../../types';
import { ActionDropdown } from '../common/ActionDropdown';
import { Card } from '../common/Card';

interface DoctorCardProps {
  doctor: DoctorListItem;
  isActionMenuOpen: boolean;
  onToggleActionMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function DoctorCard({
  doctor,
  isActionMenuOpen,
  onToggleActionMenu,
  onEdit,
  onDelete,
  onView,
}: DoctorCardProps) {
  const isAvailable = doctor.status === 'Available';

  return (
    <Card
      role="link"
      tabIndex={0}
      aria-label={`View details for ${doctor.name}`}
      onClick={onView}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onView();
        }
      }}
      className="group relative flex cursor-pointer flex-col justify-between p-5 transition-all hover:shadow-md focus-visible:outline-2 focus-visible:outline-[var(--theme-accent)]"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            {doctor.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="size-16 shrink-0 rounded-xl border border-[var(--border-color)] object-cover shadow-sm"
              />
            ) : (
              <div className="grid size-16 shrink-0 place-items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                <UserRound aria-hidden="true" className="size-7" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--theme-accent)]">
                {doctor.name}
              </h3>
              <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-secondary)]">
                {doctor.department || doctor.designation || '—'}
              </p>
            </div>
          </div>
          <div onClick={(event) => event.stopPropagation()}>
            <ActionDropdown
              isOpen={isActionMenuOpen}
              onToggle={onToggleActionMenu}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        <div className="space-y-2 border-y border-[var(--border-color)] py-2 text-xs font-medium text-[var(--text-secondary)]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--text-muted)]">Available:</span>
            <span className={isAvailable ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-600'}>
              Mon, 20 Jan 2025
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--text-muted)]">Starts From:</span>
            <span className="font-bold text-[var(--text-primary)]">{doctor.fees || '—'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2">
        <span
          className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
            isAvailable
              ? 'border-emerald-200/60 bg-emerald-50 text-emerald-600'
              : 'border-rose-200/60 bg-rose-50 text-rose-600'
          }`}
        >
          {doctor.status}
        </span>
        <button
          type="button"
          aria-label={`Schedule ${doctor.name}`}
          title="Schedule Appointment"
          onClick={(event) => event.stopPropagation()}
          className="flex cursor-pointer items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] p-2 text-[var(--text-secondary)] shadow-sm transition-colors hover:text-[var(--theme-accent)]"
        >
          <Calendar aria-hidden="true" className="size-4" />
        </button>
      </div>
    </Card>
  );
}
