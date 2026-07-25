'use client';

import { createAuthProvider, useAuth } from '@visual-erp/auth';
import { withAuth } from '@visual-erp/auth';
import { apiBaseUrl } from '@visual-erp/config';
import { PortalLayout, Sidebar, Header, Card, CardContent } from '@visual-erp/ui';
import { useRouter } from 'next/navigation';

const AuthProvider = createAuthProvider(apiBaseUrl);

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Meus Projetos', href: '/projetos' },
  { label: 'Meus Orçamentos', href: '/orcamentos' },
  { label: 'Financeiro', href: '/financeiro' },
  { label: 'Meu Perfil', href: '/perfil' },
];

function OrcamentosContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const orcamentos = [
    { id: '1', number: 'OR-001', title: 'Orçamento Exemplo', total: 15000, status: 'SENT' },
  ];

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Meus Orçamentos" userName={user?.name} onLogout={logout} />}
    >
      {orcamentos.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Nenhum orçamento encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orcamentos.map((o) => (
            <Card key={o.id}>
              <CardContent>
                <p className="font-medium">{o.number} - {o.title}</p>
                <p className="text-sm text-gray-500">R$ {o.total.toLocaleString('pt-BR')} - {o.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}

const Authenticated = withAuth(OrcamentosContent);

export default function OrcamentosPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
