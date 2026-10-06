import {
  CalendarDays,
  Video,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { DoctorDashboardStat } from '../../types';

interface DoctorStatCardProps {
  stat: DoctorDashboardStat;
}

const statIcons: Record<string, LucideIcon> = {
  Calendar: CalendarDays,
  Video,
  XCircle,
};

export const DoctorStatCard = ({ stat }: DoctorStatCardProps) => {
  const Icon = statIcons[stat.icon] ?? CalendarDays;
  const maxValue = Math.max(...stat.miniChartData, 1);

  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
      <div className="min-w-0">
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ color: stat.chartColor, backgroundColor: `${stat.chartColor}15` }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-500">
          {stat.title}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {stat.value}
        </p>
        <p className={`mt-2 text-xs font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {stat.change}
          <span className="ml-1 font-medium text-slate-400">vs last month</span>
        </p>
      </div>

      <div
        className="flex h-16 shrink-0 items-end gap-1.5"
        role="img"
        aria-label={`${stat.title} trend`}
      >
        {stat.miniChartData.map((value, index) => (
          <span
            key={`${stat.id}-${index}`}
            className="w-2 rounded-t-sm"
            style={{
              height: `${Math.max((value / maxValue) * 100, 8)}%`,
              backgroundColor: stat.chartColor,
              opacity: 0.35 + (index / Math.max(stat.miniChartData.length - 1, 1)) * 0.65,
            }}
          />
        ))}
      </div>
    </article>
  );
};
