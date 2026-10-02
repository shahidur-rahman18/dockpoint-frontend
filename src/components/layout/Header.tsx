import React from 'react';
import { Search, Sparkles, Calendar, Settings, Moon, Bell } from 'lucide-react';

interface HeaderProps {
  background: string;
}

export const Header: React.FC<HeaderProps> = ({ background }) => {
  return (
    <header style={{ background }} className="sticky top-0 z-30 h-14 shrink-0 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-xs">
      {/* Search Input */}
      <div className="relative w-72">
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

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* AI Assistance Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-medium whitespace-nowrap rounded-lg shadow-xs transition-colors cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>AI Assistance</span>
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-1 pl-2 border-l border-slate-200 text-slate-600">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer" title="Calendar">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer" title="Theme">
            <Moon className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer relative" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
        </div>

      </div>
    </header>
  );
};
