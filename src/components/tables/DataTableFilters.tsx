'use client';

import { Button } from '@/components/ui/button';
import { X } from '@/constants/icons';

export interface FilterChip {
  label: string;
  value: string;
  onRemove: () => void;
}

interface DataTableFiltersProps {
  chips?: FilterChip[];
  children?: React.ReactNode;
}

export function DataTableFilters({ chips, children }: DataTableFiltersProps) {
  if (!chips?.length && !children) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {chips?.map((chip) => (
        <span
          key={chip.value}
          className="inline-flex items-center gap-1 rounded-md border bg-background px-2.5 py-1 text-xs font-medium"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            className="ml-0.5 rounded-sm opacity-60 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
