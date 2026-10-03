import React from 'react';
import { topPatientsData } from '../../data/mockData';

export const TopPatients: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Top 5 Patients</h2>
        <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Patient List */}
      <div className="space-y-3.5">
        {topPatientsData.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-slate-800 truncate">{patient.name}</h3>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{patient.totalPaid}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-semibold rounded-lg shrink-0">
              {patient.appointmentsCount} Appointments
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
