'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { LoadingLocal, EmptyState } from '@/components/feedback';
import { Search, AlertCircle } from '@/constants/icons';
import { LOG_LEVEL_LABELS, LOG_LEVEL_COLORS } from '../validators';
import type { SystemLog } from '../types';

interface SystemLogViewerProps {
  logs: SystemLog[];
  loading: boolean;
}

export function SystemLogViewer({ logs, loading }: SystemLogViewerProps) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filtered = logs.filter((log) => {
    const matchSearch = !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchSearch && matchLevel;
  });

  if (loading) return <LoadingLocal />;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={levelFilter} onValueChange={(val) => setLevelFilter(val ?? 'ALL')}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Nível" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            {Object.entries(LOG_LEVEL_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<AlertCircle className="h-12 w-12 text-muted-foreground" />} title="Nenhum log" description="Nenhum log de sistema encontrado." />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Nível</TableHead>
                <TableHead className="w-28">Data/Hora</TableHead>
                <TableHead className="w-28">Módulo</TableHead>
                <TableHead>Mensagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${LOG_LEVEL_COLORS[log.level]}`}>
                      {LOG_LEVEL_LABELS[log.level]}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{log.createdAt.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-xs font-mono">{log.module}</TableCell>
                  <TableCell className="text-sm">
                    <div>{log.message}</div>
                    {log.stack && (
                      <details className="mt-1">
                        <summary className="text-xs text-muted-foreground cursor-pointer">Stack trace</summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">{log.stack}</pre>
                      </details>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
