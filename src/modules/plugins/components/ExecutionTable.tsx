'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { PluginExecutionRecord } from '@/core/plugins';

export function ExecutionTable({ data }: { data: PluginExecutionRecord[] }) {
  const statusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default' as const;
      case 'running': return 'secondary' as const;
      case 'failed': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const statusLabel: Record<string, string> = {
    pending: 'Pendente',
    running: 'Executando',
    completed: 'Concluído',
    failed: 'Falhou',
    cancelled: 'Cancelado',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Evento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Erro</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              Nenhuma execução encontrada.
            </TableCell>
          </TableRow>
        ) : (
          data.map((exec) => (
            <TableRow key={exec.id}>
              <TableCell className="font-mono text-sm">{exec.event}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(exec.status)}>{statusLabel[exec.status] ?? exec.status}</Badge>
              </TableCell>
              <TableCell>{exec.duration ? `${exec.duration}ms` : '-'}</TableCell>
              <TableCell className="text-red-600 text-sm max-w-[200px] truncate">
                {exec.error ?? '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(exec.createdAt).toLocaleString('pt-BR')}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
