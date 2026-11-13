import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { LayoutGrid, List, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router';
import { DataTable } from '../common/DataTable';
import { Card } from '../common/Card';
import { DoctorAvatar } from '../doctors/DoctorAvatar';
import { usePatients } from '../../hooks/usePatients';
import { getPatientApiErrorMessage, type PatientRecord } from '../../services/patientService';

export function PatientList() {
  const { data: patients = [], error, isError, isPending, refetch } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result = patients.filter((patient) => {
      const matchesQuery =
        !query ||
        [patient.name, patient.email, patient.phone, patient.address, patient.bloodGroup, patient.gender]
          .some((value) => value.toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'verified' ? patient.isVerified : !patient.isVerified);
      return matchesQuery && matchesStatus;
    });

    if (sortOrder === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOrder === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [patients, searchTerm, sortOrder, statusFilter]);

  const columns = useMemo<ColumnDef<PatientRecord, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        size: 25,
        header: 'Patient',
        cell: ({ row }) => {
          const patient = row.original;
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
                <span className="mt-0.5 block truncate text-[11px] text-slate-400">{patient.email}</span>
              </span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'phone',
        size: 17,
        header: 'Phone',
        cell: ({ getValue }) => <span className="whitespace-nowrap text-slate-600">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'gender',
        size: 11,
        header: 'Gender',
        cell: ({ getValue }) => <span className="whitespace-nowrap text-slate-600">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'bloodGroup',
        size: 12,
        header: 'Blood Group',
        cell: ({ getValue }) => <span className="whitespace-nowrap text-slate-600">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'address',
        size: 23,
        header: 'Address',
        cell: ({ getValue }) => <span className="line-clamp-2 text-slate-600">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'isVerified',
        size: 12,
        header: 'Status',
        cell: ({ getValue }) => {
          const isVerified = getValue<boolean>();
          return (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {isVerified ? 'Email verified' : 'Email unverified'}
            </span>
          );
        },
      },
    ],
    [],
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
            <span className="sr-only">Filter by verification status</span>
            <select
              aria-label="Filter by verification status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="max-w-32 bg-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="verified">Email verified</option>
              <option value="unverified">Email unverified</option>
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
              onClick={() => setView('list')}
              className={`grid size-8 cursor-pointer place-items-center rounded-md ${view === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <List aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
              className={`grid size-8 cursor-pointer place-items-center rounded-md ${view === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <LayoutGrid aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </Card>

      {isPending ? (
        <Card role="status" className="flex min-h-48 items-center justify-center p-8 text-sm text-slate-500">
          Loading patients…
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
    </div>
  );
}
