import type {
  DoctorAppointmentChartData,
  DoctorDashboardMetric,
  DoctorDashboardStat,
  DoctorUpcomingAppointment,
  DoctorUpgradeCard,
} from '../types';

export const doctorStatsData: DoctorDashboardStat[] = [
  {
    id: 'total-appointments',
    title: 'Total Appointments',
    value: '1,248',
    change: '+12.8%',
    isPositive: true,
    icon: 'Calendar',
    miniChartData: [4, 6, 5, 8, 7, 10, 9],
    chartColor: '#4f46e5',
  },
  {
    id: 'online-consultations',
    title: 'Online Consultations',
    value: '462',
    change: '+8.2%',
    isPositive: true,
    icon: 'Video',
    miniChartData: [3, 5, 4, 7, 6, 8, 10],
    chartColor: '#0ea5e9',
  },
  {
    id: 'cancelled-appointments',
    title: 'Cancelled Appointments',
    value: '36',
    change: '-2.4%',
    isPositive: false,
    icon: 'XCircle',
    miniChartData: [8, 7, 9, 6, 5, 6, 4],
    chartColor: '#f43f5e',
  },
];

export const doctorUpcomingAppointmentsData: DoctorUpcomingAppointment[] = [
  {
    id: 'apt-1001',
    patientName: 'Andrew Billard',
    patientId: 'PT-2048',
    time: '09:30 AM',
    department: 'Cardiology',
    consultationType: 'Video Consultation',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'apt-1002',
    patientName: 'Sophia Martinez',
    patientId: 'PT-1876',
    time: '10:15 AM',
    department: 'Cardiology',
    consultationType: 'In-Person',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'apt-1003',
    patientName: 'Daniel Wilson',
    patientId: 'PT-2315',
    time: '11:00 AM',
    department: 'Cardiology',
    consultationType: 'Follow-up',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

export const doctorAppointmentsChartData: DoctorAppointmentChartData[] = [
  { month: 'Jan', appointments: 42, completed: 34 },
  { month: 'Feb', appointments: 48, completed: 39 },
  { month: 'Mar', appointments: 45, completed: 37 },
  { month: 'Apr', appointments: 56, completed: 46 },
  { month: 'May', appointments: 61, completed: 52 },
  { month: 'Jun', appointments: 54, completed: 45 },
  { month: 'Jul', appointments: 68, completed: 58 },
  { month: 'Aug', appointments: 63, completed: 54 },
  { month: 'Sep', appointments: 72, completed: 62 },
  { month: 'Oct', appointments: 66, completed: 57 },
  { month: 'Nov', appointments: 75, completed: 65 },
  { month: 'Dec', appointments: 81, completed: 71 },
];

export const doctorDashboardMetricsData: DoctorDashboardMetric[] = [
  {
    id: 'total-patients',
    label: 'Total Patients',
    value: '856',
    icon: 'Users',
    iconBgColor: 'bg-blue-50 text-blue-600',
    change: '+10.5%',
    isPositive: true,
  },
  {
    id: 'video-consultations',
    label: 'Video Consultations',
    value: '462',
    icon: 'Video',
    iconBgColor: 'bg-violet-50 text-violet-600',
    change: '+8.2%',
    isPositive: true,
  },
  {
    id: 'rescheduled',
    label: 'Rescheduled',
    value: '24',
    icon: 'CalendarClock',
    iconBgColor: 'bg-amber-50 text-amber-600',
    change: '-3.1%',
    isPositive: false,
  },
  {
    id: 'pre-visit-bookings',
    label: 'Pre-Visit Bookings',
    value: '318',
    icon: 'ClipboardList',
    iconBgColor: 'bg-emerald-50 text-emerald-600',
    change: '+6.4%',
    isPositive: true,
  },
  {
    id: 'walk-in-bookings',
    label: 'Walk-In Bookings',
    value: '179',
    icon: 'Footprints',
    iconBgColor: 'bg-rose-50 text-rose-600',
    change: '+4.7%',
    isPositive: true,
  },
  {
    id: 'follow-ups',
    label: 'Follow-Ups',
    value: '205',
    icon: 'RotateCcw',
    iconBgColor: 'bg-cyan-50 text-cyan-600',
    change: '+7.3%',
    isPositive: true,
  },
];

export const doctorUpgradeCardData: DoctorUpgradeCard = {
  title: 'Upgrade To Pro',
  description: 'Unlock more tools to manage your practice and grow your patient base.',
  buttonText: 'Upgrade Now',
};
