'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingLocal, EmptyState } from '@/components/feedback';
import { History, Search, User } from '@/constants/icons';
import { MODULE_LABELS } from '../validators';
import type { AuditLog } from '../types';

interface AuditTimelineProps {
  logs: AuditLog[];
  loading: boolean;
}

export function AuditTimeline({ logs, loading }: AuditTimelineProps) {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');

  const uniqueUsers = [...new Set(logs.filter((l) => l.userName).map((l) => l.userName))];

  const filtered = logs.filter((log) => {
    const matchSearch = !search ||
      log.entityName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.userName ?? '').toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    const matchUser = userFilter === 'ALL' || log.userName === userFilter;
    return matchSearch && matchModule && matchUser;
  });

  if (loading) return <LoadingLocal />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por entidade, ação, usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={moduleFilter} onValueChange={(v) => setModuleFilter(v ?? 'ALL')}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Módulo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os módulos</SelectItem>
            {Object.entries(MODULE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={userFilter} onValueChange={(v) => setUserFilter(v ?? 'ALL')}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Usuário" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os usuários</SelectItem>
            {uniqueUsers.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<History className="h-12 w-12 text-muted-foreground" />} title="Nenhum registro" description="Nenhum registro de auditoria encontrado." />
      ) : (
        <div className="relative pl-6 space-y-0">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
          {filtered.map((log) => (
            <div key={log.id} className="relative pb-6 last:pb-0">
              <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-primary bg-background" />
              <Card className="ml-4">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{log.userName || 'Sistema'}</span>
                        <Badge variant="secondary" className="text-xs">{log.action}</Badge>
                        <span className="text-xs text-muted-foreground">
                          em {MODULE_LABELS[log.module] ?? log.module}
                        </span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">{log.entityName}</span>
                        {log.entityId ? <span className="text-muted-foreground ml-1">#{log.entityId.slice(0, 8)}</span> : null}
                      </p>
                      {(log.oldData || log.newData) && (
                        <div className="mt-2 flex gap-4 text-xs">
                          {log.oldData && (
                            <div className="bg-red-50 border border-red-200 rounded p-2 flex-1">
                              <span className="font-medium text-red-600 block mb-1">Antes</span>
                              <pre className="text-red-700 whitespace-pre-wrap">{JSON.stringify(log.oldData, null, 2)}</pre>
                            </div>
                          )}
                          {log.newData && (
                            <div className="bg-green-50 border border-green-200 rounded p-2 flex-1">
                              <span className="font-medium text-green-600 block mb-1">Depois</span>
                              <pre className="text-green-700 whitespace-pre-wrap">{JSON.stringify(log.newData, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {log.createdAt.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    {log.ip && <span>IP: {log.ip}</span>}
                    {log.executionTime ? <span>{log.executionTime}ms</span> : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
