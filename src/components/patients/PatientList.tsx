import React, { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { LoaderOne } from '../common/LoaderOne';
import { DataTable } from '../common/DataTable';
import { DoctorAvatar } from '../doctors/DoctorAvatar';
import type { PatientListItem } from '../../types';
import { usePatients } from '../../hooks/usePatients';
import { getPatientListErrorMessage } from '../../services/patientService';

export const PatientList: React.FC = () => {
  const { data: patients, error, isError, isPending, refetch } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result = (patients ?? []).filter((p) => {
      return (
        !query ||
        [p.name, p.email, p.phone].some((field) => field.toLowerCase().includes(query))
      );
    });

    switch (sortOrder) {
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result;
    }
  }, [patients, searchTerm, sortOrder]);

  const columns = useMemo<ColumnDef<PatientListItem, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        size: 30,
        header: 'Patient',
        cell: ({ row }) => {
          const patient = row.original;
          return (
            <div className="flex min-w-0 items-center gap-3">
              <DoctorAvatar
                src={patient.avatar}
                imageClassName="size-9 rounded-full border border-slate-200 object-cover shadow-xs"
                fallbackClassName="grid size-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-400"
                iconClassName="size-4"
              />
              <div className="min-w-0">
                <div className="whitespace-nowrap font-bold text-slate-800">{patient.name}</div>
                <div className="mt-0.5 whitespace-nowrap text-[11px] font-medium text-slate-400">
                  {patient.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'phone',
        size: 20,
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="block whitespace-nowrap font-medium text-slate-600">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'gender',
        size: 15,
        header: 'Gender',
        cell: ({ getValue }) => (
          <span className="block whitespace-nowrap font-medium text-slate-600 capitalize">
            {getValue<string>().toLowerCase() === '—' ? '—' : getValue<string>().charAt(0) + getValue<string>().slice(1).toLowerCase()}
          </span>
        ),
      },
      {
        accessorKey: 'bloodGroup',
        size: 15,
        header: 'Blood Group',
        cell: ({ getValue }) => (
          <span className="block whitespace-nowrap font-medium text-slate-600">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'isVerified',
        size: 20,
        header: 'Status',
        cell: ({ getValue }) => {
          const verified = getValue<boolean>();
          return (
            <span
              className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
                verified
                  ? 'border-emerald-200/60 bg-emerald-50 text-emerald-600'
                  : 'border-amber-200/60 bg-amber-50 text-amber-600'
              }`}
            >
              {verified ? 'Verified' : 'Unverified'}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patient List</h1>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
            Total Patients : {isPending ? '…' : patients?.length ?? 0}
          </span>
        </div>
      </div>

      {/* Search & Sort toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <label className="flex min-w-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 sm:px-3.5">
          <span className="shrink-0">Sort By:</span>
          <select
            aria-label="Sort patients"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="min-w-0 flex-1 appearance-none bg-transparent outline-none cursor-pointer sm:max-w-36"
          >
            <option value="default">Default</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
          </select>
        </label>
      </div>

      {/* Loading */}
      {isPending && (
        <div
          role="status"
          className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500"
        >
          <LoaderOne />
          Loading patients…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
        >
          <p className="text-sm font-medium text-rose-700">
            {getPatientListErrorMessage(error)}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="cursor-pointer rounded-lg bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!isPending && !isError && (
        <DataTable
          data={filteredPatients}
          columns={columns}
          fixedColumnWidths
          horizontalScrollOnSmallScreens
          emptyMessage="No patients found"
          emptyDescription="Try adjusting your search keywords."
        />
      )}

      <div className="text-center pt-2 pb-2 text-xs font-medium text-slate-500 border-t border-slate-200/60">
        2026 &copy;Docpoint, All Rights Reserved
      </div>
    </div>
  );
};
