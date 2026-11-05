import type { FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { SharedForm, type FormFieldConfig } from '../common/SharedForm';
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

const fields: FormFieldConfig[] = [
  { name: 'patientName', label: 'Patient name', required: true },
  { name: 'patientEmail', label: 'Patient email', type: 'email', required: true },
  { name: 'patientPhone', label: 'Phone number', type: 'tel' },
  {
    name: 'mode',
    label: 'Appointment type',
    type: 'select',
    options: [
      { label: 'In-person', value: 'In-person' },
      { label: 'Online', value: 'Online' },
    ],
  },
  { name: 'appointmentDate', label: 'Date', type: 'date', required: true },
  { name: 'startTime', label: 'Start time', type: 'time', required: true },
  { name: 'endTime', label: 'End time', type: 'time', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Pending', value: 'PENDING' },
      { label: 'Confirmed', value: 'CONFIRMED' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ],
  },
  { name: 'reason', label: 'Appointment reason', type: 'textarea', span: 'full' },
];

export function AppointmentFormDialog({
  open,
  appointment,
  onClose,
  onSubmit,
}: AppointmentFormDialogProps) {
  const handleSubmit = (_values: Record<string, string>, event: FormEvent<HTMLFormElement>) => {
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
      size="lg"
      onClose={onClose}
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <SharedForm
          fields={fields}
          initialValues={{
            patientName: appointment?.patientName ?? '',
            patientEmail: appointment?.patientEmail ?? '',
            patientPhone: appointment?.patientPhone ?? '',
            mode: appointment?.mode ?? 'In-person',
            appointmentDate: appointment?.appointmentDate ?? getToday(),
            startTime: appointment?.startTime ?? '09:00',
            endTime: appointment?.endTime ?? '09:30',
            status: appointment?.status ?? 'PENDING',
            reason: appointment?.reason ?? '',
          }}
          submitLabel={appointment ? 'Save changes' : 'Create appointment'}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </Modal>
  );
}
