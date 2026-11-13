import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { LayoutGrid, List, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { DataTable } from '../common/DataTable';
import { ActionDropdown } from '../common/ActionDropdown';
import { Card } from '../common/Card';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { LoaderOne } from '../common/LoaderOne';
import { DoctorAvatar } from '../doctors/DoctorAvatar';
import { useDeletePatient, usePatients } from '../../hooks/usePatients';
import {
  getPatientApiErrorMessage,
  getPatientMutationErrorMessage,
  type PatientRecord,
} from '../../services/patientService';

const getPatientAge = (dateOfBirth: string): number | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return null;

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return age >= 0 ? age : null;
};

export function PatientList() {
  const navigate = useNavigate();
  const { data: patients = [], error, isError, isPending, refetch } = usePatients();
  const deletePatient = useDeletePatient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<PatientRecord | null>(null);

  const handleConfirmDeletePatient = () => {
    if (!patientToDelete || deletePatient.isPending) return;

    deletePatient.mutate(patientToDelete.id, {
      onSuccess: () => {
        toast.success(`${patientToDelete.name} deleted permanently.`, {
          position: 'bottom-right',
        });
        setPatientToDelete(null);
      },
    });
  };

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result = patients.filter((patient) => {
      const matchesQuery =
        !query ||
        [
          patient.name,
          patient.email,
          patient.phone,
          patient.address,
          patient.doctor?.name ?? '',
          patient.doctor?.specialization ?? '',
        ]
          .some((value) => value.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'available'
          ? patient.doctor?.isAvailable === true
          : statusFilter === 'unavailable' && patient.doctor?.isAvailable === false);
      return matchesQuery && matchesStatus;
    });

    if (sortOrder === 'recent') {
      result.sort((a, b) => (b.lastVisit ?? '').localeCompare(a.lastVisit ?? ''));
    }
    if (sortOrder === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [patients, searchTerm, sortOrder, statusFilter]);

  const columns = useMemo<ColumnDef<PatientRecord, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        size: 22,
        header: 'Patient',
        cell: ({ row }) => {
          const patient = row.original;
          const age = getPatientAge(patient.dateOfBirth);
          return (
            <Link to={`/admin-dashboard/patients/${patient.id}`} className="flex min-w-0 items-center gap-3">
              <DoctorAvatar
                src={patient.avatar}
                alt={patient.name}
                imageClassName="size-10 rounded-full border border-slate-200 object-cover"
                fallbackClassName="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-400"
                iconClassName="size-4"
              />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-slate-800">{patient.name}</span>
                <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                  {age === null ? '' : `${age}, `}
                  {patient.gender}
                </span>
              </span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'phone',
        size: 13,
        header: 'Phone',
        cell: ({ getValue }) => <span className="whitespace-nowrap text-slate-600">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'doctor',
        size: 20,
        header: 'Doctor',
        cell: ({ row }) => {
          const doctor = row.original.doctor;
          if (!doctor) return <span className="text-slate-400">—</span>;

          return (
            <div className="flex min-w-0 items-center gap-2">
              <DoctorAvatar
                src={doctor.avatar}
                alt={doctor.name}
                imageClassName="size-10 rounded-full border border-slate-200 object-cover"
                fallbackClassName="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-400"
                iconClassName="size-4"
              />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-slate-800">{doctor.name}</span>
                <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                  {doctor.specialization || '—'}
                </span>
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'address',
        size: 19,
        header: 'Address',
        cell: ({ getValue }) => <span className="line-clamp-2 text-slate-600">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'lastVisit',
        size: 12,
        header: 'Last Visit',
        cell: ({ getValue }) => {
          const lastVisit = getValue<string | null>();
          if (!lastVisit) return <span className="whitespace-nowrap text-slate-400">—</span>;

          return (
            <span className="whitespace-nowrap text-slate-600">
              {new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              }).format(new Date(`${lastVisit}T00:00:00Z`))}
            </span>
          );
        },
      },
      {
        accessorKey: 'doctor.isAvailable',
        id: 'status',
        size: 8,
        header: 'Status',
        cell: ({ row }) => {
          const isAvailable = row.original.doctor?.isAvailable;
          if (isAvailable === undefined) return <span className="text-slate-400">—</span>;

          return (
            <span className={`inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-medium ${
              isAvailable ? 'border-emerald-500 text-emerald-600' : 'border-rose-500 text-rose-600'
            }`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        size: 6,
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ActionDropdown
              isOpen={openActionMenuId === row.original.id}
              onToggle={() =>
                setOpenActionMenuId((current) =>
                  current === row.original.id ? null : row.original.id,
                )
              }
              onView={() => navigate(`/admin-dashboard/patients/${row.original.id}`)}
              onEdit={() => navigate(`/admin-dashboard/patients/${row.original.id}/edit`)}
              onDelete={() => {
                deletePatient.reset();
                setPatientToDelete(row.original);
              }}
            />
          </div>
        ),
      },
    ],
    [deletePatient, navigate, openActionMenuId],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Clinic / Patients</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Patients List</h1>
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Total Patients: {isPending ? '…' : patients.length}
            </span>
          </div>
        </div>
        <Link
          to="/admin-dashboard/patients/create"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          <Plus aria-hidden="true" className="size-4" />
          New Patient
        </Link>
      </div>

      <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <label className="relative block w-full sm:max-w-sm">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search name, phone, email..."
            aria-label="Search patients"
            className="min-h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600">
            <SlidersHorizontal aria-hidden="true" className="size-4 text-slate-400" />
            <span className="sr-only">Filter by doctor availability</span>
            <select
              aria-label="Filter by doctor availability"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="max-w-32 bg-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>
          <label className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600">
            <span className="shrink-0">Sort:</span>
            <select
              aria-label="Sort patients"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="max-w-32 bg-transparent outline-none"
            >
              <option value="recent">Recent</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </label>
          <div className="flex rounded-lg border border-slate-200 p-1" aria-label="Patient view">
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => {
                setView('list');
                setOpenActionMenuId(null);
              }}
              className={`grid size-8 cursor-pointer place-items-center rounded-md ${view === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <List aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => {
                setView('grid');
                setOpenActionMenuId(null);
              }}
              className={`grid size-8 cursor-pointer place-items-center rounded-md ${view === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <LayoutGrid aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </Card>

      {isPending ? (
        <Card className="flex min-h-48 items-center justify-center p-8 text-sm font-medium text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <LoaderOne />
            <span>Loading patients…</span>
          </div>
        </Card>
      ) : isError ? (
        <Card role="alert" className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-sm font-medium text-rose-700">{getPatientApiErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="min-h-9 cursor-pointer rounded-md border border-rose-200 bg-white px-4 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            Retry
          </button>
        </Card>
      ) : view === 'list' ? (
        <DataTable
          data={filteredPatients}
          columns={columns}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          fixedColumnWidths
          horizontalScrollOnSmallScreens
          emptyMessage="No patients found"
          emptyDescription="Try changing your search or filters."
        />
      ) : filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-5">
              <div className="flex items-start gap-4">
                <DoctorAvatar
                  src={patient.avatar}
                  alt={patient.name}
                  imageClassName="size-16 rounded-lg border border-slate-200 object-cover"
                  fallbackClassName="grid size-16 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400"
                  iconClassName="size-6"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-indigo-600">Patient #{patient.id}</p>
                  <h2 className="mt-1 truncate font-bold text-slate-900">{patient.name}</h2>
                  <p className="mt-1 break-words text-sm text-slate-500">{patient.address}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <p><span className="text-slate-400">Phone:</span> {patient.phone}</p>
                <p><span className="text-slate-400">Email:</span> {patient.email}</p>
                <p><span className="text-slate-400">Blood group:</span> {patient.bloodGroup}</p>
              </div>
              <Link
                to={`/admin-dashboard/patients/${patient.id}`}
                className="mt-4 inline-flex min-h-9 items-center rounded-md bg-[var(--theme-accent)] px-4 text-xs font-semibold text-white hover:brightness-110"
              >
                View Patient
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="font-semibold text-slate-700">No patients found</p>
          <p className="mt-1 text-sm text-slate-400">Try changing your search or filters.</p>
        </Card>
      )}
      <p className="border-t border-slate-200/70 py-3 text-center text-xs text-slate-500">
        2026 © Dockpoint, All Rights Reserved
      </p>
      <DeleteConfirmationModal
        open={patientToDelete !== null}
        title="Permanently Delete Patient"
        description={
          patientToDelete
            ? `Delete ${patientToDelete.name} permanently? Their appointments and medical history will also be deleted. This cannot be undone.`
            : undefined
        }
        confirmLabel={deletePatient.isPending ? 'Deleting...' : 'Delete Permanently'}
        isPending={deletePatient.isPending}
        error={
          deletePatient.error
            ? getPatientMutationErrorMessage(deletePatient.error, 'delete')
            : null
        }
        onCancel={() => {
          if (deletePatient.isPending) return;
          setPatientToDelete(null);
          deletePatient.reset();
        }}
        onConfirm={handleConfirmDeletePatient}
      />
    </div>
  );
}
