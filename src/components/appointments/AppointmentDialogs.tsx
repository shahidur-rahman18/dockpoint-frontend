import type { FormEvent } from 'react';
import { Modal } from '../common/Modal';
import type { DoctorListItem } from '../../types';

export interface AppointmentDetails {
  patientName: string;
  doctorName: string;
  specialty: string;
  start: Date | null;
  status: string;
  mode: string;
}

export interface AppointmentDraft {
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  mode: 'In-person' | 'Online';
}

interface AppointmentDetailsDialogProps {
  appointment: AppointmentDetails;
  onClose: () => void;
}

interface NewAppointmentDialogProps {
  draft: AppointmentDraft;
  doctors: DoctorListItem[];
  onDraftChange: (draft: AppointmentDraft) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const formatAppointmentDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(date)
    : 'Date not set';

export const AppointmentDetailsDialog = ({
  appointment,
  onClose,
}: AppointmentDetailsDialogProps) => (
  <Modal
    open
    title="Appointment details"
    description={appointment.patientName}
    size="md"
    onClose={onClose}
  >
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
      <dt className="text-[var(--text-secondary)]">Doctor</dt>
      <dd className="font-medium text-[var(--text-primary)]">{appointment.doctorName}</dd>
      <dt className="text-[var(--text-secondary)]">Specialty</dt>
      <dd className="font-medium text-[var(--text-primary)]">{appointment.specialty}</dd>
      <dt className="text-[var(--text-secondary)]">Date</dt>
      <dd className="font-medium text-[var(--text-primary)]">{formatAppointmentDate(appointment.start)}</dd>
      <dt className="text-[var(--text-secondary)]">Status</dt>
      <dd className="font-medium text-[var(--text-primary)]">{appointment.status}</dd>
      <dt className="text-[var(--text-secondary)]">Visit type</dt>
      <dd className="font-medium text-[var(--text-primary)]">{appointment.mode}</dd>
    </dl>
  </Modal>
);

export const NewAppointmentDialog = ({
  draft,
  doctors,
  onDraftChange,
  onClose,
  onSubmit,
}: NewAppointmentDialogProps) => (
  <Modal
    open
    title="New appointment"
    description="This demo entry will only remain until you leave this page."
    size="md"
    onClose={onClose}
  >
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-xs font-semibold text-[var(--text-secondary)]">
        Patient name
        <input
          required
          value={draft.patientName}
          onChange={(event) => onDraftChange({ ...draft, patientName: event.target.value })}
          className="mt-1.5 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm font-normal text-[var(--text-primary)] outline-none focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/15"
        />
      </label>
      <label className="block text-xs font-semibold text-[var(--text-secondary)]">
        Doctor
        <select
          required
          value={draft.doctorId}
          onChange={(event) => onDraftChange({ ...draft, doctorId: event.target.value })}
          className="mt-1.5 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm font-normal text-[var(--text-primary)] outline-none focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/15"
        >
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          Date
          <input
            required
            type="date"
            value={draft.date}
            onChange={(event) => onDraftChange({ ...draft, date: event.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm font-normal text-[var(--text-primary)] outline-none focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/15"
          />
        </label>
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          Start time
          <input
            required
            type="time"
            value={draft.time}
            onChange={(event) => onDraftChange({ ...draft, time: event.target.value })}
            className="mt-1.5 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm font-normal text-[var(--text-primary)] outline-none focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/15"
          />
        </label>
      </div>
      <label className="block text-xs font-semibold text-[var(--text-secondary)]">
        Visit type
        <select
          value={draft.mode}
          onChange={(event) => {
            const mode = event.target.value;
            if (mode === 'In-person' || mode === 'Online') {
              onDraftChange({ ...draft, mode });
            }
          }}
          className="mt-1.5 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm font-normal text-[var(--text-primary)] outline-none focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/15"
        >
          <option value="In-person">In-person</option>
          <option value="Online">Online</option>
        </select>
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          Add demo appointment
        </button>
      </div>
    </form>
  </Modal>
);
