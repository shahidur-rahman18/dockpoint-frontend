import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  CalendarDays,
  Download,
  Filter,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { ActionDropdown } from '../components/common/ActionDropdown';
import { DataTable } from '../components/common/DataTable';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';
import { Modal } from '../components/common/Modal';
import {
  AppointmentFormDialog,
  type AppointmentFormValues,
} from '../components/appointments/AppointmentFormDialog';
import {
  doctorAppointmentsMockData,
  type AppointmentMode,
  type AppointmentStatus,
  type DoctorAppointment,
} from '../data/doctorAppointmentsMockData';

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
  'min-h-9 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

export function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState(doctorAppointmentsMockData);
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [modeFilter, setModeFilter] = useState<AppointmentMode | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [formAppointment, setFormAppointment] = useState<DoctorAppointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewAppointment, setViewAppointment] = useState<DoctorAppointment | null>(null);
  const [deleteAppointment, setDeleteAppointment] = useState<DoctorAppointment | null>(null);

  const visibleAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return appointments
      .filter((appointment) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            appointment.id,
            appointment.patientName,
            appointment.patientEmail,
            appointment.patientPhone,
          ].some((value) => value.toLowerCase().includes(normalizedQuery));
        const matchesDate =
          (!fromDate || appointment.appointmentDate >= fromDate) &&
          (!toDate || appointment.appointmentDate <= toDate);
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
        const matchesMode = modeFilter === 'all' || appointment.mode === modeFilter;
        return matchesQuery && matchesDate && matchesStatus && matchesMode;
      })
      .sort((left, right) => {
        if (sortOrder === 'patient') return left.patientName.localeCompare(right.patientName);
        const dateComparison = `${left.appointmentDate} ${left.startTime}`.localeCompare(
          `${right.appointmentDate} ${right.startTime}`,
        );
        return sortOrder === 'recent' ? -dateComparison : dateComparison;
      });
  }, [appointments, fromDate, modeFilter, query, sortOrder, statusFilter, toDate]);

  const closeForm = () => {
    setIsFormOpen(false);
    setFormAppointment(null);
  };

  const handleSaveAppointment = (values: AppointmentFormValues) => {
    if (formAppointment) {
      setAppointments((current) =>
        current.map((item) =>
          item.id === formAppointment.id ? { ...values, id: formAppointment.id } : item,
        ),
      );
    } else {
      setAppointments((current) => [
        { ...values, id: `APT-${Date.now().toString().slice(-6)}` },
        ...current,
      ]);
    }
    closeForm();
  };

  const handleExport = () => {
    const rows = [
      ['Appointment ID', 'Date', 'Start time', 'End time', 'Patient', 'Email', 'Phone', 'Mode', 'Status', 'Reason'],
      ...visibleAppointments.map((item) => [
        item.id,
        item.appointmentDate,
        item.startTime,
        item.endTime,
        item.patientName,
        item.patientEmail,
        item.patientPhone,
        item.mode,
        statusLabels[item.status],
        item.reason,
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

  const columns = useMemo<ColumnDef<DoctorAppointment, unknown>[]>(
    () => [
      {
        accessorKey: 'appointmentDate',
        header: 'Date & Time',
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            <p className="font-semibold text-slate-700">{formatDate(row.original.appointmentDate)}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {formatTime(row.original.startTime)} - {formatTime(row.original.endTime)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'patientName',
        header: 'Patient',
        cell: ({ row }) => {
          const patient = row.original;
          const initials = patient.patientName
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase();
          return (
            <div className="flex min-w-48 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{patient.patientName}</p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {patient.patientPhone || patient.patientEmail}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'mode',
        header: 'Mode',
        cell: ({ getValue }) => <span className="text-slate-600">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<AppointmentStatus>();
          return (
            <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${statusClasses[status]}`}>
              {statusLabels[status]}
            </span>
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
                onEdit={() => {
                  setFormAppointment(appointment);
                  setIsFormOpen(true);
                }}
                onDelete={() => setDeleteAppointment(appointment)}
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
    setModeFilter('all');
  };
  const hasActiveFilters =
    Boolean(query || fromDate || toDate) || statusFilter !== 'all' || modeFilter !== 'all';

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="mt-1 text-xs text-slate-500">View and manage your patient appointments.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={handleExport} className={buttonClass}>
            <Download className="size-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setFormAppointment(null);
              setIsFormOpen(true);
            }}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-indigo-800 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="size-4" />
            New Appointment
          </button>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-slate-100/60 px-2 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="relative block sm:w-[190px]">
              <span className="sr-only">Search appointments</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="min-h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <div className="grid min-h-9 w-full grid-cols-1 gap-1.5 rounded-md border border-slate-200 bg-white p-2 sm:w-[245px] sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-1.5 sm:px-2.5 sm:py-0">
              <CalendarDays aria-hidden="true" className="hidden size-3.5 shrink-0 text-slate-600 sm:block" />
              <label className="flex min-w-0 items-center gap-2 sm:block">
                <span className="w-8 shrink-0 text-[11px] font-medium text-slate-500 sm:hidden">From</span>
                <span className="sr-only">Filter from date</span>
                <input
                  type="date"
                  aria-label="From date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="min-w-0 w-full border-0 bg-transparent p-0 text-xs text-slate-600 outline-none focus:ring-0"
                />
              </label>
              <span className="hidden text-xs text-slate-400 sm:block">to</span>
              <label className="flex min-w-0 items-center gap-2 sm:block">
                <span className="w-8 shrink-0 text-[11px] font-medium text-slate-500 sm:hidden">To</span>
                <span className="sr-only">Filter to date</span>
                <input
                  type="date"
                  aria-label="To date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(event) => setToDate(event.target.value)}
                  className="min-w-0 w-full border-0 bg-transparent p-0 text-xs text-slate-600 outline-none focus:ring-0"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              className={`${buttonClass} min-h-9 rounded-md px-3 ${filtersOpen ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : ''}`}
            >
              <Filter className="size-3.5" />
              Filters
            </button>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap text-xs text-slate-500">Sort by</span>
              <select
                aria-label="Sort appointments"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className={selectClass}
              >
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="patient">Patient A-Z</option>
              </select>
            </label>
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-3 flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-end">
            <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
              Status
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as AppointmentStatus | 'all')
                }
                className={selectClass}
              >
                <option value="all">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
              Mode
              <select
                value={modeFilter}
                onChange={(event) => setModeFilter(event.target.value as AppointmentMode | 'all')}
                className={selectClass}
              >
                <option value="all">All modes</option>
                <option value="In-person">In-person</option>
                <option value="Online">Online</option>
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
        initialPageSize={10}
        pageSizeOptions={[5, 10, 15]}
        emptyMessage="No appointments found"
        emptyDescription="Try changing your search or filters."
      />

      <AppointmentFormDialog
        open={isFormOpen}
        appointment={formAppointment ?? undefined}
        onClose={closeForm}
        onSubmit={handleSaveAppointment}
      />

      <Modal
        open={Boolean(viewAppointment)}
        title="Appointment details"
        description={viewAppointment?.id}
        size="md"
        onClose={() => setViewAppointment(null)}
      >
        {viewAppointment && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
            <dt className="text-[var(--text-secondary)]">Patient</dt>
            <dd className="font-medium text-[var(--text-primary)]">{viewAppointment.patientName}</dd>
            <dt className="text-[var(--text-secondary)]">Email</dt>
            <dd className="break-all font-medium text-[var(--text-primary)]">{viewAppointment.patientEmail}</dd>
            <dt className="text-[var(--text-secondary)]">Phone</dt>
            <dd className="font-medium text-[var(--text-primary)]">{viewAppointment.patientPhone || 'Not provided'}</dd>
            <dt className="text-[var(--text-secondary)]">Date & time</dt>
            <dd className="font-medium text-[var(--text-primary)]">
              {formatDate(viewAppointment.appointmentDate)}, {formatTime(viewAppointment.startTime)} - {formatTime(viewAppointment.endTime)}
            </dd>
            <dt className="text-[var(--text-secondary)]">Mode</dt>
            <dd className="font-medium text-[var(--text-primary)]">{viewAppointment.mode}</dd>
            <dt className="text-[var(--text-secondary)]">Status</dt>
            <dd className="font-medium text-[var(--text-primary)]">{statusLabels[viewAppointment.status]}</dd>
            <dt className="text-[var(--text-secondary)]">Reason</dt>
            <dd className="font-medium text-[var(--text-primary)]">{viewAppointment.reason || 'Not provided'}</dd>
          </dl>
        )}
      </Modal>

      <DeleteConfirmationModal
        open={Boolean(deleteAppointment)}
        title="Delete appointment?"
        description={`This will remove the demo appointment for ${deleteAppointment?.patientName ?? 'this patient'}.`}
        onCancel={() => setDeleteAppointment(null)}
        onConfirm={() => {
          if (deleteAppointment) {
            setAppointments((current) => current.filter((item) => item.id !== deleteAppointment.id));
          }
          setDeleteAppointment(null);
        }}
      />
    </div>
  );
}
