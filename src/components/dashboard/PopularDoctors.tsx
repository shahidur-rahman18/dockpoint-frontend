import React from 'react';
import { popularDoctors } from '../../data/mockData';
import { ChevronDown, Star } from 'lucide-react';

export const PopularDoctors: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Popular Doctors</h2>
        <div className="relative">
          <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Doctor Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {popularDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200/80 transition-all flex items-center gap-3.5 cursor-pointer group"
          >
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-slate-800 truncate">{doctor.name}</h3>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">{doctor.specialty}</p>

              {doctor.rating && (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-500 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating}</span>
                  <span className="text-slate-400 font-normal">({doctor.reviewsCount})</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
