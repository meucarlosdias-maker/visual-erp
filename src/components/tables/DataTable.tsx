'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableEmpty } from './DataTableEmpty';
import { DataTableSkeleton } from './DataTableSkeleton';
import type { DataTableProps } from './types';

export function DataTable<TData extends { id?: string }>({
  columns,
  data,
  pageCount: controlledPageCount,
  pageSize: defaultPageSize = 20,
  loading = false,
  onPaginationChange,
  onSearch,
  onSortingChange,
  onRowClick,
  onSelectedRowsChange,
  searchPlaceholder,
  storageKey,
  toolbar,
  batchActions,
  filters,
  empty,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState({});

  const isControlled = !!controlledPageCount;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const hasFilters = !!(onSearch || toolbar || batchActions || filters);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.columnVisibility) {
          setColumnVisibility(parsed.columnVisibility);
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const persistVisibility = useCallback(
    (updater: unknown) => {
      if (typeof updater === 'function') {
        setColumnVisibility((prev) => {
          const next = (updater as (prev: Record<string, boolean>) => Record<string, boolean>)(prev);
          if (storageKey) {
            try {
              const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
              localStorage.setItem(
                storageKey,
                JSON.stringify({ ...saved, columnVisibility: next }),
              );
            } catch {
              // ignore
            }
          }
          return next;
        });
      }
    },
    [storageKey],
  );

  const paginationState = useMemo(
    () => ({
      pageIndex: isControlled ? pagination.pageIndex : pagination.pageIndex,
      pageSize: pagination.pageSize,
    }),
    [isControlled, pagination],
  );

  const pageCount = isControlled
    ? controlledPageCount
    : Math.ceil(data.length / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnVisibility,
      pagination: paginationState,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next[0]?.id, next[0]?.desc);
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onSelectedRowsChange) {
        const selected = table
          .getSelectedRowModel()
          .rows.map((r) => r.original);
        onSelectedRowsChange(selected);
      }
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(next);
      onPaginationChange?.(next.pageIndex, next.pageSize);
    },
    onColumnVisibilityChange: persistVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: isControlled ? undefined : getPaginationRowModel(),
    manualPagination: isControlled,
    pageCount: isControlled ? controlledPageCount : undefined,
    enableRowSelection: !!onSelectedRowsChange,
    enableSortingRemoval: false,
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  if (loading) {
    return <DataTableSkeleton columns={columns.length} />;
  }

  return (
    <div className="space-y-4">
      {hasFilters && (
        <DataTableToolbar
          search={globalFilter}
          onSearchChange={
            onSearch
              ? (value) => {
                  setGlobalFilter(value);
                  onSearch(value);
                }
              : undefined
          }
          searchPlaceholder={searchPlaceholder}
          batchActions={batchActions}
          selectedCount={selectedRows.length}
        >
          {toolbar}
          {filters}
        </DataTableToolbar>
      )}

      {data.length === 0 ? (
        empty ?? <DataTableEmpty />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize() !== 150 ? header.getSize() : undefined,
                      }}
                      className={cn(
                        header.column.getCanSort() &&
                          'cursor-pointer select-none hover:bg-muted/50',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(onRowClick && 'cursor-pointer')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DataTablePagination
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        total={isControlled ? data.length : data.length}
        pageCount={table.getPageCount()}
        onPageChange={(page) => table.setPageIndex(page)}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  );
}
