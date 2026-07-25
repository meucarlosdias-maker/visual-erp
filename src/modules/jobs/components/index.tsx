'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { JOB_PRIORITY_OPTIONS, JOB_TYPE_LABELS, JOB_STATUS_LABELS, SCHEDULE_TYPE_LABELS } from '../types';
import type { Job, JobExecution, ScheduledJob, EventLog } from '../types';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export function JobStatusBadge({ status }: { status: string }) {
  return <Badge className={cn('font-medium', statusColor[status] ?? '')}>{JOB_STATUS_LABELS[status as Job['status']] ?? status}</Badge>;
}

export function JobPriorityBadge({ priority }: { priority: string }) {
  const opt = JOB_PRIORITY_OPTIONS.find((p) => p.value === priority);
  return <Badge variant="outline" className={cn('font-medium border', opt?.color)}>{opt?.label ?? priority}</Badge>;
}

export function JobTypeBadge({ type }: { type: string }) {
  return <Badge variant="secondary">{JOB_TYPE_LABELS[type as Job['type']] ?? type}</Badge>;
}

export function ScheduleTypeBadge({ type }: { type: string }) {
  return <Badge variant="outline">{SCHEDULE_TYPE_LABELS[type as ScheduledJob['type']] ?? type}</Badge>;
}

export function MonitoringCards({ jobs }: { jobs: Job[] }) {
  const pending = jobs.filter((j) => j.status === 'pending').length;
  const running = jobs.filter((j) => j.status === 'running').length;
  const completed = jobs.filter((j) => j.status === 'completed').length;
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const total = pending + running + completed + failed;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendentes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{pending}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Executando</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-500">{running}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Concluídos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-500">{completed}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Falhos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-500">{failed}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Taxa de Sucesso</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{successRate}%</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{total}</p></CardContent></Card>
    </div>
  );
}

export function JobTable({ jobs, onView }: { jobs: Job[]; onView?: (id: string) => void }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Nome</th>
            <th className="text-left p-3 font-medium">Tipo</th>
            <th className="text-left p-3 font-medium">Prioridade</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Tentativas</th>
            <th className="text-left p-3 font-medium">Criado em</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {jobs.length === 0 && (
            <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhum job encontrado.</td></tr>
          )}
          {jobs.map((job) => (
            <tr key={job.id} className={cn('hover:bg-muted/30', onView && 'cursor-pointer')} onClick={() => onView?.(job.id)}>
              <td className="p-3 font-medium">{job.name}</td>
              <td className="p-3"><JobTypeBadge type={job.type} /></td>
              <td className="p-3"><JobPriorityBadge priority={job.priority} /></td>
              <td className="p-3"><JobStatusBadge status={job.status} /></td>
              <td className="p-3 text-muted-foreground">{job.attempts}/{job.maxAttempts}</td>
              <td className="p-3 text-muted-foreground">{job.createdAt.toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExecutionTable({ executions }: { executions: JobExecution[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Worker</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Duração</th>
            <th className="text-left p-3 font-medium">Erro</th>
            <th className="text-left p-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {executions.length === 0 && (
            <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhuma execução encontrada.</td></tr>
          )}
          {executions.map((exec) => (
            <tr key={exec.id}>
              <td className="p-3">{exec.worker}</td>
              <td className="p-3"><JobStatusBadge status={exec.status} /></td>
              <td className="p-3 text-muted-foreground">{exec.duration ? `${(exec.duration / 1000).toFixed(1)}s` : '-'}</td>
              <td className="p-3 text-red-500 max-w-[200px] truncate">{exec.error ?? '-'}</td>
              <td className="p-3 text-muted-foreground">{exec.createdAt.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SchedulerTable({ schedules, onToggle, onDelete }: {
  schedules: ScheduledJob[]; onToggle?: (id: string, active: boolean) => void; onDelete?: (id: string) => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Nome</th>
            <th className="text-left p-3 font-medium">Tipo</th>
            <th className="text-left p-3 font-medium">Cron/Intervalo</th>
            <th className="text-left p-3 font-medium">Ativo</th>
            <th className="text-left p-3 font-medium">Última Exec.</th>
            <th className="text-left p-3 font-medium">Próxima Exec.</th>
            <th className="text-left p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {schedules.length === 0 && (
            <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Nenhum agendamento encontrado.</td></tr>
          )}
          {schedules.map((sch) => (
            <tr key={sch.id}>
              <td className="p-3 font-medium">{sch.name}</td>
              <td className="p-3"><ScheduleTypeBadge type={sch.type} /></td>
              <td className="p-3 text-muted-foreground font-mono text-xs">{sch.cron ?? (sch.interval ? `${sch.interval / 1000}s` : '-')}</td>
              <td className="p-3">
                <button onClick={() => onToggle?.(sch.id, !sch.active)} className={cn('px-2 py-1 rounded text-xs font-medium', sch.active ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-500 dark:bg-gray-800')}>
                  {sch.active ? 'Ativo' : 'Inativo'}
                </button>
              </td>
              <td className="p-3 text-muted-foreground text-xs">{sch.lastExecution?.toLocaleString('pt-BR') ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs">{sch.nextExecution?.toLocaleString('pt-BR') ?? '-'}</td>
              <td className="p-3">
                <button onClick={() => onDelete?.(sch.id)} className="text-red-500 hover:text-red-700 text-xs">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EventTable({ events }: { events: EventLog[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Evento</th>
            <th className="text-left p-3 font-medium">Publisher</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {events.length === 0 && (
            <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum evento encontrado.</td></tr>
          )}
          {events.map((evt) => (
            <tr key={evt.id}>
              <td className="p-3 font-medium">{evt.event}</td>
              <td className="p-3 text-muted-foreground">{evt.publisher}</td>
              <td className="p-3"><JobStatusBadge status={evt.status} /></td>
              <td className="p-3 text-muted-foreground">{evt.createdAt.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WorkerCards({ workers }: { workers: { name: string; status: string; version: string; queue: string[]; lastActivity: Date | null }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workers.length === 0 && (
        <p className="col-span-full text-center py-12 text-muted-foreground">Nenhum worker registrado.</p>
      )}
      {workers.map((w) => (
        <Card key={w.name}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">{w.name}</CardTitle>
            <Badge className={cn(w.status === 'idle' ? 'bg-green-500' : w.status === 'running' ? 'bg-blue-500' : 'bg-gray-500')}>{w.status}</Badge>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Versão: {w.version}</p>
            <p>Filas: {w.queue.map((q) => JOB_TYPE_LABELS[q as Job['type']] ?? q).join(', ')}</p>
            <p>Última atividade: {w.lastActivity?.toLocaleString('pt-BR') ?? 'Nunca'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
