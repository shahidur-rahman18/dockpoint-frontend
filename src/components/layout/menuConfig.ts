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
}

export interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  section: 'Main Menu' | 'Clinic' | 'Settings';
  path?: string;
  items?: NavItem[];
  defaultOpen?: boolean;
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    section: 'Main Menu',
    defaultOpen: true,
    items: [
      { label: 'Admin Dashboard', path: '/admin-dashboard' },
      { label: 'Doctor Dashboard', path: '/doctor-dashboard' },
      { label: 'Patient Dashboard', path: '/patient-dashboard' },
      { label: 'Pharmacist Dashboard', path: '/pharmacist-dashboard' },
      { label: 'Nurse Dashboard', path: '/nurse-dashboard' },
      { label: 'Receptionist Dashboard', path: '/receptionist-dashboard' },
    ],
  },
  { id: 'applications', label: 'Applications', icon: AppWindow, section: 'Main Menu', path: '/applications' },
  { id: 'layouts', label: 'Layouts', icon: Layers, section: 'Main Menu', path: '/layouts' },
  {
    id: 'doctors',
    label: 'Doctors',
    icon: UserCheck,
    section: 'Clinic',
    defaultOpen: true,
    items: [
      { label: 'Doctors', path: '/doctors' },
      { label: 'Add Doctor', path: '/add-doctor' },
      { label: 'Doctor Schedule', path: '/doctor-schedule' },
    ],
  },
  { id: 'patients', label: 'Patients', icon: Users, section: 'Clinic', path: '/patients' },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck, section: 'Clinic', path: '/appointments' },
  { id: 'queue', label: 'Queue Management', icon: ListOrdered, section: 'Clinic', path: '/queue-management' },
  { id: 'locations', label: 'Locations', icon: MapPin, section: 'Clinic', path: '/locations' },
  { id: 'services', label: 'Services', icon: Stethoscope, section: 'Clinic', path: '/services' },
  { id: 'specializations', label: 'Specializations', icon: Award, section: 'Clinic', path: '/specializations' },
  {
    id: 'admin-settings',
    label: 'Settings',
    icon: Settings,
    section: 'Settings',
    defaultOpen: true,
    items: [
      { label: 'Profile', path: '/settings/profile' },
      { label: 'Security', path: '/settings/security' },
      { label: 'Notifications', path: '/settings/notifications' },
      { label: 'Integrations', path: '/settings/integrations' },
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
