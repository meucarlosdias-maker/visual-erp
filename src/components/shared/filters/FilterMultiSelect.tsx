'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from '@/constants/icons';

interface SelectOption {
  value: string;
  label: string;
}

interface FilterMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
}

export function FilterMultiSelect({
  value = [],
  onChange,
  options,
}: FilterMultiSelectProps) {
  const handleToggle = (val: string) => {
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => {
        const isSelected = value.includes(opt.value);
        return (
          <Badge
            key={opt.value}
            variant={isSelected ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleToggle(opt.value)}
          >
            {opt.label}
            {isSelected && <X className="ml-1 h-3 w-3" />}
          </Badge>
        );
      })}
    </div>
  );
}
