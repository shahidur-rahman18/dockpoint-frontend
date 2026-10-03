import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import { doctorsListData } from '../../data/mockData';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15];

export const DoctorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return doctorsListData;

    return doctorsListData.filter((doc) =>
      [doc.name, doc.designation, doc.department, doc.email, doc.status].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }, [searchTerm]);

  const totalRecords = filteredDoctors.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedDoctors = useMemo(() => {
    const startIndex = (safePage - 1) * rowsPerPage;
    return filteredDoctors.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDoctors, safePage, rowsPerPage]);

  const startRecord = totalRecords === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(safePage * rowsPerPage, totalRecords);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const pageNumbers = useMemo(() => {
    const total = totalPages;
    const current = safePage;

    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const start = Math.max(1, Math.min(current - 1, total - 3));
    return Array.from({ length: 4 }, (_, i) => start + i);
  }, [safePage, totalPages]);

  return (
    <div className="space-y-6">
      {/* Top Header & Action Bar */}
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

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, department or email"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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

      {/* Doctor List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold">
                <th className="py-3.5 px-5">Name &amp; Designation</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Fees</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{doc.name}</div>
                        <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                          {doc.designation}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-600">{doc.department}</td>
                  <td className="py-4 px-4 font-medium text-slate-600">{doc.phone}</td>
                  <td className="py-4 px-4 font-medium text-slate-600">{doc.email}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">{doc.fees}</td>

                  <td className="py-4 px-4">
                    {doc.status === 'Available' ? (
                      <span className="inline-block px-3 py-1 rounded-md text-emerald-600 bg-emerald-50 border border-emerald-200/60 font-semibold text-[11px]">
                        Available
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-md text-rose-600 bg-rose-50 border border-rose-200/60 font-semibold text-[11px]">
                        Unavailable
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        aria-label={`Schedule ${doc.name}`}
                        title="Schedule"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                        aria-label={`More options for ${doc.name}`}
                        title="More"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedDoctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="text-sm font-semibold text-slate-700">No doctors found</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                      Try adjusting your search keywords.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Rows Per Page:</span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  aria-label="Rows per page"
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold pl-3 pr-7 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {ROWS_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-700">{startRecord}</span> to{' '}
              <span className="font-bold text-slate-700">{endRecord}</span> of{' '}
              <span className="font-bold text-slate-700">{totalRecords}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-current={page === safePage ? 'page' : undefined}
                style={
                  page === safePage
                    ? { background: 'var(--theme-accent)', borderColor: 'var(--theme-accent)' }
                    : undefined
                }
                className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  page === safePage
                    ? 'text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="text-center pt-2 pb-2 text-xs font-medium text-slate-500 border-t border-slate-200/60">
        2026 &copy;Preclinic, All Rights Reserved
      </div>
    </div>
  );
};