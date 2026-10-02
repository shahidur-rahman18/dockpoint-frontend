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
  PanelLeftClose
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
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
    <aside className={`${collapsed ? 'w-[72px]' : 'w-64'} bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-y-auto select-none shrink-0 transition-[width] duration-200`}>
      {/* Brand Header */}
      <div className={`h-14 shrink-0 flex items-center border-b border-slate-100 ${collapsed ? 'px-3 justify-center' : 'px-4 justify-between'}`}>
        <div className="flex items-center gap-2.5">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="w-8 h-8 rounded-xl bg-indigo-900 flex items-center justify-center text-white font-bold shadow-xs cursor-pointer"
            >
              <span className="text-lg leading-none font-black tracking-tight">P</span>
            </button>
          ) : (
            <>
              <div className="w-8 h-8 rounded-xl bg-indigo-900 flex items-center justify-center text-white font-bold shadow-xs">
                <span className="text-lg leading-none font-black tracking-tight">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Dockpoint</span>
            </>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sidebar Nav Links */}
      <div className={`pt-0 pb-4 space-y-6 flex-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        {/* Main Menu Section */}
        <div>
          {!collapsed && <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</span>}
          <div className="mt-2 space-y-1">
            {/* Dashboard Accordion */}
            <div>
              <button
                onClick={() => collapsed ? setCollapsed(false) : setDashboardOpen(!dashboardOpen)}
                title={collapsed ? 'Dashboard' : undefined}
                className={`w-full py-2 flex items-center text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  {!collapsed && <span>Dashboard</span>}
                </div>
                {!collapsed && (dashboardOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                ))}
              </button>

              {!collapsed && dashboardOpen && (
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
            <button title={collapsed ? 'Applications' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <AppWindow className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Applications</span>}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Layouts */}
            <button title={collapsed ? 'Layouts' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Layouts</span>}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Clinic Section */}
        <div>
          {!collapsed && <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinic</span>}
          <div className="mt-2 space-y-0.5">
            <button title={collapsed ? 'Doctors' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Doctors</span>}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button title={collapsed ? 'Patients' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Patients</span>}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button title={collapsed ? 'Appointments' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Appointments</span>}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button title={collapsed ? 'Queue Management' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <ListOrdered className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Queue Management</span>}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button title={collapsed ? 'Locations' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Locations</span>}
              </div>
            </button>

            <button title={collapsed ? 'Services' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Services</span>}
              </div>
            </button>

            <button title={collapsed ? 'Specializations' : undefined} className={`w-full py-2 flex items-center text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-slate-400" />
                {!collapsed && <span>Specializations</span>}
              </div>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
