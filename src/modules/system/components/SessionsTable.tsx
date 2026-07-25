'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingLocal, EmptyState } from '@/components/feedback';
import { Search, UserCheck, LogOut, RotateCcw } from '@/constants/icons';
import type { UserSession } from '../types';

interface SessionsTableProps {
  sessions: UserSession[];
  loading: boolean;
  onRevoke: (id: string) => Promise<void>;
  onReload: () => void;
}

export function SessionsTable({ sessions, loading, onRevoke, onReload }: SessionsTableProps) {
  const [search, setSearch] = useState('');

  const filtered = sessions.filter((s) =>
    !search || s.browser?.toLowerCase().includes(search.toLowerCase()) ||
    s.device?.toLowerCase().includes(search.toLowerCase()) ||
    s.ip?.includes(search) ||
    s.country?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingLocal />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar por navegador, dispositivo, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={onReload}><RotateCcw className="h-4 w-4" /></Button>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<UserCheck className="h-12 w-12 text-muted-foreground" />} title="Nenhuma sessão" description="Nenhuma sessão ativa encontrada." />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Navegador</TableHead>
                <TableHead>SO</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {s.active ? 'Ativa' : 'Encerrada'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{s.device || '-'}</TableCell>
                  <TableCell className="text-sm">{s.browser || '-'}</TableCell>
                  <TableCell className="text-sm">{s.operatingSystem || '-'}</TableCell>
                  <TableCell className="text-xs font-mono">{s.ip || '-'}</TableCell>
                  <TableCell className="text-xs">{s.city ? `${s.city}${s.country ? `, ${s.country}` : ''}` : '-'}</TableCell>
                  <TableCell className="text-xs">{s.startedAt.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-xs">{s.lastActivity.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    {s.active && (
                      <Button variant="ghost" size="sm" onClick={() => onRevoke(s.id)} title="Revogar sessão">
                        <LogOut className="h-4 w-4 text-red-500" />
                      </Button>
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
