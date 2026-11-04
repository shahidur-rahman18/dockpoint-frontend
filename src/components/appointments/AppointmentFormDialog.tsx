import type { FormEvent } from 'react';
import { Modal } from '../common/Modal';
import type {
  AppointmentMode,
  AppointmentStatus,
  DoctorAppointment,
} from '../../data/doctorAppointmentsMockData';

export type AppointmentFormValues = Omit<DoctorAppointment, 'id'>;

const isAppointmentMode = (value: FormDataEntryValue | null): value is AppointmentMode =>
  value === 'In-person' || value === 'Online';

const isAppointmentStatus = (
  value: FormDataEntryValue | null,
): value is AppointmentStatus =>
  value === 'PENDING' ||
  value === 'CONFIRMED' ||
  value === 'CANCELLED' ||
  value === 'COMPLETED';

const getToday = () => {
  const today = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

interface AppointmentFormDialogProps {
  open: boolean;
  appointment?: DoctorAppointment;
  onClose: () => void;
  onSubmit: (appointment: AppointmentFormValues) => void;
}

const inputClass =
  'w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm font-normal text-[var(--text-primary)] outline-none transition focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/15';
const labelClass = 'block space-y-1.5 text-xs font-semibold text-[var(--text-secondary)]';

export function AppointmentFormDialog({
  open,
  appointment,
  onClose,
  onSubmit,
}: AppointmentFormDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mode = formData.get('mode');
    const status = formData.get('status');
    if (!isAppointmentMode(mode) || !isAppointmentStatus(status)) {
      return;
    }
    const endTimeInput = event.currentTarget.elements.namedItem('endTime');
    if (endTimeInput instanceof HTMLInputElement) {
      endTimeInput.setCustomValidity(
        String(formData.get('endTime')) <= String(formData.get('startTime'))
          ? 'End time must be later than start time.'
          : '',
      );
      if (!event.currentTarget.reportValidity()) return;
    }

    onSubmit({
      patientName: String(formData.get('patientName')).trim(),
      patientEmail: String(formData.get('patientEmail')).trim(),
      patientPhone: String(formData.get('patientPhone')).trim(),
      appointmentDate: String(formData.get('appointmentDate')),
      startTime: String(formData.get('startTime')),
      endTime: String(formData.get('endTime')),
      mode,
      status,
      reason: String(formData.get('reason')).trim(),
    });
  };

  return (
    <Modal
      open={open}
      title={appointment ? 'Edit appointment' : 'New appointment'}
      description="Demo only — changes are not saved to the server."
      size="lg"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            Patient name
            <input
              required
              name="patientName"
              defaultValue={appointment?.patientName}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Patient email
            <input
              required
              type="email"
              name="patientEmail"
              defaultValue={appointment?.patientEmail}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Phone number
            <input
              name="patientPhone"
              defaultValue={appointment?.patientPhone}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Appointment type
            <select name="mode" defaultValue={appointment?.mode ?? 'In-person'} className={inputClass}>
              <option value="In-person">In-person</option>
              <option value="Online">Online</option>
            </select>
          </label>
          <label className={labelClass}>
            Date
            <input
              required
              type="date"
              name="appointmentDate"
              defaultValue={appointment?.appointmentDate ?? getToday()}
              className={inputClass}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              Start time
              <input
                required
                type="time"
                name="startTime"
                defaultValue={appointment?.startTime ?? '09:00'}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              End time
              <input
                required
                type="time"
                name="endTime"
                defaultValue={appointment?.endTime ?? '09:30'}
                className={inputClass}
              />
            </label>
          </div>
          <label className={labelClass}>
            Status
            <select
              name="status"
              defaultValue={appointment?.status ?? 'PENDING'}
              className={inputClass}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Appointment reason
            <textarea
              name="reason"
              rows={3}
              defaultValue={appointment?.reason}
              className={`${inputClass} resize-y`}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            {appointment ? 'Save changes' : 'Create appointment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
