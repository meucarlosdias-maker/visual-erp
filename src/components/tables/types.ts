import type { ColumnDef, Row } from '@tanstack/react-table';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageCount?: number;
  pageSize?: number;
  loading?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSearch?: (search: string) => void;
  onSortingChange?: (field: string, desc: boolean) => void;
  onRowClick?: (row: TData) => void;
  onSelectedRowsChange?: (rows: TData[]) => void;
  searchPlaceholder?: string;
  storageKey?: string;
  toolbar?: React.ReactNode;
  batchActions?: React.ReactNode;
  filters?: React.ReactNode;
  empty?: React.ReactNode;
}
