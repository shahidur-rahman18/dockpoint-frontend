import React from 'react';
import { statsData } from '../data/mockData';
import { StatCard } from '../components/dashboard/StatCard';
import { AppointmentStatsChart } from '../components/dashboard/AppointmentStatsChart';
import { AppointmentsList } from '../components/dashboard/AppointmentsList';
import { PopularDoctors } from '../components/dashboard/PopularDoctors';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
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
