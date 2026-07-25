'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@/constants/icons';

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  total,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {onPageSizeChange && (
          <select
            className="rounded-md border bg-background px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 30, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        )}
        <span>
          {from}–{to} de {total}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(0)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center gap-1 px-2 text-sm text-muted-foreground">
          {pageIndex + 1} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => onPageChange(pageCount - 1)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
