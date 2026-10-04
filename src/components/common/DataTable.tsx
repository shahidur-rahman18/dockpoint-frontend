import { useId, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  emptyMessage?: string;
  emptyDescription?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  data,
  columns,
  emptyMessage = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 15],
  onRowClick,
}: DataTableProps<TData>) {
  const pageSizeSelectId = useId();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
  });

  const totalRecords = table.getRowCount();
  const totalPages = Math.max(1, table.getPageCount());
  const currentPage = pagination.pageIndex + 1;
  const startRecord = totalRecords === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRecord = Math.min(currentPage * pagination.pageSize, totalRecords);
  const pageNumbers =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : Array.from(
          { length: 4 },
          (_, index) => Math.max(1, Math.min(currentPage - 1, totalPages - 3)) + index,
        );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} className="py-3.5 px-4 first:pl-5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={(event) => {
                    if (
                      !onRowClick ||
                      (event.target instanceof Element &&
                        event.target.closest('button, a, input, select, textarea, [role="button"]'))
                    ) {
                      return;
                    }
                    onRowClick(row.original);
                  }}
                  onKeyDown={(event) => {
                    if (
                      !onRowClick ||
                      event.target !== event.currentTarget ||
                      (event.key !== 'Enter' && event.key !== ' ')
                    ) {
                      return;
                    }
                    event.preventDefault();
                    onRowClick(row.original);
                  }}
                  className={onRowClick ? 'cursor-pointer hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-600' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 px-4 first:pl-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getVisibleLeafColumns().length} className="py-16 text-center">
                  <p className="text-sm font-semibold text-slate-700">{emptyMessage}</p>
                  <p className="text-xs font-medium text-slate-400 mt-1">{emptyDescription}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor={pageSizeSelectId}
              className="text-xs font-medium text-slate-500"
            >
              Rows Per Page:
            </label>
            <div className="relative">
              <select
                id={pageSizeSelectId}
                value={pagination.pageSize}
                onChange={(event) => {
                  table.setPageIndex(0);
                  table.setPageSize(Number(event.target.value));
                }}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold pl-3 pr-7 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {pageSizeOptions.map((option) => (
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => table.setPageIndex(page - 1)}
              aria-current={page === currentPage ? 'page' : undefined}
              style={
                page === currentPage
                  ? { background: 'var(--theme-accent)', borderColor: 'var(--theme-accent)' }
                  : undefined
              }
              className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                page === currentPage
                  ? 'text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
