import React from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { leaveRequestsData } from '../../data/mockData';

export const LeaveRequests: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Leave Requests</h2>
        <div className="relative">
          <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-3">
        {leaveRequestsData.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={req.avatar}
                alt={req.doctorName}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-800 truncate">{req.doctorName}</h3>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{req.duration}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button aria-label="Reject leave request" className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
              <button aria-label="Approve leave request" className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors cursor-pointer">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
