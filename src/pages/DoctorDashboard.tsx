import React from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import {
  doctorDashboardMetricsData,
  doctorStatsData,
} from '../data/doctorMockData';
import { AppointmentsChart } from '../components/doctor-dashboard/AppointmentsChart';
import { DoctorMetricCard } from '../components/doctor-dashboard/DoctorMetricCard';
import { DoctorStatCard } from '../components/doctor-dashboard/DoctorStatCard';
import { UpcomingAppointments } from '../components/doctor-dashboard/UpcomingAppointments';

export const DoctorDashboard: React.FC = () => (
  <div className="space-y-6 pb-6">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Doctor Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your practice.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          style={{ background: 'var(--theme-accent)' }}
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:brightness-90"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>New Appointment</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <CalendarDays className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <span>Schedule Availability</span>
        </button>
      </div>
    </header>

    <section
      aria-label="Appointment statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {doctorStatsData.map((stat) => (
        <DoctorStatCard key={stat.id} stat={stat} />
      ))}
    </section>

    <section
      aria-label="Appointments overview"
      className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
    >
      <div className="lg:col-span-8">
        <UpcomingAppointments />
      </div>
      <div className="lg:col-span-4">
        <AppointmentsChart />
      </div>
    </section>

    <section
      aria-label="Practice metrics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
    >
      {doctorDashboardMetricsData.map((metric) => (
        <DoctorMetricCard key={metric.id} metric={metric} />
      ))}
    </section>
  </div>
);
