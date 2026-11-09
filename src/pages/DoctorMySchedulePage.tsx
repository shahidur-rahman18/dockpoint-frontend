import { useEffect, useState, type FormEvent } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../components/common/Card';
import { LoaderOne } from '../components/common/LoaderOne';
import {
  useDoctorSchedule,
  useUpdateDoctorSchedule,
} from '../hooks/useDoctorSchedule';
import {
  getDoctorScheduleErrorMessage,
  scheduleDays,
  type DoctorSchedule,
  type DoctorScheduleSlot,
  type ScheduleDay,
} from '../services/doctorScheduleService';

const days: { key: ScheduleDay; label: string }[] = [
  { key: 'MONDAY', label: 'Monday' },
  { key: 'TUESDAY', label: 'Tuesday' },
  { key: 'WEDNESDAY', label: 'Wednesday' },
  { key: 'THURSDAY', label: 'Thursday' },
  { key: 'FRIDAY', label: 'Friday' },
  { key: 'SATURDAY', label: 'Saturday' },
  { key: 'SUNDAY', label: 'Sunday' },
];

interface ScheduleFormState {
  effectiveFrom: string;
  effectiveUntil: string;
  weeklySchedule: Record<ScheduleDay, DoctorScheduleSlot[]>;
}

const emptyWeeklySchedule = (): Record<ScheduleDay, DoctorScheduleSlot[]> =>
  Object.fromEntries(scheduleDays.map((day) => [day, []])) as Record<
    ScheduleDay,
    DoctorScheduleSlot[]
  >;

const scheduleToForm = (schedule: DoctorSchedule): ScheduleFormState => ({
  effectiveFrom: schedule.effective_from ?? '',
  effectiveUntil: schedule.effective_until ?? '',
  weeklySchedule: schedule.weekly_schedule,
});

const fieldClass =
  'h-9 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

