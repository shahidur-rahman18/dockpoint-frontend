import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, Filter, Search, X } from 'lucide-react';
import { ActionDropdown } from '../components/common/ActionDropdown';
import { DataTable } from '../components/common/DataTable';
import { LoaderOne } from '../components/common/LoaderOne';
import { Modal } from '../components/common/Modal';
import { DoctorAvatar } from '../components/doctors/DoctorAvatar';
import { getProfileApiErrorMessage } from '../services/accountService';
import { useDoctorSettingsProfile } from '../hooks/useDoctorSettingsProfile';
import {
  getDoctorAppointments,
  getDoctorAppointmentsErrorMessage,
  type Appointment,
} from '../services/doctorAppointmentService';
import type { components } from '../types/schema';

type AppointmentStatus = components['schemas']['StatusEnum'];
type SortOrder = 'recent' | 'oldest' | 'patient';

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusClasses: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-emerald-50 text-emerald-700',
  COMPLETED: 'bg-blue-50 text-blue-700',
  CANCELLED: 'bg-rose-50 text-rose-700',
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(2000, 0, 1, hours, minutes));
};

const buttonClass =
  'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
const selectClass =
  'min-h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

export function DoctorAppointmentsPage() {
  const profileQuery = useDoctorSettingsProfile();
  const doctorId = profileQuery.data?.doctor.id;
  const appointmentsQuery = useQuery({
    queryKey: ['doctor-appointments', doctorId],
    queryFn: () => {
      if (doctorId === undefined) {
        throw new Error('Doctor profile is not loaded. Please reload and try again.');
      }
      return getDoctorAppointments(doctorId);
    },
    enabled: doctorId !== undefined,
  });

  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);

  const visibleAppointments = useMemo(() => {
    const appointments = appointmentsQuery.data ?? [];
    const normalizedQuery = query.trim().toLowerCase();
    return appointments
      .filter((appointment) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            String(appointment.id),
            String(appointment.patient),
            appointment.patient_email,
            appointment.patient_detail?.first_name ?? '',
            appointment.patient_detail?.last_name ?? '',
            appointment.symptoms_note ?? '',
          ].some((value) => value.toLowerCase().includes(normalizedQuery));
        const matchesDate =
          (!fromDate || appointment.appointment_date >= fromDate) &&
          (!toDate || appointment.appointment_date <= toDate);
        const matchesStatus =
          statusFilter === 'all' || appointment.status === statusFilter;
        return matchesQuery && matchesDate && matchesStatus;
      })
      .sort((left, right) => {
        if (sortOrder === 'patient') {
          const leftName = `${left.patient_detail?.first_name ?? ''} ${left.patient_detail?.last_name ?? ''}`.trim();
          const rightName = `${right.patient_detail?.first_name ?? ''} ${right.patient_detail?.last_name ?? ''}`.trim();
          return (leftName || left.patient_email).localeCompare(rightName || right.patient_email);
        }
        const dateComparison = `${left.appointment_date} ${left.time_slot_start}`.localeCompare(
          `${right.appointment_date} ${right.time_slot_start}`,
        );
        return sortOrder === 'recent' ? -dateComparison : dateComparison;
      });
  }, [appointmentsQuery.data, fromDate, query, sortOrder, statusFilter, toDate]);

  const handleExport = () => {
    const rows = [
      ['Appointment ID', 'Date', 'Start time', 'End time', 'Patient email', 'Reason', 'Fee', 'Status'],
      ...visibleAppointments.map((item) => [
        String(item.id),
        item.appointment_date,
        item.time_slot_start,
        item.time_slot_end,
        item.patient_email,
        item.symptoms_note ?? '',
        item.total_fee ?? '',
        item.status ? statusLabels[item.status] : 'Unknown',
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'doctor-appointments.csv';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const columns = useMemo<ColumnDef<Appointment, unknown>[]>(
    () => [
      {
        accessorKey: 'appointment_date',
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            <p className="font-semibold text-slate-700">
              {formatDate(row.original.appointment_date)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {formatTime(row.original.time_slot_start)} - {formatTime(row.original.time_slot_end)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'patient_email',
        header: 'Patient',
        cell: ({ row }) => {
          const patient = row.original.patient_detail;
          const patientName = [patient?.first_name, patient?.last_name]
            .filter(Boolean)
            .join(' ') || row.original.patient_email;

          return (
            <div className="flex min-w-56 items-center gap-3">
              <DoctorAvatar
                src={patient?.avatar_url ?? ''}
                alt={`${patientName} avatar`}
                imageClassName="size-10 shrink-0 rounded-full object-cover"
                fallbackClassName="grid size-10 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600"
                iconClassName="size-5"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{patientName}</p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {row.original.patient_email} | Patient #{row.original.patient}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'symptoms_note',
        header: 'Reason',
        cell: ({ getValue }) => (
          <span className="line-clamp-2 text-slate-600">{getValue<string | null>() || '—'}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<AppointmentStatus | undefined>();
          return status ? (
            <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${statusClasses[status]}`}>
              {statusLabels[status]}
            </span>
          ) : (
            <span className="text-slate-500">Unknown</span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          const appointment = row.original;
          return (
            <div className="flex justify-end">
              <ActionDropdown
                isOpen={openActionId === appointment.id}
                onToggle={() =>
                  setOpenActionId((current) => (current === appointment.id ? null : appointment.id))
                }
                onView={() => setViewAppointment(appointment)}
              />
            </div>
          );
        },
      },
    ],
    [openActionId],
  );

  const clearFilters = () => {
    setQuery('');
    setFromDate('');
    setToDate('');
    setStatusFilter('all');
  };
  const hasActiveFilters =
    Boolean(query || fromDate || toDate) || statusFilter !== 'all';

  if (profileQuery.isPending || (doctorId !== undefined && appointmentsQuery.isPending)) {
    return (
      <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 px-3 py-10 text-center sm:px-5" role="status">
        <LoaderOne />
        <p className="text-sm text-slate-500">Loading appointments…</p>
      </div>
    );
  }

  const loadError = profileQuery.error ?? appointmentsQuery.error;
  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:p-5">
        <p>
          {profileQuery.isError
            ? getProfileApiErrorMessage(profileQuery.error)
            : getDoctorAppointmentsErrorMessage(loadError)}
        </p>
        <button
          type="button"
          onClick={() => {
            if (profileQuery.isError) {
              void profileQuery.refetch();
            } else {
              void appointmentsQuery.refetch();
            }
          }}
          className="font-semibold underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1440px] space-y-4 sm:space-y-5">
      <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="mt-1 text-xs text-slate-500">View your patient appointments.</p>
        </div>
        <button type="button" onClick={handleExport} className={`${buttonClass} w-full sm:w-auto`}>
          <Download className="size-3.5" />
          Export CSV
        </button>
      </header>

      <div className="min-w-0 border-b border-slate-200 bg-slate-100/60 px-2 py-3 dark:bg-transparent sm:px-3">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <label className="relative block w-full lg:w-[190px]">
              <span className="sr-only">Search appointments</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="min-h-9 w-full min-w-0 rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-2 sm:flex sm:flex-wrap">
              <label className="text-xs font-medium text-slate-500" htmlFor="appointments-from-date">
                From
              </label>
              <input
                id="appointments-from-date"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) => setFromDate(event.target.value)}
                className={`${selectClass} w-full sm:w-auto`}
              />
              <label className="text-xs font-medium text-slate-500" htmlFor="appointments-to-date">
                To
              </label>
              <input
                id="appointments-to-date"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => setToDate(event.target.value)}
                className={`${selectClass} w-full sm:w-auto`}
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              className={`${buttonClass} w-full min-h-9 rounded-md px-3 sm:w-auto ${filtersOpen ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : ''}`}
            >
              <Filter className="size-3.5" />
              Filters
            </button>
            <label className="flex min-w-0 items-center justify-between gap-2 sm:justify-start">
              <span className="shrink-0 whitespace-nowrap text-xs text-slate-500">Sort by</span>
              <select
                aria-label="Sort appointments"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className={`${selectClass} flex-1 sm:flex-none`}
              >
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="patient">Patient A-Z</option>
              </select>
            </label>
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-3 flex min-w-0 flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
              Status
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as AppointmentStatus | 'all')
                }
                className={`${selectClass} w-full sm:w-auto`}
              >
                <option value="all">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-9 items-center gap-1.5 self-start px-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900 sm:self-end"
              >
                <X className="size-3.5" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <DataTable
        data={visibleAppointments}
        columns={columns}
        initialPageSize={20}
        pageSizeOptions={[10, 20, 50]}
        horizontalScrollOnSmallScreens
        emptyMessage="No appointments found"
        emptyDescription="Try changing your search or filters."
      />

      <Modal
        open={Boolean(viewAppointment)}
        title="Appointment details"
        description={viewAppointment ? `Appointment #${viewAppointment.id}` : undefined}
        size="md"
        onClose={() => setViewAppointment(null)}
      >
        {viewAppointment && (
          <dl className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[minmax(5rem,auto)_minmax(0,1fr)] sm:gap-y-3">
            <dt className="text-[var(--text-secondary)]">Patient</dt>
            <dd className="min-w-0 break-words font-medium text-[var(--text-primary)] sm:mb-0">{viewAppointment.patient_email}</dd>
            <dt className="text-[var(--text-secondary)]">Patient ID</dt>
            <dd className="min-w-0 break-words font-medium text-[var(--text-primary)]">{viewAppointment.patient}</dd>
            <dt className="text-[var(--text-secondary)]">Date & time</dt>
            <dd className="min-w-0 break-words font-medium text-[var(--text-primary)]">
              {formatDate(viewAppointment.appointment_date)}, {formatTime(viewAppointment.time_slot_start)} - {formatTime(viewAppointment.time_slot_end)}
            </dd>
            <dt className="text-[var(--text-secondary)]">Status</dt>
            <dd className="min-w-0 font-medium text-[var(--text-primary)]">
              {viewAppointment.status ? statusLabels[viewAppointment.status] : 'Unknown'}
            </dd>
            <dt className="text-[var(--text-secondary)]">Fee</dt>
            <dd className="min-w-0 font-medium text-[var(--text-primary)]">{viewAppointment.total_fee ?? '—'}</dd>
            <dt className="text-[var(--text-secondary)]">Reason</dt>
            <dd className="min-w-0 break-words font-medium text-[var(--text-primary)]">{viewAppointment.symptoms_note || '—'}</dd>
          </dl>
        )}
      </Modal>
    </div>
  );
}
