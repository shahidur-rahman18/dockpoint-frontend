export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type AppointmentMode = 'In-person' | 'Online';

export interface DoctorAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  mode: AppointmentMode;
  status: AppointmentStatus;
  reason: string;
}

const dateOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const appointmentSeeds: Omit<DoctorAppointment, 'appointmentDate'>[] = [
  {
    id: 'APT-2041',
    patientName: 'Ayesha Rahman',
    patientEmail: 'ayesha.rahman@example.com',
    patientPhone: '+880 1712 345 678',
    startTime: '09:00',
    endTime: '09:30',
    mode: 'In-person',
    status: 'CONFIRMED',
    reason: 'Regular heart health follow-up',
  },
  {
    id: 'APT-2042',
    patientName: 'Tanvir Ahmed',
    patientEmail: 'tanvir.ahmed@example.com',
    patientPhone: '+880 1812 456 789',
    startTime: '10:00',
    endTime: '10:30',
    mode: 'Online',
    status: 'PENDING',
    reason: 'Review recent test results',
  },
  {
    id: 'APT-2043',
    patientName: 'Nusrat Jahan',
    patientEmail: 'nusrat.jahan@example.com',
    patientPhone: '+880 1912 567 890',
    startTime: '11:30',
    endTime: '12:00',
    mode: 'In-person',
    status: 'COMPLETED',
    reason: 'Blood pressure consultation',
  },
  {
    id: 'APT-2044',
    patientName: 'Fahim Hossain',
    patientEmail: 'fahim.hossain@example.com',
    patientPhone: '+880 1612 678 901',
    startTime: '14:00',
    endTime: '14:30',
    mode: 'Online',
    status: 'CANCELLED',
    reason: 'Initial consultation',
  },
  {
    id: 'APT-2045',
    patientName: 'Maliha Karim',
    patientEmail: 'maliha.karim@example.com',
    patientPhone: '+880 1512 789 012',
    startTime: '15:00',
    endTime: '15:30',
    mode: 'In-person',
    status: 'CONFIRMED',
    reason: 'Medication follow-up',
  },
  {
    id: 'APT-2046',
    patientName: 'Sakib Hasan',
    patientEmail: 'sakib.hasan@example.com',
    patientPhone: '+880 1412 890 123',
    startTime: '09:30',
    endTime: '10:00',
    mode: 'Online',
    status: 'PENDING',
    reason: 'Discuss ongoing symptoms',
  },
  {
    id: 'APT-2047',
    patientName: 'Raisa Chowdhury',
    patientEmail: 'raisa.chowdhury@example.com',
    patientPhone: '+880 1312 901 234',
    startTime: '11:00',
    endTime: '11:30',
    mode: 'In-person',
    status: 'CONFIRMED',
    reason: 'Routine check-up',
  },
  {
    id: 'APT-2048',
    patientName: 'Imran Kabir',
    patientEmail: 'imran.kabir@example.com',
    patientPhone: '+880 1212 012 345',
    startTime: '16:00',
    endTime: '16:30',
    mode: 'Online',
    status: 'COMPLETED',
    reason: 'Follow-up consultation',
  },
];

export const doctorAppointmentsMockData: DoctorAppointment[] = appointmentSeeds.map(
  (appointment, index) => ({
    ...appointment,
    appointmentDate: dateOffset(index < 5 ? index - 2 : 2 + index),
  }),
);