export function DoctorMySchedulePage() {
  const scheduleQuery = useDoctorSchedule();
  const updateSchedule = useUpdateDoctorSchedule();
  const [form, setForm] = useState<ScheduleFormState | null>(null);
  const [selectedDay, setSelectedDay] = useState<ScheduleDay>('MONDAY');
  const [formError, setFormError] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    if (scheduleQuery.data && form === null) {
      setForm(scheduleToForm(scheduleQuery.data));
    }
  }, [form, scheduleQuery.data]);

  const updateDaySlots = (
    day: ScheduleDay,
    update: (slots: DoctorScheduleSlot[]) => DoctorScheduleSlot[],
  ) => {
    updateSchedule.reset();
    setForm((current) =>
      current
        ? {
            ...current,
            weeklySchedule: {
              ...current.weeklySchedule,
              [day]: update(current.weeklySchedule[day]),
            },
          }
        : current,
    );
    setFormError('');
  };

  const updateSlot = (
    index: number,
    key: keyof DoctorScheduleSlot,
    value: string,
  ) => {
    updateDaySlots(selectedDay, (slots) =>
      slots.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot,
      ),
    );
  };

  const addSlot = () => {
    updateDaySlots(selectedDay, (slots) => [...slots, { start: '', end: '' }]);
  };

  const removeSlot = (index: number) => {
    updateDaySlots(selectedDay, (slots) =>
      slots.filter((_, slotIndex) => slotIndex !== index),
    );
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;

    const weeklySchedule = emptyWeeklySchedule();
    for (const day of scheduleDays) {
      const slots = form.weeklySchedule[day];
      const incompleteSlot = slots.some(
        (slot) => Boolean(slot.start) !== Boolean(slot.end),
      );
      if (incompleteSlot) {
        setSelectedDay(day);
        setFormError(`Enter both start and end times for every ${day.toLowerCase()} slot.`);
        return;
      }

      weeklySchedule[day] = slots.filter((slot) => slot.start && slot.end);
    }

    setFormError('');
    updateSchedule.mutate(
      {
        effective_from: form.effectiveFrom,
        effective_until: form.effectiveUntil || null,
        timezone: scheduleQuery.data?.timezone ?? 'Asia/Dhaka',
        weekly_schedule: weeklySchedule,
      },
      {
        onSuccess: (savedSchedule) => {
          setForm(scheduleToForm(savedSchedule));
          toast.success('Your schedule has been saved.', { position: 'top-right' });
        },
        onError: (error) => {
          toast.error(getDoctorScheduleErrorMessage(error), { position: 'top-right' });
        },
      },
    );
  };

  const handleCancel = () => {
    if (!scheduleQuery.data) return;
    updateSchedule.reset();
    setForm(scheduleToForm(scheduleQuery.data));
    setSelectedDay('MONDAY');
    setFormError('');
  };

  const handleExport = () => {
    if (!form) return;
    const rows = [
      ['Day', 'Effective from', 'Effective until', 'Start time', 'End time'],
      ...days.flatMap(({ key, label }) => {
        const slots = form.weeklySchedule[key];
        return (slots.length ? slots : [{ start: '', end: '' }]).map((slot) => [
          label,
          form.effectiveFrom,
          form.effectiveUntil,
          slot.start,
          slot.end,
        ]);
      }),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-schedule.csv';
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  if (scheduleQuery.isPending || !form) {
    if (scheduleQuery.isError) {
      return (
        <div className="mx-auto w-full max-w-[920px] px-3 sm:px-5 lg:px-0">
          <Card className="space-y-3 rounded-md p-4 sm:p-5">
            <h1 className="text-lg font-bold text-slate-900">My Schedule</h1>
            <p role="alert" className="text-sm text-rose-600">
              {getDoctorScheduleErrorMessage(scheduleQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => void scheduleQuery.refetch()}
              className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Try again
            </button>
          </Card>
        </div>
      );
    }

    return (
      <div className="mx-auto flex min-h-[40vh] w-full max-w-[920px] flex-col items-center justify-center gap-3 px-3 py-12 text-center sm:px-5" role="status">
        <LoaderOne />
        <p className="text-sm text-slate-500">Loading your schedule…</p>
      </div>
    );
  }

  return (
    <div className="my-schedule-page -mt-0.5 mx-auto w-full min-w-0 max-w-[920px] space-y-3 px-3 py-0 sm:space-y-4 sm:px-5 lg:px-0">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold tracking-tight text-slate-900">My Schedule</h1>
        <details
          className="schedule-export-control group relative"
          open={exportOpen}
          onToggle={(event) => setExportOpen(event.currentTarget.open)}
        >
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-center gap-2 self-end rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:min-h-8">
            Export <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="schedule-export-menu absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={() => {
                window.print();
                setExportOpen(false);
              }}
              className="w-full cursor-pointer px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              Download as PDF
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="w-full cursor-pointer px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
            >
              Download as Excel (.csv)
            </button>
          </div>
        </details>
      </header>

      <form onSubmit={handleSave} className="space-y-5 sm:space-y-8">
        <Card className="schedule-card min-w-0 rounded-md p-3 sm:p-4 lg:p-[18px]">
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Schedule validity</h2>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              <label className="flex flex-col gap-2 text-xs font-medium text-slate-700">
                Effective from
                <input
                  type="date"
                  required
                  value={form.effectiveFrom}
                  onChange={(event) => {
                    updateSchedule.reset();
                    setFormError('');
                    setForm((current) =>
                      current ? { ...current, effectiveFrom: event.target.value } : current,
                    );
                  }}
                  className={fieldClass}
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-medium text-slate-700">
                Effective until (optional)
                <input
                  type="date"
                  min={form.effectiveFrom || undefined}
                  value={form.effectiveUntil}
                  onChange={(event) => {
                    updateSchedule.reset();
                    setFormError('');
                    setForm((current) =>
                      current ? { ...current, effectiveUntil: event.target.value } : current,
                    );
                  }}
                  className={fieldClass}
                />
              </label>
              <p className="self-end pb-2 text-xs text-slate-500">
                Repeats every week · {scheduleQuery.data.timezone}
              </p>
            </div>
          </section>

          <section className="mt-4 space-y-3 border-t border-slate-200 pt-4">
            <h2 className="text-sm font-bold text-slate-900">Weekly availability</h2>
            <div className="flex min-w-0 touch-pan-x gap-1 overflow-x-auto pb-2">
              {days.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(key)}
                  aria-pressed={selectedDay === key}
                  style={selectedDay === key ? { backgroundColor: 'var(--theme-accent)' } : undefined}
                  className={`shrink-0 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                    selectedDay === key
                      ? 'text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <span className="text-xs font-medium text-slate-700">Start time</span>
              <span className="text-xs font-medium text-slate-700">End time</span>
              <span className="hidden sm:block" aria-hidden="true" />
              {form.weeklySchedule[selectedDay].map((slot, index) => (
                <div
                  key={`${selectedDay}-${index}`}
                  className="col-span-full grid min-w-0 items-end gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <label className="relative">
                    <span className="sr-only">Start time</span>
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(event) => updateSlot(index, 'start', event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="relative">
                    <span className="sr-only">End time</span>
                    <input
                      type="time"
                      min={slot.start || undefined}
                      value={slot.end}
                      onChange={(event) => updateSlot(index, 'end', event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <div className="schedule-row-controls flex justify-end gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={addSlot}
                      aria-label={`Add ${days.find((day) => day.key === selectedDay)?.label} availability slot`}
                      className="grid h-9 w-9 cursor-pointer place-items-center rounded-md bg-slate-100 text-slate-800 hover:bg-slate-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      aria-label={`Remove ${days.find((day) => day.key === selectedDay)?.label} availability slot`}
                      className="grid h-9 w-9 cursor-pointer place-items-center rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {form.weeklySchedule[selectedDay].length === 0 && (
                <p className="col-span-full py-2 text-xs text-slate-500">
                  No availability added for {days.find((day) => day.key === selectedDay)?.label}.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={addSlot}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" /> Add availability
            </button>
          </section>
        </Card>

        <footer className="schedule-page-actions flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <p aria-live="polite" role={formError ? 'alert' : undefined} className="text-xs text-rose-600">
            {formError}
          </p>
          <div className="flex w-full justify-end gap-2 sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updateSchedule.isPending}
              className="min-h-10 flex-1 cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-9 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateSchedule.isPending}
              style={{ backgroundColor: 'var(--theme-accent)' }}
              className="min-h-10 flex-1 cursor-pointer rounded-md px-4 py-2 text-xs font-semibold text-white hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-9 sm:flex-none"
            >
              {updateSchedule.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
