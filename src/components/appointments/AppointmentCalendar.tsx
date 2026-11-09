import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction';
import type { CalendarApi, EventClickArg, EventInput } from '@fullcalendar/core';
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDoctors } from '../../hooks/useDoctors';
import { getSampleAppointments } from '../../services/appointmentCalendarService';
import {
  AppointmentDetailsDialog,
  NewAppointmentDialog,
  type AppointmentDetails,
  type AppointmentDraft,
} from './AppointmentDialogs';

const localDateValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const formatRangeDate = (date: Date) =>
  new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: '2-digit' }).format(date);

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

export const AppointmentCalendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: doctors = [], error, isError, isPending, refetch } = useDoctors();
  const selectedDoctorId = searchParams.get('doctorId') ?? '';
  const [calendarTitle, setCalendarTitle] = useState('');
  const [view, setView] = useState('dayGridMonth');
  const [rangeStart, setRangeStart] = useState(() => startOfMonth(new Date()));
  const [rangeEnd, setRangeEnd] = useState<Date | null>(
    () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );
  const [pickerMonth, setPickerMonth] = useState(() => startOfMonth(new Date()));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [appointments, setAppointments] = useState<EventInput[]>([]);
  const [activeAppointment, setActiveAppointment] = useState<AppointmentDetails | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState<AppointmentDraft>({
    patientName: '',
    doctorId: selectedDoctorId,
    date: localDateValue(new Date()),
    time: '09:00',
    mode: 'In-person',
  });

  useEffect(() => {
    if (!isDatePickerOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !datePickerRef.current?.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isDatePickerOpen]);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId);
  const baseAppointments = useMemo(() => getSampleAppointments(doctors), [doctors]);
  const activeRangeEnd = rangeEnd ?? rangeStart;
  const visibleAppointments = useMemo(
    () =>
      [...baseAppointments, ...appointments].filter((appointment) => {
        const appointmentDate = appointment.start
          ? new Date(appointment.start as string | Date)
          : null;
        const matchesDoctor =
          !selectedDoctorId || appointment.extendedProps?.doctorId === selectedDoctorId;
        const matchesStatus =
          statusFilter === 'all' ||
          String(appointment.extendedProps?.status).toLowerCase() === statusFilter;
        const matchesDateRange =
          appointmentDate !== null &&
          appointmentDate >= new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()) &&
          appointmentDate <
            new Date(activeRangeEnd.getFullYear(), activeRangeEnd.getMonth(), activeRangeEnd.getDate() + 1);
        return matchesDoctor && matchesStatus && matchesDateRange;
      }),
    [activeRangeEnd, appointments, baseAppointments, rangeStart, selectedDoctorId, statusFilter],
  );

  const getCalendar = (): CalendarApi | undefined => calendarRef.current?.getApi();

  const handleViewChange = (nextView: string) => {
    getCalendar()?.changeView(nextView);
    setView(nextView);
  };

  const handleRangeDateClick = (date: Date) => {
    if (rangeStart && !rangeEnd) {
      const start = date < rangeStart ? date : rangeStart;
      const end = date < rangeStart ? rangeStart : date;
      setRangeStart(start);
      setRangeEnd(end);
      getCalendar()?.gotoDate(start);
      setPickerMonth(startOfMonth(start));
      setIsDatePickerOpen(false);
      return;
    }

    setRangeStart(date);
    setRangeEnd(null);
    setPickerMonth(startOfMonth(date));
  };

  const pickerDays = useMemo(() => {
    const firstDay = startOfMonth(pickerMonth);
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [pickerMonth]);

  const handleDateClick = ({ date }: DateClickArg) => {
    setRangeStart(date);
    setRangeEnd(date);
    setDraft((current) => ({
      ...current,
      doctorId: selectedDoctorId || doctors[0]?.id || '',
      date: localDateValue(date),
    }));
    setIsCreateOpen(true);
  };

  const handleEventClick = ({ event }: EventClickArg) => {
    setActiveAppointment({
      patientName: String(event.extendedProps.patientName ?? event.title),
      doctorName: String(event.extendedProps.doctorName ?? 'Unassigned'),
      specialty: String(event.extendedProps.specialty ?? ''),
      start: event.start,
      status: String(event.extendedProps.status ?? 'Scheduled'),
      mode: String(event.extendedProps.mode ?? 'In-person'),
    });
  };

  const handleExport = () => {
    const rows = [
      ['Patient', 'Doctor', 'Specialty', 'Date', 'Status', 'Mode'],
      ...visibleAppointments.map((appointment) => [
        String(appointment.extendedProps?.patientName ?? appointment.title ?? ''),
        String(appointment.extendedProps?.doctorName ?? ''),
        String(appointment.extendedProps?.specialty ?? ''),
        String(appointment.start ?? ''),
        String(appointment.extendedProps?.status ?? ''),
        String(appointment.extendedProps?.mode ?? ''),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'appointments.csv';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleCreateAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const doctor = doctors.find((item) => item.id === draft.doctorId);
    if (!doctor) return;

    const start = `${draft.date}T${draft.time}:00`;
    const startDate = new Date(start);
    startDate.setMinutes(startDate.getMinutes() + 30);
    const end = `${localDateValue(startDate)}T${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:00`;
    const newAppointment: EventInput = {
      id: `demo-appointment-${Date.now()}`,
      title: draft.patientName.trim(),
      start,
      end,
      backgroundColor: '#fef3c7',
      borderColor: '#fef3c7',
      textColor: '#92400e',
      classNames: ['appointment-status-pending'],
      extendedProps: {
        patientName: draft.patientName.trim(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.department,
        status: 'Pending',
        mode: draft.mode,
      },
    };

    setAppointments((current) => [...current, newAppointment]);
    setIsCreateOpen(false);
    setDraft((current) => ({ ...current, patientName: '' }));
  };

  if (isPending) {
    return (
      <div className="flex min-h-72 items-center justify-center text-sm font-medium text-slate-500">
        Loading doctors and appointment calendar…
      </div>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-white p-8 text-center">
        <h1 className="text-lg font-bold text-slate-900">Unable to load appointments</h1>
        <p className="mt-2 text-sm text-slate-500">
          {error instanceof Error ? error.message : 'Please try again.'}
        </p>
        <button type="button" onClick={() => void refetch()} className={`${buttonClass} mt-5`}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="appointment-page space-y-5">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard/doctors')}
            aria-label="Back to doctors"
            className="mt-0.5 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-700"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Appointment Calendar</h1>
            <p className="mt-1 text-xs text-slate-500">
              {selectedDoctor
                ? `Appointments for ${selectedDoctor.name}`
                : 'View and manage doctor appointments'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button type="button" onClick={handleExport} className={buttonClass}>
            <Download className="size-3.5" />
            Export
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft((current) => ({
                ...current,
                doctorId: selectedDoctorId || doctors[0]?.id || '',
                date: localDateValue(new Date()),
              }));
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-800 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="size-3.5" />
            New Appointment
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs text-blue-900 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Demo calendar data: appointments are sample records. New entries are temporary and are not saved to the server.
        </span>
        <span className="shrink-0 font-semibold">{visibleAppointments.length} appointments shown</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          Doctor
          <select
            value={selectedDoctorId}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) next.set('doctorId', event.target.value);
              else next.delete('doctorId');
              setSearchParams(next);
            }}
            className="min-w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <div className="appointment-calendar rounded-xl border border-slate-200 bg-white p-3 shadow-2xs sm:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <div ref={datePickerRef} className="relative">
              <button
                type="button"
                aria-label="Choose appointment date range"
                aria-expanded={isDatePickerOpen}
                onClick={() => {
                  setPickerMonth(startOfMonth(rangeStart));
                  setIsDatePickerOpen((open) => !open);
                }}
                className={buttonClass}
              >
                <CalendarDays className="size-3.5" />
                {rangeEnd
                  ? `${formatRangeDate(rangeStart)} – ${formatRangeDate(rangeEnd)}`
                  : `${formatRangeDate(rangeStart)} – Select end`}
              </button>
              {isDatePickerOpen && (
                <div
                  className="absolute left-0 top-full z-30 mt-1 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
                  role="dialog"
                  aria-label="Choose date range"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() =>
                        setPickerMonth(
                          (month) => new Date(month.getFullYear(), month.getMonth() - 1, 1),
                        )
                      }
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="text-sm font-semibold text-slate-700">
                      {new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(pickerMonth)}
                    </span>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setPickerMonth(
                          (month) => new Date(month.getFullYear(), month.getMonth() + 1, 1),
                        )
                      }
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-500">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <span key={day} className="py-1">{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {pickerDays.map((date) => {
                      const dateValue = localDateValue(date);
                      const isStart = dateValue === localDateValue(rangeStart);
                      const isEnd = rangeEnd !== null && dateValue === localDateValue(rangeEnd);
                      const isInRange =
                        rangeEnd !== null && date > rangeStart && date < rangeEnd;
                      const isCurrentMonth = date.getMonth() === pickerMonth.getMonth();

                      return (
                        <button
                          key={dateValue}
                          type="button"
                          aria-label={new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(date)}
                          aria-pressed={isStart || isEnd}
                          onClick={() => handleRangeDateClick(date)}
                          className={`h-9 text-xs transition ${
                            isStart || isEnd
                              ? 'rounded-full bg-indigo-800 font-semibold text-white'
                              : isInRange
                                ? 'bg-indigo-50 text-indigo-800'
                                : isCurrentMonth
                                  ? 'text-slate-700 hover:bg-slate-100'
                                  : 'text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    {!rangeEnd ? 'Select an end date' : 'Select a date to start a new range'}
                  </p>
                </div>
              )}
            </div>
            <button type="button" onClick={() => getCalendar()?.prev()} aria-label="Previous date range" className={buttonClass}>
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => getCalendar()?.today()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-800 bg-indigo-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Today
            </button>
            <button type="button" onClick={() => getCalendar()?.next()} aria-label="Next date range" className={buttonClass}>
              <ChevronRight className="size-4" />
            </button>
          </div>
          <h2 className="text-center text-sm font-bold uppercase tracking-wide text-slate-800">{calendarTitle}</h2>
          <div className="flex items-center justify-center gap-1">
            {[
              ['dayGridMonth', 'Month'],
              ['timeGridWeek', 'Week'],
              ['timeGridDay', 'Day'],
              ['listWeek', 'List'],
            ].map(([calendarView, label]) => (
              <button
                key={calendarView}
                type="button"
                aria-pressed={view === calendarView}
                onClick={() => handleViewChange(calendarView)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  view === calendarView
                    ? 'border-indigo-800 bg-indigo-800 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {selectedDoctorId && !selectedDoctor ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            The selected doctor could not be found. Choose another doctor or select All doctors.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              height="auto"
              dayMaxEvents
              events={visibleAppointments}
              dayCellClassNames={({ date }) => {
                const dateValue = localDateValue(date);
                const isSelected =
                  dateValue >= localDateValue(rangeStart) &&
                  dateValue <= localDateValue(activeRangeEnd);
                return isSelected ? ['appointment-date-range'] : [];
              }}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              datesSet={({ view: currentView }) => {
                setCalendarTitle(currentView.title);
                setView(currentView.type);
              }}
              eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
              eventDisplay="block"
            />
          </div>
        )}
      </div>

      {activeAppointment && (
        <AppointmentDetailsDialog
          appointment={activeAppointment}
          onClose={() => setActiveAppointment(null)}
        />
      )}
      {isCreateOpen && (
        <NewAppointmentDialog
          draft={draft}
          doctors={doctors}
          onDraftChange={setDraft}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateAppointment}
        />
      )}
    </section>
  );
};
