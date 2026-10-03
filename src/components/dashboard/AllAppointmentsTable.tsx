import React from 'react';
import { allAppointmentsData } from '../../data/mockData';

export const AllAppointmentsTable: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">All Appointments</h2>
        <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
              <th className="py-3 px-4 font-semibold">Doctor</th>
              <th className="py-3 px-4 font-semibold">Patient</th>
              <th className="py-3 px-4 font-semibold">Date & Time</th>
              <th className="py-3 px-4 font-semibold">Mode</th>
              <th className="py-3 px-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {allAppointmentsData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Doctor */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.doctor.avatar}
                      alt={item.doctor.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-800">{item.doctor.name}</div>
                      <div className="text-[11px] font-medium text-slate-400 mt-0.5">{item.doctor.specialty}</div>
                    </div>
                  </div>
                </td>

                {/* Patient */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.patient.avatar}
                      alt={item.patient.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-800">{item.patient.name}</div>
                      <div className="text-[11px] font-medium text-slate-400 mt-0.5">{item.patient.phone}</div>
                    </div>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="py-3.5 px-4 font-medium text-slate-600">
                  {item.dateTime}
                </td>

                {/* Mode */}
                <td className="py-3.5 px-4 font-medium text-slate-600">
                  {item.mode}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-right">
                  {item.status === 'Confirmed' && (
                    <span className="inline-block px-3 py-1 rounded-md text-emerald-600 bg-emerald-50 border border-emerald-200/60 font-semibold text-[11px]">
                      Confirmed
                    </span>
                  )}
                  {item.status === 'Cancelled' && (
                    <span className="inline-block px-3 py-1 rounded-md text-rose-600 bg-rose-50 border border-rose-200/60 font-semibold text-[11px]">
                      Cancelled
                    </span>
                  )}
                  {item.status === 'Checked Out' && (
                    <span className="inline-block px-3 py-1 rounded-md text-cyan-600 bg-cyan-50 border border-cyan-200/60 font-semibold text-[11px]">
                      Checked Out
                    </span>
                  )}
                  {item.status === 'Schedule' && (
                    <span className="inline-block px-3 py-1 rounded-md text-blue-600 bg-blue-50 border border-blue-200/60 font-semibold text-[11px]">
                      Schedule
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
