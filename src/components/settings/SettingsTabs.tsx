import React from 'react';
import type { SettingsTabItem, SettingsTabType } from '../../types/settings';
import { User, Lock, Bell, Link, Shield } from 'lucide-react';

interface SettingsTabsProps {
  tabs: SettingsTabItem[];
  activeTab: SettingsTabType;
  onTabChange: (tab: SettingsTabType) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'User': return <User className="w-4 h-4" />;
      case 'Lock':
      case 'Key': return <Lock className="w-4 h-4" />;
      case 'Bell': return <Bell className="w-4 h-4" />;
      case 'Link': return <Link className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm space-y-1">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Account Settings
      </div>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
              {getIcon(tab.iconName)}
            </span>
            <div className="flex-1">
              <div>{tab.label}</div>
            </div>
            {isActive && <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>}
          </button>
        );
      })}
    </div>
  );
};
