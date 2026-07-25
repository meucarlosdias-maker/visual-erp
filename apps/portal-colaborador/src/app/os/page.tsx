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

function OsContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const ordens: { id: string; number: string; title: string; status: string }[] = [];

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Ordens de Serviço" userName={user?.name} onLogout={logout} />}
    >
      {ordens.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Nenhuma ordem de serviço.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ordens.map((o) => (
            <Card key={o.id}>
              <CardContent>
                <p className="font-medium">{o.number} - {o.title}</p>
                <p className="text-sm text-gray-500">{o.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}

const Authenticated = withAuth(OsContent);

export default function OsPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
