import type { EventInput } from '@fullcalendar/core';
import type { DoctorListItem } from '../types';

interface AppointmentSample {
  patientName: string;
  dayOffset: number;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  mode: 'In-person' | 'Online';
}

const statusColors = {
  Confirmed: { backgroundColor: '#dcfce7', borderColor: '#dcfce7', textColor: '#166534' },
  Pending: { backgroundColor: '#fef3c7', borderColor: '#fef3c7', textColor: '#92400e' },
  Completed: { backgroundColor: '#dbeafe', borderColor: '#dbeafe', textColor: '#1e40af' },
  Cancelled: { backgroundColor: '#ffe4e6', borderColor: '#ffe4e6', textColor: '#9f1239' },
} satisfies Record<AppointmentSample['status'], Pick<EventInput, 'backgroundColor' | 'borderColor' | 'textColor'>>;

const appointmentSamples: AppointmentSample[] = [
  { patientName: 'Ayesha Rahman', dayOffset: -4, time: '09:00', status: 'Completed', mode: 'In-person' },
  { patientName: 'Tanvir Ahmed', dayOffset: -1, time: '10:30', status: 'Completed', mode: 'Online' },
  { patientName: 'Nusrat Jahan', dayOffset: 0, time: '09:30', status: 'Confirmed', mode: 'In-person' },
  { patientName: 'Fahim Hossain', dayOffset: 0, time: '11:00', status: 'Pending', mode: 'Online' },
  { patientName: 'Samira Islam', dayOffset: 1, time: '14:00', status: 'Confirmed', mode: 'In-person' },
  { patientName: 'Rafi Hasan', dayOffset: 2, time: '10:00', status: 'Cancelled', mode: 'Online' },
  { patientName: 'Maliha Chowdhury', dayOffset: 4, time: '15:30', status: 'Confirmed', mode: 'In-person' },
  { patientName: 'Sakib Karim', dayOffset: 8, time: '12:00', status: 'Pending', mode: 'Online' },
  { patientName: 'Nabila Akter', dayOffset: 12, time: '16:00', status: 'Confirmed', mode: 'In-person' },
  { patientName: 'Imran Kabir', dayOffset: 18, time: '09:30', status: 'Confirmed', mode: 'Online' },
];

const toLocalDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hours)}:${pad(minutes)}:00`;
};

const addMinutes = (dateTime: string, minutesToAdd: number) => {
  const date = new Date(dateTime);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return toLocalDateTime(date, time);
};

export const getSampleAppointments = (doctors: DoctorListItem[]): EventInput[] => {
  if (doctors.length === 0) return [];

  return appointmentSamples.map((sample, index) => {
    const doctor = doctors[index % doctors.length];
    const date = new Date();
    date.setDate(date.getDate() + sample.dayOffset);
    const start = toLocalDateTime(date, sample.time);

    return {
      id: `sample-appointment-${index + 1}`,
      title: sample.patientName,
      start,
      end: addMinutes(start, 30),
      ...statusColors[sample.status],
      classNames: [`appointment-status-${sample.status.toLowerCase()}`],
      extendedProps: {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.department,
        patientName: sample.patientName,
        status: sample.status,
        mode: sample.mode,
      },
    };
  });
};
