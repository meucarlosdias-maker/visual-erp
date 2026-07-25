'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingLocal, EmptyState } from '@/components/feedback';
import { History, Search } from '@/constants/icons';
import { MODULE_LABELS } from '../validators';
import type { AuditLog } from '../types';

interface AuditTableProps {
  logs: AuditLog[];
  loading: boolean;
}

export function AuditTable({ logs, loading }: AuditTableProps) {
  const [search, setSearch] = useState('');

  const filtered = logs.filter((log) =>
    !search || log.entityName.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.module.toLowerCase().includes(search.toLowerCase()) ||
    (log.userName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingLocal />;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar por entidade, ação, módulo ou usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<History className="h-12 w-12 text-muted-foreground" />} title="Nenhum registro" description="Nenhum log de auditoria encontrado." />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">{log.createdAt.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-sm">{log.userName || '-'}</TableCell>
                  <TableCell className="text-sm">{log.entityName}{log.entityId ? ` #${log.entityId.slice(0, 8)}` : ''}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{MODULE_LABELS[log.module] ?? log.module}</TableCell>
                  <TableCell className="text-xs font-mono">{log.ip || '-'}</TableCell>
                  <TableCell className="text-sm">{log.executionTime ? `${log.executionTime}ms` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
