'use client';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from '@/constants/icons';
import { PERIOD_LABELS } from '../validators';
import type { GlobalFilter } from '../types';

interface GlobalFiltersProps {
  filters: GlobalFilter;
  onChange: (filters: GlobalFilter) => void;
}

export function GlobalFilters({ filters, onChange }: GlobalFiltersProps) {
  const update = <K extends keyof GlobalFilter>(key: K, value: GlobalFilter[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filtros:</span>
          </div>

          <Select value={filters.period} onValueChange={(v) => update('period', v as GlobalFilter['period'])}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.department} onValueChange={(v) => update('department', v ?? '')}>
            <SelectTrigger className="w-40 h-8 text-sm"><SelectValue placeholder="Departamento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Departamentos</SelectItem>
              <SelectItem value="marcenaria">Marcenaria</SelectItem>
              <SelectItem value="serralheria">Serralheria</SelectItem>
              <SelectItem value="pintura">Pintura</SelectItem>
              <SelectItem value="montagem">Montagem</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.responsible} onValueChange={(v) => update('responsible', v ?? '')}>
            <SelectTrigger className="w-40 h-8 text-sm"><SelectValue placeholder="Responsável" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Responsáveis</SelectItem>
              <SelectItem value="carlos">Carlos</SelectItem>
              <SelectItem value="ana">Ana</SelectItem>
              <SelectItem value="roberto">Roberto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
