'use client';

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Columns } from '@/constants/icons';
import type { Table } from '@tanstack/react-table';

interface DataTableColumnVisibilityProps<TData> {
  table: Table<TData>;
}

export function DataTableColumnVisibility<TData>({
  table,
}: DataTableColumnVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Button variant="outline" size="sm">
          <Columns className="mr-2 h-4 w-4" />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Visibilidade</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => {
            const label =
              typeof col.columnDef.header === 'string'
                ? col.columnDef.header
                : col.id;
            return (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(checked) => col.toggleVisibility(checked)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
