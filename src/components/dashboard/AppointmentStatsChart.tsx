import React from 'react';
import { appointmentSummaries, monthlyData } from '../../data/mockData';
import { ChevronDown } from 'lucide-react';

export const AppointmentStatsChart: React.FC = () => {
  // Find max value to normalize bar heights
  const maxTotal = Math.max(
    ...monthlyData.map((d) => d.completed + d.ongoing + d.rescheduled)
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Appointment Statistics</h2>
        <div className="relative">
          <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 4 Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {appointmentSummaries.map((summary) => (
          <div
            key={summary.label}
            className={`${summary.bgColor} p-3.5 rounded-xl border border-slate-200/60 text-center flex flex-col justify-center`}
          >
            <span className="text-xs font-medium text-slate-500">{summary.label}</span>
            <span className={`text-xl font-bold ${summary.color} mt-1`}>
              {summary.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Bar Chart Area */}
      <div className="pt-2">
        <div className="h-56 flex items-end justify-between gap-2.5 sm:gap-4 px-2 pb-6 border-b border-slate-100 relative">
          {/* Y-Axis guide lines */}
          <div className="absolute inset-x-0 top-0 border-b border-slate-100 text-[10px] text-slate-300 pl-1">5K</div>
          <div className="absolute inset-x-0 top-1/4 border-b border-slate-100 text-[10px] text-slate-300 pl-1">4K</div>
          <div className="absolute inset-x-0 top-2/4 border-b border-slate-100 text-[10px] text-slate-300 pl-1">2K</div>
          <div className="absolute inset-x-0 top-3/4 border-b border-slate-100 text-[10px] text-slate-300 pl-1">1K</div>
          <div className="absolute inset-x-0 bottom-6 border-b border-slate-200 text-[10px] text-slate-300 pl-1">0K</div>

          {monthlyData.map((item) => {
            const total = item.completed + item.ongoing + item.rescheduled;
            const totalHeightPercent = (total / maxTotal) * 100;

            const completedPercent = (item.completed / total) * 100;
            const ongoingPercent = (item.ongoing / total) * 100;
            const rescheduledPercent = (item.rescheduled / total) * 100;

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end z-10 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none z-20 whitespace-nowrap">
                  {item.month}: {total.toLocaleString()}
                </div>

                {/* Stacked bar */}
                <div
                  className="w-full max-w-[20px] rounded-t-sm overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:opacity-90"
                  style={{ height: `${totalHeightPercent}%` }}
                >
                  {/* Rescheduled bar (Purple) */}
                  <div
                    className="w-full bg-indigo-700"
                    style={{ height: `${rescheduledPercent}%` }}
                  ></div>
                  {/* Ongoing bar (Blue) */}
                  <div
                    className="w-full bg-sky-400"
                    style={{ height: `${ongoingPercent}%` }}
                  ></div>
                  {/* Completed bar (Cyan) */}
                  <div
                    className="w-full bg-teal-400"
                    style={{ height: `${completedPercent}%` }}
                  ></div>
                </div>

                {/* Month Label */}
                <span className="text-[11px] font-medium text-slate-400 mt-2 absolute -bottom-5">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-teal-400"></span>
            <span className="text-xs text-slate-500 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-400"></span>
            <span className="text-xs text-slate-500 font-medium">Ongoing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-700"></span>
            <span className="text-xs text-slate-500 font-medium">Rescheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
