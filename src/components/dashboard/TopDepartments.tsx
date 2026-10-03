import React from 'react';
import { ChevronDown } from 'lucide-react';
import { departmentStats } from '../../data/mockData';

export const TopDepartments: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Top 3 Departments</h2>
        <div className="relative">
          <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Donut Chart Visual with Entrance Animation */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <div
          className="chart-scale-enter w-48 h-48 rounded-full relative flex items-center justify-center p-4 shadow-inner"
          style={{
            background: 'conic-gradient(#60a5fa 0deg 180deg, #9333ea 180deg 280deg, #4f46e5 280deg 360deg)'
          }}
        >
          <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-xs">
            <span className="text-xs font-medium text-slate-400">Total Patient</span>
            <span className="text-xl font-extrabold text-slate-800 mt-0.5">638</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {departmentStats.map((dept) => (
          <div key={dept.name} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${dept.color}`}></span>
            <span className="text-xs font-bold text-slate-800">{dept.count}</span>
            <span className="text-xs text-slate-500">{dept.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
