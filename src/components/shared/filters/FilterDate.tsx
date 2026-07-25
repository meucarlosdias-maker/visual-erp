'use client';

import { Input } from '@/components/ui/input';

interface FilterDateProps {
  value: string;
  onChange: (value: string) => void;
}

export function FilterDate({
  value,
  onChange,
}: FilterDateProps) {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-40"
    />
  );
}
