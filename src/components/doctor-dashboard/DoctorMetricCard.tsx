import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  Footprints,
  RotateCcw,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { DoctorDashboardMetric } from '../../types';

interface DoctorMetricCardProps {
  metric: DoctorDashboardMetric;
}

const metricIcons: Record<string, LucideIcon> = {
  Users,
  Video,
  CalendarClock,
  ClipboardList,
  Footprints,
  RotateCcw,
};

export const DoctorMetricCard = ({ metric }: DoctorMetricCardProps) => {
  const Icon = metricIcons[metric.icon] ?? Users;
  const ChangeIcon = metric.isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${metric.iconBgColor}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{metric.label}</p>
          <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">
            {metric.value}
          </p>
        </div>
      </div>
      <p className={`mt-3 inline-flex items-center gap-0.5 text-xs font-semibold ${metric.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        <ChangeIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {metric.change}
        <span className="ml-1 font-medium text-slate-400">vs last month</span>
      </p>
    </article>
  );
};
