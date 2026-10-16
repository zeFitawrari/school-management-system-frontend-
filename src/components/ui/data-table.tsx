import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { useState, type ReactNode } from 'react';

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageSize?: number;
  enableGlobalFilter?: boolean;
  searchPlaceholder?: string;
  enableRowSelection?: boolean;
  emptyState?: ReactNode;
  className?: string;
  onRowSelectionChange?: (rows: TData[]) => void;
};

export function DataTable<TData>({
  columns,
  data,
  pageSize = 10,
  enableGlobalFilter = false,
  searchPlaceholder = 'Search…',
  enableRowSelection = false,
  emptyState,
  className,
  onRowSelectionChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const tableColumns = enableRowSelection
    ? [
        {
          id: 'select',
          header: (context: { table: unknown }) => {
            const currentTable = context.table as {
              getIsAllPageRowsSelected: () => boolean;
              getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void;
            };

            return (
              <input
                type="checkbox"
                checked={currentTable.getIsAllPageRowsSelected()}
                onChange={currentTable.getToggleAllPageRowsSelectedHandler()}
                aria-label="Select all rows"
              />
            );
          },
          cell: (context: { row: unknown }) => {
            const currentRow = context.row as {
              getIsSelected: () => boolean;
              getToggleSelectedHandler: () => (event: unknown) => void;
            };

            return (
              <input
                type="checkbox"
                checked={currentRow.getIsSelected()}
                onChange={currentRow.getToggleSelectedHandler()}
                aria-label="Select row"
              />
            );
          },
          enableSorting: false,
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      setRowSelection((previous) => {
        const next = typeof updater === 'function' ? (updater as (old: RowSelectionState) => RowSelectionState)(previous) : updater;
        if (onRowSelectionChange) {
          const selectedRows = Object.keys(next)
            .filter((key) => next[key])
            .map((key) => table.getRowModel().rows[Number(key)]?.original)
            .filter((row): row is TData => row !== undefined);
          onRowSelectionChange(selectedRows);
        }
        return next;
      });
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();
  const totalColumns = tableColumns.length;

  return (
    <div className={['space-y-3', className ?? ''].join(' ')}>
      {enableGlobalFilter ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground sm:max-w-xs"
          />
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} result(s)
          </p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead className="bg-muted/60">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      header.column.getIsSorted() === 'asc'
                        ? 'ascending'
                        : header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : 'none'
                    }
                    className="whitespace-nowrap px-3 py-3 text-left font-semibold text-foreground"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={
                          header.column.getCanSort()
                            ? 'inline-flex items-center gap-1 hover:text-primary'
                            : 'inline-flex items-center gap-1'
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={!header.column.getCanSort()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          <span aria-hidden="true">
                            {header.column.getIsSorted() === 'asc'
                              ? '↑'
                              : header.column.getIsSorted() === 'desc'
                                ? '↓'
                                : '↕'}
                          </span>
                        ) : null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="px-3 py-8 text-center text-muted-foreground">
                  {emptyState ?? 'No data found.'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border even:bg-muted/20">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-3 py-3 text-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="min-h-9 rounded-md border border-border px-3 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="min-h-9 rounded-md border border-border px-3 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
