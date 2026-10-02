import React from 'react';
import { recentAppointments } from '../../data/mockData';
import { ChevronDown, Calendar } from 'lucide-react';

export const AppointmentsList: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Appointments</h2>
          <div className="relative">
            <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>All Type</option>
              <option>General Visit</option>
              <option>Emergency</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="space-y-3">
          {recentAppointments.map((apt, index) => (
            <div
              key={apt.id}
              data-appointment-index={index}
              className={`p-4 rounded-xl border transition-all ${
                index === 1
                  ? 'bg-rose-50/30 border-rose-100'
                  : 'bg-slate-50/50 border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{apt.type}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>
                      {apt.date}, {apt.time}
                    </span>
                  </div>
                </div>

                {/* Patient / Doctor Avatars */}
                <div className="flex -space-x-1.5 overflow-hidden">
                  {apt.avatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="User avatar"
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Button */}
      <button className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl transition-colors mt-4 cursor-pointer">
        View All Appointments
      </button>
    </div>
  );
};
