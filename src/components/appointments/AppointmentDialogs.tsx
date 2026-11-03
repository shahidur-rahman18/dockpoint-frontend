import type { FormEvent } from 'react';
import { X } from 'lucide-react';
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

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

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
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
    onMouseDown={onClose}
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-details-title"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 id="appointment-details-title" className="text-lg font-bold text-slate-900">
            Appointment details
          </h2>
          <p className="mt-1 text-sm text-slate-500">{appointment.patientName}</p>
        </div>
        <button
          type="button"
          aria-label="Close appointment details"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X className="size-4" />
        </button>
      </div>
      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
        <dt className="text-slate-500">Doctor</dt>
        <dd className="font-medium text-slate-800">{appointment.doctorName}</dd>
        <dt className="text-slate-500">Specialty</dt>
        <dd className="font-medium text-slate-800">{appointment.specialty}</dd>
        <dt className="text-slate-500">Date</dt>
        <dd className="font-medium text-slate-800">{formatAppointmentDate(appointment.start)}</dd>
        <dt className="text-slate-500">Status</dt>
        <dd className="font-medium text-slate-800">{appointment.status}</dd>
        <dt className="text-slate-500">Visit type</dt>
        <dd className="font-medium text-slate-800">{appointment.mode}</dd>
      </dl>
    </section>
  </div>
);

export const NewAppointmentDialog = ({
  draft,
  doctors,
  onDraftChange,
  onClose,
  onSubmit,
}: NewAppointmentDialogProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
    onMouseDown={onClose}
  >
    <form
      onSubmit={onSubmit}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-appointment-title"
      className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 id="new-appointment-title" className="text-lg font-bold text-slate-900">
            New appointment
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            This demo entry will only remain until you leave this page.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close new appointment form"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X className="size-4" />
        </button>
      </div>
      <label className="block space-y-1.5 text-xs font-semibold text-slate-600">
        Patient name
        <input
          required
          value={draft.patientName}
          onChange={(event) => onDraftChange({ ...draft, patientName: event.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </label>
      <label className="block space-y-1.5 text-xs font-semibold text-slate-600">
        Doctor
        <select
          required
          value={draft.doctorId}
          onChange={(event) => onDraftChange({ ...draft, doctorId: event.target.value })}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-xs font-semibold text-slate-600">
          Date
          <input
            required
            type="date"
            value={draft.date}
            onChange={(event) => onDraftChange({ ...draft, date: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label className="space-y-1.5 text-xs font-semibold text-slate-600">
          Start time
          <input
            required
            type="time"
            value={draft.time}
            onChange={(event) => onDraftChange({ ...draft, time: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>
      <label className="block space-y-1.5 text-xs font-semibold text-slate-600">
        Visit type
        <select
          value={draft.mode}
          onChange={(event) => {
            const mode = event.target.value;
            if (mode === 'In-person' || mode === 'Online') {
              onDraftChange({ ...draft, mode });
            }
          }}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="In-person">In-person</option>
          <option value="Online">Online</option>
        </select>
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className={buttonClass}>
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
  </div>
);
