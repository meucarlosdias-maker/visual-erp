'use client';

import { createAuthProvider, useAuth } from '@visual-erp/auth';
import { withAuth } from '@visual-erp/auth';
import { apiBaseUrl } from '@visual-erp/config';
import { PortalLayout, Sidebar, Header, Card, CardContent } from '@visual-erp/ui';
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

function AgendaContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const eventos: { id: string; title: string; date: string }[] = [];

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Agenda" userName={user?.name} onLogout={logout} />}
    >
      {eventos.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Nenhum evento na agenda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {eventos.map((e) => (
            <Card key={e.id}>
              <CardContent>
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-gray-500">{e.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}

const Authenticated = withAuth(AgendaContent);

export default function AgendaPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
