'use client';

import { createAuthProvider, useAuth } from '@visual-erp/auth';
import { withAuth } from '@visual-erp/auth';
import { apiBaseUrl } from '@visual-erp/config';
import { PortalLayout, Sidebar, Header, Card, CardContent, CardHeader, CardTitle } from '@visual-erp/ui';
import { useRouter } from 'next/navigation';

const AuthProvider = createAuthProvider(apiBaseUrl);

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Produção', href: '/producao' },
  { label: 'Ordens de Serviço', href: '/os' },
  { label: 'Instalações', href: '/instalacoes' },
  { label: 'Meu Perfil', href: '/perfil' },
];

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const stats = [
    { label: 'OS Hoje', value: '2' },
    { label: 'Em Produção', value: '3' },
    { label: 'Instalações', value: '1' },
    { label: 'Eventos Hoje', value: '4' },
  ];

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Dashboard" userName={user?.name} onLogout={logout} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader><CardTitle className="text-sm">{s.label}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

const Authenticated = withAuth(DashboardContent);

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
