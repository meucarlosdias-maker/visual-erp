'use client';

import { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ApiLog } from '../types';

interface ApiLogTableProps {
  data: ApiLog[];
}

const statusColor = (code: number) => {
  if (code >= 200 && code < 300) return 'default';
  if (code >= 400 && code < 500) return 'secondary';
  if (code >= 500) return 'destructive';
  return 'outline';
};

export const ApiLogTable = memo(function ApiLogTable({ data }: ApiLogTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Endpoint</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tempo (ms)</TableHead>
          <TableHead>IP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="text-sm">{new Date(log.createdAt).toLocaleString('pt-BR')}</TableCell>
            <TableCell>
              <Badge variant="outline">{log.method}</Badge>
            </TableCell>
            <TableCell className="text-sm font-mono">{log.endpoint}</TableCell>
            <TableCell>
              <Badge variant={statusColor(log.statusCode)}>{log.statusCode}</Badge>
            </TableCell>
            <TableCell className="text-sm">{log.responseTime}ms</TableCell>
            <TableCell className="text-sm">{log.ip ?? '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});