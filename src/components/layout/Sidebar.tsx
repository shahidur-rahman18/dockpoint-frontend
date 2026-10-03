import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
  PanelLeftClose,
} from 'lucide-react';

interface SidebarProps {
  background: string;
}

interface NavItem {
  label: string;
  path: string;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  items?: NavItem[];
  defaultOpen?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      { label: 'Admin Dashboard', path: '/' },
      { label: 'Doctor Dashboard', path: '/doctor-dashboard' },
      { label: 'Patient Dashboard', path: '/patient-dashboard' },
      { label: 'Pharmacist Dashboard', path: '/pharmacist-dashboard' },
      { label: 'Nurse Dashboard', path: '/nurse-dashboard' },
      { label: 'Receptionist Dashboard', path: '/receptionist-dashboard' },
    ],
  },
  { id: 'applications', label: 'Applications', icon: AppWindow, path: '/applications' },
  { id: 'layouts', label: 'Layouts', icon: Layers, path: '/layouts' },
  {
    id: 'doctors',
    label: 'Doctors',
    icon: UserCheck,
    defaultOpen: true,
    items: [
      { label: 'Doctors', path: '/doctors' },
      { label: 'Doctor Details', path: '/doctor-details' },
      { label: 'Add Doctor', path: '/add-doctor' },
      { label: 'Doctor Schedule', path: '/doctor-schedule' },
    ],
  },
  { id: 'patients', label: 'Patients', icon: Users, path: '/patients' },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck, path: '/appointments' },
  { id: 'queue', label: 'Queue Management', icon: ListOrdered, path: '/queue-management' },
  { id: 'locations', label: 'Locations', icon: MapPin, path: '/locations' },
  { id: 'services', label: 'Services', icon: Stethoscope, path: '/services' },
  { id: 'specializations', label: 'Specializations', icon: Award, path: '/specializations' },
];

export const Sidebar: React.FC<SidebarProps> = ({ background }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(
    NAV_GROUPS.filter((group) => group.defaultOpen).map((group) => group.id),
  );
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (path?: string) => {
    if (!path) return false;
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((groupId) => groupId !== id) : [...prev, id],
    );
  };

  return (
    <aside
      style={{ background }}
      className={`${collapsed ? 'w-[72px]' : 'w-64'} bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-y-auto select-none shrink-0 transition-[width] duration-200`}
    >
      {/* Brand Header */}
      <div
        className={`h-14 shrink-0 flex items-center border-b border-slate-100 ${collapsed ? 'px-3 justify-center' : 'px-4 justify-between'}`}
      >
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
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-900 flex items-center justify-center text-white font-bold shadow-xs">
                <span className="text-lg leading-none font-black tracking-tight">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Dockpoint</span>
            </button>
            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Sidebar Nav Links */}
      <div className={`pt-0 pb-4 space-y-6 flex-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        {/* Main Menu Section */}
        <div>
          {!collapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </span>
          )}
          <div className="mt-2 space-y-1">
            {NAV_GROUPS.slice(0, 3).map((group) => {
              const Icon = group.icon;

              if (!group.items) {
                return (
                  <button
                    key={group.id}
                    onClick={() => navigate(group.path!)}
                    title={collapsed ? group.label : undefined}
                    className={`w-full py-2 flex items-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'} ${
                      isItemActive(group.path)
                        ? 'bg-indigo-50/70 text-slate-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${isItemActive(group.path) ? 'text-slate-500' : 'text-slate-400'}`}
                      />
                      {!collapsed && <span>{group.label}</span>}
                    </span>
                    {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                );
              }

              const isOpen = openGroups.includes(group.id);

              return (
                <div key={group.id}>
                  <button
                    onClick={() => (collapsed ? setCollapsed(false) : toggleGroup(group.id))}
                    title={collapsed ? group.label : undefined}
                    aria-expanded={!collapsed ? isOpen : undefined}
                    className={`w-full py-2 flex items-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'} ${
                      group.items.some((item) => isItemActive(item.path))
                        ? 'text-slate-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-500" />
                      {!collapsed && <span>{group.label}</span>}
                    </span>
                    {!collapsed &&
                      (isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      ))}
                  </button>

                  {!collapsed && isOpen && (
                    <div className="ml-4 pl-3 border-l border-slate-100 my-1 space-y-1">
                      {group.items.map((item) => {
                        const isActive = isItemActive(item.path);

                        return (
                          <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                            style={isActive ? { background: 'var(--theme-accent)', color: '#fff' } : undefined}
                            className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer block ${
                              isActive
                                ? 'font-semibold'
                                : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinic Section */}
        <div>
          {!collapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clinic
            </span>
          )}
          <div className="mt-2 space-y-0.5">
            {NAV_GROUPS.slice(3).map((group) => {
              const Icon = group.icon;

              if (!group.items) {
                return (
                  <button
                    key={group.id}
                    onClick={() => navigate(group.path!)}
                    title={collapsed ? group.label : undefined}
                    className={`w-full py-2 flex items-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'} ${
                      isItemActive(group.path)
                        ? 'bg-indigo-50/70 text-slate-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${isItemActive(group.path) ? 'text-slate-500' : 'text-slate-400'}`}
                      />
                      {!collapsed && <span>{group.label}</span>}
                    </span>
                    {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                );
              }

              const isOpen = openGroups.includes(group.id);

              return (
                <div key={group.id}>
                  <button
                    onClick={() => (collapsed ? setCollapsed(false) : toggleGroup(group.id))}
                    title={collapsed ? group.label : undefined}
                    aria-expanded={!collapsed ? isOpen : undefined}
                    className={`w-full py-2 flex items-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-between px-3'} ${
                      group.items.some((item) => isItemActive(item.path))
                        ? 'text-slate-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-500" />
                      {!collapsed && <span>{group.label}</span>}
                    </span>
                    {!collapsed &&
                      (isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      ))}
                  </button>

                  {!collapsed && isOpen && (
                    <div className="ml-4 pl-3 border-l border-slate-100 my-1 space-y-1">
                      {group.items.map((item) => {
                        const isActive = isItemActive(item.path);

                        return (
                          <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            aria-current={isActive ? 'page' : undefined}
                            style={isActive ? { background: 'var(--theme-accent)', color: '#fff' } : undefined}
                            className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer block ${
                              isActive
                                ? 'font-semibold'
                                : 'font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};