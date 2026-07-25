'use client';

import { Input } from '@/components/ui/input';

interface FilterRangeProps {
  value: [string, string];
  onChange: (value: [string, string]) => void;
  type?: 'date' | 'number';
  placeholderFrom?: string;
  placeholderTo?: string;
}

export function FilterRange({
  value,
  onChange,
  type = 'number',
  placeholderFrom = 'De',
  placeholderTo = 'Até',
}: FilterRangeProps) {
  const [from, to] = value;

  return (
    <div className="flex items-center gap-1">
      <Input
        type={type}
        value={from}
        onChange={(e) => onChange([e.target.value, to])}
        placeholder={placeholderFrom}
        className="w-28"
      />
      <span className="text-muted-foreground">—</span>
      <Input
        type={type}
        value={to}
        onChange={(e) => onChange([from, e.target.value])}
        placeholder={placeholderTo}
        className="w-28"
      />
    </div>
  );
}
