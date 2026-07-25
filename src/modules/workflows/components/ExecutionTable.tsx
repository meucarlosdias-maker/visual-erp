'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { WorkflowExecution } from '../types';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  COMPLETED: 'default',
  RUNNING: 'outline',
  PENDING: 'secondary',
  FAILED: 'destructive',
  CANCELLED: 'secondary',
};

const statusLabel: Record<string, string> = {
  COMPLETED: 'Concluído',
  RUNNING: 'Executando',
  PENDING: 'Pendente',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelado',
};

interface ExecutionTableProps {
  data: WorkflowExecution[];
}

export const ExecutionTable = memo(function ExecutionTable({ data }: ExecutionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Workflow</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Fim</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Erro</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((exec) => (
          <TableRow key={exec.id}>
            <TableCell className="text-xs font-mono">{exec.id.slice(0, 8)}...</TableCell>
            <TableCell className="text-xs font-mono">{exec.workflowId.slice(0, 8)}...</TableCell>
            <TableCell>
              <Badge variant={statusVariant[exec.status] ?? 'secondary'}>
                {statusLabel[exec.status] ?? exec.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">
              {exec.startedAt ? new Date(exec.startedAt).toLocaleString('pt-BR') : '-'}
            </TableCell>
            <TableCell className="text-sm">
              {exec.finishedAt ? new Date(exec.finishedAt).toLocaleString('pt-BR') : '-'}
            </TableCell>
            <TableCell className="text-sm">
              {exec.duration != null ? `${(exec.duration / 1000).toFixed(2)}s` : '-'}
            </TableCell>
            <TableCell className="text-sm text-destructive max-w-[200px] truncate">
              {exec.error ?? '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
