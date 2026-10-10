import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DoctorList } from '../components/doctors/DoctorList';
import { DoctorDetails } from '../components/doctors/DoctorDetails';
import { AddDoctor } from '../components/doctors/AddDoctor';
import { DoctorSchedule } from '../components/doctors/DoctorSchedule';
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { DoctorSettingsPage } from '../pages/DoctorSettingsPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { RequireAuth, SignInRoute } from '../components/auth/AuthRoutes';
import { AdminDashboard } from '../pages/AdminDashboard';
import { SignUpPage } from '../components/auth/SignUpPage';
import { NotFound } from '../components/common/NotFound';

const pending = (title: string, description: string) => ({
  element: <PlaceholderPage title={title} description={description} />,
});

export const routes: RouteObject[] = [
  { path: '/admin/sign-in', element: <SignInRoute role="admin" /> },
  { path: '/doctor/sign-in', element: <SignInRoute role="doctor" /> },
  { path: '/sign-in', element: <Navigate to="/doctor/sign-in" replace /> },
  { path: '/sign-up', element: <SignUpPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/admin-dashboard" replace /> },
      { path: 'admin-dashboard', element: <AdminDashboard /> },
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
      { path: 'doctor-dashboard/settings', element: <DoctorSettingsPage /> },
      { path: 'doctor-dashboard/settings/:section', element: <DoctorSettingsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'settings/:section', element: <AdminSettingsPage /> },
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
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);