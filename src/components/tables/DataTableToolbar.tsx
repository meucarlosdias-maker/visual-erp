'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from '@/constants/icons';

interface DataTableToolbarProps {
  search?: string;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  batchActions?: React.ReactNode;
  selectedCount?: number;
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  children,
  batchActions,
  selectedCount,
}: DataTableToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {onSearchChange && (
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => onSearchChange('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
      {selectedCount !== undefined && selectedCount > 0 && batchActions && (
        <div className="flex items-center gap-2 rounded-md bg-muted px-4 py-2">
          <span className="text-sm text-muted-foreground">
            {selectedCount} selecionado(s)
          </span>
          {batchActions}
        </div>
      )}
    </div>
  );
}
