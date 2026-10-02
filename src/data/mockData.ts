import type { StatItem, AppointmentSummary, MonthlyChartData, RecentAppointment, PopularDoctor } from '../types';

export const statsData: StatItem[] = [
  {
    id: '1',
    title: 'Doctors',
    value: '247',
    change: '+95%',
    isPositive: true,
    timeframe: 'in last 7 Days',
    icon: 'Stethoscope',
    chartType: 'bar',
    chartColor: '#3b82f6',
  },
  {
    id: '2',
    title: 'Patients',
    value: '4,178',
    change: '+25%',
    isPositive: true,
    timeframe: 'in last 7 Days',
    icon: 'Users',
    chartType: 'line',
    chartColor: '#ef4444',
  },
  {
    id: '3',
    title: 'Appointment',
    value: '12,178',
    change: '-15%',
    isPositive: false,
    timeframe: 'in last 7 Days',
    icon: 'Calendar',
    chartType: 'bar',
    chartColor: '#2563eb',
  },
  {
    id: '4',
    title: 'Revenue',
    value: '$55,1240',
    change: '+25%',
    isPositive: true,
    timeframe: 'in last 7 Days',
    icon: 'Wallet',
    chartType: 'line',
    chartColor: '#10b981',
  },
];

export const appointmentSummaries: AppointmentSummary[] = [
  { label: 'All Appointments', count: 6314, color: 'text-slate-800', bgColor: 'bg-slate-50' },
  { label: 'Cancelled', count: 456, color: 'text-rose-600', bgColor: 'bg-rose-50/50' },
  { label: 'Reschedule', count: 745, color: 'text-amber-600', bgColor: 'bg-amber-50/50' },
  { label: 'Completed', count: 4578, color: 'text-emerald-600', bgColor: 'bg-emerald-50/50' },
];

export const monthlyData: MonthlyChartData[] = [
  { month: 'Jan', completed: 1200, ongoing: 600, rescheduled: 300 },
  { month: 'Feb', completed: 1500, ongoing: 700, rescheduled: 400 },
  { month: 'Mar', completed: 1800, ongoing: 900, rescheduled: 500 },
  { month: 'Apr', completed: 2100, ongoing: 1000, rescheduled: 400 },
  { month: 'May', completed: 2500, ongoing: 1200, rescheduled: 600 },
  { month: 'Jun', completed: 1100, ongoing: 500, rescheduled: 300 },
  { month: 'Jul', completed: 1600, ongoing: 700, rescheduled: 300 },
  { month: 'Aug', completed: 1900, ongoing: 800, rescheduled: 400 },
  { month: 'Sep', completed: 2400, ongoing: 1100, rescheduled: 700 },
  { month: 'Oct', completed: 2300, ongoing: 1000, rescheduled: 600 },
  { month: 'Nov', completed: 1800, ongoing: 800, rescheduled: 400 },
  { month: 'Dec', completed: 1700, ongoing: 700, rescheduled: 300 },
];

export const recentAppointments: RecentAppointment[] = [
  {
    id: '1',
    type: 'General Visit',
    date: 'Wed, 05 Apr 2025',
    time: '06:30 PM',
    avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'],
  },
  {
    id: '2',
    type: 'General Visit',
    date: 'Wed, 05 Apr 2025',
    time: '04:10 PM',
    avatars: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'],
  },
  {
    id: '3',
    type: 'General Visit',
    date: 'Wed, 05 Apr 2025',
    time: '10:00 AM',
    avatars: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'],
  },
];

export const popularDoctors: PopularDoctor[] = [
  {
    id: '1',
    name: 'Dr. Alex Morgan',
    specialty: 'Cardiologist',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 124,
  },
  {
    id: '2',
    name: 'Dr. Emily Carter',
    specialty: 'Pediatrician',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a933758f46?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 98,
  },
  {
    id: '3',
    name: 'Dr. David Lee',
    specialty: 'Gynecologist',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 156,
  },
];
