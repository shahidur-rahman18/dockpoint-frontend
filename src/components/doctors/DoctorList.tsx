import React, { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router';
import {
  Search,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UserRound,
} from 'lucide-react';
import { DataTable } from '../common/DataTable';
import { ActionDropdown } from '../common/ActionDropdown';
import { DoctorCard } from './DoctorCard';
import type { DoctorListItem } from '../../types';
import { useDoctors, useUpdateDoctorAvailability } from '../../hooks/useDoctors';
import { getDoctorListErrorMessage } from '../../services/doctorService';

const doctorDetailsPath = (doctor: DoctorListItem) => {
  const slug = doctor.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `/doctor-details/${doctor.id}/${slug}`;
};

export const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: doctors,
    error,
    isError,
    isPending,
    refetch,
  } = useDoctors();
  const availabilityMutation = useUpdateDoctorAvailability();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<DoctorListItem['status'] | ''>('');
  const [sortOrder, setSortOrder] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [pageIndex, setPageIndex] = useState(0);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const pageSize = 6;

  const toggleActionMenu = (doctorId: string) => {
    setOpenActionMenuId((prev) => (prev === doctorId ? null : doctorId));
  };

  const handleViewDoctor = (doctor: DoctorListItem) => {
    navigate(doctorDetailsPath(doctor));
  };

  const goToPage = (page: number) => {
    setPageIndex(page);
    setOpenActionMenuId(null);
  };

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result = (doctors ?? []).filter((doc) => {
      const matchesQuery =
        !query ||
        [doc.name, doc.designation, doc.department, doc.email, doc.status].some((field) =>
          field.toLowerCase().includes(query),
        );

      return (
        matchesQuery &&
        (!departmentFilter || doc.department === departmentFilter) &&
        (!statusFilter || doc.status === statusFilter)
      );
    });

    switch (sortOrder) {
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'department':
        return result.sort((a, b) => a.department.localeCompare(b.department));
      case 'fees-asc':
        return result.sort(
          (a, b) =>
            Number(a.fees.replace(/[^\d.]/g, '')) -
            Number(b.fees.replace(/[^\d.]/g, '')),
        );
      case 'fees-desc':
        return result.sort(
          (a, b) =>
            Number(b.fees.replace(/[^\d.]/g, '')) -
            Number(a.fees.replace(/[^\d.]/g, '')),
        );
      default:
        return result;
    }
  }, [doctors, searchTerm, departmentFilter, statusFilter, sortOrder]);

  const departments = useMemo(
    () => [...new Set((doctors ?? []).map((doctor) => doctor.department))].sort(),
    [doctors],
  );

  const paginatedGridDoctors = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, pageIndex, pageSize]);

  const totalPages = Math.ceil(filteredDoctors.length / pageSize) || 1;

  const columns = useMemo<ColumnDef<DoctorListItem, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        size: 25,
        header: 'Name & Designation',
        cell: ({ row }) => {
          const doctor = row.original;

          return (
            <div className="flex min-w-0 items-center gap-3">
              {doctor.avatar ? (
                <button
                  type="button"
                  onClick={() => handleViewDoctor(doctor)}
                  aria-label={`View details for ${doctor.name}`}
                  className="shrink-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  <img
                    src={doctor.avatar}
                    alt=""
                    className="size-10 rounded-full border border-slate-200 object-cover shadow-xs"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleViewDoctor(doctor)}
                  aria-label={`View details for ${doctor.name}`}
                  className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  <UserRound aria-hidden="true" className="size-5" />
                </button>
              )}
              <div className="min-w-0">
                <div className="whitespace-nowrap font-bold text-slate-800">
                  {doctor.name}
                </div>
                <div
                  className="mt-0.5 whitespace-nowrap text-[11px] font-medium text-slate-400"
                >
                  {doctor.designation}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'department',
        size: 12,
        header: 'Department',
        cell: ({ getValue }) => (
          <span className="block whitespace-nowrap font-medium text-slate-600">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'phone',
        size: 13,
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="block whitespace-nowrap font-medium text-slate-600">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'email',
        size: 17,
        header: 'Email',
        cell: ({ getValue }) => (
          <span
            className="block max-w-full truncate whitespace-nowrap font-medium text-slate-600"
            title={getValue<string>()}
          >
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'fees',
        size: 10,
        header: 'Fees',
        cell: ({ getValue }) => {
          const fee = getValue<string>();
          const amount = Number(fee.replace(/[^\d.-]/g, ''));

          return (
            <span className="block whitespace-nowrap text-[11px] font-bold text-slate-800">
              {/-?\d/.test(fee) && Number.isFinite(amount)
                ? `৳ ${amount.toFixed(2)}`
                : fee}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        size: 13,
        header: 'Status',
        cell: ({ row }) => {
          const doctor = row.original;
          const status = doctor.status;
          const available = status === 'Available';
          const updating =
            availabilityMutation.isPending &&
            availabilityMutation.variables?.doctorId === doctor.id;

          return (
            <label className="relative inline-block">
              <select
                aria-label={`Availability for ${doctor.name}`}
                aria-busy={updating}
                value={status}
                disabled={availabilityMutation.isPending}
                onChange={(event) => {
                  const nextStatus = event.target.value;
                  if (nextStatus !== 'Available' && nextStatus !== 'Unavailable') return;
                  if (nextStatus === status) return;

                  availabilityMutation.reset();
                  availabilityMutation.mutate({
                    doctorId: doctor.id,
                    isAvailable: nextStatus === 'Available',
                  });
                }}
                className={`cursor-pointer appearance-none rounded-md border py-1 pl-3 pr-7 text-[11px] font-semibold transition-opacity disabled:cursor-wait disabled:opacity-60 ${
                  available
                    ? 'border-emerald-200/60 bg-emerald-50 text-emerald-600'
                    : 'border-rose-200/60 bg-rose-50 text-rose-600'
                }`}
              >
                <option  value="Available">Available</option>
                <option  value="Unavailable">Unavailable</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2"
              />
            </label>
          );
        },
      },
      {
        id: 'actions',
        size: 10,
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
            <ActionDropdown
              isOpen={openActionMenuId === row.original.id}
              onToggle={() => toggleActionMenu(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [openActionMenuId, toggleActionMenu],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Doctor List</h1>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
            Total Doctors : {isPending ? '…' : doctors?.length ?? 0}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                setViewMode('table');
                setOpenActionMenuId(null);
              }}
              aria-label="List view"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setViewMode('grid');
                setOpenActionMenuId(null);
              }}
              aria-label="Grid view"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/add-doctor')}
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
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageIndex(0);
              setOpenActionMenuId(null);
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((open) => !open)}
              aria-expanded={isFilterOpen}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Filters
                {Number(Boolean(departmentFilter)) + Number(Boolean(statusFilter)) > 0 &&
                  ` (${Number(Boolean(departmentFilter)) + Number(Boolean(statusFilter))})`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-64 space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                <label className="block space-y-1.5 text-xs font-semibold text-slate-600">
                  Department
                  <select
                    value={departmentFilter}
                    onChange={(event) => {
                      setDepartmentFilter(event.target.value);
                      setPageIndex(0);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal text-slate-700"
                  >
                    <option value="">All departments</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5 text-xs font-semibold text-slate-600">
                  Status
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      const value = event.target.value;
                      setStatusFilter(
                        value === 'Available' || value === 'Unavailable' ? value : '',
                      );
                      setPageIndex(0);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal text-slate-700"
                  >
                    <option value="">All statuses</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </label>
                {(departmentFilter || statusFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDepartmentFilter('');
                      setStatusFilter('');
                      setPageIndex(0);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <span>Sort By:</span>
            <select
              aria-label="Sort doctors"
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value);
                setPageIndex(0);
              }}
              className="max-w-36 bg-transparent outline-none cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="department">Department</option>
              <option value="fees-asc">Fees (Low to high)</option>
              <option value="fees-desc">Fees (High to low)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </label>
        </div>
      </div>

      {isPending && (
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500"
        >
          Loading doctors…
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
        >
          <p className="text-sm font-medium text-rose-700">
            {getDoctorListErrorMessage(error)}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {!isPending && (!isError || (doctors?.length ?? 0) > 0) && (viewMode === 'grid' ? (

         <>
          {availabilityMutation.isError && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            >
              {getDoctorListErrorMessage(availabilityMutation.error)}
            </p>
          )}
          <DataTable
            data={filteredDoctors}
            columns={columns}
            fixedColumnWidths
            emptyMessage="No doctors found"
            emptyDescription="Try adjusting your search keywords."
          />
        </>
      ) : (
       <div className="space-y-4">
          {paginatedGridDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedGridDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  isActionMenuOpen={openActionMenuId === doctor.id}
                  onToggleActionMenu={() => toggleActionMenu(doctor.id)}
                  onView={() => handleViewDoctor(doctor)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center">
              <p className="text-sm font-semibold text-slate-700">No doctors found</p>
              <p className="text-xs font-medium text-slate-400 mt-1">
                {doctors?.length
                  ? 'Try adjusting your search keywords.'
                  : 'There are no doctors to display.'}
              </p>
            </div>
          )}

          {/* Grid Pagination */}
          {filteredDoctors.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-500">
                Showing <span className="font-bold text-slate-700">{filteredDoctors.length === 0 ? 0 : pageIndex * pageSize + 1}</span> to{' '}
                <span className="font-bold text-slate-700">{Math.min((pageIndex + 1) * pageSize, filteredDoctors.length)}</span> of{' '}
                <span className="font-bold text-slate-700">{filteredDoctors.length}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage(Math.max(0, pageIndex - 1))}
                  disabled={pageIndex === 0}
                  aria-label="Previous page"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page - 1)}
                    aria-current={page === pageIndex + 1 ? 'page' : undefined}
                    style={
                      page === pageIndex + 1
                        ? { background: 'var(--theme-accent)', borderColor: 'var(--theme-accent)' }
                        : undefined
                    }
                    className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      page === pageIndex + 1
                        ? 'text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(Math.min(totalPages - 1, pageIndex + 1))}
                  disabled={pageIndex >= totalPages - 1}
                  aria-label="Next page"
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="text-center pt-2 pb-2 text-xs font-medium text-slate-500 border-t border-slate-200/60">
        2026 &copy;Docpoint, All Rights Reserved
      </div>

    </div>
  );
};
