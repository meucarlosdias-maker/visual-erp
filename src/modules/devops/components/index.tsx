'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LOG_LEVEL_LABELS, LOG_LEVEL_COLORS, HEALTH_STATUS_LABELS, DEPLOYMENT_STATUS_LABELS, BACKUP_STATUS_LABELS } from '../types';
import type { SystemLog, HealthCheck, Deployment, Backup, DevOpsDashboard } from '../types';

const deploymentColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', running: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700',
  rolled_back: 'bg-gray-100 text-gray-700',
};

const healthColor: Record<string, string> = {
  healthy: 'bg-green-100 text-green-700', degraded: 'bg-yellow-100 text-yellow-700',
  unhealthy: 'bg-red-100 text-red-700', unknown: 'bg-gray-100 text-gray-700',
};

const backupColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', running: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700',
};

function formatUptime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

export function DevOpsDashboardCards({ data }: { data: DevOpsDashboard }) {
  const { healthSummary, systemMetrics } = data;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Uptime</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatUptime(systemMetrics.uptime)}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Memória</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{systemMetrics.memoryUsage} MB</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Requisições</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{systemMetrics.totalRequests}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tempo Médio</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{systemMetrics.avgResponseTime}ms</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Taxa Erro</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-500">{systemMetrics.errorRate}%</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Serviços Saudáveis</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-500">{healthSummary.healthy}/{healthSummary.total}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Degradados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-500">{healthSummary.degraded}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Conexões Ativas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{systemMetrics.activeConnections}</p></CardContent></Card>
    </div>
  );
}

export function SystemLogTable({ logs }: { logs: SystemLog[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr><th className="text-left p-3 font-medium">Nível</th><th className="text-left p-3 font-medium">Fonte</th><th className="text-left p-3 font-medium">Mensagem</th><th className="text-left p-3 font-medium">Data</th></tr>
        </thead>
        <tbody className="divide-y">
          {logs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum log.</td></tr>}
          {logs.map((l) => (
            <tr key={l.id}>
              <td className="p-3"><Badge className={LOG_LEVEL_COLORS[l.level]}>{LOG_LEVEL_LABELS[l.level]}</Badge></td>
              <td className="p-3 font-mono text-xs text-muted-foreground">{l.source}</td>
              <td className="p-3 max-w-md truncate">{l.message}</td>
              <td className="p-3 text-muted-foreground text-xs">{l.createdAt.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HealthCheckCards({ checks }: { checks: HealthCheck[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {checks.map((h) => (
        <Card key={h.id}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">{h.service}</CardTitle>
            <Badge className={healthColor[h.status]}>{HEALTH_STATUS_LABELS[h.status]}</Badge>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <p>Resposta: {h.responseTime ? `${h.responseTime}ms` : '-'}</p>
            <p>Verificado: {h.checkedAt.toLocaleString('pt-BR')}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DeploymentTable({ deployments }: { deployments: Deployment[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr><th className="text-left p-3 font-medium">Versão</th><th className="text-left p-3 font-medium">Ambiente</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Commit</th><th className="text-left p-3 font-medium">Branch</th><th className="text-left p-3 font-medium">Data</th></tr>
        </thead>
        <tbody className="divide-y">
          {deployments.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhum deployment.</td></tr>}
          {deployments.map((d) => (
            <tr key={d.id}>
              <td className="p-3 font-medium">{d.version}</td>
              <td className="p-3 text-muted-foreground">{d.environment}</td>
              <td className="p-3"><Badge className={deploymentColor[d.status]}>{DEPLOYMENT_STATUS_LABELS[d.status]}</Badge></td>
              <td className="p-3 font-mono text-xs text-muted-foreground">{d.commit?.slice(0, 8) ?? '-'}</td>
              <td className="p-3 font-mono text-xs text-muted-foreground">{d.branch ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs">{d.createdAt.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BackupTable({ backups, stats }: { backups: Backup[]; stats?: { total: number; totalSize: number; lastBackup: Date | null } | null }) {
  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Backups</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{stats.total}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Tamanho Total</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{(stats.totalSize / 1024).toFixed(1)} GB</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Último Backup</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{stats.lastBackup?.toLocaleDateString('pt-BR') ?? '-'}</p></CardContent></Card>
        </div>
      )}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr><th className="text-left p-3 font-medium">Tipo</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Tamanho</th><th className="text-left p-3 font-medium">Início</th><th className="text-left p-3 font-medium">Fim</th></tr>
          </thead>
          <tbody className="divide-y">
            {backups.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum backup.</td></tr>}
            {backups.map((b) => (
              <tr key={b.id}>
                <td className="p-3">{b.type === 'manual' ? 'Manual' : 'Agendado'}</td>
                <td className="p-3"><Badge className={backupColor[b.status]}>{BACKUP_STATUS_LABELS[b.status]}</Badge></td>
                <td className="p-3 text-muted-foreground">{b.size ? `${(b.size / 1024).toFixed(1)} GB` : '-'}</td>
                <td className="p-3 text-muted-foreground text-xs">{b.startedAt?.toLocaleString('pt-BR') ?? '-'}</td>
                <td className="p-3 text-muted-foreground text-xs">{b.finishedAt?.toLocaleString('pt-BR') ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
