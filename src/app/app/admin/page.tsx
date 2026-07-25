'use client';
import { useRoles } from '@/modules/system/hooks/use-roles';
import { useAuditLogs } from '@/modules/system/hooks/use-audit';
import { useSystemLogs } from '@/modules/system/hooks/use-system-logs';
import { useSessions } from '@/modules/system/hooks/use-sessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, History, AlertCircle, UserCheck, Users, FileText } from '@/constants/icons';

export default function AdminDashboardPage() {
  const { roles, loading: loadingRoles } = useRoles();
  const { logs: auditLogs, loading: loadingAudit } = useAuditLogs();
  const { logs: sysLogs, loading: loadingSys } = useSystemLogs();
  const { activeCount, loading: loadingSessions } = useSessions();

  const cards = [
    { icon: Users, label: 'Usuários', value: 'Ir', href: '/app/admin/usuarios', color: 'text-blue-600' },
    { icon: ShieldX, label: 'Papéis', value: roles.length, loading: loadingRoles, href: '/app/admin/roles', color: 'text-purple-600' },
    { icon: FileText, label: 'Permissões', value: 'Matriz', href: '/app/admin/permissoes', color: 'text-indigo-600' },
    { icon: UserCheck, label: 'Sessões Ativas', value: activeCount, loading: loadingSessions, href: '/app/admin/sessoes', color: 'text-green-600' },
    { icon: History, label: 'Auditoria', value: auditLogs.length, loading: loadingAudit, href: '/app/admin/auditoria', color: 'text-amber-600' },
    { icon: AlertCircle, label: 'Logs', value: sysLogs.length, loading: loadingSys, href: '/app/admin/logs', color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administração do Sistema</h1>
        <p className="text-muted-foreground">RBAC, auditoria, logs e segurança</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <a key={card.label} href={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <card.icon className={`h-8 w-8 ${card.color}`} />
                  <span className="text-2xl font-bold">{card.loading ? '...' : card.value}</span>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
