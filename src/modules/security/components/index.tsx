'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AUDIT_ACTION_LABELS, COMPLIANCE_FRAMEWORK_LABELS } from '../types';
import type { AuditEvent, AccessLog, SecurityPolicy, DataRetentionPolicy, ComplianceStatus } from '../types';

const statusColor: Record<string, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  denied: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  passed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export function AuditTable({ events }: { events: AuditEvent[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Ação</th>
            <th className="text-left p-3 font-medium">Entidade</th>
            <th className="text-left p-3 font-medium">Usuário</th>
            <th className="text-left p-3 font-medium">IP</th>
            <th className="text-left p-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {events.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum evento de auditoria.</td></tr>}
          {events.map((evt) => (
            <tr key={evt.id}>
              <td className="p-3"><Badge variant="outline">{AUDIT_ACTION_LABELS[evt.action] ?? evt.action}</Badge></td>
              <td className="p-3 font-medium">{evt.entity}{evt.entityId ? ` #${evt.entityId.slice(0, 8)}` : ''}</td>
              <td className="p-3 text-muted-foreground">{evt.userId ?? '-'}</td>
              <td className="p-3 text-muted-foreground font-mono text-xs">{evt.ip ?? '-'}</td>
              <td className="p-3 text-muted-foreground">{evt.createdAt.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccessLogTable({ logs }: { logs: AccessLog[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Ação</th>
            <th className="text-left p-3 font-medium">Recurso</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">IP</th>
            <th className="text-left p-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {logs.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum log de acesso.</td></tr>}
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="p-3 font-medium">{log.action}</td>
              <td className="p-3 text-muted-foreground font-mono text-xs">{log.resource}</td>
              <td className="p-3"><Badge className={statusColor[log.status] ?? ''}>{log.status}</Badge></td>
              <td className="p-3 text-muted-foreground font-mono text-xs">{log.ip ?? '-'}</td>
              <td className="p-3 text-muted-foreground">{log.createdAt.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PolicyTable({ policies, onToggle, onDelete }: {
  policies: SecurityPolicy[]; onToggle?: (id: string, active: boolean) => void; onDelete?: (id: string) => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Nome</th>
            <th className="text-left p-3 font-medium">Regras</th>
            <th className="text-left p-3 font-medium">Ativo</th>
            <th className="text-left p-3 font-medium">Criada em</th>
            <th className="text-left p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {policies.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhuma política.</td></tr>}
          {policies.map((pol) => (
            <tr key={pol.id}>
              <td className="p-3 font-medium">{pol.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{pol.rules.length} regra(s)</td>
              <td className="p-3">
                <button onClick={() => onToggle?.(pol.id, !pol.active)} className={cn('px-2 py-1 rounded text-xs font-medium', pol.active ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-500 dark:bg-gray-800')}>
                  {pol.active ? 'Ativo' : 'Inativo'}
                </button>
              </td>
              <td className="p-3 text-muted-foreground">{pol.createdAt.toLocaleDateString('pt-BR')}</td>
              <td className="p-3"><button onClick={() => onDelete?.(pol.id)} className="text-red-500 hover:text-red-700 text-xs">Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RetentionTable({ policies, onToggle, onDelete }: {
  policies: DataRetentionPolicy[]; onToggle?: (id: string, active: boolean) => void; onDelete?: (id: string) => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Entidade</th>
            <th className="text-left p-3 font-medium">Retenção (dias)</th>
            <th className="text-left p-3 font-medium">Arquivar após</th>
            <th className="text-left p-3 font-medium">Excluir após</th>
            <th className="text-left p-3 font-medium">Ativo</th>
            <th className="text-left p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {policies.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhuma política de retenção.</td></tr>}
          {policies.map((pol) => (
            <tr key={pol.id}>
              <td className="p-3 font-medium">{pol.entity}</td>
              <td className="p-3">{pol.retentionDays}</td>
              <td className="p-3 text-muted-foreground">{pol.archiveAfter ?? '-'}</td>
              <td className="p-3 text-muted-foreground">{pol.deleteAfter ?? '-'}</td>
              <td className="p-3">
                <button onClick={() => onToggle?.(pol.id, !pol.active)} className={cn('px-2 py-1 rounded text-xs font-medium', pol.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                  {pol.active ? 'Ativo' : 'Inativo'}
                </button>
              </td>
              <td className="p-3"><button onClick={() => onDelete?.(pol.id)} className="text-red-500 hover:text-red-700 text-xs">Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComplianceCards({ checks }: { checks: ComplianceStatus[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {checks.length === 0 && <p className="col-span-full text-center py-12 text-muted-foreground">Nenhum framework de compliance.</p>}
      {checks.map((framework) => (
        <Card key={framework.framework}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{COMPLIANCE_FRAMEWORK_LABELS[framework.framework]}</CardTitle>
              <Badge className={cn(
                framework.status === 'compliant' ? 'bg-green-500' : framework.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500',
              )}>
                {framework.status === 'compliant' ? 'Conforme' : framework.status === 'partial' ? 'Parcial' : 'Não Conforme'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${framework.score}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{framework.score}%</span>
            </div>
            <div className="space-y-1">
              {framework.checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={cn('w-2 h-2 rounded-full', check.status === 'passed' ? 'bg-green-500' : check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500')} />
                  <span className="text-muted-foreground">{check.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SecuritySummaryCards({ auditCount, logCount, policyCount, retentionCount }: {
  auditCount: number; logCount: number; policyCount: number; retentionCount: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Eventos de Auditoria</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{auditCount}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Logs de Acesso</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{logCount}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Políticas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{policyCount}</p></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Regras de Retenção</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{retentionCount}</p></CardContent></Card>
    </div>
  );
}
