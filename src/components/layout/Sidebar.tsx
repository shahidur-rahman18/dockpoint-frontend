import React, { useState } from 'react';
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  AppWindow,
  Layers,
  UserCheck,
  Users,
  CalendarCheck,
  ListOrdered,
  MapPin,
  Stethoscope,
  Award,
  Building2,
  ChevronsUpDown
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Admin Dashboard');

  const dashboardItems = [
    'Admin Dashboard',
    'Doctor Dashboard',
    'Patient Dashboard',
    'Pharmacist Dashboard',
    'Nurse Dashboard',
    'Receptionist Dashboard',
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-y-auto select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-900 flex items-center justify-center text-white font-bold shadow-xs">
            <span className="text-lg leading-none font-black tracking-tight">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Preclinic</span>
        </div>
      </div>

      {/* Clinic Switcher Card */}
      <div className="px-3 pt-3">
        <div className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-800 text-white flex items-center justify-center text-xs font-semibold">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight">Trustcare Clinic</span>
              <span className="text-[10px] text-slate-400">Lasvegas</span>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Sidebar Nav Links */}
      <div className="px-3 py-4 space-y-6 flex-1">
        {/* Main Menu Section */}
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</span>
          <div className="mt-2 space-y-1">
            {/* Dashboard Accordion */}
            <div>
              <button
                onClick={() => setDashboardOpen(!dashboardOpen)}
                className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Dashboard</span>
                </div>
                {dashboardOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {dashboardOpen && (
                <div className="ml-4 pl-3 border-l border-slate-100 my-1 space-y-1">
                  {dashboardItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveItem(item)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer block ${
                        activeItem === item
                          ? 'text-blue-600 bg-blue-50/70 font-semibold'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Applications */}
            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <AppWindow className="w-4 h-4 text-slate-400" />
                <span>Applications</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Layouts */}
            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Layouts</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Clinic Section */}
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinic</span>
          <div className="mt-2 space-y-0.5">
            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>Doctors</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Patients</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-slate-400" />
                <span>Appointments</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <ListOrdered className="w-4 h-4 text-slate-400" />
                <span>Queue Management</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Locations</span>
              </div>
            </button>

            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-4 h-4 text-slate-400" />
                <span>Services</span>
              </div>
            </button>

            <button className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-slate-400" />
                <span>Specializations</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
