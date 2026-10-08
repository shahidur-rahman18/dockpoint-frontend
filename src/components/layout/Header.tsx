import React from 'react';
import {
  Search,
  Sparkles,
  Calendar,
  Settings,
  Moon,
  Sun,
  Bell,
  Menu,
  UserRound,
  Shield,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { isDoctorDashboardPath } from './menuConfig';
import { ProfileDropdown, type ProfileDropdownItem } from '../common/ProfileDropdown';
import { useAuth } from '../../auth/AuthContext';

interface HeaderProps {
  background: string;
  colorMode: 'light' | 'dark';
  onToggleColorMode: () => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ background, colorMode, onToggleColorMode, onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, role, logout } = useAuth();
  const isDoctorDashboard = isDoctorDashboardPath(location.pathname);
  const settingsPath = isDoctorDashboard
    ? '/doctor-dashboard/settings'
    : '/settings';
  const profileMenuItems: ProfileDropdownItem[] = [
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: <UserRound className="h-4 w-4 text-slate-400" />,
      onClick: () => navigate(`${settingsPath}/profile`),
    },
    {
      id: 'account',
      label: 'Account Settings',
      icon: <Shield className="h-4 w-4 text-slate-400" />,
      onClick: () => navigate(
        isDoctorDashboard
          ? `${settingsPath}/password`
          : `${settingsPath}/security`,
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-4 w-4 text-slate-400" />,
      onClick: () => navigate(`${settingsPath}/notifications`),
    },
  ];

  return (
    <header style={{ background }} className="sticky top-0 z-30 h-14 shrink-0 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left Side: Hamburger (Mobile) & Search (Desktop) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          title="Open menu"
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-72 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 text-slate-700 placeholder-slate-400 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Assistance Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-medium whitespace-nowrap rounded-lg shadow-xs transition-colors cursor-pointer hidden md:flex">
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>AI Assistance</span>
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-200 text-slate-600">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer hidden sm:block" title="Calendar">
            <Calendar className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(
              isDoctorDashboard
                ? '/doctor-dashboard/settings/profile'
                : '/settings/profile',
            )}
            aria-label="Settings"
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer hidden sm:block"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleColorMode}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            title={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {colorMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer relative" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
        </div>

        {/* User Profile Menu */}
        <div className="flex items-center pl-2 border-l border-slate-200">
          <ProfileDropdown
            name={doctor?.name ?? 'Administrator'}
            role={role === 'admin' ? 'Admin' : 'Doctor'}
            avatarUrl={doctor?.avatar ?? ''}
            items={profileMenuItems}
            onLogout={() => {
              logout();
              navigate(role === 'admin' ? '/admin/sign-in' : '/doctor/sign-in', {
                replace: true,
              });
            }}
          />
        </div>

      </div>
    </header>
  );
};
