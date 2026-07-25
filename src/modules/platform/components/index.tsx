'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LICENSE_STATUS_LABELS, ANNOUNCEMENT_TYPE_LABELS, METRIC_LABELS } from '../types';
import type { Company, Plan, License, PlatformMetric, Announcement, PlatformDashboardData, PlatformUser } from '../types';

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  expired: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const announcementColor: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  update: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function PlatformDashboardCards({ data }: { data: PlatformDashboardData }) {
  const cards = [
    { label: 'Empresas Ativas', value: data.activeCompanies, color: 'text-green-500' },
    { label: 'Empresas Bloqueadas', value: data.blockedCompanies, color: 'text-red-500' },
    { label: 'Usuários Totais', value: data.totalUsers, color: 'text-blue-500' },
    { label: 'Projetos Ativos', value: data.activeProjects, color: 'text-purple-500' },
    { label: 'Receita Recorrente', value: `R$ ${data.mrr.toLocaleString('pt-BR')}`, color: 'text-emerald-500' },
    { label: 'Storage Usado', value: `${data.storageUsed} MB`, color: 'text-orange-500' },
    { label: 'Consumo de IA', value: data.aiUsage.toLocaleString('pt-BR'), color: 'text-cyan-500' },
    { label: 'Chamadas de API', value: data.apiCalls.toLocaleString('pt-BR'), color: 'text-indigo-500' },
    { label: 'Jobs Executados', value: data.jobsExecuted.toLocaleString('pt-BR'), color: 'text-teal-500' },
    { label: 'Tempo Médio Resp.', value: `${data.avgResponseTime}ms`, color: 'text-yellow-500' },
    { label: 'Erros Críticos', value: data.criticalErrors, color: 'text-red-600' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle></CardHeader>
          <CardContent><p className={cn('text-2xl font-bold', card.color)}>{card.value}</p></CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CompanyTable({ companies, onBlock, onUnblock }: {
  companies: Company[]; onBlock?: (id: string) => void; onUnblock?: (id: string) => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Empresa</th>
            <th className="text-left p-3 font-medium">Documento</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Usuários</th>
            <th className="text-left p-3 font-medium">Projetos</th>
            <th className="text-left p-3 font-medium">Storage</th>
            <th className="text-left p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {companies.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Nenhuma empresa.</td></tr>}
          {companies.map((c) => (
            <tr key={c.id}>
              <td className="p-3 font-medium">{c.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{c.document ?? '-'}</td>
              <td className="p-3"><Badge className={statusColor[c.status] ?? ''}>{c.status}</Badge></td>
              <td className="p-3">{c.usersCount}</td>
              <td className="p-3">{c.projectsCount}</td>
              <td className="p-3 text-muted-foreground">{c.storageUsed} MB</td>
              <td className="p-3">
                {c.status === 'blocked' ? (
                  <button onClick={() => onUnblock?.(c.id)} className="text-green-500 hover:text-green-700 text-xs mr-2">Reativar</button>
                ) : (
                  <button onClick={() => onBlock?.(c.id)} className="text-red-500 hover:text-red-700 text-xs mr-2">Suspender</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PlanTable({ plans, onDelete }: { plans: Plan[]; onDelete?: (id: string) => void }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Nome</th>
            <th className="text-left p-3 font-medium">Preço</th>
            <th className="text-left p-3 font-medium">Usuários</th>
            <th className="text-left p-3 font-medium">Storage</th>
            <th className="text-left p-3 font-medium">API</th>
            <th className="text-left p-3 font-medium">IA</th>
            <th className="text-left p-3 font-medium">Plugins</th>
            <th className="text-left p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {plans.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Nenhum plano.</td></tr>}
          {plans.map((p) => (
            <tr key={p.id}>
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3">R$ {p.price.toLocaleString('pt-BR')}</td>
              <td className="p-3">{p.limits.users === 999999 ? 'Ilimitado' : p.limits.users}</td>
              <td className="p-3">{p.limits.storage === 999999 ? 'Ilimitado' : `${p.limits.storage} MB`}</td>
              <td className="p-3">{p.limits.apiCalls === 999999 ? 'Ilimitado' : p.limits.apiCalls.toLocaleString()}</td>
              <td className="p-3">{p.limits.aiCredits === 999999 ? 'Ilimitado' : p.limits.aiCredits.toLocaleString()}</td>
              <td className="p-3">{p.limits.plugins ? 'Sim' : 'Não'}</td>
              <td className="p-3"><button onClick={() => onDelete?.(p.id)} className="text-red-500 hover:text-red-700 text-xs">Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LicenseTable({ licenses }: { licenses: License[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Empresa</th>
            <th className="text-left p-3 font-medium">Plano</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Expiração</th>
            <th className="text-left p-3 font-medium">Usuários</th>
            <th className="text-left p-3 font-medium">Storage</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {licenses.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhuma licença.</td></tr>}
          {licenses.map((l) => (
            <tr key={l.id}>
              <td className="p-3 font-medium">{l.companyId}</td>
              <td className="p-3">{l.planName}</td>
              <td className="p-3"><Badge className={statusColor[l.status] ?? ''}>{LICENSE_STATUS_LABELS[l.status]}</Badge></td>
              <td className="p-3 text-muted-foreground text-xs">{l.expiresAt?.toLocaleDateString('pt-BR') ?? '-'}</td>
              <td className="p-3">{l.maxUsers}</td>
              <td className="p-3">{l.maxStorage} MB</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PlatformUserTable({ users }: { users: PlatformUser[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Nome</th>
            <th className="text-left p-3 font-medium">E-mail</th>
            <th className="text-left p-3 font-medium">Função</th>
            <th className="text-left p-3 font-medium">Ativo</th>
            <th className="text-left p-3 font-medium">Último Login</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum usuário.</td></tr>}
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-3 font-medium">{u.name}</td>
              <td className="p-3 text-muted-foreground">{u.email}</td>
              <td className="p-3"><Badge variant="outline">{u.role}</Badge></td>
              <td className="p-3">{u.active ? <span className="text-green-500">Sim</span> : <span className="text-red-500">Não</span>}</td>
              <td className="p-3 text-muted-foreground text-xs">{u.lastLogin?.toLocaleString('pt-BR') ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MetricCards({ metrics }: { metrics: PlatformMetric[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {metrics.length === 0 && <p className="col-span-full text-center py-12 text-muted-foreground">Nenhuma métrica.</p>}
      {metrics.map((m) => (
        <Card key={m.id}>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{METRIC_LABELS[m.metric] ?? m.metric}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{typeof m.value === 'number' ? m.value.toLocaleString('pt-BR') : m.value}</p></CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AnnouncementTable({ announcements, onDelete }: {
  announcements: Announcement[]; onDelete?: (id: string) => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Título</th>
            <th className="text-left p-3 font-medium">Tipo</th>
            <th className="text-left p-3 font-medium">Ativo</th>
            <th className="text-left p-3 font-medium">Início</th>
            <th className="text-left p-3 font-medium">Fim</th>
            <th className="text-left p-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {announcements.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhum aviso.</td></tr>}
          {announcements.map((a) => (
            <tr key={a.id}>
              <td className="p-3 font-medium">{a.title}</td>
              <td className="p-3"><Badge className={announcementColor[a.type] ?? ''}>{ANNOUNCEMENT_TYPE_LABELS[a.type]}</Badge></td>
              <td className="p-3">{a.active ? <span className="text-green-500">Sim</span> : <span className="text-gray-400">Não</span>}</td>
              <td className="p-3 text-muted-foreground text-xs">{a.startsAt?.toLocaleDateString('pt-BR') ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs">{a.endsAt?.toLocaleDateString('pt-BR') ?? '-'}</td>
              <td className="p-3"><button onClick={() => onDelete?.(a.id)} className="text-red-500 hover:text-red-700 text-xs">Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActiveAnnouncements({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;
  return (
    <div className="space-y-2">
      {announcements.map((a) => (
        <div key={a.id} className={cn('p-3 rounded-lg border text-sm', announcementColor[a.type])}>
          <p className="font-medium">{a.title}</p>
          <p className="text-xs mt-1">{a.message}</p>
        </div>
      ))}
    </div>
  );
}
