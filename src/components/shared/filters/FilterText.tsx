'use client';

import { Input } from '@/components/ui/input';
import { Search } from '@/constants/icons';

interface FilterTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterText({
  value,
  onChange,
  placeholder = 'Filtrar...',
}: FilterTextProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-48 pl-8"
      />
    </div>
  );
}
