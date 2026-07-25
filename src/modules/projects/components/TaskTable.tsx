'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TaskBadge } from './TaskBadge';
import { Pencil, Trash2, ArrowUp, ArrowDown } from '@/constants/icons';
import type { ProjectTask } from '../types';

interface TaskTableProps {
  tasks: ProjectTask[];
  departments: { id: string; name: string }[];
  onEdit?: (task: ProjectTask) => void;
  onRemove?: (id: string) => void;
  onMove?: (id: string, direction: -1 | 1) => void;
  readOnly?: boolean;
}

export function TaskTable({ tasks, departments, onEdit, onRemove, onMove, readOnly }: TaskTableProps) {
  const deptName = (id: string | null | undefined) => {
    if (!id) return '—';
    const d = departments.find((d) => d.id === id);
    return d?.name ?? id;
  };

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Nenhuma tarefa cadastrada.
      </p>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Horas Prev.</TableHead>
            <TableHead className="w-24">Horas Real.</TableHead>
            {!readOnly && <TableHead className="w-28">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, idx) => (
            <TableRow key={task.id}>
              <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
              <TableCell className="text-sm">{deptName(task.departmentId)}</TableCell>
              <TableCell className="text-sm font-medium">{task.title}</TableCell>
              <TableCell><TaskBadge status={task.status} /></TableCell>
              <TableCell className="text-sm">{task.estimatedHours ?? '—'}</TableCell>
              <TableCell className="text-sm">{task.actualHours ?? '—'}</TableCell>
              {!readOnly && (
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    {onEdit && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(task)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {onMove && (
                      <>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(task.id, -1)} disabled={idx === 0}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(task.id, 1)} disabled={idx === tasks.length - 1}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    {onRemove && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onRemove(task.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
