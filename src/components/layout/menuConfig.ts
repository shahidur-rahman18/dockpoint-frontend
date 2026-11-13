import {
  AppWindow,
  Award,
  CalendarCheck,
  CalendarDays,
  CalendarOff,
  ClipboardList,
  LayoutDashboard,
  Layers,
  ListOrdered,
  MapPin,
  MessageSquare,
  Settings,
  Stethoscope,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  exact?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  section: 'Main Menu' | 'Clinic' | 'Settings';
  path?: string;
  activePath?: string;
  items?: NavItem[];
  defaultOpen?: boolean;
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    section: 'Main Menu',
    path: '/admin-dashboard',
  },
  { id: 'applications', label: 'Applications', icon: AppWindow, section: 'Main Menu', path: '/admin-dashboard/applications' },
  { id: 'layouts', label: 'Layouts', icon: Layers, section: 'Main Menu', path: '/admin-dashboard/layouts' },
  {
    id: 'doctors',
    label: 'Doctors',
    icon: UserCheck,
    section: 'Clinic',
    defaultOpen: true,
    items: [
      { label: 'Doctors', path: '/admin-dashboard/doctors' },
      { label: 'Add Doctor', path: '/admin-dashboard/add-doctor' },
      { label: 'Doctor Schedule', path: '/admin-dashboard/doctor-schedule' },
    ],
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: Users,
    section: 'Clinic',
    activePath: '/admin-dashboard/patients',
    defaultOpen: true,
    items: [
      { label: 'Patients List', path: '/admin-dashboard/patients', exact: true },
      { label: 'Add Patient', path: '/admin-dashboard/patients/create' },
    ],
  },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck, section: 'Clinic', path: '/admin-dashboard/appointments' },
  { id: 'queue', label: 'Queue Management', icon: ListOrdered, section: 'Clinic', path: '/admin-dashboard/queue-management' },
  { id: 'locations', label: 'Locations', icon: MapPin, section: 'Clinic', path: '/admin-dashboard/locations' },
  { id: 'services', label: 'Services', icon: Stethoscope, section: 'Clinic', path: '/admin-dashboard/services' },
  { id: 'specializations', label: 'Specializations', icon: Award, section: 'Clinic', path: '/admin-dashboard/specializations' },
  {
    id: 'admin-settings',
    label: 'Settings',
    icon: Settings,
    section: 'Settings',
    defaultOpen: true,
    items: [
      { label: 'Profile', path: '/admin-dashboard/settings/profile' },
      { label: 'Security', path: '/admin-dashboard/settings/security' },
      { label: 'Notifications', path: '/admin-dashboard/settings/notifications' },
      { label: 'Integrations', path: '/admin-dashboard/settings/integrations' },
    ],
  },
];

export const DOCTOR_NAV_GROUPS: NavGroup[] = [
  {
    id: 'doctor-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    section: 'Main Menu',
    path: '/doctor-dashboard',
  },
  { id: 'doctor-appointments', label: 'Appointments', icon: CalendarCheck, section: 'Main Menu', path: '/doctor-dashboard/appointments' },
  { id: 'doctor-schedule', label: 'My Schedule', icon: CalendarDays, section: 'Main Menu', path: '/doctor-dashboard/schedule' },
  { id: 'doctor-prescriptions', label: 'Prescriptions', icon: ClipboardList, section: 'Clinic', path: '/doctor-dashboard/prescriptions' },
  { id: 'doctor-leave', label: 'Leave', icon: CalendarOff, section: 'Clinic', path: '/doctor-dashboard/leave' },
  { id: 'doctor-reviews', label: 'Reviews', icon: MessageSquare, section: 'Clinic', path: '/doctor-dashboard/reviews' },
  {
    id: 'doctor-settings',
    label: 'Settings',
    icon: Settings,
    section: 'Settings',
    defaultOpen: true,
    items: [
      { label: 'Profile Settings', path: '/doctor-dashboard/settings/profile' },
      { label: 'Change Password', path: '/doctor-dashboard/settings/password' },
      { label: 'Notifications', path: '/doctor-dashboard/settings/notifications' },
    ],
  },
];

export const isDoctorDashboardPath = (pathname: string): boolean =>
  pathname === '/doctor-dashboard' || pathname.startsWith('/doctor-dashboard/');

export const getNavGroups = (pathname: string): NavGroup[] =>
  isDoctorDashboardPath(pathname) ? DOCTOR_NAV_GROUPS : ADMIN_NAV_GROUPS;
