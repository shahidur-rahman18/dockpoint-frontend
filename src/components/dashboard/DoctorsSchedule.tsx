import React from 'react';
import { scheduleDoctors, doctorScheduleSummary } from '../../data/mockData';

export const DoctorsSchedule: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Doctors Schedule</h2>
        <button className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 py-1 text-center border-y border-slate-100">
        <div className="py-1">
          <div className="text-[11px] font-medium text-slate-400">Available</div>
          <div className="text-base font-bold text-slate-800 mt-0.5">{doctorScheduleSummary.available}</div>
        </div>
        <div className="py-1 border-x border-slate-100">
          <div className="text-[11px] font-medium text-slate-400">Unavailable</div>
          <div className="text-base font-bold text-slate-800 mt-0.5">{doctorScheduleSummary.unavailable}</div>
        </div>
        <div className="py-1">
          <div className="text-[11px] font-medium text-slate-400">Leave</div>
          <div className="text-base font-bold text-slate-800 mt-0.5">{doctorScheduleSummary.leave}</div>
        </div>
      </div>

      {/* Doctor List */}
      <div className="space-y-3">
        {scheduleDoctors.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={doc.avatar}
                alt={doc.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-800 truncate">{doc.name}</h3>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{doc.specialty}</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white text-[11px] font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
