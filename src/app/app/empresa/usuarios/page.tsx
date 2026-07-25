'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserPlus, Clock } from '@/constants/icons';

export default function CompanyUsersPage() {
  const stats = [
    { icon: Users, label: 'Total', value: '3' },
    { icon: UserCheck, label: 'Ativos', value: '3' },
    { icon: UserPlus, label: 'Convidados', value: '0' },
    { icon: Clock, label: 'Pendentes', value: '0' },
  ];

  return (
    <CrudPage
      title="Usuários"
      description="Gerencie os usuários da empresa"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <s.icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center py-12 text-muted-foreground">
        O gerenciamento detalhado de usuários está disponível em{' '}
        <a href="/app/admin/usuarios" className="text-primary hover:underline">Administração &gt; Usuários</a>.
      </p>
    </CrudPage>
  );
}
