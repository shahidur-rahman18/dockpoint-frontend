export interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  icon: string;
  chartType: 'bar' | 'line';
  chartColor: string;
}

export interface AppointmentSummary {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

export interface MonthlyChartData {
  month: string;
  completed: number;
  ongoing: number;
  rescheduled: number;
}

export interface RecentAppointment {
  id: string;
  type: string;
  date: string;
  time: string;
  patientName?: string;
  avatars: string[];
}

export interface PopularDoctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating?: number;
  reviewsCount?: number;
}
