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

function FinanceiroContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Financeiro" userName={user?.name} onLogout={logout} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">A Receber</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">R$ 0,00</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">A Pagar</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-600">R$ 0,00</p></CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

const Authenticated = withAuth(FinanceiroContent);

export default function FinanceiroPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
