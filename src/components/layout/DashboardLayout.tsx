import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Floating Settings Button on Right Edge */}
      <button className="fixed right-0 top-1/2 -translate-y-1/2 bg-indigo-800 hover:bg-indigo-900 text-white p-2.5 rounded-l-xl shadow-lg transition-all cursor-pointer z-40">
        <Settings className="w-5 h-5 animate-spin-slow" />
      </button>
    </div>
  );
};
