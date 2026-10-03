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

export interface DepartmentStat {
  name: string;
  count: number;
  color: string;
}

export interface DoctorScheduleSummary {
  available: number;
  unavailable: number;
  leave: number;
}

export interface ScheduleDoctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

export interface IncomeTreatment {
  id: string;
  treatment: string;
  appointmentsCount: number;
  amount: string;
}

export interface AllAppointmentItem {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    avatar: string;
  };
  patient: {
    name: string;
    phone: string;
    avatar: string;
  };
  dateTime: string;
  mode: 'Online' | 'In-Person';
  status: 'Confirmed' | 'Cancelled' | 'Checked Out' | 'Schedule';
}

export interface TopPatient {
  id: string;
  name: string;
  totalPaid: string;
  appointmentsCount: number;
  avatar: string;
}

export interface RecentTransaction {
  id: string;
  title: string;
  invoiceId: string;
  amount: string;
  isPositive: boolean;
  provider: 'stripe' | 'paypal';
}

export interface LeaveRequest {
  id: string;
  doctorName: string;
  duration: string;
  reason: string;
  avatar: string;
}

export interface DoctorListItem {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  fees: string;
  status: 'Available' | 'Unavailable';
  avatar: string;
}
