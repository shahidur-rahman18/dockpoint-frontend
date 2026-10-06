import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { getNavGroups, isDoctorDashboardPath } from './menuConfig';
import { UpgradeProCard } from '../doctor-dashboard/UpgradeProCard';

interface SidebarProps {
  background: string;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ background, mobileOpen = false, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navGroups = getNavGroups(location.pathname);
  const [openGroups, setOpenGroups] = useState<string[]>(
    navGroups.filter((group) => group.defaultOpen).map((group) => group.id),
  );

  useEffect(() => {
    const activeExpandableGroups = navGroups
      .filter((group) => group.items?.some((item) => isItemActive(item.path)))
      .map((group) => group.id);

    if (activeExpandableGroups.length > 0) {
      setOpenGroups((current) => [...new Set([...current, ...activeExpandableGroups])]);
    }
  }, [location.pathname]);

  const isItemActive = (path?: string) => {
    if (!path) return false;
    if (path === '/' || path === '/doctor-dashboard') return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((groupId) => groupId !== id) : [...prev, id],
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        style={{ background }}
        className={`fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 h-screen overflow-y-auto select-none shrink-0 transition-[width,translate] duration-300 ease-in-out motion-reduce:transition-none ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } w-64 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } bg-white border-r border-slate-200 flex flex-col`}
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
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer hidden lg:block"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close sidebar"
                  title="Close sidebar"
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>

      {/* Sidebar Nav Links */}
      <div className={`pt-0 pb-4 space-y-6 flex-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        {(['Main Menu', 'Clinic', 'Settings'] as const).map((section) => (
          <div key={section}>
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section}
              </span>
            )}
            <div className={`${section === 'Settings' ? 'mt-2 border-t border-slate-100 pt-3' : 'mt-2'} space-y-1`}>
              {navGroups.filter((group) => group.section === section).map((group) => {
                const Icon = group.icon;

                if (!group.items) {
                  return (
                    <button
                      key={group.id}
                      onClick={() => group.path && navigate(group.path)}
                      title={collapsed ? group.label : undefined}
                      aria-current={isItemActive(group.path) ? 'page' : undefined}
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
        ))}
      </div>
      {isDoctorDashboardPath(location.pathname) && !collapsed && <UpgradeProCard />}
    </aside>
    </>
  );
};