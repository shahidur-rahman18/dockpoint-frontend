import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { statsData } from '../data/mockData';
import { StatCard } from '../components/dashboard/StatCard';
import { AppointmentStatsChart } from '../components/dashboard/AppointmentStatsChart';
import { AppointmentsList } from '../components/dashboard/AppointmentsList';
import { PopularDoctors } from '../components/dashboard/PopularDoctors';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2.5">
          <button style={{ background: 'var(--theme-accent)' }} className="flex items-center gap-1.5 px-3.5 py-2 hover:brightness-90 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Schedule Availability</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Middle Grid: Appointment Statistics (Left 8 cols) & Appointments List (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <AppointmentStatsChart />
        </div>
        <div className="lg:col-span-4">
          <AppointmentsList />
        </div>
      </div>

      {/* Bottom Row: Popular Doctors */}
      <div>
        <PopularDoctors />
      </div>
    </div>
  );
};
