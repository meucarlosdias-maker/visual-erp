'use client';

import { createAuthProvider, useAuth } from '@visual-erp/auth';
import { withAuth } from '@visual-erp/auth';
import { apiBaseUrl } from '@visual-erp/config';
import { PortalLayout, Sidebar, Header, Card, CardContent, CardHeader, CardTitle } from '@visual-erp/ui';
import { useRouter } from 'next/navigation';

const AuthProvider = createAuthProvider(apiBaseUrl);

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Meus Projetos', href: '/projetos' },
  { label: 'Meus Orçamentos', href: '/orcamentos' },
  { label: 'Financeiro', href: '/financeiro' },
  { label: 'Meu Perfil', href: '/perfil' },
];

function PerfilContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Meu Perfil" userName={user?.name} onLogout={logout} />}
    >
      <Card>
        <CardHeader><CardTitle className="text-sm">Dados do Perfil</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-gray-500">Nome:</span> {user?.name}</p>
          <p><span className="text-gray-500">E-mail:</span> {user?.email}</p>
        </CardContent>
      </Card>
    </PortalLayout>
  );
}

const Authenticated = withAuth(PerfilContent);

export default function PerfilPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
