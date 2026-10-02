import React from 'react';
import type { StatItem } from '../../types';
import { Stethoscope, Users, Calendar, Wallet } from 'lucide-react';

interface StatCardProps {
  stat: StatItem;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const getIcon = () => {
    switch (stat.icon) {
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-indigo-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-rose-600" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      default:
        return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const getIconBg = () => {
    switch (stat.icon) {
      case 'Stethoscope':
        return 'bg-indigo-50 border-indigo-100';
      case 'Users':
        return 'bg-rose-50 border-rose-100';
      case 'Calendar':
        return 'bg-blue-50 border-blue-100';
      case 'Wallet':
        return 'bg-emerald-50 border-emerald-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden">
      {/* Top row: Icon on left, Percentage Badge on right */}
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl border ${getIconBg()}`}>
          {getIcon()}
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
              stat.isPositive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-600 border border-rose-200/60'
            }`}
          >
            {stat.change}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">{stat.timeframe}</p>
        </div>
      </div>

      {/* Main content row: Number & Title on left, Mini Chart visual on right */}
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
        </div>

        {/* Mini SVG Chart Visualization matching image */}
        <div className="w-20 h-10 flex items-end justify-end">
          {stat.chartType === 'bar' ? (
            <div className="flex items-end gap-1.5 h-full">
              <div className="w-2 bg-indigo-200 rounded-t-xs h-3"></div>
              <div className="w-2 bg-indigo-300 rounded-t-xs h-6"></div>
              <div className="w-2 bg-indigo-500 rounded-t-xs h-8"></div>
              <div className="w-2 bg-indigo-800 rounded-t-xs h-10"></div>
              <div className="w-2 bg-indigo-900 rounded-t-xs h-7"></div>
            </div>
          ) : (
            <svg className="w-20 h-9" viewBox="0 0 80 36" fill="none">
              <path
                d={
                  stat.isPositive
                    ? 'M 2 30 Q 20 28, 35 18 T 60 12 T 78 4'
                    : 'M 2 8 Q 20 12, 35 22 T 60 28 T 78 32'
                }
                stroke={stat.chartColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
