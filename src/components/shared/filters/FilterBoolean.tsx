'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBooleanProps {
  value: string;
  onChange: (value: string) => void;
  trueLabel?: string;
  falseLabel?: string;
}

export function FilterBoolean({
  value,
  onChange,
  trueLabel = 'Sim',
  falseLabel = 'Não',
}: FilterBooleanProps) {
  return (
      <Select value={value} onValueChange={(v) => onChange(v ?? '')}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Todos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">{trueLabel}</SelectItem>
        <SelectItem value="false">{falseLabel}</SelectItem>
      </SelectContent>
    </Select>
  );
}
