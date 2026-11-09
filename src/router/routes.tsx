import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DoctorList } from '../components/doctors/DoctorList';
import { PatientList } from '../components/patients/PatientList';
import { DoctorDetails } from '../components/doctors/DoctorDetails';
import { DoctorEditPage } from '../components/doctors/DoctorEditPage';
import { AddDoctor } from '../components/doctors/AddDoctor';
import { DoctorSchedule } from '../components/doctors/DoctorSchedule';
import { LoaderOne } from '../components/common/LoaderOne';
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { DoctorMySchedulePage } from '../pages/DoctorMySchedulePage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { DoctorSettingsPage } from '../pages/DoctorSettingsPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { RequireAuth, SignInRoute } from '../components/auth/AuthRoutes';
import { DoctorPasswordSetupRoute } from '../components/auth/DoctorPasswordSetupRoute';
import { AdminDashboard } from '../pages/AdminDashboard';
import { NotFound } from '../components/common/NotFound';

const pending = (title: string, description: string) => ({
  element: <PlaceholderPage title={title} description={description} />,
});
const AppointmentCalendar = lazy(() =>
  import('../components/appointments/AppointmentCalendar').then((module) => ({
    default: module.AppointmentCalendar,
  })),
);
const DoctorAppointmentsPage = lazy(() =>
  import('../pages/DoctorAppointmentsPage').then((module) => ({
    default: module.DoctorAppointmentsPage,
  })),
);

export const routes: RouteObject[] = [
  { path: '/setup-password', element: <DoctorPasswordSetupRoute /> },
  { path: '/sign-in', element: <SignInRoute /> },
  { path: '/admin/sign-in', element: <SignInRoute role="admin" /> },
  { path: '/doctor/sign-in', element: <SignInRoute role="doctor" /> },
  { path: '/sign-up', element: <Navigate to="/doctor/sign-in" replace /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/admin-dashboard" replace /> },
      {
        path: 'admin-dashboard',
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'doctors', element: <DoctorList /> },
          { path: 'doctors/:doctorId/edit', element: <DoctorEditPage /> },
          { path: 'doctor-details', element: <Navigate to="/admin-dashboard/doctors" replace /> },
          { path: 'doctor-details/:doctorId/:doctorSlug', element: <DoctorDetails /> },
          { path: 'add-doctor', element: <AddDoctor /> },
          { path: 'doctor-schedule', element: <DoctorSchedule /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { path: 'settings/:section', element: <AdminSettingsPage /> },
          { path: 'applications', ...pending('Applications', 'Installed clinic applications will appear here.') },
          { path: 'layouts', ...pending('Layouts', 'Reusable dashboard layouts will appear here.') },
          { path: 'patients', element: <PatientList /> },
          {
            path: 'appointments',
            element: (
              <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading appointment calendar…</div>}>
                <AppointmentCalendar />
              </Suspense>
            ),
          },
          { path: 'queue-management', ...pending('Queue Management', 'Live patient queue will appear here.') },
          { path: 'locations', ...pending('Locations', 'Clinic locations will appear here.') },
          { path: 'services', ...pending('Services', 'Available clinic services will appear here.') },
          { path: 'specializations', ...pending('Specializations', 'Medical specializations will appear here.') },
        ],
      },
      { path: 'doctor-dashboard', element: <DoctorDashboard /> },
      {
        path: 'doctor-dashboard/appointments',
        element: (
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 px-3 py-10 text-center sm:px-5" role="status">
                <LoaderOne />
                <p className="text-sm text-slate-500">Loading appointments…</p>
              </div>
            }
          >
            <DoctorAppointmentsPage />
          </Suspense>
        ),
      },
      { path: 'doctor-dashboard/schedule', element: <DoctorMySchedulePage /> },
      { path: 'doctor-dashboard/prescriptions', ...pending('Prescriptions', 'Your prescriptions will appear here.') },
      { path: 'doctor-dashboard/leave', ...pending('Leave', 'Your leave requests will appear here.') },
      { path: 'doctor-dashboard/reviews', ...pending('Reviews', 'Your patient reviews will appear here.') },
      { path: 'doctor-dashboard/settings', element: <DoctorSettingsPage /> },
      { path: 'doctor-dashboard/settings/:section', element: <DoctorSettingsPage /> },
      { path: 'patient-dashboard', ...pending('Patient Dashboard', 'Patient-facing dashboard will appear here.') },
      { path: 'pharmacist-dashboard', ...pending('Pharmacist Dashboard', 'Pharmacy dashboard will appear here.') },
      { path: 'nurse-dashboard', ...pending('Nurse Dashboard', 'Nurse dashboard will appear here.') },
      { path: 'receptionist-dashboard', ...pending('Receptionist Dashboard', 'Receptionist dashboard will appear here.') },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);