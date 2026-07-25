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

function InstalacoesContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const instalacoes: { id: string; address: string; status: string; date: string }[] = [];

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Instalações" userName={user?.name} onLogout={logout} />}
    >
      {instalacoes.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Nenhuma instalação agendada.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {instalacoes.map((i) => (
            <Card key={i.id}>
              <CardContent>
                <p className="font-medium">{i.address}</p>
                <p className="text-sm text-gray-500">{i.status} - {i.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}

const Authenticated = withAuth(InstalacoesContent);

export default function InstalacoesPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
