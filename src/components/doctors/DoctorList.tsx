import React, { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import { DataTable } from '../common/DataTable';
import { doctorsListData } from '../../data/mockData';
import type { DoctorListItem } from '../../types';

export const DoctorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return doctorsListData;

    return doctorsListData.filter((doc) =>
      [doc.name, doc.designation, doc.department, doc.email, doc.status].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }, [searchTerm]);

  const columns = useMemo<ColumnDef<DoctorListItem, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name & Designation',
        cell: ({ row }) => {
          const doctor = row.original;

          return (
            <div className="flex items-center gap-3">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs"
              />
              <div>
                <div className="font-bold text-slate-800">{doctor.name}</div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {doctor.designation}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-600">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-600">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-600">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'fees',
        header: 'Fees',
        cell: ({ getValue }) => (
          <span className="font-bold text-slate-800">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<DoctorListItem['status']>();
          const available = status === 'Available';

          return (
            <span
              className={`inline-block px-3 py-1 rounded-md border font-semibold text-[11px] ${
                available
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200/60'
                  : 'text-rose-600 bg-rose-50 border-rose-200/60'
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              aria-label={`Schedule ${row.original.name}`}
              title="Schedule"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              aria-label={`More options for ${row.original.name}`}
              title="More"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Doctor List</h1>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
            Total Doctors : {doctorsListData.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              aria-label="List view"
              className="p-1.5 bg-white text-slate-800 rounded shadow-xs cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              aria-label="Grid view"
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            style={{ background: 'var(--theme-accent)' }}
            className="flex items-center gap-1.5 px-3.5 py-2 hover:brightness-90 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Doctor</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, department or email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
            <span>Sort By : Recent</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      <DataTable
        data={filteredDoctors}
        columns={columns}
        emptyMessage="No doctors found"
        emptyDescription="Try adjusting your search keywords."
      />

      <div className="text-center pt-2 pb-2 text-xs font-medium text-slate-500 border-t border-slate-200/60">
        2026 &copy;Preclinic, All Rights Reserved
      </div>
    </div>
  );
};
