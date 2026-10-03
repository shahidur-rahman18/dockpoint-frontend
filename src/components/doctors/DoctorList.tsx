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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DataTable } from '../common/DataTable';
import { ActionDropdown } from '../common/ActionDropdown';
import { EditDoctorDrawer } from './EditDoctorDrawer';
import { doctorsListData } from '../../data/mockData';
import type { DoctorListItem } from '../../types';

export const DoctorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [pageIndex, setPageIndex] = useState(0);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorListItem | null>(null);
  const pageSize = 6;

  const toggleActionMenu = (doctorId: string) => {
    setOpenActionMenuId((prev) => (prev === doctorId ? null : doctorId));
  };

  const handleEditDoctor = (doctor: DoctorListItem) => {
    setSelectedDoctor(doctor);
    setIsEditDrawerOpen(true);
  };

  const handleSaveDoctor = (updatedDoctor: DoctorListItem) => {
    // Update the doctor in the list
    const index = doctorsListData.findIndex((d) => d.id === updatedDoctor.id);
    if (index !== -1) {
      doctorsListData[index] = updatedDoctor;
    }
  };

  const handleDeleteDoctor = (doctor: DoctorListItem) => {
    console.log('Delete doctor:', doctor);
  };

  const goToPage = (page: number) => {
    setPageIndex(page);
    setOpenActionMenuId(null);
  };

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return doctorsListData;

    return doctorsListData.filter((doc) =>
      [doc.name, doc.designation, doc.department, doc.email, doc.status].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }, [searchTerm]);

  const paginatedGridDoctors = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, pageIndex, pageSize]);

  const totalPages = Math.ceil(filteredDoctors.length / pageSize) || 1;

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
            <ActionDropdown
              isOpen={openActionMenuId === row.original.id}
              onToggle={() => toggleActionMenu(row.original.id)}
              onEdit={() => handleEditDoctor(row.original)}
              onDelete={() => handleDeleteDoctor(row.original)}
            />
          </div>
        ),
      },
    ],
    [openActionMenuId, toggleActionMenu, handleEditDoctor, handleDeleteDoctor],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Doctor List</h1>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
            Total Doctors : {filteredDoctors.length}
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

      {viewMode === 'grid' ? (
        <div className="space-y-4">
          {paginatedGridDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedGridDoctors.map((doctor) => {
                const isAvailable = doctor.status === 'Available';
                return (
                  <div
                    key={doctor.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all relative flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Action Menu & Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {doctor.name}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">
                              {doctor.department}
                            </p>
                          </div>
                        </div>
                        <ActionDropdown
                          isOpen={openActionMenuId === doctor.id}
                          onToggle={() => toggleActionMenu(doctor.id)}
                          onEdit={() => handleEditDoctor(doctor)}
                          onDelete={() => handleDeleteDoctor(doctor)}
                        />
                      </div>

                      {/* Availability & Fees */}
                      <div className="space-y-2 py-2 border-t border-b border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-slate-600 font-medium">
                          <span className="text-slate-400">Available :</span>
                          <span className={isAvailable ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                            Mon, 20 Jan 2025
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 font-medium">
                          <span className="text-slate-400">Starts From :</span>
                          <span className="font-bold text-slate-900">{doctor.fees}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between mt-4 pt-2">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md border font-semibold text-[11px] ${
                          isAvailable
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200/60'
                            : 'text-rose-600 bg-rose-50 border-rose-200/60'
                        }`}
                      >
                        {doctor.status}
                      </span>

                      <button
                        aria-label={`Schedule ${doctor.name}`}
                        title="Schedule Appointment"
                        className="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center">
              <p className="text-sm font-semibold text-slate-700">No doctors found</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Try adjusting your search keywords.</p>
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
      ) : (
        <DataTable
          data={filteredDoctors}
          columns={columns}
          emptyMessage="No doctors found"
          emptyDescription="Try adjusting your search keywords."
        />
      )}

      <div className="text-center pt-2 pb-2 text-xs font-medium text-slate-500 border-t border-slate-200/60">
        2026 &copy;Preclinic, All Rights Reserved
      </div>

      <EditDoctorDrawer
        open={isEditDrawerOpen}
        doctor={selectedDoctor}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setSelectedDoctor(null);
        }}
        onSave={handleSaveDoctor}
      />
    </div>
  );
};
