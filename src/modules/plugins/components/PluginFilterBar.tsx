'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, RotateCcw } from '@/constants/icons';
import { categoryLabels } from './PluginCategoryBadge';

export function PluginFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  enabled,
  onEnabledChange,
  onReset,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  enabled: string;
  onEnabledChange: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar plugin..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={category} onValueChange={(v) => onCategoryChange(v ?? 'all')}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={enabled} onValueChange={(v) => onEnabledChange(v ?? 'all')}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Ativo</SelectItem>
          <SelectItem value="false">Inativo</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" size="sm" onClick={onReset}>
        <RotateCcw className="h-4 w-4 mr-1" />
        Limpar
      </Button>
    </div>
  );
}
