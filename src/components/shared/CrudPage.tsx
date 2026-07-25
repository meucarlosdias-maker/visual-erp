'use client';

import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface CrudPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actionNew?: {
    label?: string;
    onClick: () => void;
  };
  onExport?: () => void;
  onFilter?: () => void;
  filters?: React.ReactNode;
  toolbar?: React.ReactNode;
  summary?: React.ReactNode;
  className?: string;
}

export function CrudPage({
  title,
  description,
  children,
  actionNew,
  onExport,
  onFilter,
  filters,
  toolbar,
  summary,
  className,
}: CrudPageProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <Breadcrumb />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {toolbar}
          {onFilter && (
            <Button variant="outline" size="sm" onClick={onFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          )}
          {actionNew && (
            <Button size="sm" onClick={actionNew.onClick}>
              <Plus className="mr-2 h-4 w-4" />
              {actionNew.label ?? 'Novo'}
            </Button>
          )}
        </div>
      </div>

      {filters && <div className="flex flex-wrap gap-2">{filters}</div>}

      <div className="space-y-4">
        {children}
      </div>

      {summary && (
        <div className="text-sm text-muted-foreground">{summary}</div>
      )}
    </div>
  );
}
