import { createBrowserRouter, type RouteObject } from 'react-router';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AdminDashboard } from '../pages/AdminDashboard';
import { DoctorList } from '../components/doctors/DoctorList';
import { DoctorDetails } from '../components/doctors/DoctorDetails';
import { AddDoctor } from '../components/doctors/AddDoctor';
import { DoctorSchedule } from '../components/doctors/DoctorSchedule';
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { SignInPage } from '../components/auth/SignInPage';
import { SignUpPage } from '../components/auth/SignUpPage';

const pending = (title: string, description: string) => ({
  element: <PlaceholderPage title={title} description={description} />,
});

export const routes: RouteObject[] = [
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/sign-up', element: <SignUpPage /> },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'doctors', element: <DoctorList /> },
      { path: 'doctor-details/:doctorId/:doctorSlug', element: <DoctorDetails /> },
      { path: 'add-doctor', element: <AddDoctor /> },
      { path: 'doctor-schedule', element: <DoctorSchedule /> },
      { path: 'doctor-dashboard', element: <DoctorDashboard /> },
      { path: 'doctor-dashboard/appointments', ...pending('Appointments', 'Your appointments will appear here.') },
      { path: 'doctor-dashboard/schedule', ...pending('My Schedule', 'Your availability and schedule will appear here.') },
      { path: 'doctor-dashboard/prescriptions', ...pending('Prescriptions', 'Your prescriptions will appear here.') },
      { path: 'doctor-dashboard/leave', ...pending('Leave', 'Your leave requests will appear here.') },
      { path: 'doctor-dashboard/reviews', ...pending('Reviews', 'Your patient reviews will appear here.') },
      { path: 'doctor-dashboard/settings', ...pending('Settings', 'Your account settings will appear here.') },
      { path: 'patient-dashboard', ...pending('Patient Dashboard', 'Patient-facing dashboard will appear here.') },
      { path: 'pharmacist-dashboard', ...pending('Pharmacist Dashboard', 'Pharmacy dashboard will appear here.') },
      { path: 'nurse-dashboard', ...pending('Nurse Dashboard', 'Nurse dashboard will appear here.') },
      { path: 'receptionist-dashboard', ...pending('Receptionist Dashboard', 'Receptionist dashboard will appear here.') },
      { path: 'applications', ...pending('Applications', 'Installed clinic applications will appear here.') },
      { path: 'layouts', ...pending('Layouts', 'Reusable dashboard layouts will appear here.') },
      { path: 'patients', ...pending('Patients', 'Patient directory will appear here.') },
      { path: 'appointments', ...pending('Appointments', 'Appointment management will appear here.') },
      { path: 'queue-management', ...pending('Queue Management', 'Live patient queue will appear here.') },
      { path: 'locations', ...pending('Locations', 'Clinic locations will appear here.') },
      { path: 'services', ...pending('Services', 'Available clinic services will appear here.') },
      { path: 'specializations', ...pending('Specializations', 'Medical specializations will appear here.') },
      { path: '*', ...pending('Page Not Found', 'The page you are looking for does not exist or has been moved.') },
    ],
  },
];

export const router = createBrowserRouter(routes);