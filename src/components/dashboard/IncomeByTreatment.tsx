import React from 'react';
import { ChevronDown } from 'lucide-react';
import { incomeTreatments } from '../../data/mockData';

export const IncomeByTreatment: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Income By Treatment</h2>
        <div className="relative">
          <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Treatments List */}
      <div className="space-y-3.5 divide-y divide-slate-100">
        {incomeTreatments.map((item, index) => (
          <div key={item.id} className={`flex items-center justify-between ${index !== 0 ? 'pt-3.5' : ''}`}>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{item.treatment}</h3>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                {item.appointmentsCount.toLocaleString()} Appointments
              </p>
            </div>
            <span className="text-sm font-extrabold text-slate-900">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
